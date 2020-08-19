import React, { useEffect } from 'react';
import { InlineFormLabel, Segment } from '@grafana/ui';
import { QueryEditorProps } from '@grafana/data';
import { XrayDataSource } from '../DataSource';
import { XrayJsonData, XrayQuery, XrayQueryType } from '../types';
import { XRayQueryField } from './XRayQueryField';
import { ColumnFilter } from './ColumnFilter';

/**
 * We do some mapping of the actual queryTypes to options user can select. Mainly don't want user to choose
 * between trace list and single trace and we detect that based on query. So trace list option returns single trace
 * if query contains single traceID.
 */
export enum QueryTypeOptions {
  traceList = 'Trace List',
  traceStatistics = 'Trace Statistics',
}

export function queryTypeToQueryTypeOptions(queryType?: XrayQueryType): QueryTypeOptions {
  if (queryType === XrayQueryType.getTrace || queryType === XrayQueryType.getTraceSummaries) {
    return QueryTypeOptions.traceList;
  } else {
    return QueryTypeOptions.traceStatistics;
  }
}

export function queryTypeOptionToQueryType(queryTypeOption: QueryTypeOptions, query: string): XrayQueryType {
  if (queryTypeOption === QueryTypeOptions.traceList) {
    const isTraceIdQuery = /^\d-\w{8}-\w{24}$/.test(query.trim());
    return isTraceIdQuery ? XrayQueryType.getTrace : XrayQueryType.getTraceSummaries;
  } else {
    return XrayQueryType.getTimeSeriesServiceStatistics;
  }
}

type Props = QueryEditorProps<XrayDataSource, XrayQuery, XrayJsonData>;
export function QueryEditor({ query, onChange, datasource, onRunQuery: onRunQuerySuper }: Props) {
  useInitQuery(query, onChange);
  const queryTypeOption = queryTypeToQueryTypeOptions(query.queryType);

  const onRunQuery = () => {
    onChange(query);
    // Only run query if it has value
    if (query.query) {
      onRunQuerySuper();
    }
  };

  return (
    <div>
      <div className="gf-form">
        <div className="gf-form">
          <InlineFormLabel width="auto">Query Type</InlineFormLabel>
          <Segment
            value={queryTypeOption}
            options={Object.keys(QueryTypeOptions).map(key => ({
              value: key,
              // @ts-ignore get rid of implicit any here
              label: QueryTypeOptions[key],
            }))}
            onChange={({ value }) => {
              const newQueryType = queryTypeOptionToQueryType(
                // @ts-ignore get get rid of implicit any here
                QueryTypeOptions[value!],
                query.query || ''
              );
              onChange({
                ...query,
                queryType: newQueryType,
                columns: newQueryType === XrayQueryType.getTimeSeriesServiceStatistics ? ['all'] : undefined,
              } as any);
            }}
          />
        </div>
        <div style={{ flex: 1, display: 'flex' }}>
          <InlineFormLabel width="auto">Query</InlineFormLabel>
          <XRayQueryField
            query={query}
            history={[]}
            datasource={datasource}
            onRunQuery={onRunQuery}
            onChange={e => {
              onChange({
                ...query,
                queryType: queryTypeOptionToQueryType(queryTypeOption, e.query),
                query: e.query,
              });
            }}
          />
        </div>
      </div>
      {queryTypeOption === QueryTypeOptions.traceStatistics && (
        <div className="gf-form">
          <div className="gf-form" data-testid="resolution" style={{ flexWrap: 'wrap' }}>
            <InlineFormLabel width="auto">Resolution</InlineFormLabel>
            <Segment
              value={query.resolution ? query.resolution.toString() + 's' : 'auto'}
              options={['auto', '60s', '300s'].map(val => ({ value: val, label: val }))}
              onChange={({ value }) => {
                onChange({
                  ...query,
                  resolution: value === 'auto' ? undefined : parseInt(value!, 10),
                } as any);
              }}
            />
          </div>
          <div className="gf-form" data-testid="column-filter" style={{ flexWrap: 'wrap' }}>
            <InlineFormLabel width="auto">Columns</InlineFormLabel>
            <ColumnFilter columns={query.columns || []} onChange={columns => onChange({ ...query, columns })} />
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Inits the query with queryType so the segment component is filled in.
 */
function useInitQuery(query: XrayQuery, onChange: (value: XrayQuery) => void) {
  useEffect(() => {
    // We assume that if there is no queryType during mount there should not be any query so we do not need to
    // check if query has traceId or not as we do with the QueryTypeOptions mapping.
    if (!query.queryType) {
      onChange({
        ...query,
        queryType: XrayQueryType.getTraceSummaries,
      });
    }
  }, [query]);
}
