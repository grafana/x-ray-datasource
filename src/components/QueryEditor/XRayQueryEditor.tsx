import React from 'react';
import { css } from '@emotion/css';
import { QueryEditorProps, ScopedVars } from '@grafana/data';
import { MultiSelect, Select, ButtonCascader } from '@grafana/ui';
import { Group, XrayJsonData, XrayQuery, XrayQueryType } from '../../types';
import {
  QueryTypeOption,
  columnNames,
  dummyAllGroup,
  insightsOption,
  queryTypeOptions,
  serviceMapOption,
  traceListOption,
  traceStatisticsOption,
} from './constants';
import { XrayDataSource } from '../../XRayDataSource';
import { getTemplateSrv } from '@grafana/runtime';
import { AccountIdDropdown } from './AccountIdDropdown';
import { EditorRow, EditorFieldGroup, EditorField } from '@grafana/plugin-ui';
import { QuerySection } from './QuerySection';
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
function queryTypeToQueryTypeOptions(queryType?: XrayQueryType): QueryTypeOption[] {
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

export function queryTypeOptionToQueryType(selected: string[], query: string, scopedVars?: ScopedVars): XrayQueryType {
  if (selected[0] === traceListOption.value) {
    const resolvedQuery = getTemplateSrv().replace(query, scopedVars);
    const isTraceIdQuery = /^(\d-\w{8}-\w{24}|\w{32})$/.test(resolvedQuery.trim());
    return isTraceIdQuery ? XrayQueryType.getTrace : XrayQueryType.getTraceSummaries;
  } else {
    let found: any = undefined;
    for (const path of selected) {
      found = (found?.children ?? queryTypeOptions).find((option: QueryTypeOption) => option.value === path);
    }
    return found.queryType;
  }
}

const getStyles = () => ({
  queryParamsRow: css`
    flex-wrap: wrap;
  `,
  spring: css`
    flex: 1;
  `,
  regionSelect: css`
    margin-right: 4px;
  `,
  formFieldStyles: css({
    marginBottom: 0,
  }),
});

export type XrayQueryEditorFormProps = QueryEditorProps<XrayDataSource, XrayQuery, XrayJsonData> & {
  groups: Group[];
};
export function XRayQueryEditor({
  query,
  onChange,
  datasource,
  onRunQuery,
  groups,
  range,
  data,
}: XrayQueryEditorFormProps) {
  const selectedOptions = queryTypeToQueryTypeOptions(query.queryType);

  const allGroups = selectedOptions[0] === insightsOption ? [dummyAllGroup, ...groups] : groups;
  const styles = getStyles();

  return (
    <>
      <EditorRow>
        <EditorFieldGroup>
          <EditorField label="Query Type" className={`query-keyword ${styles.formFieldStyles}`}>
            <ButtonCascader
              variant="secondary"
              value={selectedOptions.map((option) => option.value)}
              options={queryTypeOptions}
              onChange={(value) => {
                const newQueryType = queryTypeOptionToQueryType(value, query.query || '', data?.request?.scopedVars);
                onChange({
                  ...query,
                  queryType: newQueryType,
                  columns: newQueryType === XrayQueryType.getTimeSeriesServiceStatistics ? [] : undefined,
                } as any);
              }}
            >
              {selectedOptions[selectedOptions.length - 1].label}
            </ButtonCascader>
          </EditorField>
          <EditorField label="Group" className={`query-keyword ${styles.formFieldStyles}`} htmlFor="groupName">
            <Select
              id="groupName"
              value={query.group?.GroupName}
              options={allGroups.map((group: Group) => ({
                value: group.GroupARN,
                label: group.GroupName,
              }))}
              onChange={(value) => {
                onChange({
                  ...query,
                  group: allGroups.find((g: Group) => g.GroupARN === value.value),
                } as any);
              }}
            />
          </EditorField>
          {[serviceMapOption].includes(selectedOptions[0]) && (
            <AccountIdDropdown
              datasource={datasource}
              query={query}
              range={range}
              onChange={(accountIds) =>
                onChange({
                  ...query,
                  accountIds,
                })
              }
            />
          )}
          {selectedOptions[0] === insightsOption && (
            <EditorField label="State" className={`query-keyword ${styles.formFieldStyles}`} htmlFor="queryState">
              <Select
                id="queryState"
                value={query.state ?? 'All'}
                options={['All', 'Active', 'Closed'].map((val) => ({ value: val, label: val }))}
                onChange={(value) => {
                  onChange({
                    ...query,
                    state: value.value,
                  });
                }}
              />
            </EditorField>
          )}
          {selectedOptions[0] === traceStatisticsOption && (
            <EditorField
              label="Resolution"
              className={`query-keyword ${styles.formFieldStyles}`}
              htmlFor="resolution"
              data-testid="resolution"
            >
              <Select
                id="resolution"
                value={query.resolution ? query.resolution.toString() + 's' : 'auto'}
                options={['auto', '60s', '300s'].map((val) => ({ value: val, label: val }))}
                onChange={({ value }) => {
                  onChange({
                    ...query,
                    resolution: value === 'auto' ? undefined : parseInt(value!, 10),
                  } as any);
                }}
              />
            </EditorField>
          )}
          <XrayLinks datasource={datasource} query={query} range={range} />
        </EditorFieldGroup>
      </EditorRow>
      {![insightsOption, serviceMapOption].includes(selectedOptions[0]) && (
        <EditorRow>
          <QuerySection
            query={query}
            datasource={datasource}
            onChange={onChange}
            onRunQuery={onRunQuery}
            selectedOptions={selectedOptions}
          />
        </EditorRow>
      )}

      {selectedOptions[0] === traceStatisticsOption && (
        <EditorRow>
          <EditorFieldGroup>
            <EditorField
              label="Columns"
              className={`query-keyword ${styles.formFieldStyles}`}
              htmlFor="columns"
              data-testid="column-filter"
            >
              <MultiSelect
                inputId="columns"
                allowCustomValue={false}
                options={Object.keys(columnNames).map((c) => ({
                  label: columnNames[c],
                  value: c,
                }))}
                value={(query.columns || []).map((c) => ({
                  label: columnNames[c],
                  value: c,
                }))}
                onChange={(values) => onChange({ ...query, columns: values.map((v) => v.value!) })}
                closeMenuOnSelect={false}
                isClearable={true}
                placeholder="All columns"
                menuPlacement="bottom"
              />
            </EditorField>
          </EditorFieldGroup>
        </EditorRow>
      )}
    </>
  );
}
