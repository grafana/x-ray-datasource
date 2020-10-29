import { stylesFactory } from '@grafana/ui';
import { css } from 'emotion';
import { XrayDataSource } from '../../DataSource';
import { XrayQuery } from '../../types';
import { TimeRange } from '@grafana/data';
import React from 'react';

const getStyles = stylesFactory(() => ({
  container: css`
    display: flex;
  `,
  link: css`
    white-space: nowrap;
  `,
}));
type XrayLinksProps = {
  datasource: XrayDataSource;
  query: XrayQuery;
  range?: TimeRange;
};
export function XrayLinks({ datasource, query, range }: XrayLinksProps) {
  const styles = getStyles();
  return (
    <div className={styles.container}>
      {[
        ['To X-Ray service map', datasource.getServiceMapUrl(query.region)],
        ['Open in X-Ray console', datasource.getXrayUrlForQuery(query, range)],
      ].map(([text, href]) => {
        return (
          <a href={href} target="_blank" rel="noopener" key={href}>
            <span className={`gf-form-label gf-form-label--btn ${styles.link}`}>
              <i className="fa fa-share-square-o" />
              &nbsp;{text}
            </span>
          </a>
        );
      })}
    </div>
  );
}
