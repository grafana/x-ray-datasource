import { DataQuery, DataSourceJsonData } from '@grafana/data';

export interface XrayQuery extends DataQuery {
  queryType: XrayQueryType;
  query: string;
}

export enum XrayQueryType {
  getTrace = 'getTrace',
  getTraceSummaries = 'getTraceSummaries',
  getTimeSeriesServiceStatistics = 'getTimeSeriesServiceStatistics',
}

export interface XrayJsonData extends DataSourceJsonData {
  timeField?: string;
  assumeRoleArn?: string;
  database?: string;
  customMetricsNamespaces?: string;
  profile?: string;
}

export interface XraySecureJsonData {
  accessKey: string;
  secretKey: string;
}

export interface TSDBResponse<T = any> {
  results: Record<string, TSDBQueryResult<T>>;
  message?: string;
}

export interface TSDBQueryResult<T = any> {
  refId: string;
  series: TSDBTimeSeries[];
  tables: Array<TSDBTable<T>>;
  dataframes: number[][];
  error?: string;
  meta?: any;
}

export interface TSDBTimeSeries {
  name: string;
  points: TSDBTimePoint[];
  tags?: Record<string, string>;
}

export type TSDBTimePoint = [number, number];

export interface TSDBTable<T = any> {
  columns: Array<{ text: string }>;
  rows: T[];
}

export interface MetricRequest {
  from?: string;
  to?: string;
  queries: MetricQuery[];
  debug?: boolean;
}

export interface MetricQuery {
  [key: string]: any;
  datasourceId: number;
  refId?: string;
  maxDataPoints?: number;
  intervalMs?: number;
}

export type XrayTraceData = {
  Duration: number;
  Id: string;
  Segments: XrayTraceDataSegment[];
};

export type XrayTraceDataRaw = {
  Duration: number;
  Id: string;
  Segments: XrayTraceDataSegmentRaw[];
};

export type XrayTraceDataSegment = {
  Document: XrayTraceDataSegmentDocument;
  Id: string;
};

type XrayTraceDataSegmentRaw = {
  Document: string;
  Id: string;
};

interface Aws {
  [index: string]: any;
  retries: number;
  region: string;
  operation: string;
  request_id: string;
  table_name: string;
  attribute_names_substituted: any[];
  resource_names: string[];
}

export type XrayTraceDataSegmentDocument = {
  // Same as Segment Id
  id: string;
  name: string;
  start_time: number;
  end_time: number;
  // Same as top level Id
  trace_id: string;
  subsegments?: XrayTraceDataSegmentDocument[];
  parent_id?: string;
  origin?: string;
  aws?: Aws;
  error?: boolean;
  http?: any;
};
