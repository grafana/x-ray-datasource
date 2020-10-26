import useAsync from 'react-use/lib/useAsync';
import { getDataSourceSrv } from '@grafana/runtime';
import { XrayDataSource } from '../../DataSource';
import { Region } from '../../types';
import { useError } from './useError';

type Options = { datasource: XrayDataSource } | { name: string };

/**
 * Get regions from AWS. Fallbacks to static list if there is any error with that. As we need this in Config page and it
 * does not get Datasource object we need to allow for passing only name and loading the data source here.
 * @param options
 */
export function useRegions(options: Options): Region[] | undefined {
  const result = useAsync(async () => {
    let datasource;
    if ('datasource' in options) {
      datasource = options.datasource;
    } else {
      datasource = (await getDataSourceSrv().get(options.name)) as XrayDataSource;
    }
    return datasource.getRegions();
  }, ['datasource' in options ? options.datasource : options.name]);

  useError('Failed to load regions from AWS, showing default regions instead.', result.error);

  if (result.error) {
    return defaultRegions;
  }

  return result.loading ? undefined : result.value;
}

const defaultRegions = [
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
].map(r => ({
  label: r,
  value: r,
  text: r,
}));
