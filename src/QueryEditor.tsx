import React from 'react';
import { LegacyForms, Segment } from '@grafana/ui';
import { QueryEditorProps, SelectableValue } from '@grafana/data';
import { XrayDataSource } from './DataSource';
import { XrayJsonData, XrayQuery, XrayQueryType } from './types';

const { FormField } = LegacyForms;

type Props = QueryEditorProps<XrayDataSource, XrayQuery, XrayJsonData>;

export function QueryEditor({ query, onChange }: Props) {
  return (
    <div className="gf-form">
      <Segment
        value={query.queryType}
        options={Object.values(XrayQueryType).map(s => ({ value: s, label: s } as SelectableValue<XrayQueryType>))}
        onChange={({ value }) => onChange({ ...query, queryType: value! } as any)}
      />
      <FormField
        labelWidth={undefined}
        value={query.query || ''}
        onChange={e =>
          onChange({
            ...query,
            query: e.currentTarget.value,
          })
        }
        label="Query Text"
        tooltip="Not used yet"
      />
    </div>
  );
}
