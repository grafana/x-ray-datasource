import React, { useEffect, useState } from 'react';
import {
  ButtonCascader,
  Icon,
  InlineFormLabel,
  MultiSelect,
  Segment,
  Spinner,
  stylesFactory,
  Tooltip,
} from '@grafana/ui';
import { QueryEditorProps } from '@grafana/data';
import { XrayDataSource } from '../DataSource';
import { Group, XrayJsonData, XrayQuery, XrayQueryType } from '../types';
import { XRayQueryField } from './XRayQueryField';
import { CascaderOption } from '@grafana/ui/components/Cascader/Cascader';
import { css } from 'emotion';

const traceListOption = { label: 'Trace List', value: 'traceList' };
const insightsOption = { label: 'Insights', value: 'insights', queryType: XrayQueryType.getInsights };
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

  if (queryType === XrayQueryType.getInsights) {
    return [insightsOption];
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
      found = (found?.children ?? queryTypeOptions).find((option: QueryTypeOption) => option.value === path);
    }
    return found.queryType;
  }
}

type XrayQueryEditorProps = QueryEditorProps<XrayDataSource, XrayQuery, XrayJsonData>;
export function QueryEditor(props: XrayQueryEditorProps) {
  const groups = useGroups(props.datasource);
  // We need this wrapper to wait for the groups and only after that run the useInitQuery as it needs to know the groups
  // at that point.
  if (!groups) {
    return <Spinner />;
  } else {
    return <QueryEditorForm {...{ ...props, groups: groups! }} />;
  }
}

const getStyles = stylesFactory(() => ({
  tooltipLink: css`
    color: #33a2e5;
    &:hover {
      color: #33a2e5;
      filter: brightness(120%);
    }
  `,
}));

function QueryEditorForm({
  query,
  onChange,
  datasource,
  onRunQuery: onRunQuerySuper,
  groups,
}: XrayQueryEditorProps & { groups: Group[] }) {
  const selectedOptions = queryTypeToQueryTypeOptions(query.queryType);
  useInitQuery(query, onChange, groups, datasource);
  const styles = getStyles();

  const onRunQuery = () => {
    onChange(query);
    // Only run query if it has value
    if (query.query) {
      onRunQuerySuper();
    }
  };

  const allGroups = selectedOptions[0] === insightsOption ? [dummyAllGroup, ...groups] : groups;

  return (
    <div>
      {selectedOptions[0] !== insightsOption && (
        <div className="gf-form">
          <div style={{ flex: 1, display: 'flex' }}>
            <InlineFormLabel className="query-keyword" width="auto">
              Query&nbsp;
              <Tooltip
                placement="top"
                content={
                  <span>
                    See{' '}
                    <a
                      href="https://docs.aws.amazon.com/xray/latest/devguide/xray-console-filters.html?icmpid=docs_xray_console"
                      target="_blank"
                      className={styles.tooltipLink}
                    >
                      X-Ray documentation
                    </a>{' '}
                    for filter expression help.
                  </span>
                }
                theme="info"
              >
                <Icon className="gf-form-help-icon gf-form-help-icon--right-normal" name="info-circle" size="sm" />
              </Tooltip>
            </InlineFormLabel>
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
      )}
      <div className="gf-form">
        <div className="gf-form">
          <InlineFormLabel className="query-keyword" width="auto">
            Query Type
          </InlineFormLabel>
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
          <InlineFormLabel className="query-keyword" width="auto">
            Group
          </InlineFormLabel>
          <Segment
            value={query.group?.GroupName}
            options={allGroups.map((group: Group) => ({
              value: group.GroupARN,
              label: group.GroupName,
            }))}
            onChange={value => {
              onChange({
                ...query,
                group: allGroups.find((g: Group) => g.GroupARN === value.value),
              } as any);
            }}
          />
        </div>

        <div className="gf-form">
          {selectedOptions[0] === insightsOption && (
            <div className="gf-form">
              <InlineFormLabel className="query-keyword" width="auto">
                State
              </InlineFormLabel>
              <Segment
                value={query.state ?? 'All'}
                options={['All', 'Active', 'Closed'].map(val => ({ value: val, label: val }))}
                onChange={value => {
                  onChange({
                    ...query,
                    state: value.value,
                  });
                }}
              />
            </div>
          )}
        </div>

        <div className="gf-form">
          {selectedOptions[0] === traceStatisticsOption && (
            <div className="gf-form" data-testid="resolution" style={{ flexWrap: 'wrap' }}>
              <InlineFormLabel className="query-keyword" width="auto">
                Resolution
              </InlineFormLabel>
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
          )}
        </div>
      </div>
      {selectedOptions[0] === traceStatisticsOption && (
        <div className="gf-form" data-testid="column-filter" style={{ flexWrap: 'wrap' }}>
          <InlineFormLabel className="query-keyword" width="auto">
            Columns
          </InlineFormLabel>
          <div style={{ flex: 1 }}>
            <MultiSelect
              allowCustomValue={false}
              options={Object.keys(columnNames).map(c => ({
                label: columnNames[c],
                value: c,
              }))}
              value={(query.columns || []).map(c => ({
                label: columnNames[c],
                value: c,
              }))}
              onChange={values => onChange({ ...query, columns: values.map(v => v.value!) })}
              closeMenuOnSelect={false}
              isClearable={true}
              placeholder="All columns"
              menuPlacement="bottom"
            />
          </div>
        </div>
      )}
    </div>
  );
}

