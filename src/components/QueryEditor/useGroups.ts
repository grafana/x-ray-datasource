import { XrayDataSource } from '../../XRayDataSource';
import { Group } from '../../types';
import useAsync from 'react-use/lib/useAsync';
import { useError } from './useError';

/**
 * Returns group for a datasource and region. In case the deps change we will still return old groups. This is to
 * prevent flash of loading state when changing group.
 */
export function useGroups(datasource: XrayDataSource, region?: string): Group[] | undefined {
  const result = useAsync(async () => datasource.getGroups(region), [datasource, region]);
  useError('Failed to load groups', result.error);

  if (result.error) {
    // The assumption is that this should always by ok to send with the query.
    return [
      {
        // We dp not know the proper ARN but all APIs that use group also accept name.
        GroupARN: 'default',
        GroupName: 'Default',
      },
    ];
  }

  return result.value;
}
