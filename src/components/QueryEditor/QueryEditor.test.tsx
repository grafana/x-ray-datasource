import React from 'react';
import { render, screen, fireEvent, act, waitFor } from '@testing-library/react';
import { QueryEditor } from './QueryEditor';
import { Group, Region, XrayJsonData, XrayQuery, XrayQueryType } from '../../types';
import { XrayDataSource } from '../../DataSource';
import { DataSourceInstanceSettings } from '@grafana/data';

const defaultProps = {
  onRunQuery: undefined as any,
  datasource: {
    async getGroups(): Promise<Group[]> {
      return [{ GroupName: 'Default', GroupARN: 'DefaultARN' }];
    },
    async getRegions(): Promise<Region[]> {
      return [{ label: 'region1', text: 'region1', value: 'region1' }];
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
    XRayQueryField: jest.fn(props => (
      <input data-testid={'query-field-mock'} onChange={e => props.onChange({ query: e.target.value })} />
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
    [XrayQueryType.getTrace, 'Trace List'],
    [XrayQueryType.getTraceSummaries, 'Trace List'],
    [XrayQueryType.getTimeSeriesServiceStatistics, 'Trace Statistics'],
  ])('renders proper query type option when query type is %s', async (type, expected) => {
    await renderWithQuery({
      query: 'test query',
      queryType: type as XrayQueryType,
    });
    expect(screen.getByText(expected)).not.toBeNull();
  });

  it('inits the query with query type', async () => {
    const { onChange } = await renderWithQuery({ query: '' });
    expect(onChange).toBeCalledWith({
      refId: 'A',
      query: '',
      queryType: XrayQueryType.getTraceSummaries,
      region: 'default',
      group: { GroupName: 'Default', GroupARN: 'DefaultARN' },
    });
  });

  it('shows column filter and resolution only if query type is getTimeSeriesServiceStatistics', async () => {
    const { rerender } = await renderWithQuery({ query: '', queryType: XrayQueryType.getTraceSummaries });
    expect(screen.queryByTestId('column-filter')).toBeNull();
    expect(screen.queryByTestId('resolution')).toBeNull();

    await renderWithQuery({ query: '', queryType: XrayQueryType.getTimeSeriesServiceStatistics }, rerender);
    expect(screen.queryByTestId('column-filter')).not.toBeNull();
    expect(screen.queryByTestId('resolution')).not.toBeNull();
  });

  it('correctly changes the query type if user fills in trace id', async () => {
    const { onChange } = await renderWithQuery({ query: '', queryType: XrayQueryType.getTraceSummaries });

    const field = screen.getByTestId('query-field-mock');

    fireEvent.change(field, { target: { value: '1-5f160a8b-83190adad07f429219c0e259' } });

    // First call would be the query init call. We do not update the query based on that so when doing this second one
    // it's done without default region or group.
    expect(onChange.mock.calls[1][0]).toEqual({
      refId: 'A',
      query: '1-5f160a8b-83190adad07f429219c0e259',
      queryType: XrayQueryType.getTrace,
    });
  });

  it('can add and remove column filters', async () => {
    let { onChange } = await renderWithQuery({
      query: '',
      columns: [],
      queryType: XrayQueryType.getTimeSeriesServiceStatistics,
    });

    let select = screen.getByText('All columns');
    fireEvent.mouseDown(select);
    let option = screen.getByText(/Success Count/i);
    fireEvent.click(option);

    expect(onChange).toBeCalledWith({
      refId: 'A',
      query: '',
      columns: ['OkCount'],
      queryType: XrayQueryType.getTimeSeriesServiceStatistics,
    });
  });

  it('waits until groups and regions are loaded', async () => {
    await act(async () => {
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
      expect(screen.getByText('', { selector: '.fa-spinner' })).toBeDefined();
      await waitFor(() => expect(screen.getByText('Query')).toBeDefined());
    });
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
