import React, { useRef, useEffect } from 'react';
import Prism from 'prismjs';
import { Node } from 'slate';
import { QueryField, TypeaheadInput, TypeaheadOutput, BracesPlugin, SlatePrism } from '@grafana/ui';
import { QueryEditorProps } from '@grafana/data';
import { XrayDataSource } from 'XRayDataSource';
import { XrayQuery, XrayJsonData, XrayQueryType } from 'types';
import { XRayLanguageProvider } from 'language_provider';
import { tokenizer } from 'syntax';

interface XRayQueryFieldProps extends QueryEditorProps<XrayDataSource, XrayQuery, XrayJsonData> {}

const PRISM_LANGUAGE = 'xray';
const plugins = [
  BracesPlugin(),
  SlatePrism({
    onlyIn: (node: Node) => node.object === 'block' && node.type === 'code_block',
    getSyntax: () => PRISM_LANGUAGE,
  }),
];

export function XRayQueryField(props: XRayQueryFieldProps) {
  const queryType = useRef(props.query.queryType);

  useEffect(() => {
    queryType.current = props.query.queryType;
  }, [props.query, props.query.queryType]);

  useEffect(() => {
    Prism.languages[PRISM_LANGUAGE] = tokenizer;
  }, []);

  const onChangeQuery = (value: string) => {
    const { query, onChange } = props;
    const nextQuery: XrayQuery = { ...query, query: value };
    onChange(nextQuery);
  };

  const onTypeAhead = async (typeahead: TypeaheadInput): Promise<TypeaheadOutput> => {
    const { datasource } = props;

    // Only show suggestions for getTraceSummaries
    if (!datasource.languageProvider || queryType.current === XrayQueryType.getTrace) {
      return { suggestions: [] };
    }

    const xRayLanguageProvider = datasource.languageProvider as XRayLanguageProvider;

    return await xRayLanguageProvider.provideCompletionItems(typeahead);
  };

  return (
    <QueryField
      additionalPlugins={plugins}
      query={props.query.query}
      portalOrigin="xray"
      onChange={onChangeQuery}
      onTypeahead={onTypeAhead}
      placeholder="Enter service name, annotation, trace ID."
      onRunQuery={props.onRunQuery}
    />
  );
}
