import { XrayQuery, XrayQueryType } from '../types';
import { DataSourceInstanceSettings } from '@grafana/data';

export function makeLinks(itemQuery: string, instanceSettings: DataSourceInstanceSettings, dataQuery?: XrayQuery) {
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

function linkFactory(itemQuery: string, instanceSettings: DataSourceInstanceSettings, dataQuery?: XrayQuery) {
  return (title: string, queryType: XrayQueryType, queryFilter?: string) => {
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
