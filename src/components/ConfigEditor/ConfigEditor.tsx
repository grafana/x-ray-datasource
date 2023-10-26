import { AwsAuthDataSourceJsonData, AwsAuthDataSourceSecureJsonData, ConnectionConfig } from '@grafana/aws-sdk';
import { DataSourcePluginOptionsEditorProps } from '@grafana/data';
import React from 'react';
import { standardRegions } from './regions';
import { config } from '@grafana/runtime';

export type Props = DataSourcePluginOptionsEditorProps<AwsAuthDataSourceJsonData, AwsAuthDataSourceSecureJsonData>;

export function ConfigEditor(props: Props) {
  const newFormStylingEnabled = config.featureToggles.awsDatasourcesNewFormStyling;

  return (
    <div className="width-30">
      <ConnectionConfig {...props} standardRegions={standardRegions} newFormStylingEnabled={newFormStylingEnabled} />
      {/* can add x-ray specific things here */}
    </div>
  );
}
