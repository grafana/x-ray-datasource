import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { QueryEditor } from './QueryEditor';
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

it('sets the query type to getTrace if query is a traceID', () => {
  const onChange = jest.fn();
  render(
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

  fireEvent.change(screen.getByTestId('query-input'), {
    target: { value: '1-5f048fc1-4f1c9b022d6233dacd96fb84' },
  });
  expect(onChange).toBeCalledWith({
    refId: 'A',
    query: '1-5f048fc1-4f1c9b022d6233dacd96fb84',
    queryType: XrayQueryType.getTrace,
  });
});