const columnNames: { [key: string]: string } = {
  'ErrorStatistics.ThrottleCount': 'Throttle Count',
  'ErrorStatistics.TotalCount': 'Error Count',
  'FaultStatistics.TotalCount': 'Fault Count',
  OkCount: 'Success Count',
  TotalCount: 'Total Count',
  'Computed.AverageResponseTime': 'Average Response Time',
};

// Dummy group that can be selected only in insights;
const dummyAllGroup = { GroupName: 'All', GroupARN: 'All' };

/**
 * Inits the query on mount or on datasource change.
 */
function useInitQuery(
  query: XrayQuery,
  onChange: (value: XrayQuery) => void,
  groups: Group[],
  dataSource: XrayDataSource
) {
  useEffect(() => {
    // We assume here the "Default" group is always there.
    const defaultGroup = groups.find((g: Group) => g.GroupName === 'Default')!;

    // We assume that if there is no queryType during mount there should not be any query so we do not need to
    // check if query has traceId or not as we do with the QueryTypeOptions mapping.
    if (!query.queryType) {
      onChange({
        ...query,
        queryType: XrayQueryType.getTraceSummaries,
        query: '',
        group: defaultGroup,
      });
    } else {
      // Check if we can keep the group from previous x-ray datasource or we need to set it to default again.
      let group = query.group;
      let allGroups = groups;
      if (query.queryType === XrayQueryType.getInsights) {
        allGroups = [dummyAllGroup, ...groups];
      }

      let sameArnGroup = allGroups.find((g: Group) => g.GroupARN === query.group?.GroupARN);
      if (!sameArnGroup) {
        group = defaultGroup;
      } else if (
        // This is the case when the group changes ie has the same ARN but different filter for example. I assume this can
        // happen but not 100% sure.
        sameArnGroup.GroupName !== query.group?.GroupName ||
        sameArnGroup.FilterExpression !== query.group?.FilterExpression
      ) {
        group = sameArnGroup;
      }
      if (group !== query.group) {
        onChange({
          ...query,
          group: group,
        });
      }
    }
    // Technically it should dep on all the arguments. Issue is I don't want this to run on every query change as it
    // should not be possible currently to clear the query, change the onChange or groups without changing the
    // datasource so this is sort of shorthand.
  }, [query, dataSource]);
}

function useGroups(datasource: XrayDataSource): Group[] | undefined {
  const [groups, setGroups] = useState<Group[] | undefined>(undefined);

  useEffect(() => {
    // This should run in case we change between different x-ray datasources and so should clear old groups.
    setGroups(undefined);
    datasource.getGroups().then(groups => {
      setGroups(groups);
    });
  }, [datasource]);
  return groups;
}
