import { css } from '@emotion/css';
import { GrafanaTheme2, QueryEditorProps, SelectableValue } from '@grafana/data';
import { Select, useStyles2 } from '@grafana/ui';
import React from 'react';
import { Group, VariableQueryType, XrayJsonData, XrayQuery, XrayVariableQuery } from 'types';
import { XrayDataSource } from 'XRayDataSource';
import { useAccountIds } from './QueryEditor/useAccountIds';
import { useServices } from './QueryEditor/useServices';
import { EditorField } from '@grafana/plugin-ui';
import { useRegions } from './QueryEditor/useRegions';
import { useGroups } from './QueryEditor/useGroups';

export type Props = QueryEditorProps<XrayDataSource, XrayQuery, XrayJsonData, XrayVariableQuery>;

const variableQueryOptions: Array<SelectableValue<VariableQueryType>> = [
  { label: 'Regions', value: VariableQueryType.Regions },
  { label: 'Groups', value: VariableQueryType.Groups },
  { label: 'Accounts', value: VariableQueryType.Accounts },
  { label: 'Services', value: VariableQueryType.Services },
  { label: 'Operations', value: VariableQueryType.Operations },
];

function serviceToOption(service: Record<string, string>) {
  return {
    value: service,
    label: service.Name,
  };
}

export const XrayVariableQueryEditor = ({ query, datasource, onChange, range }: Props) => {
  const { queryType, region, group, accountId, service } = query;
  const styles = useStyles2(getStyles);

  const regions = useRegions(datasource);
  // Use groups will return old groups after region change so it does not flash loading state. in case datasource
  // changes regions will return undefined so that will do the loading state.
  const groups = useGroups(datasource, region) ?? [];
  const groupOptions = groups.map((group: Group) => ({
    value: group.GroupARN,
    label: group.GroupName,
  }));

  const accountIds = useAccountIds(datasource, group, range);

  const services = useServices(datasource, region, range, query.accountId);
  const serviceOptions = (services || []).map(serviceToOption);

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
            options={regions}
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
            value={query.group?.GroupName}
            options={groupOptions}
            allowCustomValue
            onChange={(value) => {
              onChange({ ...query, group: groups.find((g: Group) => g.GroupARN === value.value) });
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
            value={service ? serviceToOption(service) : undefined}
            options={serviceOptions}
            onChange={(value) => {
              onChange({ ...query, service: value.value });
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
