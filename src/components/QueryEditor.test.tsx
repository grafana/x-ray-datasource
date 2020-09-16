import React from 'react';
import { render, screen, fireEvent, act, waitFor } from '@testing-library/react';
import { QueryEditor, queryTypeOptionToQueryType, queryTypeOptions } from './QueryEditor';
import { XrayQuery, XrayQueryType } from '../types';

const defaultProps = {
  onRunQuery: undefined as any,
  datasource: {
    async getGroups() {
      return [];
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

    expect(onChange.mock.calls[0][0]).toEqual({
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

  it('sets the query type to getTrace if query is a traceID', () => {
    const queryType = queryTypeOptionToQueryType([queryTypeOptions[0].value], '1-5f048fc1-4f1c9b022d6233dacd96fb84');

    expect(queryType).toBe(XrayQueryType.getTrace);
  });
});
