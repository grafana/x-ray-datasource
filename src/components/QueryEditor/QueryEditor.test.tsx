import React from 'react';
import { render, screen, fireEvent, act, waitFor, waitForElementToBeRemoved } from '@testing-library/react';
import { QueryEditor } from './QueryEditor';
import { Group, Region, ServicesQueryType, XrayJsonData, XrayQuery, XrayQueryMode, XrayQueryType } from '../../types';
import { XrayDataSource } from '../../XRayDataSource';
import { DataSourceInstanceSettings, ScopedVars, TypedVariableModel } from '@grafana/data';

const defaultProps = {
  onRunQuery: undefined as any,
  datasource: {
    async getGroups(): Promise<Group[]> {
      return [{ GroupName: 'Default', GroupARN: 'DefaultARN' }];
    },
    async getRegions(): Promise<Region[]> {
      return [{ label: 'region1', text: 'region1', value: 'region1' }];
    },
    async getAccountIdsForServiceMap(): Promise<string[]> {
      return ['account1', 'account2'];
    },
    getServiceMapUrl() {
      return 'service-map';
    },
    getXrayUrlForQuery() {
      return 'console';
    },
  } as any,
};

jest.mock('./XRayQueryField', () => {
  return {
    __esModule: true,
    XRayQueryField: jest.fn((props) => (
      <input data-testid={'query-field-mock'} onChange={(e) => props.onChange({ query: e.target.value })} />
    )),
  };
});

jest.mock(
  'grafana/app/core/app_events',
  () => {
    return {
      __esModule: true,
      default: {
        emit: jest.fn(),
      },
    };
  },
  { virtual: true }
);

jest.mock('@grafana/runtime', () => ({
  ...jest.requireActual('@grafana/runtime'),
  getTemplateSrv: () => ({
    getVariables(): TypedVariableModel[] {
      return [];
    },
    replace(target?: string, scopedVars?: ScopedVars, format?: string | Function): string {
      if (!target) {
        return '';
      }
      const vars: Record<string, { value: any }> = {
        ...scopedVars,
        someVar: {
          value: '200',
        },
      };
      for (const key of Object.keys(vars)) {
        target = target!.replace(`\$${key}`, vars[key].value);
        target = target!.replace(`\${${key}}`, vars[key].value);
      }
      return target!;
    },
    containsTemplate: jest.fn(),
    updateTimeRange: jest.fn(),
  }),
}));

async function renderWithQuery(query: Omit<XrayQuery, 'refId'>, rerender?: any) {
  const renderFunc = rerender || render;

  const onChange = jest.fn();
  let utils: any;
  await act(async () => {
    utils = renderFunc(
      <QueryEditor
        {...{
          ...defaultProps,
          query: {
            refId: 'A',
            ...query,
          },
        }}
        onChange={onChange}
      />
    );
    await waitFor(() => {});
  });

  return { ...utils, onChange };
}

