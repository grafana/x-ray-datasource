import { Group, XrayQuery, XrayQueryType } from '../../types';
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
  dataSource: XrayDataSource
) {
  useEffect(() => {
    // We assume here the "Default" group is always there but lets fallback to first group if not. In case there are
    // no groups we don't have to actually crash as most queryTypes don't need group to be defined
    const defaultGroup = groups.find((g: Group) => g.GroupName === 'Default') || groups[0];

    // We assume that if there is no queryType during mount there should not be any query so we do not need to
    // check if query has traceId or not as we do with the QueryTypeOptions mapping.
    if (!query.queryType) {
      onChange({
        ...query,
        queryType: XrayQueryType.getTraceSummaries,
        query: '',
        group: defaultGroup,
      });
    } else {
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
      if (group !== query.group) {
        onChange({
          ...query,
          group: group,
        });
      }
    }
  }, [query, groups, onChange, dataSource]);
}
