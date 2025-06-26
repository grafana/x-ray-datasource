import { sortBy } from 'lodash';
import {
  DataFrame,
  DataQueryRequest,
  DataQueryResponse,
  DataSourceInstanceSettings,
  DateTimeDuration,
  FieldType,
  ScopedVars,
  TimeRange,
  toDuration,
  NodeGraphDataFrameFieldNames,
  anyToNumber,
} from '@grafana/data';
import { DataSourceWithBackend, getTemplateSrv, TemplateSrv, config } from '@grafana/runtime';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import {
  Group,
  Region,
  XrayJsonData,
  XrayQuery,
  XrayQueryType,
  XrayTraceData,
  XrayTraceDataRaw,
  XrayTraceDataSegment,
} from './types';
import { parseGraphResponse, transformTraceResponse } from 'utils/transform';
import { XRayLanguageProvider } from 'language_provider';
import { makeLinks } from './utils/links';
import { XrayVariableSupport } from 'variables';

export class XrayDataSource extends DataSourceWithBackend<XrayQuery, XrayJsonData> {
  private instanceSettings: DataSourceInstanceSettings<XrayJsonData>;

  /** @ngInject */
  constructor(instanceSettings: DataSourceInstanceSettings<XrayJsonData>) {
    super(instanceSettings);

    this.languageProvider = new XRayLanguageProvider(this);
    this.instanceSettings = instanceSettings;
    this.variables = new XrayVariableSupport(this);
  }

  query(request: DataQueryRequest<XrayQuery>): Observable<DataQueryResponse> {
    const processedRequest = processRequest(request, getTemplateSrv());
    let response = super.query(processedRequest);
    return response.pipe(
      map((dataQueryResponse) => {
        return {
          ...dataQueryResponse,
          data: dataQueryResponse.data.flatMap((frame) => {
            const target = request.targets.find((t) => t.refId === frame.refId);
            return this.parseResponse(frame, target);
          }),
        };
      })
    );
  }

  async getGroups(region?: string, scopedVars?: ScopedVars): Promise<Group[]> {
    let searchString = '';
    if (region) {
      const actualRegion = getTemplateSrv().replace(this.getActualRegion(region), scopedVars);
      const params = new URLSearchParams({ region: actualRegion });
      searchString = '?' + params.toString();
    }
    return this.getResource(`groups${searchString}`);
  }

  async getRegions(): Promise<Region[]> {
    const response = await this.getResource('regions');
    return [
      ...sortBy(
        response.map((name: string) => ({
          label: name,
          value: name,
          text: name,
        })),
        'label'
      ),
    ];
  }

  async getServices(
    region?: string,
    range?: TimeRange,
    accountId?: string,
    scopedVars?: ScopedVars
  ): Promise<Array<Record<string, string>>> {
    const actualRegion = this.getActualRegion(region);
    const params = new URLSearchParams({
      region: getTemplateSrv().replace(actualRegion, scopedVars),
      startTime: range ? range.from.toISOString() : '',
      endTime: range ? range.to.toISOString() : '',
      accountId: getTemplateSrv().replace(accountId ?? ''),
    });
    const searchString = '?' + params.toString();
    return this.getResource(`services${searchString}`);
  }

  async getOperations(
    region?: string,
    range?: TimeRange,
    service?: string,
    scopedVars?: ScopedVars
  ): Promise<string[]> {
    const params = new URLSearchParams({
      region: getTemplateSrv().replace(this.getActualRegion(region), scopedVars),
      startTime: range ? range.from.toISOString() : '',
      endTime: range ? range.to.toISOString() : '',
    });

    if (!service) {
      return [];
    }

    const body = getTemplateSrv().replace(service);
    const searchString = '?' + params.toString();
    return this.postResource(`operations${searchString}`, body);
  }

  async getAccountIds(range?: TimeRange, group?: string, scopedVars?: ScopedVars): Promise<string[]> {
    if (!config.featureToggles.cloudWatchCrossAccountQuerying) {
      return [];
    }
    const params = new URLSearchParams({
      startTime: range ? range.from.toISOString() : '',
      endTime: range ? range.to.toISOString() : '',
      group: getTemplateSrv().replace(group ?? 'Default', scopedVars),
    });

    const searchString = '?' + params.toString();

    const response = await this.getResource(`accounts${searchString}`);
    return response.map((account: { Id: string }) => account.Id);
  }

