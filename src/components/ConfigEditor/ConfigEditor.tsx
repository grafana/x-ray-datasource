import React, { PureComponent } from 'react';
import { DataSourcePluginOptionsEditorProps } from '@grafana/data';
import ConnectionConfig from './ConnectionConfig';
import { AwsDataSourceJsonData, AwsDataSourceSecureJsonData } from './types';

export type Props = DataSourcePluginOptionsEditorProps<AwsDataSourceJsonData, AwsDataSourceSecureJsonData>;

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
