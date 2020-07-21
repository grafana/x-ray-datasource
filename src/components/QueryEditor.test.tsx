import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { QueryEditor, queryTypeOptionToQueryType, QueryTypeOptions } from './QueryEditor';
import { XrayQuery, XrayQueryType } from '../types';

const defaultProps = {
  onChange: () => {},
  datasource: undefined as any,
  onRunQuery: undefined as any,
};

jest.mock('./XRayQueryField', () => {
  return {
    __esModule: true,
    XRayQueryField: jest.fn(props => (
      <input data-testid={'query-field-mock'} onChange={e => props.onChange({ query: e.target.value })} />
    )),
  };
});

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

it('correctly changes the query type if user fills in trace id', () => {
  const onChange = jest.fn();
  render(
    <QueryEditor
      {...{
        ...defaultProps,
        query: { refId: 'A', query: '', queryType: XrayQueryType.getTraceSummaries },
        onChange,
      }}
    />
  );

  const field = screen.getByTestId('query-field-mock');

  fireEvent.change(field, { target: { value: '1-5f160a8b-83190adad07f429219c0e259' } });

  expect(onChange.mock.calls[0][0]).toEqual({
    refId: 'A',
    query: '1-5f160a8b-83190adad07f429219c0e259',
    queryType: XrayQueryType.getTrace,
  });
});

it('sets the query type to getTrace if query is a traceID', () => {
  const queryType = queryTypeOptionToQueryType(QueryTypeOptions.traceList, '1-5f048fc1-4f1c9b022d6233dacd96fb84');

  expect(queryType).toBe(XrayQueryType.getTrace);
});