  getServiceMapUrl(region?: string): string {
    return `${this.getXrayUrl(region)}#/service-map/`;
  }

  getXrayUrlForQuery(query: XrayQuery, timeRange?: TimeRange): string {
    let section;
    let urlQuery: URLSearchParams | undefined = new URLSearchParams();
    if (query.query) {
      urlQuery.append('filter', query.query);
    }
    if (timeRange) {
      urlQuery.append('timeRange', `${timeRange.from.toISOString()}~${timeRange.to.toISOString()}`);
    }
    if (query.group && query.group.GroupName !== 'Default') {
      urlQuery.append('group', query.group.GroupName);
    }

    switch (query.queryType) {
      case XrayQueryType.getTraceSummaries:
        section = 'traces';
        break;
      case XrayQueryType.getTrace:
        section = `traces/${query.query}`;
        urlQuery = undefined;
        break;
      case XrayQueryType.getInsights:
        // Insights don't use url params
        section = 'insights';
        urlQuery = undefined;
        break;
      // There is not real equivalent for this so lets point to analytics
      case XrayQueryType.getTimeSeriesServiceStatistics:
      default:
        section = 'analytics';
    }

    // Check if we either dropped the params because they are not needed for some query types or they are empty.
    let queryParams = urlQuery?.toString()
      ? // For some reason the analytics view of X-ray does not handle some url escapes
        '?' + urlQuery?.toString().replace(/\+/g, '%20').replace(/%3A/g, ':').replace(/%7E/g, '~')
      : '';
    return `${this.getXrayUrl(query.region)}#/${section}${queryParams}`;
  }

  // public
  getVariables() {
    return getTemplateSrv()
      .getVariables()
      .map((v) => `$${v.name}`);
  }

  getActualRegion(region?: string) {
    if (region === 'default' || region === undefined || region === '') {
      return this.instanceSettings.jsonData.defaultRegion ?? '';
    }
    return region;
  }

  interpolateVariablesInQueries(queries: XrayQuery[], scopedVars: ScopedVars): XrayQuery[] {
    let expandedQueries = queries;
    if (queries && queries.length) {
      expandedQueries = queries.map((query) => {
        const expandedQuery = {
          ...query,
          datasource: this.getRef(),
          query: getTemplateSrv().replace(query.query, scopedVars),
        };
        return expandedQuery;
      });
    }
    return expandedQueries;
  }

  private getXrayUrl(region?: string): string {
    region = !region || region === 'default' ? this.instanceSettings.jsonData.defaultRegion! : region;
    return `https://${region}.console.aws.amazon.com/xray/home?region=${region}`;
  }

  private parseResponse(response: DataFrame, query?: XrayQuery): DataFrame[] {
    // TODO this would better be based on type but backend Go def does not have dataFrame.type
    switch (response.name) {
      case 'Traces':
        return parseTraceResponse(response, query);
      case 'TraceSummaries':
        return parseTracesListResponse(response, this.instanceSettings, query);
      case 'InsightSummaries':
        return this.parseInsightsResponse(response, query?.region);
      case 'ServiceMap':
        return parseServiceMapResponse(response, this.instanceSettings, query);
      case 'TraceGraph':
        return parseGraphResponse(response, query, { showRequestCounts: true });
      default:
        return [response];
    }
  }

