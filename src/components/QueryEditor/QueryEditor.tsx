import React from 'react';
import { Spinner } from '@grafana/ui';
import { useGroups } from './useGroups';
import { useRegions } from './useRegions';
import { QueryEditorForm, XrayQueryEditorFormProps } from './QueryEditorForm';
import QueryHeader from './QueryHeader';
import { useInitQuery } from './useInitQuery';
import { XrayQueryMode } from 'types';
import { ServiceQueryEditor } from './ServiceQueryEditor';
/**
 * Simple wrapper that is only responsible to load groups and delay actual render of the QueryEditorForm. Main reason
 * for that is that there is queryInit code that requires groups to be already loaded and is separate hook and it
 * cannot be inside a condition. There are other ways to put it into single component but this seems cleaner than
 * alternatives.
 */
export function QueryEditor(props: Omit<XrayQueryEditorFormProps, 'groups' | 'regions'>) {
  const fetchedRegions = useRegions(props.datasource) || [];
  const regions = [{ label: 'default', value: 'default', text: 'default' }, ...fetchedRegions];
  // Use groups will return old groups after region change so it does not flash loading state. in case datasource
  // changes regions will return undefined so that will do the loading state.
  const groups = useGroups(props.datasource, props.query.region);

  useInitQuery(props.query, props.onChange, groups, regions, props.datasource);

  // We need this wrapper to wait for the groups and regions and only after that run the useInitQuery as it needs to
  // know both at that point.
  if (!(groups && regions)) {
    return <Spinner />;
  } else {
    return (
      <>
        <QueryHeader {...{ ...props, regions }} />
        {props.query.queryMode === XrayQueryMode.xray && <QueryEditorForm {...{ ...props, groups }} />};
        {props.query.queryMode === XrayQueryMode.services && <ServiceQueryEditor {...props} />}
      </>
    );
  }
}