describe('QueryEditor', () => {
  it.each([
    [XrayQueryMode.xray, XrayQueryType.getTrace, 'Trace List'],
    [XrayQueryMode.xray, XrayQueryType.getTraceSummaries, 'Trace List'],
    [XrayQueryMode.xray, XrayQueryType.getTimeSeriesServiceStatistics, 'Trace Statistics'],
    [XrayQueryMode.xray, XrayQueryType.getAnalyticsRootCauseResponseTimeService, 'Root Cause'],
    [XrayQueryMode.xray, XrayQueryType.getAnalyticsRootCauseResponseTimePath, 'Path'],
    [XrayQueryMode.xray, XrayQueryType.getAnalyticsRootCauseErrorService, 'Root Cause'],
    [XrayQueryMode.xray, XrayQueryType.getAnalyticsRootCauseErrorPath, 'Path'],
    [XrayQueryMode.xray, XrayQueryType.getAnalyticsRootCauseErrorMessage, 'Error Message'],
    [XrayQueryMode.xray, XrayQueryType.getAnalyticsRootCauseFaultService, 'Root Cause'],
    [XrayQueryMode.xray, XrayQueryType.getAnalyticsRootCauseFaultPath, 'Path'],
    [XrayQueryMode.xray, XrayQueryType.getAnalyticsRootCauseFaultMessage, 'Error Message'],
    [XrayQueryMode.xray, XrayQueryType.getAnalyticsUser, 'End user impact'],
    [XrayQueryMode.xray, XrayQueryType.getAnalyticsUrl, 'URL'],
    [XrayQueryMode.xray, XrayQueryType.getAnalyticsStatusCode, 'HTTP status code'],
    [XrayQueryMode.xray, XrayQueryType.getInsights, 'Insights'],
    [XrayQueryMode.xray, XrayQueryType.getServiceMap, 'Service Map'],
  ])('renders proper query type option when query mode is %s and query type is %s', async (mode, type, expected) => {
    await renderWithQuery({
      queryMode: mode,
      query: 'test query',
      queryType: type as XrayQueryType,
    });
    expect(screen.getByText(expected)).not.toBeNull();
  });

  it.each([[XrayQueryMode.services, ServicesQueryType.listServices, 'List Services']])(
    'renders proper query type option when query mode is %s and query type is %s',
    async (mode, type, expected) => {
      await renderWithQuery({
        queryMode: mode,
        query: 'test query',
        serviceQueryType: type as ServicesQueryType,
      });
      expect(screen.getByText(expected)).not.toBeNull();
    }
  );

  it('inits the query with query type', async () => {
    const { onChange } = await renderWithQuery({ query: '' });
    expect(onChange).toHaveBeenCalledWith({
      refId: 'A',
      query: '',
      queryMode: XrayQueryMode.xray,
      queryType: XrayQueryType.getTraceSummaries,
      region: 'default',
      group: { GroupName: 'Default', GroupARN: 'DefaultARN' },
    });
  });

  it('inits service query with query type', async () => {
    const { onChange } = await renderWithQuery({ queryMode: XrayQueryMode.services, query: '' });
    expect(onChange).toHaveBeenCalledWith({
      refId: 'A',
      query: '',
      region: 'default',
      queryMode: XrayQueryMode.services,
      serviceQueryType: ServicesQueryType.listServices,
    });
  });

  it('fills in queryMode for set queryType', async () => {
    const { onChange } = await renderWithQuery({ queryType: XrayQueryType.getTraceSummaries, query: '' });
    expect(onChange).toHaveBeenCalledWith({
      refId: 'A',
      query: '',
      queryMode: XrayQueryMode.xray,
      queryType: XrayQueryType.getTraceSummaries,
      region: 'default',
      group: { GroupName: 'Default', GroupARN: 'DefaultARN' },
    });
  });

  it('shows column filter and resolution only if query type is getTimeSeriesServiceStatistics', async () => {
    const { rerender } = await renderWithQuery({
      query: '',
      queryMode: XrayQueryMode.xray,
      queryType: XrayQueryType.getTraceSummaries,
    });
    expect(screen.queryByTestId('column-filter')).toBeNull();
    expect(screen.queryByTestId('resolution')).toBeNull();

    await renderWithQuery(
      { query: '', queryMode: XrayQueryMode.xray, queryType: XrayQueryType.getTimeSeriesServiceStatistics },
      rerender
    );
    expect(screen.queryByTestId('column-filter')).not.toBeNull();
    expect(screen.queryByTestId('resolution')).not.toBeNull();
  });

  it('hides query input if query is service map', async () => {
    await renderWithQuery({ query: '', queryMode: XrayQueryMode.xray, queryType: XrayQueryType.getServiceMap });
    expect(screen.queryByText(/^Query$/)).toBeNull();
  });

  it('correctly changes the query type if user fills in trace id (X-Ray format)', async () => {
    const { onChange } = await renderWithQuery({
      query: '',
      queryMode: XrayQueryMode.xray,
      queryType: XrayQueryType.getTraceSummaries,
    });

    const field = screen.getByTestId('query-field-mock');

    fireEvent.change(field, { target: { value: '1-5f160a8b-83190adad07f429219c0e259' } });

    expect(onChange.mock.calls[1][0]).toEqual({
      refId: 'A',
      query: '1-5f160a8b-83190adad07f429219c0e259',
      queryMode: XrayQueryMode.xray,
      queryType: XrayQueryType.getTrace,
    });
  });

  it('correctly changes the query type if user fills in trace id (W3C format)', async () => {
    const { onChange } = await renderWithQuery({
      query: '',
      queryMode: XrayQueryMode.xray,
      queryType: XrayQueryType.getTraceSummaries,
    });

    const field = screen.getByTestId('query-field-mock');

    fireEvent.change(field, { target: { value: '5f160a8b83190adad07f429219c0e259' } });

    expect(onChange.mock.calls[1][0]).toEqual({
      refId: 'A',
      query: '5f160a8b83190adad07f429219c0e259',
      queryMode: XrayQueryMode.xray,
      queryType: XrayQueryType.getTrace,
    });
  });

  it('can add and remove column filters', async () => {
    let { onChange } = await renderWithQuery({
      query: '',
      columns: [],
      queryMode: XrayQueryMode.xray,
      queryType: XrayQueryType.getTimeSeriesServiceStatistics,
    });

    let select = screen.getByText('All columns');
    fireEvent.mouseDown(select);
    let option = screen.getByText(/Success Count/i);
    fireEvent.click(option);

    expect(onChange).toHaveBeenCalledWith({
      refId: 'A',
      query: '',
      columns: ['OkCount'],
      queryMode: XrayQueryMode.xray,
      queryType: XrayQueryType.getTimeSeriesServiceStatistics,
    });
  });

  it('waits until groups and regions are loaded', async () => {
    render(
      <QueryEditor
        {...{
          ...defaultProps,
          query: {
            refId: 'A',
          } as any,
        }}
        onChange={() => {}}
      />
    );
    // No ideal selector but spinner does not seem to have any better thing to select by
    expect(screen.getByTestId('Spinner')).toBeDefined();
    expect(await screen.findByText('Query')).toBeDefined();
  });

  it('sets the correct links based on region default', async () => {
    renderEditorWithRegion('region1', 'default');
    await checkLinks({
      console: 'https://region1.console.aws.amazon.com/xray/home?region=region1#/analytics',
      serviceMap: 'https://region1.console.aws.amazon.com/xray/home?region=region1#/service-map/',
    });
  });

  it('sets the correct links based on region in query', async () => {
    renderEditorWithRegion('region1', 'region2');
    await checkLinks({
      console: 'https://region2.console.aws.amazon.com/xray/home?region=region2#/analytics',
      serviceMap: 'https://region2.console.aws.amazon.com/xray/home?region=region2#/service-map/',
    });
  });

  it('shows the accountIds in a dropdown on service map selection', async () => {
    const mockGetAccountIds = jest.fn(() => Promise.resolve(['account1', 'account2']));
    render(
      <QueryEditor
        {...{
          ...defaultProps,
          datasource: {
            ...defaultProps.datasource,
            getAccountIds: mockGetAccountIds,
          },
          query: {
            refId: 'A',
            queryType: 'getServiceMap',
            accountIds: ['account1'],
          } as any,
        }}
        onChange={() => {}}
      />
    );
    expect(screen.getByTestId('Spinner')).toBeDefined();
    expect(await screen.findByText('account1')).toBeDefined();
    expect(mockGetAccountIds).toHaveBeenCalled();
  });

  it('shows the accountIds in a dropdown on listService selection', async () => {
    const mockGetAccountIds = jest.fn(() => Promise.resolve(['account1', 'account2']));
    render(
      <QueryEditor
        {...{
          ...defaultProps,
          datasource: {
            ...defaultProps.datasource,
            getAccountIds: mockGetAccountIds,
          },
          query: {
            refId: 'A',
            queryMode: XrayQueryMode.services,
            ServicesQueryType: ServicesQueryType.listServices,
            accountIds: ['account1'],
          } as any,
        }}
        onChange={() => {}}
      />
    );
    expect(screen.getByTestId('Spinner')).toBeDefined();
    expect(await screen.findByText('account1')).toBeDefined();
    expect(mockGetAccountIds).toHaveBeenCalled();
  });

  it('does not fetch account ids if service map is not selected', async () => {
    const mockGetAccountIds = jest.fn(() => Promise.resolve(['account1', 'account2']));
    render(
      <QueryEditor
        {...{
          ...defaultProps,
          datasource: {
            ...defaultProps.datasource,
            getAccountIds: mockGetAccountIds,
          },
          query: {
            refId: 'A',
            queryType: XrayQueryType.getTrace,
            accountIds: [],
          } as any,
        }}
        onChange={() => {}}
      />
    );
    expect(screen.getByTestId('Spinner')).toBeDefined();
    await waitForElementToBeRemoved(() => screen.getByTestId('Spinner'));
    expect(mockGetAccountIds).not.toHaveBeenCalled();
  });
});

function makeDataSource(settings: DataSourceInstanceSettings<XrayJsonData>) {
  const ds = new XrayDataSource(settings);
  ds.getGroups = async (): Promise<Group[]> => [{ GroupName: 'Default', GroupARN: 'DefaultARN' }];
  ds.getRegions = async (): Promise<Region[]> => [{ label: 'region1', text: 'region1', value: 'region1' }];
  return ds;
}

function renderEditorWithRegion(region: string, queryRegion: string) {
  render(
    <QueryEditor
      {...{
        ...defaultProps,
        datasource: makeDataSource({ jsonData: { defaultRegion: 'region1' } } as any),
        query: {
          refId: 'A',
          query: '',
          queryMode: XrayQueryMode.xray,
          region: queryRegion,
        },
      }}
      onChange={() => {}}
    />
  );
}

async function checkLinks(links: { console: string; serviceMap: string }) {
  const serviceMapLink = (await screen.findByText(/service map/i)).closest('a');
  expect(serviceMapLink).toBeDefined();
  expect(serviceMapLink!.href).toBe(links.serviceMap);

  const consoleLink = (await screen.findByText(/console/i)).closest('a');
  expect(consoleLink).toBeDefined();
  expect(consoleLink!.href).toBe(links.console);
}
