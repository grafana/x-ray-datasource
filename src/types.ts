import { DataQuery, DataSourceJsonData } from '@grafana/data';

// TODO: would make sense at this point to change to discriminated union type
export interface XrayQuery extends DataQuery {
  queryType?: XrayQueryType;
  query: string;

  // Used in case of getTimeSeriesServiceStatistics to say which column/series actually return
  columns?: string[];

  // Interval of the getTimeSeriesServiceStatistics aggregation time bucket
  resolution?: number;
}

export enum XrayQueryType {
  getTrace = 'getTrace',
  getTraceSummaries = 'getTraceSummaries',
  getTimeSeriesServiceStatistics = 'getTimeSeriesServiceStatistics',
  getAnalyticsRootCauseResponseTimeService = 'getAnalyticsRootCauseResponseTimeService',
  getAnalyticsRootCauseResponseTimePath = 'getAnalyticsRootCauseResponseTimePath',
  getAnalyticsRootCauseErrorService = 'getAnalyticsRootCauseErrorService',
  getAnalyticsRootCauseErrorPath = 'getAnalyticsRootCauseErrorPath',
  getAnalyticsRootCauseErrorMessage = 'getAnalyticsRootCauseErrorMessage',
  getAnalyticsRootCauseFaultService = 'getAnalyticsRootCauseFaultService',
  getAnalyticsRootCauseFaultPath = 'getAnalyticsRootCauseFaultPath',
  getAnalyticsRootCauseFaultMessage = 'getAnalyticsRootCauseFaultMessage',
  getAnalyticsUser = 'getAnalyticsUser',
  getAnalyticsUrl = 'getAnalyticsUrl',
  getAnalyticsStatusCode = 'getAnalyticsStatusCode',
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

export interface AWS {
  [index: string]: any;
  ecs?: {
    container?: string;
  };
  ec2?: {
    instance_id?: string;
    availability_zone?: string;
  };
  elastic_beanstalk?: {
    environment_name?: string;
    version_label?: string;
    deployment_id?: number;
  };
  account_id?: string;
  retries?: number;
  region?: string;
  operation?: string;
  request_id?: string;
  table_name?: string;
  attribute_names_substituted: any[];
  resource_names: string[];
}

interface Request {
  url: string;
  method: string;
  user_agent?: string;
  client_ip?: string;
}

interface Response {
  status: number;
  content_length?: number;
}

interface Http {
  request?: Request;
  response: Response;
}

interface Cause {
  working_directory: string;
  exceptions?: Array<{ message: string; type: string; stack: Array<{ path: string; line: number; label: string }> }>;
}

export type XrayTraceDataSegmentDocument = {
  // Same as Segment Id
  id: string;
  name: string;
  start_time: number;
  end_time?: number;
  in_progress?: boolean;
  // Same as top level Id
  trace_id: string;
  subsegments?: XrayTraceDataSegmentDocument[];
  parent_id?: string;
  origin?: string;
  aws?: AWS;
  error?: boolean;
  fault?: boolean;
  throttle?: boolean;
  http?: Http;
  cause?: Cause;
  annotations?: any;
  metadata?: any;
};
