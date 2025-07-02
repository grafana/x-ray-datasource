import { css } from '@emotion/css';
import { GrafanaTheme2, QueryEditorProps, SelectableValue } from '@grafana/data';
import { Select, useStyles2 } from '@grafana/ui';
import React from 'react';
import { Group, VariableQueryType, XrayJsonData, XrayQuery, XrayVariableQuery } from 'types';
import { XrayDataSource } from 'XRayDataSource';
import { useAccountIds } from './QueryEditor/useAccountIds';
import { useServices } from './QueryEditor/useServices';
import { EditorField } from '@grafana/plugin-ui';
import { useRegionOptions } from './QueryEditor/useRegions';
import { useGroups } from './QueryEditor/useGroups';
import { serviceStringsToOption } from './utils';

export type Props = QueryEditorProps<XrayDataSource, XrayQuery, XrayJsonData, XrayVariableQuery>;

const variableQueryOptions: Array<SelectableValue<VariableQueryType>> = [
  { label: 'Regions', value: VariableQueryType.Regions },
  // 374: Add proper support for group
  // { label: 'Groups', value: VariableQueryType.Groups },
  { label: 'Accounts', value: VariableQueryType.Accounts },
  { label: 'Services', value: VariableQueryType.Services },
  { label: 'Operations', value: VariableQueryType.Operations },
];

function groupsToOptions(groups: Group[], datasource: XrayDataSource): Array<SelectableValue<string>> {
  let groupOptions: Array<SelectableValue<string>> = groups.map((group: Group) => ({
    value: group.GroupName,
    label: group.GroupName,
  }));
  return groupOptions;
}

export const XrayVariableQueryEditor = ({ query, datasource, onChange, range }: Props) => {
  const { queryType, region, groupName, accountId, serviceName, serviceString } = query;
  const styles = useStyles2(getStyles);

  const regionOptions = useRegionOptions(datasource);

  // Use groups will return old groups after region change so it does not flash loading state. in case datasource
  // changes regions will return undefined so that will do the loading state.
  const groups = useGroups(datasource, region) ?? [];
  let groupOptions = groupsToOptions(groups, datasource);

  const accountIds = useAccountIds(datasource, groupName, range);
  const services = useServices(datasource, region, range, query.accountId);

  return (
    <div className={styles.formStyles}>
      <EditorField label="Query Type">
        <Select
          value={queryType}
          options={variableQueryOptions}
          onChange={(value) => {
            //TODO remove any
            onChange({ ...query, queryType: value.value } as any);
          }}
        />
      </EditorField>
      {query.queryType !== undefined && query.queryType !== VariableQueryType.Regions && (
        <EditorField label="Region">
          <Select
            value={region}
            options={regionOptions}
            allowCustomValue
            onChange={(value) => {
              onChange({ ...query, region: value.value });
            }}
          />
        </EditorField>
      )}
      {query.queryType === VariableQueryType.Accounts && (
        <EditorField label="Group">
          <Select
            value={query.groupName}
            options={groupOptions}
            allowCustomValue
            onChange={(value) => {
              onChange({ ...query, groupName: value.value });
            }}
          />
        </EditorField>
      )}
      {query.queryType === VariableQueryType.Services && (
        <EditorField label="AccountId">
          <Select
            value={accountId}
            options={accountIds}
            allowCustomValue
            onChange={(value) => {
              onChange({ ...query, accountId: value.value });
            }}
          />
        </EditorField>
      )}
      {query.queryType === VariableQueryType.Operations && (
        <EditorField label="Service">
          <Select
            value={serviceName && serviceString ? serviceStringsToOption(serviceName, serviceString) : undefined}
            options={services}
            onChange={(value) => {
              onChange({ ...query, serviceName: value.label, serviceString: value.value });
            }}
          />
        </EditorField>
      )}
    </div>
  );
};

const getStyles = (theme: GrafanaTheme2) => ({
  formStyles: css({
    maxWidth: theme.spacing(30),
  }),
  dimensionsWidth: css({
    width: theme.spacing(50),
  }),
});
