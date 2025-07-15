import {
  CustomVariableSupport,
  DataQueryRequest,
  DataQueryResponse,
  ScopedVars,
  SelectableValue,
  TimeRange,
  toOption,
} from '@grafana/data';
import { Group, VariableQueryType, XrayQuery, XrayVariableQuery } from 'types';
import { XrayDataSource } from 'XRayDataSource';
import { XrayVariableQueryEditor } from './components/VariableEditor';
import { from, map, Observable } from 'rxjs';
import { defaultRegions } from 'components/QueryEditor/useRegions';

export function groupsToVariables(groups: Group[]): SelectableValue[] {
  return groups.map((group: Group) => ({
    value: group.GroupName,
    text: group.GroupName,
  }));
}

function serviceToVariables(service: Record<string, string>): SelectableValue {
  return {
    value: JSON.stringify(service),
    text: service.Name,
  };
}

export class XrayVariableSupport extends CustomVariableSupport<XrayDataSource, XrayVariableQuery, XrayQuery> {
  constructor(private readonly datasource: XrayDataSource) {
    super();
    this.datasource = datasource;
  }

  editor = XrayVariableQueryEditor;

  query(request: DataQueryRequest<XrayVariableQuery>): Observable<DataQueryResponse> {
    return from(this.execute(request.range, request.targets[0], request.scopedVars)).pipe(map((data) => ({ data })));
  }

  async execute(range: TimeRange, query: XrayVariableQuery, scopedVars: ScopedVars) {
    try {
      switch (query.queryType) {
        case VariableQueryType.Regions:
          return defaultRegions;
        case VariableQueryType.Groups:
          return groupsToVariables(await this.datasource.getGroups(query.region, scopedVars));
        case VariableQueryType.Accounts:
          const accountIds = (await this.datasource.getAccountIds(range, query.groupName, scopedVars)).map(toOption);
          accountIds.push({ value: 'all', text: 'All' });
          return accountIds;
        case VariableQueryType.Services:
          return (await this.datasource.getServices(query.region, range, query.accountId, scopedVars)).map(
            serviceToVariables
          );
        case VariableQueryType.Operations:
          return (await this.datasource.getOperations(query.region, range, query.serviceString, scopedVars)).map(
            toOption
          );
      }
    } catch (error) {
      console.error(`Could not run Xray Variable Query ${query}`, error);
      return [];
    }
  }
}
