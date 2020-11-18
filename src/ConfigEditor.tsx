import React, { PureComponent } from 'react';
import { DataSourcePluginOptionsEditorProps } from '@grafana/data';
import ConnectionConfig from './common/ConnectionConfig';
import { AwsDataSourceJsonData, AwsDataSourceSecureJsonData } from 'common';

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
