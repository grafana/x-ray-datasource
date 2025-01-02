import { XrayDataSource } from './XRayDataSource';
import {
  DataFrame,
  DataQueryRequest,
  DataSourceInstanceSettings,
  FieldType,
  NodeGraphDataFrameFieldNames,
  ScopedVars,
  TypedVariableModel,
} from '@grafana/data';
import {
  XrayJsonData,
  XrayQuery,
  XrayQueryType,
  XrayService,
  XrayTraceDataRaw,
  XrayTraceDataSegmentDocument,
} from './types';
import { firstValueFrom, of } from 'rxjs';
import { TemplateSrv } from '@grafana/runtime';

jest.mock('@grafana/runtime', () => {
  const runtime = jest.requireActual('@grafana/runtime');
  return {
    __esModule: true,
    ...runtime,
    // We need to mock DataSourceWithBackend.query as we extend it and call super(). At the same time doing
    // query = jest.fn() would be harder to access due to how that is transpiled
    DataSourceWithBackend: class DataSourceWithBackendMock extends runtime.DataSourceWithBackend {
      mockQuery = jest.fn();
      query(...args: any[]) {
        return this.mockQuery(...args);
      }
    },
    getTemplateSrv(): TemplateSrv {
      return {
        getVariables(): TypedVariableModel[] {
          return [];
        },
        replace(target?: string, scopedVars?: ScopedVars, format?: string | Function): string {
          if (!target) {
            return '';
          }
          const vars: Record<string, { value: any }> = {
            ...scopedVars,
            someVar: {
              value: '200',
            },
          };
          for (const key of Object.keys(vars)) {
            target = target!.replace(`\$${key}`, vars[key].value);
            target = target!.replace(`\${${key}}`, vars[key].value);
          }
          return target!;
        },
        containsTemplate: jest.fn(),
        updateTimeRange: jest.fn(),
      };
    },
  };
});

jest.mock('@grafana/data', () => {
  const data = jest.requireActual('@grafana/data');
  return {
    ...data,
    NodeGraphDataFrameFieldNames: {
      ...data.NodeGraphDataFrameFieldNames,
      subTitle: 'whatever value is behind NodeGraphDataFrameFieldNames.subTitle',
    },
  };
});

