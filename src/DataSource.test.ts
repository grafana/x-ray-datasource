import { XrayDataSource } from './DataSource';
import {
  ArrayVector,
  DataFrame,
  DataQueryRequest,
  DataSourceInstanceSettings,
  FieldType,
  MutableDataFrame,
} from '@grafana/data';
import { XrayJsonData, XrayQuery, XrayQueryType, XrayTraceDataRaw, XrayTraceDataSegmentDocument } from './types';
import { of } from 'rxjs';

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
  };
});

describe('XrayDataSource', () => {
  describe('.query()', () => {
    it('returns parsed data when querying single trace', async () => {
      const ds = makeDatasourceWithResponse(makeTraceResponse(makeTrace()));
      const response = await ds.query(makeQuery(XrayQueryType.getTrace, 'traceId1')).toPromise();
      expect(response.data.length).toBe(1);
      expect(response.data[0].fields.length).toBe(1);
      expect(response.data[0].fields[0].values.length).toBe(1);
    });

    it('returns parsed data with links when querying trace list', async () => {
      const ds = makeDatasourceWithResponse(makeTraceSummariesResponse());
      const response = await ds.query(makeQuery(XrayQueryType.getTraceSummaries, '')).toPromise();
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
  });
});

function makeQuery(type: XrayQueryType, query: string): DataQueryRequest<XrayQuery> {
  return {
    targets: [
      {
        queryType: XrayQueryType.getTrace,
        query: 'traceId1',
      },
    ],
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

function makeTraceSummariesResponse(): DataFrame {
  return new MutableDataFrame({
    name: 'TraceSummaries',
    fields: [
      {
        name: 'Id',
        type: FieldType.string,
        values: new ArrayVector(['12345', '67890']),
      },
      {
        name: 'Duration',
        type: FieldType.number,
        values: new ArrayVector([10, 20]),
      },
    ],
  });
}

function makeTraceResponse(trace: XrayTraceDataRaw): DataFrame {
  return new MutableDataFrame({
    name: 'Traces',
    fields: [
      {
        name: 'traces',
        type: FieldType.trace,
        values: new ArrayVector([JSON.stringify(trace)]),
      },
    ],
  });
}

function makeDatasourceWithResponse(response: DataFrame): XrayDataSource {
  const ds = new XrayDataSource({
    uid: 'xrayUid',
  } as DataSourceInstanceSettings<XrayJsonData>);
  ((ds as any).mockQuery as jest.Mock).mockReturnValueOnce(
    of({
      data: [response],
    })
  );

  return ds;
}
