import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { QueryEditor, queryTypeOptionToQueryType, QueryTypeOptions } from './QueryEditor';
import { XrayQuery, XrayQueryType } from '../types';

const defaultProps = {
  onChange: () => {},
  datasource: undefined as any,
  onRunQuery: undefined as any,
};

function renderWithQuery(query: Omit<XrayQuery, 'refId'>) {
  render(
    <QueryEditor
      {...{
        ...defaultProps,
        query: {
          refId: 'A',
          ...query,
        },
      }}
    />
  );
}

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
  const onChange = jest.fn();
  render(
    <QueryEditor
      {...{
        ...defaultProps,
        query: { refId: 'A', query: '' },
        onChange,
      }}
    />
  );

  expect(onChange).toBeCalledWith({
    refId: 'A',
    query: '',
    queryType: XrayQueryType.getTraceSummaries,
  });
});

it('does not show column filter if query type is not getTimeSeriesServiceStatistics', () => {
  const onChange = jest.fn();
  const { rerender } = render(
    <QueryEditor
      {...{
        ...defaultProps,
        query: {
          refId: 'A',
          query: '',
          queryType: XrayQueryType.getTraceSummaries,
        },
        onChange,
      }}
    />
  );
  expect(screen.queryByTestId('column-filter')).toBeNull();

  rerender(
    <QueryEditor
      {...{
        ...defaultProps,
        query: {
          refId: 'A',
          query: '',
          queryType: XrayQueryType.getTimeSeriesServiceStatistics,
        },
        onChange,
      }}
    />
  );
  expect(screen.queryByTestId('column-filter')).not.toBeNull();
});

it('can add and remove column filters', () => {
  const onChange = jest.fn();
  const { rerender } = render(
    <QueryEditor
      {...{
        ...defaultProps,
        query: {
          refId: 'A',
          query: '',
          columns: ['all'],
          queryType: XrayQueryType.getTimeSeriesServiceStatistics,
        },
        onChange,
      }}
    />
  );

  let segment = screen.getByText(/all/i, { selector: 'a' });
  fireEvent.click(segment);
  let option = screen.getByText(/okcount/i, { selector: 'div' });
  fireEvent.click(option);

  expect(onChange).toBeCalledWith({
    refId: 'A',
    query: '',
    columns: ['OkCount'],
    queryType: XrayQueryType.getTimeSeriesServiceStatistics,
  });

  rerender(
    <QueryEditor
      {...{
        ...defaultProps,
        query: {
          refId: 'A',
          query: '',
          columns: ['OkCount'],
          queryType: XrayQueryType.getTimeSeriesServiceStatistics,
        },
        onChange,
      }}
    />
  );

  segment = screen.getByText(/okcount/i, { selector: 'a' });
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