describe('XrayDataSource', () => {
  describe('.query()', () => {
    it('returns parsed data when querying single trace', async () => {
      const ds = makeDatasourceWithResponse(makeTraceResponse(makeTrace()));
      const response = await firstValueFrom(ds.query(makeQuery()));
      expect(response.data.length).toBe(1);
      expect(response.data[0].fields.length).toBe(13);
      expect(response.data[0].fields[0].values.length).toBe(2);
    });

    it('returns parsed data with links when querying trace list', async () => {
      const ds = makeDatasourceWithResponse(makeTraceSummariesResponse());
      const response = await firstValueFrom(
        ds.query(makeQuery({ queryType: XrayQueryType.getTraceSummaries, query: '' }))
      );
      expect(response.data.length).toBe(1);
      const df: DataFrame = response.data[0];
      expect(df.fields.length).toBe(2);
      expect(df.fields[0].values.length).toBe(2);
      expect(df.fields[0].config.links?.length).toBe(1);
      expect(df.fields[0].config.links?.[0].internal?.datasourceUid).toBe('xrayUid');
      expect(df.fields[0].config.links?.[0].internal?.query).toEqual({
        query: '${__value.raw}',
        queryType: 'getTrace',
      });
    });

    it('returns parsed data when querying service map', async () => {
      const ds = makeDatasourceWithResponse(makeServiceMapResponse());
      const response = await firstValueFrom(ds.query(makeQuery({ queryType: XrayQueryType.getServiceMap, query: '' })));
      expect(response.data.length).toBe(2);
      const nodes: DataFrame = response.data[0];
      expect(nodes.fields.length).toBe(9);
      const edges: DataFrame = response.data[1];
      expect(edges.fields.length).toBe(7);
      expect(edges.fields.find((f) => f.name === NodeGraphDataFrameFieldNames.mainStat)?.values.toArray()).toEqual(
        expect.arrayContaining(['N/A'])
      );
      expect(edges.fields.find((f) => f.name === NodeGraphDataFrameFieldNames.secondaryStat)?.values.toArray()).toEqual(
        expect.arrayContaining([undefined])
      );
      expect(response.data[0].fields[0].config.links[0].internal.query.query).toBe(
        'service(id(name: "${__data.fields.title}", type: "${__data.fields.whatever value is behind NodeGraphDataFrameFieldNames.subTitle}"))'
      );
    });

    it('should parse insight response correctly', async () => {
      const ds = makeDatasourceWithResponse(makeInsightResponse());
      const response = await firstValueFrom(ds.query(makeQuery({ queryType: XrayQueryType.getInsights, query: '' })));
      const df: DataFrame = response.data[0];
      expect(df.fields[0].config.links?.[0].url).toBe(
        'https://us-east.console.aws.amazon.com/xray/home?region=us-east#/insights/${__value.raw}'
      );
      expect(df.fields[1].display?.(df.fields[1].values.get(0)).text).toBe('1 hours 16 minutes 30 seconds');
      expect(df.fields[1].display?.(df.fields[1].values.get(1)).text).toBe('23 minutes 42 seconds');
      expect(df.fields[1].display?.(df.fields[1].values.get(2)).text).toBe('42 seconds');
    });

    it('adds correct resolution based on interval', async () => {
      const ds = makeDatasourceWithResponse({} as any);
      await firstValueFrom(
        ds.query(
          makeQuery({ queryType: XrayQueryType.getTimeSeriesServiceStatistics, query: '' }, { intervalMs: 400 * 1000 })
        )
      );
      const mockQuery = (ds as any).mockQuery as jest.Mock;
      expect(mockQuery.mock.calls[0][0].targets[0].resolution).toBe(300);
    });

    it('does not override explicit resolution', async () => {
      const ds = makeDatasourceWithResponse({} as any);
      await firstValueFrom(
        ds.query(
          makeQuery(
            { queryType: XrayQueryType.getTimeSeriesServiceStatistics, query: '', resolution: 60 },
            { intervalMs: 400 * 1000 }
          )
        )
      );
      const mockQuery = (ds as any).mockQuery as jest.Mock;
      expect(mockQuery.mock.calls[0][0].targets[0].resolution).toBe(60);
    });

    it('handles variable interpolation', async () => {
      const ds = makeDatasourceWithResponse({} as any);
      await firstValueFrom(
        ds.query(
          makeQuery({ query: 'service("$variable")' }, { scopedVars: { variable: { text: 'test', value: 'test' } } })
        )
      );
      const mockQuery = (ds as any).mockQuery as jest.Mock;
      expect(mockQuery.mock.calls[0][0].targets[0].query).toBe('service("test")');
    });

    it('handles group', async () => {
      const ds = makeDatasourceWithResponse({} as any);
      await firstValueFrom(
        ds.query(
          makeQuery({
            queryType: XrayQueryType.getTimeSeriesServiceStatistics,
            query: 'service("something")',
            group: { FilterExpression: 'service("from group")' } as any,
          })
        )
      );
      const mockQuery = (ds as any).mockQuery as jest.Mock;
      expect(mockQuery.mock.calls[0][0].targets[0].query).toBe('service("from group") AND service("something")');
    });
  });
  describe('.getXrayUrlForQuery', () => {
    const ds = makeDatasourceWithResponse({} as any);
    it.each<[XrayQueryType, Partial<XrayQuery>, string]>([
      [XrayQueryType.getTrace, { query: 'traceID' }, 'traces/traceID'],
      [XrayQueryType.getTraceSummaries, { query: 'filter' }, 'traces?filter=filter'],
      [XrayQueryType.getTimeSeriesServiceStatistics, { query: 'filter' }, 'analytics?filter=filter'],
      [XrayQueryType.getInsights, { query: 'filter' }, 'insights'],
      [
        XrayQueryType.getAnalyticsRootCauseErrorMessage,
        { query: 'filter', group: { GroupARN: '', GroupName: 'TestGroup' } },
        'analytics?filter=filter&group=TestGroup',
      ],
    ])('handles query type option when query type is %s', async (type, data, expected) => {
      const url = ds.getXrayUrlForQuery({
        queryType: type,
        ...data,
      } as XrayQuery);
      expect(url).toBe(`https://us-east.console.aws.amazon.com/xray/home?region=us-east#/${expected}`);
    });
  });

  it('should replace variables', () => {
    const ds = makeDatasourceWithResponse({} as any);
    const logQuery: XrayQuery = {
      refId: 'someRefId',
      query: 'http.status = ${someVar}',
    };

    const interpolated = ds.interpolateVariablesInQueries([logQuery], {});

    expect(interpolated[0].query).toBe(`http.status = 200`);
  });
});

