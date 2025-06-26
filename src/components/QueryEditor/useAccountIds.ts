import { XrayDataSource } from 'XRayDataSource';
import { useAsync } from 'react-use';
import { XrayQuery } from 'types';
import { useError } from './useError';
import { SelectableValue, TimeRange, toOption } from '@grafana/data';
import { uniq } from 'lodash';

export function useAccountIds(datasource: XrayDataSource, groupName?: string, range?: TimeRange): SelectableValue[] {
  const result = useAsync(async () => datasource.getAccountIds(range, groupName), [datasource, range, groupName]);

  useError('Failed to load accountIds', result.error);
  if (result.error) {
    return [];
  }

  const variableOptionGroup = {
    label: 'Template Variables',
    options: datasource.getVariables().map(toOption),
  };
  return result.loading || !result.value ? [] : [...result.value.map(toOption), variableOptionGroup];
}

export function useAccountIdsWithQuery(datasource: XrayDataSource, query: XrayQuery, range?: TimeRange): string[] {
  const result = useAsync(
    async () => datasource.getAccountIds(range, query.group?.GroupName),
    [datasource, range, query]
  );

  useError('Failed to load accountIds', result.error);
  if (result.error) {
    return [];
  }

  // ensures that current selection if it exists is available in the dropdown,
  // even if it is no longer a valid option so that it can be deselected
  if (query.accountIds && result.value) {
    result.value = uniq([...result.value, ...query.accountIds]).sort();
  }

  return result.loading || !result.value ? [] : result.value;
}
