import { css } from '@emotion/css';
import { QueryEditorProps, SelectableValue } from '@grafana/data';
import { EditorField, EditorFieldGroup, EditorRow } from '@grafana/plugin-ui';
import { InlineSwitch, Select } from '@grafana/ui';
import React from 'react';
import { ServicesQueryType, XrayJsonData, XrayQuery } from 'types';
import { XrayDataSource } from 'XRayDataSource';
import { config } from '@grafana/runtime';
import { useAccountIds } from './useAccountIds';

export type ServiceQueryEditorFormProps = QueryEditorProps<XrayDataSource, XrayQuery, XrayJsonData> & {};

const servicesQueryOptions: Array<SelectableValue<ServicesQueryType>> = [
  { label: 'List Services', value: ServicesQueryType.listServices },
];

export function ServiceQueryEditor({
  query,
  onChange,
  datasource,
  onRunQuery,
  range,
  data,
}: ServiceQueryEditorFormProps) {
  const styles = getStyles();

  const accountIds = useAccountIds(datasource, query, range);
  const accountIdOptions = (accountIds || []).map((accountId: string) => ({
    value: accountId,
    label: accountId,
  }));
  accountIdOptions.push({ value: '', label: 'Default' });
  const hasStoredAccountIdFilter = !!(query.accountId && query.accountId.length);
  const showAccountIdDropdown = config.featureToggles.cloudWatchCrossAccountQuerying || hasStoredAccountIdFilter;

  return (
    <>
      <EditorRow>
        <EditorFieldGroup>
          <EditorField label="Query Type" className={`query-keyword ${styles.formFieldStyles}`}>
            <Select
              id="queryType"
              value={query.serviceQueryType}
              options={servicesQueryOptions}
              onChange={(value) => {
                onChange({
                  ...query,
                  serviceQueryType: value.value,
                } as any);
              }}
            />
          </EditorField>
          {showAccountIdDropdown && (
            <>
              <EditorField label="Include Linked Accounts" className="query-keyword" htmlFor="includeLinkedAccounts">
                <InlineSwitch
                  id="includeLinkedAccounts"
                  value={query.includeLinkedAccounts}
                  onChange={() => {
                    const includeLinkedAccounts = !(query.includeLinkedAccounts ?? false);
                    const newQuery = { ...query, includeLinkedAccounts };
                    if (!includeLinkedAccounts) {
                      newQuery.accountId = '';
                    }
                    onChange(newQuery);
                  }}
                />
              </EditorField>
              <EditorField label="AccountId" className="query-keyword" htmlFor="accountId">
                <Select
                  id="accountId"
                  options={accountIdOptions}
                  value={query.accountId ?? ''}
                  onChange={(value) => {
                    onChange({
                      ...query,
                      accountId: value.value,
                    } as any);
                  }}
                />
              </EditorField>
            </>
          )}
        </EditorFieldGroup>
      </EditorRow>
    </>
  );
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
