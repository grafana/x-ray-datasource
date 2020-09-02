import React, { useEffect, useState } from 'react';
import { ButtonCascader, InlineFormLabel, Segment } from '@grafana/ui';
import { QueryEditorProps } from '@grafana/data';
import { XrayDataSource } from '../DataSource';
import { Group, XrayJsonData, XrayQuery, XrayQueryType } from '../types';
import { XRayQueryField } from './XRayQueryField';
import { ColumnFilter } from './ColumnFilter';
import { CascaderOption } from '@grafana/ui/components/Cascader/Cascader';

const traceListOption = { label: 'Trace List', value: 'traceList' };
const traceStatisticsOption = {
  label: 'Trace Statistics',
  value: 'traceStatistics',
  queryType: XrayQueryType.getTimeSeriesServiceStatistics,
};

type QueryTypeOption = CascaderOption & {
  queryType?: XrayQueryType;
  children?: QueryTypeOption[];
};

export const queryTypeOptions: QueryTypeOption[] = [
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
];

function findOptionForQueryType(queryType: XrayQueryType, options: any = queryTypeOptions): QueryTypeOption[] {
  for (const option of options) {
    const selected: QueryTypeOption[] = [];
    if (option.queryType === queryType) {
      selected.push(option);
      return selected;
    }
    if (option.children) {
      const found = findOptionForQueryType(queryType, option.children);
      if (found.length) {
        selected.push(option, ...found);
        return selected;
      }
    }
  }
  return [];
}

/**
 * We do some mapping of the actual queryTypes to options user can select. Mainly don't want user to choose
 * between trace list and single trace and we detect that based on query. So trace list option returns single trace
 * if query contains single traceID.
 */
export function queryTypeToQueryTypeOptions(queryType?: XrayQueryType): QueryTypeOption[] {
  if (!queryType || queryType === XrayQueryType.getTimeSeriesServiceStatistics) {
    return [traceStatisticsOption];
  }

  if (queryType === XrayQueryType.getTrace || queryType === XrayQueryType.getTraceSummaries) {
    return [traceListOption];
  }

  return findOptionForQueryType(queryType);
}

export function queryTypeOptionToQueryType(selected: string[], query: string): XrayQueryType {
  if (selected[0] === traceListOption.value) {
    const isTraceIdQuery = /^\d-\w{8}-\w{24}$/.test(query.trim());
    return isTraceIdQuery ? XrayQueryType.getTrace : XrayQueryType.getTraceSummaries;
  } else {
    let found: any = undefined;
    for (const path of selected) {
      found = (found?.children ?? queryTypeOptions).find((option: QueryTypeOption) => option.value === path)!;
    }
    return found.queryType!;
  }
}

type Props = QueryEditorProps<XrayDataSource, XrayQuery, XrayJsonData>;
export function QueryEditor({ query, onChange, datasource, onRunQuery: onRunQuerySuper }: Props) {
  const groups = useGroups(datasource);
  useInitQuery(query, onChange, groups);
  const selectedOptions = queryTypeToQueryTypeOptions(query.queryType);

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
            value={selectedOptions.map(option => option.value)}
            options={queryTypeOptions}
            onChange={value => {
              const newQueryType = queryTypeOptionToQueryType(value, query.query || '');
              onChange({
                ...query,
                queryType: newQueryType,
                columns: newQueryType === XrayQueryType.getTimeSeriesServiceStatistics ? ['all'] : undefined,
              } as any);
            }}
          >
            {selectedOptions[selectedOptions.length - 1].label}
          </ButtonCascader>
        </div>
        <div className="gf-form">
          <InlineFormLabel width="auto">Group</InlineFormLabel>
          <Segment
            value={query.group?.GroupName}
            options={groups.map((group: Group) => ({
              value: group.GroupARN,
              label: group.GroupName,
            }))}
            onChange={value => {
              onChange({
                ...query,
                group: groups.find((g: Group) => g.GroupARN === value.value),
              } as any);
            }}
          />
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
                queryType: queryTypeOptionToQueryType(
                  selectedOptions.map(option => option.value),
                  e.query
                ),
                query: e.query,
              });
            }}
          />
        </div>
      </div>
      {selectedOptions[0] === traceStatisticsOption && (
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
function useInitQuery(query: XrayQuery, onChange: (value: XrayQuery) => void, groups: Group[]) {
  useEffect(() => {
    let queryType;
    // We assume that if there is no queryType during mount there should not be any query so we do not need to
    // check if query has traceId or not as we do with the QueryTypeOptions mapping.
    if (!query.queryType) {
      queryType = XrayQueryType.getTraceSummaries;
    }

    let group;
    let sameArnGroup = groups.find((g: Group) => g.GroupARN === query.group?.GroupARN);
    if (!sameArnGroup) {
      // We assume here the "Default" group is always there.
      group = groups.find((g: Group) => g.GroupName === 'Default');
    } else if (
      // This is the case when the group changes ie has the same ARN but different filter for example. I assume this can
      // happen but not 100% sure.
      sameArnGroup.GroupName !== query.group?.GroupName ||
      sameArnGroup.FilterExpression !== query.group?.FilterExpression
    ) {
      group = sameArnGroup;
    }

    if (queryType || group) {
      const change: Partial<XrayQuery> = {};
      if (queryType) {
        change.queryType = queryType;
      }
      if (group) {
        change.group = group;
      }
      onChange({
        ...query,
        ...change,
      });
    }
  }, [query, groups]);
}

function useGroups(datasource: XrayDataSource) {
  const [groups, setGroups] = useState<Group[]>([]);
  useEffect(() => {
    // This should run in case we change between different x-ray datasources and so should clear old groups.
    setGroups([]);
    datasource.getGroups().then(groups => {
      setGroups(groups);
    });
  }, [datasource]);
  return groups;
}
