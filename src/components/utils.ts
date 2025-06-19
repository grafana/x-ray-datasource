import { SelectableValue } from '@grafana/data';
import { XrayDataSource } from 'XRayDataSource';

export const toOption = (value: string) => ({ label: value, value });

export const appendTemplateVariables = (datasource: XrayDataSource, values: SelectableValue[]) => [
  ...values,
  { label: 'Template Variables', options: datasource.getVariables().map(toOption) },
];
