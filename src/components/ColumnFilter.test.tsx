import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ColumnFilter } from './ColumnFilter';

function renderComponent(columns: string[], rerender?: any) {
  const renderFunc = rerender || render;

  const onChange = jest.fn();
  const utils = renderFunc(<ColumnFilter columns={columns} onChange={onChange} />);

  return { ...utils, onChange };
}

function selectOption(path: [string, string]) {
  let segment = screen.getByText(new RegExp(path[0], 'i'), { selector: 'a' });
  fireEvent.click(segment);
  let option = screen.getByText(new RegExp(path[1], 'i'), { selector: 'div' });
  fireEvent.click(option);
}

describe('ColumnFilter', () => {
  it('can add and remove column filters', () => {
    let { onChange, rerender } = renderComponent(['all']);
    selectOption(['all', 'success count']);
    expect(onChange).toBeCalledWith(['OkCount']);
    onChange = renderComponent(['OkCount'], rerender).onChange;
    selectOption(['success count', 'remove']);
    expect(onChange).toBeCalledWith(['all']);
  });

  it('removes other options if all is selected', () => {
    let { onChange } = renderComponent(['OkCount']);
    selectOption(['add', 'all']);
    expect(onChange).toBeCalledWith(['all']);
  });

  it('selects "all" if all columns are removed', () => {
    let { onChange } = renderComponent(['OkCount']);
    selectOption(['success count', 'remove']);
    expect(onChange).toBeCalledWith(['all']);
  });
});
