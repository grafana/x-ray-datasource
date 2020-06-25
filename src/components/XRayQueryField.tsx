import React from 'react';
import { QueryField } from '@grafana/ui';
import { ExploreQueryFieldProps } from '@grafana/data';
import { XrayDataSource } from 'DataSource';
import { XrayQuery, XrayJsonData } from 'types';

interface XRayQueryFieldProps extends ExploreQueryFieldProps<XrayDataSource, XrayQuery, XrayJsonData> {}

export function XRayQueryField(props: XRayQueryFieldProps) {
  const onChangeQuery = (value: string) => {
    const { query, onChange } = props;
    const nextQuery: XrayQuery = { ...query, query: value };
    onChange(nextQuery);
  };

  return (
    <QueryField
      query={props.query.query}
      portalOrigin="xray"
      onChange={onChangeQuery}
      placeholder="Enter service name, annotation, trace ID."
      onRunQuery={props.onRunQuery}
    />
  );
}
