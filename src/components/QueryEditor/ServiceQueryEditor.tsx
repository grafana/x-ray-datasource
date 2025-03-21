import { css } from '@emotion/css';
import { QueryEditorProps, SelectableValue } from '@grafana/data';
import { EditorField, EditorFieldGroup, EditorRow } from '@grafana/plugin-ui';
import { Select } from '@grafana/ui';
import React from 'react';
import { ServicesQueryType, XrayJsonData, XrayQuery } from 'types';
import { XrayDataSource } from 'XRayDataSource';
import { AccountIdDropdown } from './AccountIdDropdown';

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
                  serviceQueryType: value,
                } as any);
              }}
            />
          </EditorField>
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
