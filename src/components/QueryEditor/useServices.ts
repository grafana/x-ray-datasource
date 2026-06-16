import { XrayDataSource } from '../../XRayDataSource';
import useAsync from 'react-use/lib/useAsync';
import { useError } from './useError';
import { SelectableValue, TimeRange, toOption } from '@grafana/data';

function serviceToOption(service: Record<string, string>) {
  return {
    value: JSON.stringify(service),
    label: service.Name,
  };
}
/**
 * Returns service for a datasource, region, and accountId. In case the deps change we will still return old groups. This is to
 * prevent flash of loading state when changing group.
 */
export function useServices(
  datasource: XrayDataSource,
  region?: string,
  range?: TimeRange,
  accountId?: string
): Array<SelectableValue<string>> {
  const result = useAsync(
    async () => datasource.getServices(region, range, accountId),
    [datasource, region, range, accountId]
  );
  useError('Failed to load services', result.error);

  if (result.error) {
    return [];
  }
  const variableOptionGroup = {
    label: 'Template Variables',
    options: datasource.getVariables().map(toOption),
  };
  return [...(result.value || []).map(serviceToOption), variableOptionGroup];
}
