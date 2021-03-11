import { AwsAuthDataSourceSecureJsonData } from '@grafana/aws-sdk';
import { DataSourcePlugin } from '@grafana/data';
import CheatSheet from './components/CheatSheet';
import { ConfigEditor } from './components/ConfigEditor/ConfigEditor';
import { QueryEditor } from './components/QueryEditor/QueryEditor';
import { XrayDataSource } from './DataSource';
import { XrayJsonData, XrayQuery } from './types';

export const plugin = new DataSourcePlugin<XrayDataSource, XrayQuery, XrayJsonData, AwsAuthDataSourceSecureJsonData>(
  XrayDataSource
)
  .setConfigEditor(ConfigEditor)
  .setExploreStartPage(CheatSheet) // Use this for Grafana versions before 7.4
  .setQueryEditor(QueryEditor);
