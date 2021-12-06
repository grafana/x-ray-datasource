import { XrayQuery, XrayQueryType } from '../types';
import { DataFrame, DataLink, DataSourceInstanceSettings } from '@grafana/data';
import { getDataSourceSrv } from '@grafana/runtime';

/**
 * Create links that will be shown when clicked on a service in service map. They target the same data source but
 * queries for traces related to that particular service
 * @param itemQuery String query part that should filter a particular service
 * @param instanceSettings
 * @param dataQuery Existing query to pass on any additional query data so they stay the same, like region.
 */
export function makeServiceMapLinks(
  itemQuery: string,
  instanceSettings: DataSourceInstanceSettings,
  dataQuery?: XrayQuery
) {
  const makeLink = linkFactory(itemQuery, instanceSettings, dataQuery);
  return [
    makeLink('Traces/All', XrayQueryType.getTraceSummaries),
    makeLink('Traces/OK', XrayQueryType.getTraceSummaries, '{ ok = true }'),
    makeLink('Traces/Errors', XrayQueryType.getTraceSummaries, '{ error = true }'),
    makeLink('Traces/Faults', XrayQueryType.getTraceSummaries, '{ fault = true }'),

    makeLink('Root cause/Error', XrayQueryType.getAnalyticsRootCauseErrorService),
    makeLink('Root cause/Fault', XrayQueryType.getAnalyticsRootCauseFaultService),
    makeLink('Root cause/Response Time', XrayQueryType.getAnalyticsRootCauseResponseTimeService),
  ];
}

export async function addTraceToLogsLinks(frame: DataFrame, region?: string, datasourceUid?: string) {
  if (!datasourceUid) {
    return;
  }
  try {
    const spanField = frame.fields.find((f) => f.name === 'spanID')!;
    const requestIdField = frame.fields.find((f) => f.name === '__request_id')!;
    const link = await makeTraceToLogsLink(datasourceUid, region, {
      hasRequestId: Boolean(requestIdField.values.get(0)),
    });
    spanField.config.links = [link];
  } catch (error) {
    // There are some things that can go wrong like datasourceUID not existing anymore etc. Does not seem useful to
    // error the whole query in that case so we will just skip the links.
    console.error(error);
  }
}

async function makeTraceToLogsLink(
  datasourceUid: string,
  region = 'default',
  options: { hasRequestId: boolean }
): Promise<DataLink> {
  const logsDS = await getDataSourceSrv().get(datasourceUid);
  const filter = options.hasRequestId
    ? 'filter @requestId = "${__data.fields.__request_id}" or @message like "${__data.fields.traceID}"'
    : 'filter @message like "${__data.fields.traceID}"';
  return {
    title: 'CloudWatch Logs',
    url: '',
    internal: {
      query: {
        region,
        queryMode: 'Logs',
        // Just use the data from the data frame. Needs to be filled in during transform.
        logGroupNames: ['${__data.fields.__log_group}'],
        expression: `fields @message | ${filter}`,
      },
      datasourceUid,
      datasourceName: logsDS.name,
    },
  };
}

function linkFactory(itemQuery: string, instanceSettings: DataSourceInstanceSettings, dataQuery?: XrayQuery) {
  return (title: string, queryType: XrayQueryType, queryFilter?: string): DataLink => {
    return {
      title,
      url: '',
      internal: {
        query: {
          ...(dataQuery || {}),
          queryType,
          query: itemQuery + (queryFilter ? ' ' + queryFilter : ''),
        },
        datasourceUid: instanceSettings.uid,
        datasourceName: instanceSettings.name,
      },
    };
  };
}
