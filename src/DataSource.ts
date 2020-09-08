import {
  ArrayVector,
  DataFrame,
  DataQueryRequest,
  DataQueryResponse,
  DataSourceInstanceSettings,
  DateTimeDuration,
  FieldType,
  MutableDataFrame,
  toDuration,
} from '@grafana/data';
import { DataSourceWithBackend, getBackendSrv, getTemplateSrv, TemplateSrv } from '@grafana/runtime';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import {
  Group,
  MetricRequest,
  TSDBResponse,
  XrayJsonData,
  XrayQuery,
  XrayQueryType,
  XrayTraceData,
  XrayTraceDataRaw,
  XrayTraceDataSegment,
} from './types';
import { transformResponse } from 'utils/transform';
import { XRayLanguageProvider } from 'language_provider';

export class XrayDataSource extends DataSourceWithBackend<XrayQuery, XrayJsonData> {
  private instanceSettings: DataSourceInstanceSettings<XrayJsonData>;

  /** @ngInject */
  constructor(instanceSettings: DataSourceInstanceSettings<XrayJsonData>) {
    super(instanceSettings);

    this.languageProvider = new XRayLanguageProvider(this);
    this.instanceSettings = instanceSettings;
  }

  query(request: DataQueryRequest<XrayQuery>): Observable<DataQueryResponse> {
    const processedRequest = processRequest(request, getTemplateSrv());
    const response = super.query(processedRequest);
    return response.pipe(
      map(dataQueryResponse => {
        return {
          ...dataQueryResponse,
          data: dataQueryResponse.data.map(frame => this.parseResponse(frame)),
        };
      })
    );
  }

  async getGroups(): Promise<Group[]> {
    return this.getResource('/groups');
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

  private transformSuggestDataFromTable(
    suggestData: TSDBResponse
  ): Array<{ text: string; value: string; label: string }> {
    return suggestData.results['metricFindQuery'].tables[0].rows.map(value => ({
      text: value,
      value,
      label: value,
    }));
  }

  private parseResponse(response: DataFrame): DataFrame {
    // TODO this would better be based on type but backend Go def does not have dataFrame.type
    switch (response.name) {
      case 'Traces':
        return parseTraceResponse(response);
      case 'TraceSummaries':
        return parseTracesListResponse(response, this.instanceSettings.uid);
      case 'InsightSummaries':
        return parseInsightsResponse(response, this.instanceSettings.jsonData.defaultRegion!);
      default:
        return response;
    }
  }
}

function parseInsightsResponse(response: DataFrame, region: string): DataFrame {
  const urlToAwsConsole = `https://${region}.console.aws.amazon.com/xray/home?region=${region}#/insights/`;
  const idField = response.fields.find(f => f.name === 'InsightId');
  if (idField) {
    idField.config.links = [{ title: '', url: urlToAwsConsole + '${__value.raw}', targetBlank: true }];
  }
  const duration = response.fields.find(f => f.name === 'Duration');

  if (duration) {
    duration.type = FieldType.string;
    duration.display = val => {
      const momentDuration = toDuration(val);
      return {
        numeric: val,
        text: getDurationText(momentDuration),
      };
    };
  }
  return response;
}

function getDurationText(duration: DateTimeDuration) {
  let result = '';

  if (duration.hours()) {
    result = `${duration.hours()} hours `;
  }

  if (duration.minutes()) {
    result += `${duration.minutes()} minutes `;
  }

  if (duration.seconds()) {
    result += `${duration.seconds()} seconds`;
  }
  return result;
}

/**
 The x-ray trace has a bit strange format where it comes as json and then some parts are string which also contains
 json, so some parts are escaped and we have to double parse that.
 */
function parseTraceResponse(response: DataFrame): DataFrame {
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
    meta: {
      preferredVisualisationType: 'trace',
    },
  });
}

/**
 * Adds links to the Id field of the dataframe. This is later processed in grafana to create actual context dependant
 * link that works both in explore and in dashboards.
 * TODO This mutates the dataframe, probably just copy it but seems like new MutableDataframe(response) errors out
 */
function parseTracesListResponse(response: DataFrame, datasourceUid: string): DataFrame {
  const idField = response.fields.find(f => f.name === 'Id');
  idField!.config.links = [
    {
      title: 'Trace: ${__value.raw}',
      url: '',
      internal: {
        datasourceUid,
        query: { query: '${__value.raw}', queryType: 'getTrace' },
      },
    },
  ];
  return response;
}

function processRequest(request: DataQueryRequest<XrayQuery>, templateSrv: TemplateSrv) {
  return {
    ...request,
    targets: request.targets.map(target => {
      let newTarget = {
        ...target,
      };

      // Handle interval => resolution mapping
      if (newTarget.queryType === XrayQueryType.getTimeSeriesServiceStatistics) {
        if (request.intervalMs && !newTarget.resolution) {
          const intervalSeconds = Math.floor(request.intervalMs / 1000);
          newTarget.resolution = intervalSeconds <= 60 ? 60 : 300;
        }
      }

      // Variable interpolation
      newTarget.query = templateSrv.replace(newTarget.query, request.scopedVars);

      // Add Group filter expression to the query filter expression. This seems to mimic what x-ray console is doing
      // as there are APIs that do not expect group just the filter expression. At the same time some APIs like Insights
      // do not accept filter expression just the groupARN so this will have to be adjusted for them.
      if (target.group && target.group.FilterExpression && target.queryType !== XrayQueryType.getTrace) {
        if (newTarget.query) {
          newTarget.query = target.group.FilterExpression + ' AND ' + newTarget.query;
        } else {
          newTarget.query = target.group.FilterExpression;
        }
      }

      return newTarget;
    }),
  };
}
