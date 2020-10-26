import { useEffect } from 'react';
import useAsync from 'react-use/lib/useAsync';
import { getDataSourceSrv } from '@grafana/runtime';
import { XrayDataSource } from '../../DataSource';
import { Region } from '../../types';
// @ts-ignore
import appEvents from 'grafana/app/core/app_events';
import { AppEvents } from '@grafana/data';

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

  useEffect(() => {
    if (result.error) {
      appEvents.emit(AppEvents.alertWarning, [
        'Could not load regions from AWS, showing default regions instead.',
        (result.error as any)?.data?.message,
      ]);
      // This is going to be deprecated. Should be using this
      // https://github.com/grafana/grafana/blob/9305117902a3698fcefc5d3063f58867717e34ce/public/app/core/services/backend_srv.ts#L265
      // instead but DataSourceWithBackend.getResource does not allow us to send the config right now.
      // TODO change when that is allowed.
      (result.error as any).isHandled = true;
    }
  }, [result.error]);

  if (result.error) {
    return defaultRegions;
  }

  return result.value;
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
