import { SelectableValue, toOption } from '@grafana/data';
import { XrayDataSource } from '../../XRayDataSource';
import { Region } from 'types';

/**
 * Use the static list of regions. aws-sdk-go-v2 has no simple replacement for the call
 * we used to use to get a dynamic list.
 */
export function useRegions(datasource: XrayDataSource): Region[] | undefined {
  return defaultRegions;
}

export function useRegionOptions(datasource: XrayDataSource): Array<SelectableValue<string>> {
  const variableOptionGroup = {
    label: 'Template Variables',
    options: datasource.getVariables().map(toOption),
    Text: 'Template Variables',
  };
  return [...defaultRegions, variableOptionGroup];
}

export const defaultRegions = [
  'ap-east-1',
  'ap-northeast-1',
  'ap-northeast-2',
  'ap-northeast-3',
  'ap-south-1',
  'ap-southeast-1',
  'ap-southeast-2',
  'ca-central-1',
  'cn-north-1',
  'cn-northwest-1',
  'eu-central-1',
  'eu-north-1',
  'eu-west-1',
  'eu-west-2',
  'eu-west-3',
  'me-south-1',
  'sa-east-1',
  'us-east-1',
  'us-east-2',
  'us-gov-east-1',
  'us-gov-west-1',
  'us-iso-east-1',
  'us-isob-east-1',
  'us-west-1',
  'us-west-2',
].map((r) => ({
  label: r,
  value: r,
  text: r,
}));
