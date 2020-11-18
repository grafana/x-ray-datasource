import { DataSourcePlugin } from '@grafana/data';
import { XrayDataSource } from './DataSource';
import { ConfigEditor } from './ConfigEditor';
import { QueryEditor } from './components/QueryEditor/QueryEditor';
import { XrayQuery, XrayJsonData } from './types';
import CheatSheet from './components/CheatSheet';
import { AwsDataSourceSecureJsonData } from 'common';

export const plugin = new DataSourcePlugin<XrayDataSource, XrayQuery, XrayJsonData, AwsDataSourceSecureJsonData>(
  XrayDataSource
)
  .setConfigEditor(ConfigEditor)
  .setExploreStartPage(CheatSheet)
  .setQueryEditor(QueryEditor);
