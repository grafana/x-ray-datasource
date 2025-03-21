import React from 'react';
import { Spinner } from '@grafana/ui';
import { useGroups } from './useGroups';
import { useRegions } from './useRegions';
import { QueryEditorForm } from './QueryEditorForm';
import QueryHeader from './QueryHeader';
import { useInitQuery } from './useInitQuery';
import { Group, Region, XrayJsonData, XrayQuery, XrayQueryMode } from 'types';
import { ServiceQueryEditor } from './ServiceQueryEditor';
import { QueryEditorProps } from '@grafana/data';
import { XrayDataSource } from 'XRayDataSource';
/**
 * Simple wrapper that is only responsible to load groups and delay actual render of the QueryEditorForm. Main reason
 * for that is that there is queryInit code that requires groups to be already loaded and is separate hook and it
 * cannot be inside a condition. There are other ways to put it into single component but this seems cleaner than
 * alternatives.
 */
export function QueryEditor(props: QueryEditorProps<XrayDataSource, XrayQuery, XrayJsonData>) {
  const regions = useRegions(props.datasource);
  // Use groups will return old groups after region change so it does not flash loading state. in case datasource
  // changes regions will return undefined so that will do the loading state.
  const groups = useGroups(props.datasource, props.query.region);

  // We need this wrapper to wait for the groups and regions and only after that run the useInitQuery as it needs to
  // know both at that point.
  if (!(groups && regions)) {
    return <Spinner />;
  } else {
    return <QueryEditorInner {...{ ...props, groups, regions }} />;
  }
}

export type XrayQueryEditorInnerProps = QueryEditorProps<XrayDataSource, XrayQuery, XrayJsonData> & {
  groups: Group[];
  regions: Region[];
};

function QueryEditorInner(props: XrayQueryEditorInnerProps) {
  const regionsWithDefault = [{ label: 'default', value: 'default', text: 'default' }, ...props.regions];
  useInitQuery(props.query, props.onChange, props.groups, regionsWithDefault, props.datasource);
  return (
    <>
      <QueryHeader {...{ ...props, regions: regionsWithDefault }} />
      {(props.query.queryMode === XrayQueryMode.xray || !props.query.queryMode) && <QueryEditorForm {...props} />}
      {props.query.queryMode === XrayQueryMode.services && <ServiceQueryEditor {...props} />}
    </>
  );
}
