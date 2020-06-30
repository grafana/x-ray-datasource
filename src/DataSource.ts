import {
  ArrayVector,
  DataFrame,
  DataQueryRequest,
  DataQueryResponse,
  DataSourceInstanceSettings,
  FieldType,
  MutableDataFrame,
} from '@grafana/data';
import { DataSourceWithBackend, getBackendSrv } from '@grafana/runtime';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import {
  MetricRequest,
  TSDBResponse,
  XrayJsonData,
  XrayQuery,
  XrayTraceData,
  XrayTraceDataRaw,
  XrayTraceDataSegment,
} from './types';
import { transformResponse } from 'utils/transform';
import { XRayLanguageProvider } from 'language_provider';

export class XrayDataSource extends DataSourceWithBackend<XrayQuery, XrayJsonData> {
  /** @ngInject */
  constructor(instanceSettings: DataSourceInstanceSettings<XrayJsonData>) {
    super(instanceSettings);

    this.languageProvider = new XRayLanguageProvider(this);
  }

  query(request: DataQueryRequest<XrayQuery>): Observable<DataQueryResponse> {
    const response = super.query(request);
    return response.pipe(
      map(dataQueryResponse => {
        // TODO add transform to jaeger UI format
        return {
          ...dataQueryResponse,
          data: dataQueryResponse.data.map(parseResponse),
        };
      })
    );
  }

  async getRegions(): Promise<Array<{ label: string; value: string; text: string }>> {
    const response = await this.awsRequest({
      queries: [
        {
          refId: 'getRegions',
          datasourceId: this.id,
          type: 'getRegions',
        },
      ],
    });
    const suggestions = this.transformSuggestDataFromTable(response);
    return [{ label: 'default', value: 'default', text: 'default' }, ...suggestions];
  }

  async awsRequest(data: MetricRequest) {
    const options = {
      method: 'POST',
      url: '/api/tsdb/query',
      data,
    };

    const result = await getBackendSrv().datasourceRequest(options);
    return result.data;
  }

  transformSuggestDataFromTable(suggestData: TSDBResponse): Array<{ text: string; value: string; label: string }> {
    return suggestData.results['metricFindQuery'].tables[0].rows.map(value => ({
      text: value,
      value,
      label: value,
    }));
  }
}

function parseResponse(response: DataFrame): DataFrame {
  // TODO this would better be based on type but backend Go def does not have dataFrame.type
  if (response.name !== 'Traces') {
    return response;
  }

  /*
   The x-ray trace has a bit strange format where it comes as json and then some parts are string which also contains
   json. So when it comes here it is some parts are escaped and we have to double parse that.
   */

  // Again assuming this will ge single field with single value which will be the trace data blob
  const traceData = response.fields[0].values.get(0);
  const traceParsed: XrayTraceDataRaw = JSON.parse(traceData);

  const parsedSegments = traceParsed.Segments.map(segment => {
    return {
      ...segment,
      Document: JSON.parse(segment.Document),
    } as XrayTraceDataSegment;
  });
  const traceParsedForReal: XrayTraceData = {
    ...traceParsed,
    Segments: parsedSegments,
  };

  return new MutableDataFrame({
    name: 'Trace',
    fields: [
      {
        name: 'trace',
        type: FieldType.trace,
        values: new ArrayVector([transformResponse(traceParsedForReal)]),
      },
    ],
  });
}
