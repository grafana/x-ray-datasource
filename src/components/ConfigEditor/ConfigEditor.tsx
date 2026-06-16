import { AwsAuthDataSourceJsonData, AwsAuthDataSourceSecureJsonData, ConnectionConfig } from '@grafana/aws-sdk';
import { DataSourcePluginOptionsEditorProps } from '@grafana/data';
import { config } from '@grafana/runtime';
import { SecureSocksProxySettings } from '@grafana/ui';
import React from 'react';
import { gte } from 'semver';
import { standardRegions } from './regions';

export type Props = DataSourcePluginOptionsEditorProps<AwsAuthDataSourceJsonData, AwsAuthDataSourceSecureJsonData>;

export function ConfigEditor(props: Props) {
  return (
    <div className="width-30">
      <ConnectionConfig {...props} standardRegions={standardRegions} />
      {config.secureSocksDSProxyEnabled && gte(config.buildInfo.version, '10.0.0') && (
        <SecureSocksProxySettings options={props.options} onOptionsChange={props.onOptionsChange} />
      )}
    </div>
  );
}
