import { XrayDataSource } from '../../DataSource';
import { Group } from '../../types';
import { useEffect, useState } from 'react';

export function useGroups(datasource: XrayDataSource): Group[] | undefined {
  const [groups, setGroups] = useState<Group[] | undefined>(undefined);

  useEffect(() => {
    // This should run in case we change between different x-ray datasources and so should clear old groups.
    setGroups(undefined);
    datasource.getGroups().then(groups => {
      setGroups(groups);
    });
  }, [datasource]);
  return groups;
}
