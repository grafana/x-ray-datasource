import { DataSourcePlugin } from '@grafana/data';
import { XrayDataSource } from './DataSource';
import { ConfigEditor } from './components/ConfigEditor/ConfigEditor';
import { AwsDataSourceSecureJsonData } from './components/ConfigEditor/types';
import { QueryEditor } from './components/QueryEditor/QueryEditor';
import { XrayQuery, XrayJsonData } from './types';
import CheatSheet from './components/CheatSheet';

export const plugin = new DataSourcePlugin<XrayDataSource, XrayQuery, XrayJsonData, AwsDataSourceSecureJsonData>(
  XrayDataSource
)
  .setConfigEditor(ConfigEditor)
  .setExploreStartPage(CheatSheet) // Use this for Grafana versions before 7.4
  .setQueryEditor(QueryEditor);
