import React from 'react';
import { Spinner } from '@grafana/ui';
import { useGroups } from './useGroups';
import { QueryEditorForm, XrayQueryEditorFormProps } from './QueryEditorForm';
import { useRegions } from './useRegions';

/**
 * Simple wrapper that is only responsible to load groups and delay actual render of the QueryEditorForm. Main reason
 * for that is that there is queryInit code that requires groups to be already loaded and is separate hook and it
 * cannot be inside a condition. There are other ways to put it into single component but this seems cleaner than
 * alternatives.
 */
export function QueryEditor(props: Omit<XrayQueryEditorFormProps, 'groups' | 'regions'>) {
  const groups = useGroups(props.datasource);
  const regions = useRegions({ datasource: props.datasource });

  // We need this wrapper to wait for the groups and regions and only after that run the useInitQuery as it needs to
  // know both at that point.
  if (!(groups && regions)) {
    return <Spinner />;
  } else {
    return <QueryEditorForm {...{ ...props, groups, regions }} />;
  }
}
