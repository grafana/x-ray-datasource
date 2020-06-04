import { DataSourcePlugin } from '@grafana/data';
import { XrayDataSource } from './DataSource';
import { ConfigEditor } from './ConfigEditor';
import { QueryEditor } from './QueryEditor';
import { XrayQuery, XrayJsonData, XraySecureJsonData } from './types';

export const plugin = new DataSourcePlugin<XrayDataSource, XrayQuery, XrayJsonData, XraySecureJsonData>(XrayDataSource)
  .setConfigEditor(ConfigEditor)
  .setQueryEditor(QueryEditor);
