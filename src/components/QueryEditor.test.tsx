import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { QueryEditor, queryTypeOptionToQueryType, QueryTypeOptions } from './QueryEditor';
import { XrayQuery, XrayQueryType } from '../types';

const defaultProps = {
  onChange: () => {},
  datasource: undefined as any,
  onRunQuery: undefined as any,
};

function renderWithQuery(query: Omit<XrayQuery, 'refId'>, rerender?: any) {
  const renderFunc = rerender || render;

  const onChange = jest.fn();
  const utils = renderFunc(
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

  return { ...utils, onChange };
}

describe('QueryEditor', () => {
  it.each([
    [XrayQueryType.getTrace, 'Trace List'],
    [XrayQueryType.getTraceSummaries, 'Trace List'],
    [XrayQueryType.getTimeSeriesServiceStatistics, 'Trace Analytics'],
  ])('renders proper query type option when query type is %s', (type, expected) => {
    renderWithQuery({
      query: 'test query',
      queryType: type as XrayQueryType,
    });
    expect(screen.getByText(expected)).not.toBeNull();
  });

  it('inits the query with query type', () => {
    const { onChange } = renderWithQuery({ query: '' });
    expect(onChange).toBeCalledWith({
      refId: 'A',
      query: '',
      queryType: XrayQueryType.getTraceSummaries,
    });
  });

  it('does not show column filter if query type is not getTimeSeriesServiceStatistics', () => {
    const { rerender } = renderWithQuery({ query: '', queryType: XrayQueryType.getTraceSummaries });
    expect(screen.queryByTestId('column-filter')).toBeNull();

    renderWithQuery({ query: '', queryType: XrayQueryType.getTimeSeriesServiceStatistics }, rerender);
    expect(screen.queryByTestId('column-filter')).not.toBeNull();
  });

  it('can add and remove column filters', () => {
    let { onChange, rerender } = renderWithQuery({
      query: '',
      columns: ['all'],
      queryType: XrayQueryType.getTimeSeriesServiceStatistics,
    });

    let segment = screen.getByText(/all/i, { selector: 'a' });
    fireEvent.click(segment);
    let option = screen.getByText(/Success Count/i, { selector: 'div' });
    fireEvent.click(option);

    expect(onChange).toBeCalledWith({
      refId: 'A',
      query: '',
      columns: ['OkCount'],
      queryType: XrayQueryType.getTimeSeriesServiceStatistics,
    });

    onChange = renderWithQuery(
      {
        query: '',
        columns: ['OkCount'],
        queryType: XrayQueryType.getTimeSeriesServiceStatistics,
      },
      rerender
    ).onChange;

    segment = screen.getByText(/Success Count/i, { selector: 'a' });
    fireEvent.click(segment);
    option = screen.getByText(/remove/i, { selector: 'div' });
    fireEvent.click(option);

    expect(onChange).toBeCalledWith({
      refId: 'A',
      query: '',
      columns: ['all'],
      queryType: XrayQueryType.getTimeSeriesServiceStatistics,
    });
  });

  it('sets the query type to getTrace if query is a traceID', () => {
    const queryType = queryTypeOptionToQueryType(QueryTypeOptions.traceList, '1-5f048fc1-4f1c9b022d6233dacd96fb84');

    expect(queryType).toBe(XrayQueryType.getTrace);
  });
});
