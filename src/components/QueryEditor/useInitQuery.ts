import { Group, Region, XrayQuery, XrayQueryType } from '../../types';
import { XrayDataSource } from '../../DataSource';
import { useEffect } from 'react';
import { dummyAllGroup } from './constants';

/**
 * Inits the query on mount or on datasource change.
 */
export function useInitQuery(
  query: XrayQuery,
  onChange: (value: XrayQuery) => void,
  groups: Group[],
  regions: Region[],
  dataSource: XrayDataSource
) {
  useEffect(() => {
    // We assume here the "Default" group is always there but lets fallback to first group if not. In case there are
    // no groups we don't have to actually crash as most queryTypes don't need group to be defined
    const defaultGroup = groups.find((g: Group) => g.GroupName === 'Default') || groups[0];

    // We assume that if there is no queryType during mount there should not be any query. This is basically
    // a case of clean slate init of the query. We do not need to check if query has traceId or not as we do with
    // the QueryTypeOptions mapping.
    if (!query.queryType) {
      onChange({
        ...query,
        queryType: XrayQueryType.getTraceSummaries,
        query: '',
        group: defaultGroup,
        region: 'default',
      });
    } else {
      // Lets make sure that we have group and region in the query and that they actually match what AWS tells us is
      // valid.
      const group = getNewGroup(query, groups, defaultGroup);
      const region = getNewRegion(query, regions);

      if (group !== query.group || region !== query.region) {
        onChange({
          ...query,
          group,
          region,
        });
      }
    }
  }, [query, groups, regions, onChange, dataSource]);
}

function getNewGroup(query: XrayQuery, groups: Group[], defaultGroup: Group): Group | undefined {
  // Check if we can keep the group from previous x-ray datasource or we need to set it to default again.
  let group = query.group;
  let allGroups = groups;
  if (query.queryType === XrayQueryType.getInsights) {
    allGroups = [dummyAllGroup, ...groups];
  }

  let sameArnGroup = allGroups.find((g: Group) => g.GroupARN === query.group?.GroupARN);
  if (!sameArnGroup) {
    group = defaultGroup;
  } else if (
    // This is the case when the group changes ie has the same ARN but different filter for example. I assume this can
    // happen but not 100% sure.
    sameArnGroup.GroupName !== query.group?.GroupName ||
    sameArnGroup.FilterExpression !== query.group?.FilterExpression
  ) {
    group = sameArnGroup;
  }
  return group;
}

function getNewRegion(query: XrayQuery, regions: Region[]): string {
  if (query.region) {
    const newRegion = regions.find((r) => r.value === query.region);
    if (newRegion) {
      return newRegion.value;
    }
  }
  return 'default';
}
