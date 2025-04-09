import { XRayQueryField } from './XRayQueryField';
import React from 'react';
import { XrayDataSource } from '../../XRayDataSource';
import { css } from '@emotion/css';
import { XrayQuery } from '../../types';
import { QueryTypeOption } from './constants';
import { EditorField } from '@grafana/plugin-ui';
import { queryTypeOptionToQueryType } from './XRayQueryEditor';

const styles = {
  tooltipLink: css({
    color: '#33a2e5',
    '&:hover': {
      color: ' #33a2e5',
      filter: 'brightness(120%)',
    },
  }),
};

type Props = {
  query: XrayQuery;
  datasource: XrayDataSource;
  onChange: (value: XrayQuery) => void;
  onRunQuery: () => void;
  selectedOptions: QueryTypeOption[];
};
export function QuerySection(props: Props) {
  const { datasource, query, onRunQuery, onChange, selectedOptions } = props;

  const onRunQueryLocal = () => {
    onChange(query);
    // Only run query if it has value
    if (query.query) {
      onRunQuery();
    }
  };

  return (
    <EditorField
      label="Query"
      tooltipInteractive
      width="100%"
      tooltip={
        <span>
          See{' '}
          <a
            href="https://docs.aws.amazon.com/xray/latest/devguide/xray-console-filters.html?icmpid=docs_xray_console"
            target="_blank"
            rel="noreferrer"
            className={styles.tooltipLink}
          >
            X-Ray documentation
          </a>{' '}
          for filter expression help.
        </span>
      }
    >
      <XRayQueryField
        query={query}
        history={[]}
        datasource={datasource}
        onRunQuery={onRunQueryLocal}
        onChange={(e) => {
          onChange({
            ...query,
            queryType: queryTypeOptionToQueryType(
              selectedOptions.map((option) => option.value),
              e.query
            ),
            query: e.query,
          });
        }}
      />
    </EditorField>
  );
}
