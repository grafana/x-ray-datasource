import { XrayDataSource } from 'XRayDataSource';
import { useAccountIdsWithQuery } from './useAccountIds';
import { XrayQuery } from '../../types';
import { TimeRange } from '@grafana/data';
import { config } from '@grafana/runtime';
import React from 'react';
import { MultiSelect } from '@grafana/ui';
import { EditorField } from '@grafana/plugin-ui';
type Props = {
  datasource: XrayDataSource;
  query: XrayQuery;
  range?: TimeRange;
  onChange: (items: string[]) => void;
};

export const AccountIdDropdown = (props: Props) => {
  const accountIds = useAccountIdsWithQuery(props.datasource, props.query, props.range);
  const hasStoredAccountIdFilter = !!(props.query.accountIds && props.query.accountIds.length);
  const showAccountIdDropdown = config.featureToggles.cloudWatchCrossAccountQuerying || hasStoredAccountIdFilter;

  if (!showAccountIdDropdown) {
    return null;
  }

  return (
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
  );
};
