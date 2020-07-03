import React, { useRef, useEffect } from 'react';
import { QueryField, TypeaheadInput, TypeaheadOutput } from '@grafana/ui';
import { ExploreQueryFieldProps } from '@grafana/data';
import { XrayDataSource } from 'DataSource';
import { XrayQuery, XrayJsonData, XrayQueryType } from 'types';
import { XRayLanguageProvider } from 'language_provider';

interface XRayQueryFieldProps extends ExploreQueryFieldProps<XrayDataSource, XrayQuery, XrayJsonData> {}

export function XRayQueryField(props: XRayQueryFieldProps) {
  const queryType = useRef(props.query.queryType);

  useEffect(() => {
    queryType.current = props.query.queryType;
  }, [props.query.queryType]);

  const onChangeQuery = (value: string) => {
    const { query, onChange } = props;
    const nextQuery: XrayQuery = { ...query, query: value };
    onChange(nextQuery);
  };

  const onTypeAhead = async (typeahead: TypeaheadInput): Promise<TypeaheadOutput> => {
    const { datasource } = props;

    // Only show suggestions for getTraceSummaries
    if (!datasource.languageProvider || queryType.current !== XrayQueryType.getTrace) {
      return { suggestions: [] };
    }

    const xRayLanguageProvider = datasource.languageProvider as XRayLanguageProvider;

    return await xRayLanguageProvider.provideCompletionItems(typeahead);
  };

  // Return the last string after whitespace
  const cleanText = (prefix: string) => {
    const s = prefix.split(' ');
    return s[s.length - 1];
  };

  return (
    <QueryField
      cleanText={cleanText}
      query={props.query.query}
      portalOrigin="xray"
      onChange={onChangeQuery}
      onTypeahead={onTypeAhead}
      placeholder="Enter service name, annotation, trace ID."
      onRunQuery={props.onRunQuery}
    />
  );
}
