import { css } from '@emotion/css';
import { QueryEditorProps, SelectableValue, toOption } from '@grafana/data';
import { EditorField, EditorFieldGroup, EditorRow } from '@grafana/plugin-ui';
import { InlineSwitch, Select } from '@grafana/ui';
import React from 'react';
import { ServicesQueryType, XrayJsonData, XrayQuery } from 'types';
import { XrayDataSource } from 'XRayDataSource';
import { config } from '@grafana/runtime';
import { useAccountIdsWithQuery } from './useAccountIds';
import { useServices } from './useServices';
import { useOperations } from './useOperations';
import { serviceStringsToOption } from 'components/utils';

export type ServiceQueryEditorFormProps = QueryEditorProps<XrayDataSource, XrayQuery, XrayJsonData> & {};

const servicesQueryOptions: Array<SelectableValue<ServicesQueryType>> = [
  { label: 'List services', value: ServicesQueryType.listServices },
  { label: 'List service operations', value: ServicesQueryType.listServiceOperations },
  { label: 'List service dependencies', value: ServicesQueryType.listServiceDependencies },
  { label: 'List Service Level Objectives (SLO)', value: ServicesQueryType.listSLOs },
];

export function ServiceQueryEditor({ query, onChange, datasource, range }: ServiceQueryEditorFormProps) {
  const { serviceQueryType, serviceName, serviceString, region } = query;
  const styles = getStyles();

  const accountIds = useAccountIdsWithQuery(datasource, query, range);
  const accountIdOptions: Array<SelectableValue<string>> = (accountIds || []).map((accountId: string) => ({
    value: accountId,
    label: accountId,
  }));
  accountIdOptions.push({ value: '', label: 'None' });
  const variableOptionGroup = {
    label: 'Template Variables',
    options: datasource.getVariables().map(toOption),
  };
  accountIdOptions.push(variableOptionGroup);
  const hasStoredAccountIdFilter = !!(query.accountId && query.accountId.length);
  const showAccountIdDropdown =
    (config.featureToggles.cloudWatchCrossAccountQuerying || hasStoredAccountIdFilter) &&
    (serviceQueryType === ServicesQueryType.listServices || serviceQueryType === ServicesQueryType.listSLOs);

  const services = useServices(datasource, region, range, query.accountId);

  const operations = useOperations(datasource, serviceQueryType, region, range, serviceString);
  const operationOptions: Array<SelectableValue<string>> = (operations || []).map((operation) => ({
    label: operation,
    value: operation,
  }));
  operationOptions.push(variableOptionGroup);

  return (
    <>
      <EditorRow>
        <EditorFieldGroup>
          <EditorField label="Query Type" className={`query-keyword ${styles.formFieldStyles}`}>
            <Select
              id="queryType"
              value={serviceQueryType}
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
                    if (includeLinkedAccounts) {
                      newQuery.accountId = accountIdOptions[0].value;
                    } else {
                      newQuery.accountId = ''; // Reset accountId if linked accounts are not included
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
                  disabled={!query.includeLinkedAccounts && serviceQueryType === ServicesQueryType.listSLOs}
                  onChange={(value) => {
                    onChange({
                      ...query,
                      accountId: value.value,
                    });
                  }}
                />
              </EditorField>
            </>
          )}
          {serviceQueryType !== ServicesQueryType.listServices && (
            <EditorField label="Service" className="query-keyword" htmlFor="service">
              <Select
                id="service"
                options={services}
                value={serviceName && serviceString ? serviceStringsToOption(serviceName, serviceString) : undefined}
                onChange={(value) => {
                  onChange({
                    ...query,
                    serviceName: value.label,
                    serviceString: value.value,
                  });
                }}
              />
            </EditorField>
          )}
          {serviceQueryType === ServicesQueryType.listSLOs && (
            <EditorField label="Operation" className="query-keyword" htmlFor="operation">
              <Select
                id="operation"
                options={operationOptions}
                value={query.operationName ? { value: query.operationName, label: query.operationName } : undefined}
                onChange={(value) => {
                  onChange({
                    ...query,
                    operationName: value.value,
                  });
                }}
              />
            </EditorField>
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