function makeQuery(
  query?: Partial<XrayQuery>,
  request?: Partial<DataQueryRequest<XrayQuery>>
): DataQueryRequest<XrayQuery> {
  return {
    targets: [
      {
        queryType: XrayQueryType.getTrace,
        query: 'traceId1',
        ...(query || {}),
      },
    ],
    ...(request || {}),
  } as DataQueryRequest<XrayQuery>;
}

function makeTrace(): XrayTraceDataRaw {
  const doc: XrayTraceDataSegmentDocument = {
    id: 'segmentId1',
    name: 'op1',
    start_time: 10,
    end_time: 90,
    trace_id: 'traceId1',
  };

  const trace = {
    Duration: 100,
    Id: 'traceId1',
  };
  return {
    ...trace,
    Segments: [
      {
        Document: JSON.stringify(doc),
        Id: 'segmentId1',
      },
    ],
  };
}

function makeServiceMapWithLinkedEdge() {
  const serviceMap: XrayService[] = [
    {
      AccountId: null,
      DurationHistogram: [
        { Count: 1, Value: 0.375 },
        { Count: 1, Value: 0.012 },
      ],
      Edges: [
        {
          Aliases: [],
          EndTime: 9,
          ReferenceId: 1,
          ResponseTimeHistogram: [
            { Count: 1, Value: 0.375 },
            { Count: 1, Value: 0.012 },
          ],
          StartTime: 1,
          SummaryStatistics: {
            ErrorStatistics: { OtherCount: 0, ThrottleCount: 0, TotalCount: 0 },
            FaultStatistics: { OtherCount: 0, TotalCount: 0 },
            OkCount: 2,
            TotalCount: 2,
            TotalResponseTime: 0.387,
          },
        },
      ],
      EndTime: 9,
      Name: 'ProcessSQSRecord',
      Names: ['ProcessSQSRecord'],
      ReferenceId: 0,
      ResponseTimeHistogram: [
        { Count: 1, Value: 0.375 },
        { Count: 1, Value: 0.012 },
      ],
      Root: null,
      StartTime: 1,
      State: 'active',
      SummaryStatistics: {
        ErrorStatistics: { OtherCount: 0, ThrottleCount: 0, TotalCount: 0 },
        FaultStatistics: { OtherCount: 0, TotalCount: 0 },
        OkCount: 2,
        TotalCount: 2,
        TotalResponseTime: 0.387,
      },
      Type: 'AWS::Lambda',
    },
    {
      AccountId: '1',
      DurationHistogram: [
        { Count: 1, Value: 0.002 },
        { Count: 1, Value: 0.242 },
      ],
      Edges: [],
      EndTime: 9,
      Name: 'ProcessSQSRecord',
      Names: ['ProcessSQSRecord'],
      ReferenceId: 1,
      ResponseTimeHistogram: [
        { Count: 1, Value: 0.002 },
        { Count: 1, Value: 0.013 },
      ],
      Root: null,
      StartTime: 1,
      State: 'active',
      SummaryStatistics: {
        ErrorStatistics: { OtherCount: 0, ThrottleCount: 0, TotalCount: 0 },
        FaultStatistics: { OtherCount: 0, TotalCount: 0 },
        OkCount: 2,
        TotalCount: 2,
        TotalResponseTime: 0.014,
      },
      Type: 'AWS::Lambda::Function',
    },
    {
      AccountId: null,
      DurationHistogram: [
        { Count: 1, Value: 0.506 },
        { Count: 33, Value: 0.002 },
        { Count: 147, Value: -0 },
        { Count: 2, Value: 0.522 },
        { Count: 1, Value: 0.51 },
        { Count: 2, Value: 0.507 },
        { Count: 1, Value: 0.508 },
        { Count: 333, Value: 0.501 },
        { Count: 160, Value: 0.503 },
        { Count: 497, Value: 0.001 },
        { Count: 1, Value: 0.514 },
        { Count: 2, Value: 0.509 },
        { Count: 2, Value: 0.505 },
        { Count: 9, Value: 0.504 },
        { Count: 2326, Value: 0.502 },
        { Count: 36, Value: 0.044 },
      ],
      Edges: [
        {
          Aliases: [],
          EndTime: 9,
          ReferenceId: 4,
          ResponseTimeHistogram: [
            { Count: 1, Value: 0.073 },
            { Count: 1, Value: 0.117 },
          ],
          StartTime: 1,
          SummaryStatistics: {
            ErrorStatistics: { OtherCount: 0, ThrottleCount: 0, TotalCount: 0 },
            FaultStatistics: { OtherCount: 0, TotalCount: 0 },
            OkCount: 2,
            TotalCount: 2,
            TotalResponseTime: 0.19,
          },
        },
      ],
      EndTime: 9,
      Name: 'SampleSite',
      Names: ['SampleSite'],
      ReferenceId: 2,
      ResponseTimeHistogram: [
        { Count: 1, Value: 0.506 },
        { Count: 33, Value: 0.002 },
        { Count: 147, Value: -0 },
        { Count: 2, Value: 0.522 },
        { Count: 1, Value: 0.51 },
        { Count: 2, Value: 0.507 },
        { Count: 1, Value: 0.508 },
        { Count: 333, Value: 0.501 },
        { Count: 160, Value: 0.503 },
        { Count: 497, Value: 0.001 },
        { Count: 1, Value: 0.514 },
        { Count: 2, Value: 0.509 },
        { Count: 2, Value: 0.505 },
        { Count: 9, Value: 0.504 },
        { Count: 2326, Value: 0.502 },
        { Count: 36, Value: 0.044 },
      ],
      Root: true,
      StartTime: 1,
      State: 'active',
      SummaryStatistics: {
        ErrorStatistics: { OtherCount: 711, ThrottleCount: 0, TotalCount: 711 },
        FaultStatistics: { OtherCount: 0, TotalCount: 0 },
        OkCount: 2842,
        TotalCount: 3553,
        TotalResponseTime: 1427.793,
      },
      Type: 'AWS::ElasticBeanstalk::Environment',
    },
    {
      AccountId: null,
      DurationHistogram: [],
      Edges: [
        {
          Aliases: [],
          EndTime: 9,
          ReferenceId: 2,
          ResponseTimeHistogram: [
            { Count: 1, Value: 0.506 },
            { Count: 33, Value: 0.002 },
            { Count: 147, Value: -0 },
            { Count: 2, Value: 0.522 },
            { Count: 1, Value: 0.51 },
            { Count: 2, Value: 0.507 },
            { Count: 1, Value: 0.508 },
            { Count: 333, Value: 0.501 },
            { Count: 160, Value: 0.503 },
            { Count: 497, Value: 0.001 },
            { Count: 1, Value: 0.514 },
            { Count: 2, Value: 0.509 },
            { Count: 2, Value: 0.505 },
            { Count: 9, Value: 0.504 },
            { Count: 2326, Value: 0.502 },
            { Count: 36, Value: 0.044 },
          ],
          StartTime: 1,
          SummaryStatistics: {
            ErrorStatistics: {
              OtherCount: 711,
              ThrottleCount: 0,
              TotalCount: 711,
            },
            FaultStatistics: { OtherCount: 0, TotalCount: 0 },
            OkCount: 2842,
            TotalCount: 3553,
            TotalResponseTime: 1427.793,
          },
        },
      ],
      EndTime: 9,
      Name: 'SampleSite',
      Names: ['SampleSite'],
      ReferenceId: 3,
      ResponseTimeHistogram: [],
      Root: null,
      StartTime: 1,
      State: 'unknown',
      SummaryStatistics: {},
      Type: 'client',
    },
    {
      AccountId: null,
      DurationHistogram: [
        { Count: 1, Value: 0.073 },
        { Count: 1, Value: 0.117 },
      ],
      Edges: [
        {
          Aliases: [],
          EndTime: 9,
          ReferenceId: 0,
          ResponseTimeHistogram: [],
          StartTime: 1,
          SummaryStatistics: {},
        },
      ],
      EndTime: 9,
      Name: 'https://sqs.us-east-1.amazonaws.com/123456789012/SampleQueue',
      Names: ['https://sqs.us-east-1.amazonaws.com/123456789012/SampleQueue'],
      ReferenceId: 4,
      ResponseTimeHistogram: [
        { Count: 1, Value: 0.073 },
        { Count: 1, Value: 0.117 },
      ],
      Root: null,
      StartTime: 1,
      State: 'unknown',
      SummaryStatistics: {
        ErrorStatistics: { OtherCount: 0, ThrottleCount: 0, TotalCount: 0 },
        FaultStatistics: { OtherCount: 0, TotalCount: 0 },
        OkCount: 2,
        TotalCount: 2,
        TotalResponseTime: 0.19,
      },
      Type: 'AWS::SQS::Queue',
    },
  ];
  return serviceMap.map((json) => JSON.stringify(json));
}

