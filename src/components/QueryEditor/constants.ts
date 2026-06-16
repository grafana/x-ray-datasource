import { XrayQueryType } from '../../types';
import { CascaderOption } from '@grafana/ui';

export type QueryTypeOption = CascaderOption & {
  queryType?: XrayQueryType;
  children?: QueryTypeOption[];
  items?: QueryTypeOption[];
};

export const traceListOption: QueryTypeOption = { label: 'Trace List', value: 'traceList' };
export const insightsOption: QueryTypeOption = {
  label: 'Insights',
  value: 'insights',
  queryType: XrayQueryType.getInsights,
};
export const serviceMapOption: QueryTypeOption = {
  label: 'Service Map',
  value: 'serviceMap',
  queryType: XrayQueryType.getServiceMap,
};

export const traceStatisticsOption: QueryTypeOption = {
  label: 'Trace Statistics',
  value: 'traceStatistics',
  queryType: XrayQueryType.getTimeSeriesServiceStatistics,
};

export const queryTypeOptions: QueryTypeOption[] = [
  traceListOption,
  traceStatisticsOption,
  insightsOption,
  {
    label: 'Trace Analytics',
    value: 'traceAnalytics',
    children: [
      {
        value: 'rootCause',
        label: 'Root Cause',
        children: [
          {
            value: 'responseTime',
            label: 'Response Time',
            children: [
              {
                value: 'rootCauseService',
                label: 'Root Cause',
                queryType: XrayQueryType.getAnalyticsRootCauseResponseTimeService,
              } as QueryTypeOption,
              {
                value: 'path',
                label: 'Path',
                queryType: XrayQueryType.getAnalyticsRootCauseResponseTimePath,
              },
            ],
          },
          {
            value: 'error',
            label: 'Error',
            children: [
              {
                value: 'rootCauseService',
                label: 'Root Cause',
                queryType: XrayQueryType.getAnalyticsRootCauseErrorService,
              },
              {
                value: 'path',
                label: 'Path',
                queryType: XrayQueryType.getAnalyticsRootCauseErrorPath,
              },
              {
                value: 'message',
                label: 'Error Message',
                queryType: XrayQueryType.getAnalyticsRootCauseErrorMessage,
              },
            ],
          },
          {
            value: 'fault',
            label: 'Fault',
            children: [
              {
                value: 'rootCauseService',
                label: 'Root Cause',
                queryType: XrayQueryType.getAnalyticsRootCauseFaultService,
              },
              {
                value: 'path',
                label: 'Path',
                queryType: XrayQueryType.getAnalyticsRootCauseFaultPath,
              },
              {
                value: 'message',
                label: 'Error Message',
                queryType: XrayQueryType.getAnalyticsRootCauseFaultMessage,
              },
            ],
          },
        ],
      },
      {
        value: 'user',
        label: 'End user impact',
        queryType: XrayQueryType.getAnalyticsUser,
      } as QueryTypeOption,
      {
        value: 'url',
        label: 'URL',
        queryType: XrayQueryType.getAnalyticsUrl,
      },
      {
        value: 'statusCode',
        label: 'HTTP status code',
        queryType: XrayQueryType.getAnalyticsStatusCode,
      },
    ],
  },
  serviceMapOption,
];

export const columnNames: { [key: string]: string } = {
  'ErrorStatistics.ThrottleCount': 'Throttle Count',
  'ErrorStatistics.TotalCount': 'Error Count',
  'FaultStatistics.TotalCount': 'Fault Count',
  OkCount: 'Success Count',
  TotalCount: 'Total Count',
  'Computed.AverageResponseTime': 'Average Response Time',
};

// Dummy group that can be selected only in insights;
export const dummyAllGroup = { GroupName: 'All', GroupARN: 'All' };