  private parseInsightsResponse(response: DataFrame, region?: string): DataFrame[] {
    const urlToAwsConsole = `${this.getXrayUrl(region)}#/insights/`;
    const idField = response.fields.find((f) => f.name === 'InsightId');
    if (idField) {
      idField.config.links = [{ title: '', url: urlToAwsConsole + '${__value.raw}', targetBlank: true }];
    }
    const duration = response.fields.find((f) => f.name === 'Duration');

    if (duration) {
      duration.type = FieldType.string;
      duration.display = (rawVal) => {
        const val = anyToNumber(rawVal);
        const momentDuration = toDuration(val);
        return {
          numeric: val,
          text: getDurationText(momentDuration),
        };
      };
    }
    return [response];
  }
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
function parseTraceResponse(response: DataFrame, query?: XrayQuery): DataFrame[] {
  // Again assuming this will ge single field with single value which will be the trace data blob
  const traceData = response.fields[0].values.get(0);
  const traceParsed: XrayTraceDataRaw = JSON.parse(traceData);

  const parsedSegments = traceParsed.Segments.map((segment) => {
    return {
      ...segment,
      Document: JSON.parse(segment.Document),
    } as XrayTraceDataSegment;
  });
  const traceParsedForReal: XrayTraceData = {
    ...traceParsed,
    Segments: parsedSegments,
  };

  const frame = transformTraceResponse(traceParsedForReal);
  frame.refId = query?.refId;

  return [frame];
}

/**
 * Adds links to the Id field of the dataframe. This is later processed in grafana to create actual context dependant
 * link that works both in explore and in dashboards.
 * TODO This mutates the dataframe, probably just copy it but seems like new MutableDataframe(response) errors out
 */
function parseTracesListResponse(
  response: DataFrame,
  instanceSettings: DataSourceInstanceSettings,
  query?: XrayQuery
): DataFrame[] {
  const idField = response.fields.find((f) => f.name === 'Id');
  idField!.config.links = [
    {
      title: 'Trace: ${__value.raw}',
      url: '',
      internal: {
        datasourceUid: instanceSettings.uid,
        datasourceName: instanceSettings.name,
        query: {
          ...(query || {}),
          query: '${__value.raw}',
          queryType: 'getTrace',
        },
      },
    },
  ];
  return [response];
}

function parseServiceMapResponse(
  response: DataFrame,
  instanceSettings: DataSourceInstanceSettings,
  query?: XrayQuery
): DataFrame[] {
  const [servicesFrame, edgesFrame] = parseGraphResponse(response, query);
  const serviceQuery = `service(id(name: "\${__data.fields.title}", type: "\${__data.fields.${NodeGraphDataFrameFieldNames.subTitle}}"))`;
  servicesFrame.fields[0].config = {
    links: makeLinks(serviceQuery, instanceSettings, query),
  };

  const edgeQuery = 'edge("${__data.fields.sourceName}", "${__data.fields.targetName}")';
  edgesFrame.fields[0].config = {
    links: makeLinks(edgeQuery, instanceSettings, query),
  };
  return [servicesFrame, edgesFrame];
}

export function migrateQuery(query: XrayQuery): XrayQuery {
  let newQuery = {
    ...query,
  };

  if (!newQuery.serviceString && newQuery.service) {
    newQuery.serviceName = newQuery.service.Name;
    newQuery.serviceString = JSON.stringify(newQuery.service);
  }
  return newQuery;
}

function processRequest(request: DataQueryRequest<XrayQuery>, templateSrv: TemplateSrv): DataQueryRequest<XrayQuery> {
  return {
    ...request,
    targets: request.targets.map((target) => {
      let newTarget = migrateQuery(target);

      // Handle interval => resolution mapping
      if (newTarget.queryType === XrayQueryType.getTimeSeriesServiceStatistics) {
        if (request.intervalMs && !newTarget.resolution) {
          const intervalSeconds = Math.floor(request.intervalMs / 1000);
          newTarget.resolution = intervalSeconds <= 60 ? 60 : 300;
        }
      }

      // Variable interpolation
      newTarget.query = templateSrv.replace(newTarget.query, request.scopedVars);
      newTarget.region = templateSrv.replace(newTarget.region, request.scopedVars);
      newTarget.accountIds = newTarget.accountIds?.map((value) => templateSrv.replace(value, request.scopedVars));
      newTarget.accountId = templateSrv.replace(newTarget.accountId, request.scopedVars);
      newTarget.serviceString = templateSrv.replace(newTarget.serviceString, request.scopedVars);
      newTarget.operationName = templateSrv.replace(newTarget.operationName, request.scopedVars);
      // TODO: handle group interpolation

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
