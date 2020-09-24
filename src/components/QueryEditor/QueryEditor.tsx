import React from 'react';
import { Spinner } from '@grafana/ui';
import { useGroups } from './useGroups';
import { QueryEditorForm, XrayQueryEditorFormProps } from './QueryEditorForm';

/**
 * Simple wrapper that is only responsible to load groups and delay actual render of the QueryEditorForm. Main reason
 * for that is that there is queryInit code that requires groups to be already loaded and is separate hook wo it
 * cannot be inside a condition. There are other ways to put it into single component but this seems cleaner than
 * alternatives.
 */
export function QueryEditor(props: Omit<XrayQueryEditorFormProps, 'groups'>) {
  const groups = useGroups(props.datasource);
  // We need this wrapper to wait for the groups and only after that run the useInitQuery as it needs to know the groups
  // at that point.
  if (!groups) {
    return <Spinner />;
  } else {
    return <QueryEditorForm {...{ ...props, groups: groups }} />;
  }
}
