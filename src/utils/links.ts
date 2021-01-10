import { XrayQuery, XrayQueryType } from '../types';
import { DataSourceInstanceSettings } from '@grafana/data';

export function makeLinks(itemQuery: string, instanceSettings: DataSourceInstanceSettings, dataQuery?: XrayQuery) {
  const makeLink = linkFactory(itemQuery, instanceSettings, dataQuery);
  return [
    makeLink('All Traces', XrayQueryType.getTraceSummaries),
    makeLink('OK Traces', XrayQueryType.getTraceSummaries, '{ ok = true }'),
    makeLink(
      'OK Traces response time root cause',
      XrayQueryType.getAnalyticsRootCauseResponseTimeService,
      '{ ok = true }'
    ),
    makeLink('Error Traces', XrayQueryType.getTraceSummaries, '{ error = true }'),
    makeLink('Error Traces root cause', XrayQueryType.getAnalyticsRootCauseErrorService, '{ error = true }'),
    makeLink('Fault Traces', XrayQueryType.getTraceSummaries, '{ fault = true }'),
    makeLink('Fault Traces root cause', XrayQueryType.getAnalyticsRootCauseFaultService, '{ fault = true }'),
    makeLink('Throttle Traces', XrayQueryType.getTraceSummaries, '{ throttle = true }'),
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
        // @ts-ignore
        datasourceName: instanceSettings.name,
      },
    };
  };
}
