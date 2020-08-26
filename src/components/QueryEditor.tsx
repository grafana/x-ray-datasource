import React, { useEffect } from 'react';
import { ButtonCascader, InlineFormLabel, Segment } from '@grafana/ui';
import { QueryEditorProps } from '@grafana/data';
import { XrayDataSource } from '../DataSource';
import { XrayJsonData, XrayQuery, XrayQueryType } from '../types';
import { XRayQueryField } from './XRayQueryField';
import { ColumnFilter } from './ColumnFilter';

const traceListOption = { label: 'Trace List', value: 'traceList' };
const traceStatisticsOption = {
  label: 'Trace Statistics',
  value: 'traceStatistics',
  queryType: XrayQueryType.getTimeSeriesServiceStatistics,
};

const queryTypeOptions = [
  traceListOption,
  traceStatisticsOption,
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
              },
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
      },
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
];

function findOptionForQueryType(queryType: XrayQueryType, options: any = queryTypeOptions): any {
  for (const option of options) {
    if (option.queryType === queryType) {
      return option;
    }
    if (option.children) {
      const found = findOptionForQueryType(queryType, option.children);
      if (found) {
        return found;
      }
    }
  }
}

/**
 * We do some mapping of the actual queryTypes to options user can select. Mainly don't want user to choose
 * between trace list and single trace and we detect that based on query. So trace list option returns single trace
 * if query contains single traceID.
 */
export function queryTypeToQueryTypeOptions(queryType?: XrayQueryType): any {
  if (!queryType || queryType === XrayQueryType.getTimeSeriesServiceStatistics) {
    return queryTypeOptions[1];
  }

  if (queryType === XrayQueryType.getTrace || queryType === XrayQueryType.getTraceSummaries) {
    return queryTypeOptions[0];
  }

  return findOptionForQueryType(queryType);
}

export function queryTypeOptionToQueryType(selected: string[], query: string): XrayQueryType {
  if (selected[0] === traceListOption.value) {
    const isTraceIdQuery = /^\d-\w{8}-\w{24}$/.test(query.trim());
    return isTraceIdQuery ? XrayQueryType.getTrace : XrayQueryType.getTraceSummaries;
  } else {
    let searchingOptions: any = queryTypeOptions;
    let foundOption;
    for (const option of selected) {
      foundOption = searchingOptions.find((o: any) => o.value === option);
      searchingOptions = foundOption?.children;
    }
    return foundOption.queryType;
  }
}

type Props = QueryEditorProps<XrayDataSource, XrayQuery, XrayJsonData>;
export function QueryEditor({ query, onChange, datasource, onRunQuery: onRunQuerySuper }: Props) {
  useInitQuery(query, onChange);
  const queryTypeOption = queryTypeToQueryTypeOptions(query.queryType);

  const onRunQuery = () => {
    onChange(query);
    // Only run query if it has value
    if (query.query) {
      onRunQuerySuper();
    }
  };

  return (
    <div>
      <div className="gf-form">
        <div className="gf-form">
          <InlineFormLabel width="auto">Query Type</InlineFormLabel>
          <ButtonCascader
            options={queryTypeOptions}
            onChange={value => {
              const newQueryType = queryTypeOptionToQueryType(
                // @ts-ignore get get rid of implicit any here
                value,
                query.query || ''
              );
              onChange({
                ...query,
                queryType: newQueryType,
                columns: newQueryType === XrayQueryType.getTimeSeriesServiceStatistics ? ['all'] : undefined,
              } as any);
            }}
          >
            {queryTypeOption.label}
          </ButtonCascader>
        </div>
        <div style={{ flex: 1, display: 'flex' }}>
          <InlineFormLabel width="auto">Query</InlineFormLabel>
          <XRayQueryField
            query={query}
            history={[]}
            datasource={datasource}
            onRunQuery={onRunQuery}
            onChange={e => {
              onChange({
                ...query,
                queryType: queryTypeOptionToQueryType(queryTypeOption, e.query),
                query: e.query,
              });
            }}
          />
        </div>
      </div>
      {queryTypeOption === traceStatisticsOption && (
        <div className="gf-form">
          <div className="gf-form" data-testid="resolution" style={{ flexWrap: 'wrap' }}>
            <InlineFormLabel width="auto">Resolution</InlineFormLabel>
            <Segment
              value={query.resolution ? query.resolution.toString() + 's' : 'auto'}
              options={['auto', '60s', '300s'].map(val => ({ value: val, label: val }))}
              onChange={({ value }) => {
                onChange({
                  ...query,
                  resolution: value === 'auto' ? undefined : parseInt(value!, 10),
                } as any);
              }}
            />
          </div>
          <div className="gf-form" data-testid="column-filter" style={{ flexWrap: 'wrap' }}>
            <InlineFormLabel width="auto">Columns</InlineFormLabel>
            <ColumnFilter columns={query.columns || []} onChange={columns => onChange({ ...query, columns })} />
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Inits the query with queryType so the segment component is filled in.
 */
function useInitQuery(query: XrayQuery, onChange: (value: XrayQuery) => void) {
  useEffect(() => {
    // We assume that if there is no queryType during mount there should not be any query so we do not need to
    // check if query has traceId or not as we do with the QueryTypeOptions mapping.
    if (!query.queryType) {
      onChange({
        ...query,
        queryType: XrayQueryType.getTraceSummaries,
      });
    }
  }, [query]);
}
