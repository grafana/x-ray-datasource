import { Process, SpanData, TraceData, SpanReference, KeyValuePair } from '@grafana/data';
import { XrayTraceData, XrayTraceDataSegment, XrayTraceDataSegmentDocument, AWS } from 'types';
import { keyBy, isPlainObject } from 'lodash';
import { flatten } from './flatten';

const MS_MULTIPLIER = 1000000;

/**
 * Transforms response to format similar to Jaegers as we use Jaeger ui on the frontend.
 */
export function transformResponse(data: XrayTraceData): TraceData & { spans: SpanData[] } {
  let subSegmentSpans: SpanData[] = [];
  const segmentSpans = data.Segments.map(segment => {
    getSubSegments(segment.Document, (subSegment, segmentParent) => {
      subSegmentSpans.push(transformSegment(subSegment, segmentParent.id));
    });
    return transformSegment(segment.Document);
  });

  return {
    processes: gatherProcesses(data.Segments),
    traceID: data.Id,
    spans: subSegmentSpans ? [...segmentSpans, ...subSegmentSpans] : segmentSpans,
    warnings: null,
  };
}

function getSubSegments(
  segment: XrayTraceDataSegmentDocument,
  callBack: (segment: XrayTraceDataSegmentDocument, segmentParent: XrayTraceDataSegmentDocument) => void
) {
  if (segment.subsegments?.length) {
    segment.subsegments.forEach(subSegment => {
      callBack(subSegment, segment);
      getSubSegments(subSegment, callBack);
    });
  }
}

function transformSegment(segment: XrayTraceDataSegmentDocument, parentId?: string): SpanData {
  let references: SpanReference[] = [];
  if (parentId) {
    references.push({ refType: 'CHILD_OF', spanID: parentId, traceID: segment.trace_id });
  }
  const jaegerSpan: SpanData = {
    duration: segment.end_time * MS_MULTIPLIER - segment.start_time * MS_MULTIPLIER,
    flags: 1,
    logs: [],
    operationName: getOperationName(segment),
    processID: segment.parent_id || segment.id,
    startTime: segment.start_time * MS_MULTIPLIER,
    spanID: segment.id,
    traceID: segment.trace_id,
    warnings: null,
    tags: getTagsForSpan(segment),
    references,
  };

  return jaegerSpan;
}

function getOperationName(segment: XrayTraceDataSegmentDocument) {
  if (segment.aws?.operation) {
    return segment.aws.operation;
  }

  if (segment.http?.request?.url && segment.http?.request?.method) {
    return `${segment.http.request.url} ${segment.http.request.method}`;
  }

  return segment.name;
}

function getTagsForSpan(segment: XrayTraceDataSegmentDocument) {
  const tags = [...segmentToTag(segment.aws), ...segmentToTag(segment.http)];

  if (segment.error) {
    tags.push({ key: 'error', value: segment.error, type: 'boolean' });
  }
  return tags;
}

function segmentToTag(segment: any | undefined) {
  const result: KeyValuePair[] = [];
  if (!segment) {
    return result;
  }

  const flattenedObject = flatten(segment);
  Object.keys(flattenedObject).map(key => {
    const tag = valueToTag(key, flattenedObject[key], typeof flattenedObject[key]);
    if (tag) {
      result.push(tag);
    }
  });
  return result;
}

function getTagsFromAws(aws: AWS | undefined) {
  const tags: KeyValuePair[] = [];
  if (!aws) {
    return tags;
  }
  /**
   * see https://docs.aws.amazon.com/xray/latest/devguide/xray-api-segmentdocuments.html#api-segmentdocuments-aws
   * for possible values on aws property
   */
  const awsKeys = ['ec2', 'ecs', 'elastic_beanstalk', 'region'];
  awsKeys.forEach(key => {
    if (aws[key]) {
      if (isPlainObject(aws[key])) {
        tags.push(...segmentToTag(aws[key]));
      } else {
        tags.push({ key, value: aws[key], type: 'string' });
      }
    }
  });
  return tags;
}

function gatherProcesses(segments: XrayTraceDataSegment[]): Record<string, Process> {
  const processes = segments.map(segment => {
    const tags: KeyValuePair[] = [{ key: 'name', value: segment.Document.name, type: 'string' }];
    tags.push(...getTagsFromAws(segment.Document.aws));
    if (segment.Document.http?.request?.url) {
      const url = new URL(segment.Document.http.request.url);
      tags.push({ key: 'hostname', value: url.hostname, type: 'string' });
    }
    return {
      serviceName: segment.Document.name,
      id: segment.Document.parent_id || segment.Document.id,
      tags,
    };
  });

  return keyBy(processes, 'id');
}

function valueToTag(key: string, value: string | number | undefined, type: string): KeyValuePair | undefined {
  if (!value || (Array.isArray(value) && !value.length)) {
    return undefined;
  }
  return {
    key,
    type,
    value,
  };
}
