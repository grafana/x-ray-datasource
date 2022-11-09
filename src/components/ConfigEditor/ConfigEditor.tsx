import { AwsAuthDataSourceJsonData, AwsAuthDataSourceSecureJsonData, ConnectionConfig } from '@grafana/aws-sdk';
import { DataSourcePluginOptionsEditorProps } from '@grafana/data';
import React, { PureComponent } from 'react';
import { standardRegions } from './regions';

export type Props = DataSourcePluginOptionsEditorProps<AwsAuthDataSourceJsonData, AwsAuthDataSourceSecureJsonData>;

export class ConfigEditor extends PureComponent<Props> {
  render() {
    return (
      <div>
        <ConnectionConfig {...this.props} standardRegions={standardRegions} />
        {/* can add x-ray specific things here */}
      </div>
    );
  }
}
