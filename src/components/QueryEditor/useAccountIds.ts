import { XrayDataSource } from 'DataSource';
import { useAsync } from 'react-use';
import { Group } from 'types';
import { useError } from './useError';
import { TimeRange } from '@grafana/data';

export function useAccountIds(datasource: XrayDataSource, range?: TimeRange, group?: Group): string[] | undefined {
  const result = useAsync(async () => datasource.getAccountIdsForServiceMap(range, group), [datasource, range, group]);

  useError('Failed to load accountIds', result.error);

  if (result.error) {
    return [];
  }

  return result.loading ? [] : result.value;
}
