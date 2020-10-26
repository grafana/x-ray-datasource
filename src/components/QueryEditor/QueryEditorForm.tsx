import { Group, Region, XrayJsonData, XrayQuery, XrayQueryType } from '../../types';
import { useInitQuery } from './useInitQuery';
import {
  columnNames,
  dummyAllGroup,
  insightsOption,
  QueryTypeOption,
  queryTypeOptions,
  traceListOption,
  traceStatisticsOption,
} from './constants';
import { ButtonCascader, InlineFormLabel, MultiSelect, Segment, stylesFactory, Select } from '@grafana/ui';
import React from 'react';
import { QueryEditorProps } from '@grafana/data';
import { XrayDataSource } from '../../DataSource';
import { QuerySection } from './QuerySection';
import { css } from 'emotion';
import { XrayLinks } from './XrayLinks';

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

const getStyles = stylesFactory(() => ({
  queryParamsRow: css`
    flex-wrap: wrap;
  `,
  spring: css`
    flex: 1;
  `,
  regionSelect: css`
    margin-right: 4px;
  `,
}));

export type XrayQueryEditorFormProps = QueryEditorProps<XrayDataSource, XrayQuery, XrayJsonData> & {
  groups: Group[];
  regions: Region[];
};
export function QueryEditorForm({
  query,
  onChange,
  datasource,
  onRunQuery,
  groups,
  range,
  regions,
}: XrayQueryEditorFormProps) {
  const selectedOptions = queryTypeToQueryTypeOptions(query.queryType);
  const allRegions = [{ label: 'default', value: 'default', text: 'default' }, ...regions];
  useInitQuery(query, onChange, groups, allRegions, datasource);

  const allGroups = selectedOptions[0] === insightsOption ? [dummyAllGroup, ...groups] : groups;

  const styles = getStyles();
  return (
    <div>
      {selectedOptions[0] !== insightsOption && (
        <div className="gf-form">
          <QuerySection
            query={query}
            datasource={datasource}
            onChange={onChange}
            onRunQuery={onRunQuery}
            selectedOptions={selectedOptions}
          />
        </div>
      )}
      <div className={`gf-form ${styles.queryParamsRow}`}>
        <div className="gf-form">
          <InlineFormLabel className="query-keyword" width="auto">
            Region
          </InlineFormLabel>
          <Select
            className={styles.regionSelect}
            options={allRegions}
            value={query.region}
            onChange={v =>
              onChange({
                ...query,
                region: v.value,
              })
            }
            width={18}
            placeholder="Choose Region"
            menuPlacement="bottom"
            maxMenuHeight={500}
          />
        </div>
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

        {/* spring to push the sections apart */}
        <div className={styles.spring} />
        <XrayLinks datasource={datasource} query={query} range={range} />
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
