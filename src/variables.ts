import {
  CustomVariableSupport,
  DataQueryRequest,
  DataQueryResponse,
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
    value: group.GroupARN,
    text: group.GroupName,
  }));
}

function serviceToVariables(service: Record<string, string>): SelectableValue {
  return {
    value: service,
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
    return from(this.execute(request.range, request.targets[0])).pipe(map((data) => ({ data })));
  }

  async execute(range: TimeRange, query: XrayVariableQuery) {
    try {
      console.log('type', query.queryType);
      switch (query.queryType) {
        case VariableQueryType.Regions:
          return defaultRegions;
        case VariableQueryType.Groups:
          return groupsToVariables(await this.datasource.getGroups(query.region));
        case VariableQueryType.Accounts:
          return await this.datasource.getAccountIds(range, query.group);
        case VariableQueryType.Services:
          return (await this.datasource.getServices(query.region, range, query.accountId)).map(serviceToVariables);
        case VariableQueryType.Operations:
          return (await this.datasource.getOperations(query.region, range, query.service)).map(toOption);
      }
    } catch (error) {
      console.error(`Could not run Xray Variable Query ${query}`, error);
      return [];
    }
  }
}
