import React from 'react';
import { Segment } from '@grafana/ui';
import { QueryEditorProps, SelectableValue } from '@grafana/data';
import { XrayDataSource } from '../DataSource';
import { XrayJsonData, XrayQuery, XrayQueryType } from '../types';
import { XRayQueryField } from './XRayQueryField';

type Props = QueryEditorProps<XrayDataSource, XrayQuery, XrayJsonData>;

export function QueryEditor(props: Props) {
  const { query, onChange, datasource } = props;

  const onRunQuery = () => {
    onChange(query);
    // Only run query if it has value
    if (query.query) {
      props.onRunQuery();
    }
  };

  return (
    <div className="gf-form">
      <Segment
        value={query.queryType}
        options={Object.values(XrayQueryType).map(s => ({ value: s, label: s } as SelectableValue<XrayQueryType>))}
        onChange={({ value }) => {
          if (!value) {
            return;
          }
          onChange({ ...query, queryType: value });
        }}
      />
      <XRayQueryField query={query} history={[]} datasource={datasource} onRunQuery={onRunQuery} onChange={onChange} />
    </div>
  );
}
