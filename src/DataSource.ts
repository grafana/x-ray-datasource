import { DataSourceInstanceSettings } from '@grafana/data';
import { DataSourceWithBackend, getBackendSrv } from '@grafana/runtime';
import { XrayJsonData, TSDBResponse, MetricRequest, XrayQuery } from './types';

export class XrayDataSource extends DataSourceWithBackend<XrayQuery, XrayJsonData> {
  /** @ngInject */
  constructor(instanceSettings: DataSourceInstanceSettings<XrayJsonData>) {
    super(instanceSettings);
  }

  async getRegions(): Promise<Array<{ label: string; value: string; text: string }>> {
    const response = await this.awsRequest({
      queries: [
        {
          refId: 'getRegions',
          datasourceId: this.id,
          type: 'getRegions',
        },
      ],
    });
    const suggestions = this.transformSuggestDataFromTable(response);
    return [{ label: 'default', value: 'default', text: 'default' }, ...suggestions];
  }

  async awsRequest(data: MetricRequest) {
    const options = {
      method: 'POST',
      url: '/api/tsdb/query',
      data,
    };

    const result = await getBackendSrv().datasourceRequest(options);
    return result.data;
  }

  transformSuggestDataFromTable(suggestData: TSDBResponse): Array<{ text: string; value: string; label: string }> {
    return suggestData.results['metricFindQuery'].tables[0].rows.map(value => ({
      text: value,
      value,
      label: value,
    }));
  }
}
