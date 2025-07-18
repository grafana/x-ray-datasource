import { useTheme2 } from '@grafana/ui';
import { css } from '@emotion/css';
import { XrayDataSource } from '../../XRayDataSource';
import { XrayQuery } from '../../types';
import { GrafanaTheme2, TimeRange } from '@grafana/data';
import React from 'react';

const getStyles = (theme: GrafanaTheme2) => ({
  container: css({ display: 'flex', paddingTop: theme.spacing(3) }),
  link: css({
    whiteSpace: 'nowrap',
    backgroundColor: theme.colors.background.primary,
    color: theme.colors.text.primary,
  }),
});
type XrayLinksProps = {
  datasource: XrayDataSource;
  query: XrayQuery;
  range?: TimeRange;
};
export function XrayLinks({ datasource, query, range }: XrayLinksProps) {
  const theme = useTheme2();
  const styles = getStyles(theme);

  return (
    <div className={styles.container}>
      {[
        ['To Traces map', datasource.getServiceMapUrl(query.region)],
        ['Open in X-Ray Traces console', datasource.getXrayUrlForQuery(query, range)],
      ].map(([text, href]) => {
        return (
          <a href={href} target="_blank" rel="noopener noreferrer" key={href}>
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
