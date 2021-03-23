import { AwsAuthDataSourceJsonData, AwsAuthDataSourceSecureJsonData, ConnectionConfig } from '@grafana/aws-sdk';
import { DataSourcePluginOptionsEditorProps } from '@grafana/data';
import React, { PureComponent } from 'react';

export type Props = DataSourcePluginOptionsEditorProps<AwsAuthDataSourceJsonData, AwsAuthDataSourceSecureJsonData>;

export class ConfigEditor extends PureComponent<Props> {
  render() {
    return (
      <div>
        <ConnectionConfig {...this.props} />
        {/* can add x-ray specific things here */}
      </div>
    );
  }
}
