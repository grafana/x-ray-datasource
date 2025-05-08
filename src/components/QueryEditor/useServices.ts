import { XrayDataSource } from '../../XRayDataSource';
import useAsync from 'react-use/lib/useAsync';
import { useError } from './useError';
import { TimeRange } from '@grafana/data';

/**
 * Returns service for a datasource, region, and accountId. In case the deps change we will still return old groups. This is to
 * prevent flash of loading state when changing group.
 */
export function useServices(
  datasource: XrayDataSource,
  region?: string,
  range?: TimeRange,
  accountId?: string
): Array<Record<string, string>> | undefined {
  const result = useAsync(
    async () => datasource.getServices(region, range, accountId),
    [datasource, region, range, accountId]
  );
  useError('Failed to load services', result.error);

  if (result.error) {
    return [];
  }
  return result.value;
}
