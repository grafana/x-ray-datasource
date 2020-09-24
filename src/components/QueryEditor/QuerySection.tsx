import { Icon, InlineFormLabel, stylesFactory, Tooltip } from '@grafana/ui';
import { XRayQueryField } from './XRayQueryField';
import React from 'react';
import { queryTypeOptionToQueryType } from './QueryEditorForm';
import { XrayDataSource } from '../../DataSource';
import { css } from 'emotion';
import { XrayQuery } from '../../types';
import { QueryTypeOption } from './constants';

const getStyles = stylesFactory(() => ({
  tooltipLink: css`
    color: #33a2e5;
    &:hover {
      color: #33a2e5;
      filter: brightness(120%);
    }
  `,
}));

type Props = {
  query: XrayQuery;
  datasource: XrayDataSource;
  onChange: (value: XrayQuery) => void;
  onRunQuery: () => void;
  selectedOptions: QueryTypeOption[];
};
export function QuerySection(props: Props) {
  const { datasource, query, onRunQuery, onChange, selectedOptions } = props;
  const styles = getStyles();

  const onRunQueryLocal = () => {
    onChange(query);
    // Only run query if it has value
    if (query.query) {
      onRunQuery();
    }
  };

  return (
    <div style={{ flex: 1, display: 'flex' }}>
      <InlineFormLabel className="query-keyword" width="auto">
        Query&nbsp;
        <Tooltip
          placement="top"
          content={
            <span>
              See{' '}
              <a
                href="https://docs.aws.amazon.com/xray/latest/devguide/xray-console-filters.html?icmpid=docs_xray_console"
                target="_blank"
                className={styles.tooltipLink}
              >
                X-Ray documentation
              </a>{' '}
              for filter expression help.
            </span>
          }
          theme="info"
        >
          <Icon className="gf-form-help-icon gf-form-help-icon--right-normal" name="info-circle" size="sm" />
        </Tooltip>
      </InlineFormLabel>
      <XRayQueryField
        query={query}
        history={[]}
        datasource={datasource}
        onRunQuery={onRunQueryLocal}
        onChange={e => {
          onChange({
            ...query,
            queryType: queryTypeOptionToQueryType(
              selectedOptions.map(option => option.value),
              e.query
            ),
            query: e.query,
          });
        }}
      />
    </div>
  );
}
