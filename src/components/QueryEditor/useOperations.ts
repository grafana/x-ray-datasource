import { XrayDataSource } from '../../XRayDataSource';
import useAsync from 'react-use/lib/useAsync';
import { useError } from './useError';
import { TimeRange } from '@grafana/data';
import { ServicesQueryType } from 'types';

/**
 * Returns operations for a datasource, region, time range and service.
 */
export function useOperations(
  datasource: XrayDataSource,
  serviceQueryType: ServicesQueryType = ServicesQueryType.listServices,
  region?: string,
  range?: TimeRange,
  service?: string
): string[] | undefined {
  const result = useAsync(async () => {
    if (serviceQueryType === ServicesQueryType.listSLOs && service) {
      return datasource.getOperations(region, range, service);
    } else {
      return Promise.resolve([]);
    }
  }, [datasource, range, region, service, serviceQueryType]);
  useError('Failed to load operations', result.error);

  if (result.error) {
    return [];
  }
  return result.value;
}
