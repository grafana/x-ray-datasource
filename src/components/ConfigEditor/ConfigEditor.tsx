import { AwsAuthDataSourceJsonData, AwsAuthDataSourceSecureJsonData, ConnectionConfig } from '@grafana/aws-sdk';
import { DataSourcePluginOptionsEditorProps } from '@grafana/data';
import React from 'react';
import { standardRegions } from './regions';

export type Props = DataSourcePluginOptionsEditorProps<AwsAuthDataSourceJsonData, AwsAuthDataSourceSecureJsonData>;

export function ConfigEditor(props: Props) {
  return (
    <div className="width-30">
      <ConnectionConfig {...props} standardRegions={standardRegions} />
    </div>
  );
}
