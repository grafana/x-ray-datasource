import { XrayDataSource } from 'DataSource';
import { useAccountIds } from './useAccountIds';
import { XrayQuery } from '../../types';
import { TimeRange } from '@grafana/data';
import { config } from '@grafana/runtime';
import React from 'react';
import { InlineFormLabel, MultiSelect } from '@grafana/ui';
import { EditorField } from '@grafana/experimental';
type Props = {
  datasource: XrayDataSource;
  query: XrayQuery;
  newFormStylingEnabled?: boolean;
  range?: TimeRange;
  onChange: (items: string[]) => void;
};

export const AccountIdDropdown = (props: Props) => {
  const accountIds = useAccountIds(props.datasource, props.query, props.range);
  const hasStoredAccountIdFilter = !!(props.query.accountIds && props.query.accountIds.length);
  const showAccountIdDropdown = config.featureToggles.cloudWatchCrossAccountQuerying || hasStoredAccountIdFilter;

  if (!showAccountIdDropdown) {
    return null;
  }

  return props.newFormStylingEnabled ? (
    <EditorField label="AccountId" className="query-keyword" htmlFor="accountId">
      <MultiSelect
        id="accountId"
        options={(accountIds || []).map((accountId: string) => ({
          value: accountId,
          label: accountId,
        }))}
        value={props.query.accountIds}
        onChange={(items) => props.onChange(items.map((item) => item.value || ''))}
        placeholder={'All'}
      />
    </EditorField>
  ) : (
    <div className="gf-form">
      <InlineFormLabel className="query-keyword" width="auto">
        AccountId
      </InlineFormLabel>
      <MultiSelect
        options={(accountIds || []).map((accountId: string) => ({
          value: accountId,
          label: accountId,
        }))}
        value={props.query.accountIds}
        onChange={(items) => props.onChange(items.map((item) => item.value || ''))}
        placeholder={'All'}
      />
    </div>
  );
};
