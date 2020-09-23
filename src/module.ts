import { DataSourcePlugin } from '@grafana/data';
import { XrayDataSource } from './DataSource';
import { ConfigEditor } from './ConfigEditor';
import { QueryEditor } from './components/QueryEditor';
import { XrayQuery, XrayJsonData, XraySecureJsonData } from './types';
import CheatSheet from './components/CheatSheet';

export const plugin = new DataSourcePlugin<XrayDataSource, XrayQuery, XrayJsonData, XraySecureJsonData>(XrayDataSource)
  .setConfigEditor(ConfigEditor)
  .setExploreStartPage(CheatSheet)
  .setQueryEditor(QueryEditor);
