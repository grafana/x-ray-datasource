import { css } from '@emotion/css';
import { GrafanaTheme } from '@grafana/data';
import { DataSourcePicker } from '@grafana/runtime';
import { InlineField, InlineFieldRow, useStyles } from '@grafana/ui';
import React from 'react';

interface Props {
  datasourceUid?: string;
  onChange: (uid: string) => void;
}

export function TraceToLogs({ datasourceUid, onChange }: Props) {
  const styles = useStyles(getStyles);

  return (
    <div className={css({ width: '100%' })}>
      <h3 className="page-heading">Trace to logs</h3>

      <div className={styles.infoText}>
        Trace to logs let&apos;s you navigate from a trace span to the selected data source&apos;s log.
      </div>

      <InlineFieldRow>
        <InlineField tooltip="The data source the trace is going to navigate to" label="Data source" labelWidth={26}>
          <DataSourcePicker
            pluginId="cloudwatch"
            current={datasourceUid}
            noDefault={true}
            width={40}
            onChange={(ds) => onChange(ds.uid)}
          />
        </InlineField>
      </InlineFieldRow>
    </div>
  );
}

const getStyles = (theme: GrafanaTheme) => ({
  infoText: css`
    padding-bottom: ${theme.spacing.md};
    color: ${theme.colors.textSemiWeak};
  `,
});
