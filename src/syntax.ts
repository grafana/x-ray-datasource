import { CompletionItem } from '@grafana/ui';
import { Grammar } from 'prismjs';

export const BOOLEAN_KEYWORDS: CompletionItem[] = [
  {
    label: 'ok',
    documentation: 'Response status code was 2XX Success.',
  },
  { label: 'error', documentation: 'Response status code was 4XX Client Error.' },
  { label: 'throttle', documentation: 'Response status code was 429 Too Many Requests.' },
  { label: 'fault', documentation: 'Response status code was 5XX Server Error.' },
  { label: 'partial', documentation: 'Request has incomplete segments.' },
  { label: 'inferred', documentation: 'Request has inferred segments.' },
  { label: 'first', documentation: 'Element is the first of an enumerated list.' },
];

export const NUMBER_KEYWORDS: CompletionItem[] = [
  { label: 'responsetime', documentation: 'Time that the server took to send a response.' },
  { label: 'duration', documentation: 'Total request duration, including all downstream calls.' },
  { label: 'http.status', documentation: 'Response status code.' },
  { label: 'index', documentation: 'Position of an element in an enumerated list.' },
  {
    label: 'coverage',
    documentation:
      'Decimal percentage of entity response time over root segment response time. Applicable only for response time root cause entities.',
  },
];

export const STRING_KEYWORDS: CompletionItem[] = [
  { label: 'http.url', documentation: 'Request URL.' },
  { label: 'http.method', documentation: 'Request method.' },
  { label: 'http.useragent', documentation: 'Request user agent string.' },
  { label: 'http.clientip', documentation: "Requestor's IP address." },
  { label: 'user', documentation: 'Value of the user field on any segment in the trace.' },
  { label: 'account.id', documentation: 'AccountId associated with trace.' },
  { label: 'name', documentation: 'The name of a service or exception.' },
  { label: 'type', documentation: 'Service type.' },
  { label: 'message', documentation: 'Exception message.' },
  { label: 'availabilityzone', documentation: 'Value of the availabilityzone field on any segment in the trace.' },
  { label: 'instance.id', documentation: 'Value of the instance ID field on any segment in the trace.' },
  { label: 'resource.arn', documentation: 'Value of the resource ARN field on any segment in the trace.' },
];

export const STRING_OPERATORS = ['=', '!=', 'CONTAINS', 'BEGINSWITH', 'ENDSWITH'];

export const COMPLEX_KEYWORDS: CompletionItem[] = [
  {
    label: 'service',
    documentation: `service(_name_) {_filter_}
     Service with name _name_.
     Optional curly braces can contain a filter expression that applies to segments created by the service.`,
  },
  {
    label: 'edge',
    documentation: `edge(_source_, _destination_) {_filter_}
      Connection between services _source_ and _destination_.
      Optional curly braces can contain a filter expression that applies to segments on this connection.`,
  },
  {
    label: 'annotation',
    documentation: `annotation.key
    Value of an annotation with field _key_.
    The value of an annotation can be a Boolean, number, or string, so you can use any of the comparison operators of those types.
    You can't use this keyword in combination with the service or edge keyword.`,
  },
  {
    label: 'json',
    documentation: `JSON root cause object.
    See Getting data from AWS X-Ray for steps to create JSON entities programmatically.`,
  },
  {
    label: 'id',
    documentation: `id(name: "service-name", type:"service::type")
    You can use the id function in place of a service name in service and edge filters.`,
  },
];

export const All_KEYWORDS = [...BOOLEAN_KEYWORDS, ...NUMBER_KEYWORDS, ...STRING_KEYWORDS, ...COMPLEX_KEYWORDS];
export const tokenizer: Grammar = {
  function: {
    pattern: new RegExp(`\\b(?:${All_KEYWORDS.map((f) => f.label).join('|')})\\b`, 'i'),
  },
  punctuation: /[{}()`,]/,
  whitespace: /\s+/,
  boolean: /\btrue|false\b/,
  isTraceId: /^\d-\w{8}-\w{24}$/,
  logicalOperator: {
    pattern: /\band|or\b/i,
    alias: 'builtin',
  },
  number: /\b-?\d+((\.\d*)?([eE][+-]?\d+)?)?\b/,
};
