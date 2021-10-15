import { AwsAuthDataSourceSecureJsonData, ConnectionConfig } from '@grafana/aws-sdk';
import { DataSourcePluginOptionsEditorProps, updateDatasourcePluginJsonDataOption } from '@grafana/data';
import React, { PureComponent } from 'react';
import { TraceToLogs } from './TraceToLogs';
import { XrayJsonData } from '../../types';

export type Props = DataSourcePluginOptionsEditorProps<XrayJsonData, AwsAuthDataSourceSecureJsonData>;

export class ConfigEditor extends PureComponent<Props> {
  render() {
    const { onOptionsChange, options } = this.props;
    return (
      <div>
        <ConnectionConfig {...this.props} />
        <TraceToLogs
          datasourceUid={options.jsonData.tracesToLogs?.datasourceUid}
          onChange={(uid) =>
            updateDatasourcePluginJsonDataOption({ onOptionsChange, options }, 'tracesToLogs', {
              datasourceUid: uid,
            })
          }
        />
      </div>
    );
  }
}
