import { AwsAuthDataSourceJsonData } from '@grafana/aws-sdk';
import { DataQuery } from '@grafana/schema';

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
  serviceQueryType?: ServicesQueryType;
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

  // if linked accounts should be used for a service query
  includeLinkedAccounts?: boolean;

  // used to filter list services by account id
  accountId?: string;

  // Used to display the correct query editor
  queryMode?: QueryMode;

  // Used to get results by service for Application Signals queries
  serviceName?: string;
  serviceString?: string;
  service?: Record<string, string>;

  // Used to get results for List Service Level Objectives queries in Application Signals
  operationName?: string;
}

export enum VariableQueryType {
  Regions = 'regions',
  Groups = 'groups',
  Accounts = 'accounts',
  Services = 'services',
  Operations = 'operations',
}

export interface XrayVariableQuery extends DataQuery {
  queryType: VariableQueryType;
  region?: string;
  groupName?: string;
  accountId?: string;
  serviceName?: string;
  serviceString?: string;
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

export enum ServicesQueryType {
  listServices = 'listServices',
  listServiceOperations = 'listServiceOperations',
  listServiceDependencies = 'listServiceDependencies',
  listSLOs = 'listServiceLevelObjectives',
}

export enum QueryMode {
  xray = 'X-Ray',
  services = 'Services',
  slos = 'SLOs',
}

export interface XrayJsonData extends AwsAuthDataSourceJsonData {
  // Can add X-Ray specific values here
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
  attribute_names_substituted?: any[];
  resource_names?: string[];
}

interface Request {
  url: string;
  method: string;
  user_agent?: string;
  client_ip?: string;
  x_forwarded_for?: boolean;
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
  exceptions?: Exception[];
}

interface Exception {
  id: string;
  message?: string;
  type?: string;
  remote?: boolean;
  truncated?: number;
  skipped?: number;
  cause?: string;
  stack?: Stack[];
}

interface Stack {
  path?: string;
  line?: number;
  label?: string;
}

export type SQL = {
  connection_string?: string;
  url?: string;
  sanitized_query?: string;
  database_type?: string;
  database_version?: string;
  driver_version?: string;
  user?: string;
  preparation?: 'call' | 'statement' | 'unknown';
};

export type XrayTraceDataSegmentDocument = {
  // Same as Segment Id
  id: string;
  name: string;
  start_time: number;
  end_time?: number;
  in_progress?: boolean;
  // Same as top level Id
  trace_id?: string;
  subsegments?: XrayTraceDataSegmentDocument[];
  parent_id?: string;
  origin?: string;
  aws?: AWS;
  error?: boolean;
  fault?: boolean;
  throttle?: boolean;
  namespace?: 'aws' | 'remote';
  http?: Http;
  inferred?: boolean;
  cause?: Cause;
  annotations?: any;
  metadata?: any;
  sql?: SQL;
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
