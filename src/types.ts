import { AwsAuthDataSourceJsonData } from '@grafana/aws-sdk';
import { DataQuery } from '@grafana/data';

export type Group = {
  FilterExpression?: string;
  GroupARN: string;
  GroupName: string;
};

export type Region = {
  label: string;
  value: string;
  text: string;
};

// TODO: would make sense at this point to change to discriminated union type
export interface XrayQuery extends DataQuery {
  queryType?: XrayQueryType;
  query: string;

  // Used in case of getTimeSeriesServiceStatistics to say which column/series actually return
  columns?: string[];

  // Interval of the getTimeSeriesServiceStatistics aggregation time bucket
  resolution?: number;

  // Used in case of getInsights to filter by state
  state?: string;
  group?: Group;

  // Can be used to override the default region set in data source config
  region?: string;

  // used to manually filter service map queries by account ids
  accountIds?: string[];
}

// Needs to match datasource Query* constants in backend code
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
  getInsights = 'getInsights',
  getServiceMap = 'getServiceMap',
}

export interface XrayJsonData extends AwsAuthDataSourceJsonData {
  tracesToLogs?: {
    datasourceUid: string;
  };
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
  api_gateway: {
    account_id: string;
    request_id: string;
    rest_api_id: string;
    stage: string;
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

interface HistogramValue {
  Count: number;
  Value: number;
}

export interface SummaryStatistics {
  ErrorStatistics?: { OtherCount: number; ThrottleCount: number; TotalCount: number };
  FaultStatistics?: { OtherCount: number; TotalCount: number };
  OkCount?: number;
  TotalCount?: number;
  TotalResponseTime?: number;
}

export interface XrayEdge {
  Aliases: string[];
  EndTime: number;
  ReferenceId: number;
  ResponseTimeHistogram: HistogramValue[];
  StartTime: number;
  SummaryStatistics: SummaryStatistics;
}

export interface XrayService {
  AccountId: string | null;
  DurationHistogram: HistogramValue[];
  Edges: XrayEdge[];
  EndTime: number;
  Name: string;
  Names: string[];
  ReferenceId: number;
  ResponseTimeHistogram: HistogramValue[];
  Root: true | null;
  StartTime: number;
  State: 'active' | 'unknown';
  SummaryStatistics: SummaryStatistics;
  Type: string;
}
