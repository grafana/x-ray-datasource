import { QueryEditorProps, SelectableValue } from '@grafana/data';
import { EditorHeader, InlineSelect } from '@grafana/plugin-ui';

import { XrayDataSource } from '../../XRayDataSource';
import { XrayQuery, QueryMode, XrayJsonData, Region } from '../../types';
import React from 'react';
import { useRegionOptions } from './useRegions';

export interface Props extends QueryEditorProps<XrayDataSource, XrayQuery, XrayJsonData> {
  regions: Region[];
}

const apiModes: Array<SelectableValue<QueryMode>> = [
  { label: 'Traces', value: QueryMode.xray },
  { label: 'Services', value: QueryMode.services },
];

const QueryHeader = ({ query, onChange, datasource, regions }: Props) => {
  const { queryMode, region } = query;
  const onQueryModeChange = ({ value }: SelectableValue<QueryMode>) => {
    if (value && value !== queryMode) {
      onChange({ ...query, queryMode: value });
    }
  };
  const onRegionChange = async (region: string) => {
    onChange({ ...query, region });
  };

  const regionOptions = useRegionOptions(datasource);

  return (
    <>
      <EditorHeader>
        <InlineSelect
          label="Region"
          value={region}
          placeholder="Select region"
          allowCustomValue
          onChange={({ value: region }) => region && onRegionChange(region)}
          options={regionOptions}
        />
        <InlineSelect
          label="Mode"
          aria-label="Query mode"
          value={queryMode}
          options={apiModes}
          onChange={onQueryModeChange}
          inputId={`cloudwatch-query-mode-${query.refId}`}
          id={`cloudwatch-query-mode-${query.refId}`}
        />
      </EditorHeader>
    </>
  );
};

export default QueryHeader;
