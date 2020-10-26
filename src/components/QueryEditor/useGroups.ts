import { XrayDataSource } from '../../DataSource';
import { Group } from '../../types';
import { useEffect, useState } from 'react';

export function useGroups(datasource: XrayDataSource, region?: string): Group[] | undefined {
  const [groups, setGroups] = useState<Group[] | undefined>(undefined);

  useEffect(() => {
    // This should run in case we change between different x-ray datasources and so should clear old groups.
    setGroups(undefined);
    datasource.getGroups(region).then(groups => {
      setGroups(groups);
    });
  }, [datasource, region]);
  return groups;
}
