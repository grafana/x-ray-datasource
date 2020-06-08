import { XrayDataSource } from './DataSource';
import { ArrayVector, DataQueryRequest, DataSourceInstanceSettings, FieldType, MutableDataFrame } from '@grafana/data';
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
    it('returns parsed data when querying traces', async () => {
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

      const ds = makeDatasourceWithResponse({
        ...trace,
        Segments: [
          {
            Document: JSON.stringify(doc),
            Id: 'segmentId1',
          },
        ],
      });
      const response = await ds
        .query({
          targets: [
            {
              queryType: XrayQueryType.getTrace,
              query: 'traceId1',
            },
          ],
        } as DataQueryRequest<XrayQuery>)
        .toPromise();

      expect(response.data.length).toBe(1);
      expect(response.data[0].fields.length).toBe(1);
      expect(response.data[0].fields[0].values.length).toBe(1);
      expect(response.data[0].fields[0].values.get(0)).toEqual({
        ...trace,
        Segments: [
          {
            // For now this just checks that this is correctly parsed
            Document: doc,
            Id: 'segmentId1',
          },
        ],
      });
    });
  });
});

function makeDatasourceWithResponse(trace: XrayTraceDataRaw): XrayDataSource {
  const ds = new XrayDataSource({} as DataSourceInstanceSettings<XrayJsonData>);
  ((ds as any).mockQuery as jest.Mock).mockReturnValueOnce(
    of({
      data: [
        new MutableDataFrame({
          name: 'Traces',
          fields: [
            {
              name: 'traces',
              type: FieldType.trace,
              values: new ArrayVector([JSON.stringify(trace)]),
            },
          ],
        }),
      ],
    })
  );

  return ds;
}
