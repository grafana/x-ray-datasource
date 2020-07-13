import React, { useEffect } from 'react';
import { Segment, InlineFormLabel } from '@grafana/ui';
import { QueryEditorProps } from '@grafana/data';
import { XrayDataSource } from '../DataSource';
import { XrayJsonData, XrayQuery, XrayQueryType } from '../types';
import { XRayQueryField } from './XRayQueryField';

/**
 * We do some mapping of the actual queryTypes to options user can select. Mainly don't want user to choose
 * between trace list and single trace and we detect that based on query. So trace list option returns single trace
 * if query contains single traceID.
 */
enum QueryTypeOptions {
  traceList = 'Trace List',
  traceAnalytics = 'Trace Analytics',
}

function queryTypeToQueryTypeOptions(queryType?: XrayQueryType): QueryTypeOptions {
  if (queryType === XrayQueryType.getTrace || queryType === XrayQueryType.getTraceSummaries) {
    return QueryTypeOptions.traceList;
  } else {
    return QueryTypeOptions.traceAnalytics;
  }
}

function queryTypeOptionToQueryType(queryTypeOption: QueryTypeOptions, query: string): XrayQueryType {
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
      <div className={'gf-form'}>
        <InlineFormLabel width={'auto'}>Query Type</InlineFormLabel>
        <Segment
          value={queryTypeOption}
          options={Object.keys(QueryTypeOptions).map(key => ({
            value: key,
            // @ts-ignore get get rid of implicit any here
            label: QueryTypeOptions[key],
          }))}
          onChange={({ value }) => {
            onChange({
              ...query,
              queryType: queryTypeOptionToQueryType(
                // @ts-ignore get get rid of implicit any here
                QueryTypeOptions[value!],
                query.query || ''
              ),
            } as any);
          }}
        />
      </div>
      <XRayQueryField
        query={query}
        history={[]}
        datasource={datasource}
        onRunQuery={onRunQuery}
        onChange={e => {
          onChange({
            ...query,
            queryType: queryTypeOptionToQueryType(queryTypeOption, e.queryType!),
            query: e.query,
          });
        }}
      />
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
  }, []);
}
