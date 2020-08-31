import { Segment } from '@grafana/ui';
import React from 'react';

const columnNames: { [key: string]: string } = {
  'ErrorStatistics.ThrottleCount': 'Throttle Count',
  'ErrorStatistics.TotalCount': 'Error Count',
  'FaultStatistics.TotalCount': 'Fault Count',
  OkCount: 'Success Count',
  TotalCount: 'Total Count',
  'Computed.AverageResponseTime': 'Average Response Time',
};

type Props = {
  columns: string[];
  onChange: (columns: string[]) => void;
};

export function ColumnFilter(props: Props) {
  const { columns, onChange } = props;

  let options = Object.keys(columnNames)
    // Don't allow selecting same column twice.
    .filter(name => !columns.includes(name))
    .map(name => ({
      label: columnNames[name],
      value: name,
    }));

  const showingAll = columns.includes('all');
  if (!showingAll) {
    // Only allow one instance of 'all'
    options = [{ label: 'all', value: 'all' }, ...options];
  }

  return (
    <>
      {columns.map((column, index) => (
        <Segment
          key={column}
          placeholder="add"
          options={[...options, { label: 'remove', value: 'remove' }]}
          value={{ label: column === 'all' ? column : columnNames[column], value: column }}
          onChange={val => {
            if (val.value === 'all') {
              onChange(['all']);
            } else if (val.value === 'remove') {
              const newColumns = columns.slice();
              newColumns.splice(index, 1);
              // If we removed last column fall back to default which is showing all columns
              onChange(newColumns.length ? newColumns : ['all']);
            } else {
              const newColumns = columns.slice();
              newColumns.splice(index, 1, val.value!);
              onChange(newColumns);
            }
          }}
        />
      ))}
      {!showingAll && (
        <Segment
          placeholder="add"
          options={[...options]}
          onChange={val => {
            if (val.value === 'all') {
              onChange(['all']);
            } else {
              onChange([...columns, val.value!]);
            }
          }}
        />
      )}
    </>
  );
}
