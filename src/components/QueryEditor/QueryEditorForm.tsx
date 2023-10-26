import React from 'react';
import { css } from '@emotion/css';
import { QueryEditorProps, ScopedVars } from '@grafana/data';
import { MultiSelect, Select, Cascader } from '@grafana/ui';
import { Group, Region, XrayJsonData, XrayQuery, XrayQueryType } from '../../types';
import { useInitQuery } from './useInitQuery';
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
import { XrayDataSource } from '../../DataSource';
import { getTemplateSrv } from '@grafana/runtime';
import { AccountIdDropdown } from './AccountIdDropdown';
import { EditorRow, EditorFieldGroup, EditorField } from '@grafana/experimental';
import { QuerySection } from './QuerySection';
import { XrayLinks } from './XrayLinks';

function findOptionForQueryType(queryType: XrayQueryType, options: any = queryTypeOptions): QueryTypeOption | null {
  for (const option of options) {
    if (option.queryType === queryType) {
      return option;
    }
    if (option.items) {
      const found = findOptionForQueryType(queryType, option.items);
      if (found) {
        return found;
      }
    }
  }
  return null;
}

/**
 * We do some mapping of the actual queryTypes to options user can select. Mainly don't want user to choose
 * between trace list and single trace and we detect that based on query. So trace list option returns single trace
 * if query contains single traceID.
 */
export function queryTypeToQueryTypeOptions(queryType?: XrayQueryType): QueryTypeOption | null {
  if (!queryType || queryType === XrayQueryType.getTimeSeriesServiceStatistics) {
    return traceStatisticsOption;
  }

  if (queryType === XrayQueryType.getTrace || queryType === XrayQueryType.getTraceSummaries) {
    return traceListOption;
  }

  if (queryType === XrayQueryType.getInsights) {
    return insightsOption;
  }

  return findOptionForQueryType(queryType);
}
// recursively search for the selected option in cascade option's item or item.items
export function findQueryTypeOption(options: QueryTypeOption[], selected: string): QueryTypeOption | undefined {
  for (const option of options) {
    // Check if the current option's value matches the selected value
    if (option.value === selected) {
      return option;
    }

    // If no match was found at the current level, check items if they exist
    if (option.items) {
      const result = findQueryTypeOption(option.items, selected);
      if (result) {
        return result;
      }
    }
  }

  // If no match was found in the current array or its items, return undefined
  return undefined;
}

export function queryTypeOptionToQueryType(
  selected: string,
  query: string,
  scopedVars?: ScopedVars
): XrayQueryType | undefined {
  if (selected === traceListOption.value) {
    const resolvedQuery = getTemplateSrv().replace(query, scopedVars);
    const isTraceIdQuery = /^\d-\w{8}-\w{24}$/.test(resolvedQuery.trim());
    return isTraceIdQuery ? XrayQueryType.getTrace : XrayQueryType.getTraceSummaries;
  } else {
    const foundItem = findQueryTypeOption(queryTypeOptions, selected);
    if (!foundItem) {
      console.log('item could not be found in the options');
    }
    console.log(JSON.stringify(foundItem, null, 2));
    return foundItem?.queryType ?? undefined;
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
  data,
}: XrayQueryEditorFormProps) {
  const allRegions = [{ label: 'default', value: 'default', text: 'default' }, ...regions];
  useInitQuery(query, onChange, groups, allRegions, datasource);

  const selectedOption = queryTypeToQueryTypeOptions(query.queryType);
  const allGroups = selectedOption === insightsOption ? [dummyAllGroup, ...groups] : groups;
  const styles = getStyles();

  return (
    <>
      <EditorRow>
        <EditorFieldGroup>
          <EditorField label="Query Type" className={`query-keyword ${styles.formFieldStyles}`}>
            <Cascader
              initialValue={selectedOption?.value}
              options={queryTypeOptions}
              changeOnSelect={false}
              onSelect={(value: string) => {
                const newQueryType = queryTypeOptionToQueryType(value, query.query || '', data?.request?.scopedVars);
                onChange({
                  ...query,
                  queryType: newQueryType,
                  columns: newQueryType === XrayQueryType.getTimeSeriesServiceStatistics ? ['all'] : undefined,
                } as any);
              }}
            />
          </EditorField>
          <EditorField label="Region" className={`query-keyword ${styles.formFieldStyles}`} htmlFor="region">
            <Select
              id="region"
              className={styles.regionSelect}
              options={allRegions}
              value={query.region}
              onChange={(v) =>
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
          {serviceMapOption === selectedOption && (
            <AccountIdDropdown
              datasource={datasource}
              newFornStylingEnabled={true}
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
          {selectedOption === insightsOption && (
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
          {selectedOption === traceStatisticsOption && (
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
      {selectedOption && ![insightsOption, serviceMapOption].includes(selectedOption) && (
        <EditorRow>
          <QuerySection
            query={query}
            datasource={datasource}
            onChange={onChange}
            onRunQuery={onRunQuery}
            selectedOption={selectedOption}
          />
        </EditorRow>
      )}

      {selectedOption === traceStatisticsOption && (
        <EditorRow>
          <EditorFieldGroup>
            <EditorField
              label="Columns"
              className={`query-keyword ${styles.formFieldStyles}`}
              htmlFor="columns"
              data-testid="column-filter"
            >
              <MultiSelect
                id="columns"
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