function makeTraceSummariesResponse(): DataFrame {
  return {
    name: 'TraceSummaries',
    length: 2,

    fields: [
      {
        name: 'Id',
        type: FieldType.string,
        values: ['12345', '67890'],
        config: {},
      },
      {
        name: 'Duration',
        type: FieldType.number,
        values: [10, 20],
        config: {},
      },
    ],
  };
}

function makeInsightResponse(): DataFrame {
  return {
    name: 'InsightSummaries',
    length: 2,
    fields: [
      {
        name: 'InsightId',
        type: FieldType.string,
        values: ['12345', '67890', 'sss'],
        config: {},
      },
      {
        name: 'Duration',
        type: FieldType.number,
        values: [4590000, 1422000, 42000],
        config: {},
      },
    ],
  };
}

function makeServiceMapResponse(): DataFrame {
  return {
    name: 'ServiceMap',
    length: 5,
    fields: [
      {
        name: 'Service',
        type: FieldType.string,
        values: makeServiceMapWithLinkedEdge(),
        config: {},
      },
    ],
  };
}

function makeTraceResponse(trace: XrayTraceDataRaw): DataFrame {
  return {
    name: 'Traces',
    length: trace.Segments.length,
    fields: [
      {
        name: 'traces',
        type: FieldType.trace,
        values: [JSON.stringify(trace)],
        config: {},
      },
    ],
  };
}

function makeDatasourceWithResponse(response: DataFrame): XrayDataSource {
  const ds = new XrayDataSource({
    uid: 'xrayUid',
    jsonData: { defaultRegion: 'us-east' },
  } as DataSourceInstanceSettings<XrayJsonData>);
  ((ds as any).mockQuery as jest.Mock).mockReturnValueOnce(
    of({
      data: [response],
    })
  );

  return ds;
}
