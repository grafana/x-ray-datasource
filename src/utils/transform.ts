import { TraceProcess, TraceSpanData, TraceData, TraceSpanReference, TraceKeyValuePair } from '@grafana/data';
import { XrayTraceData, XrayTraceDataSegment, XrayTraceDataSegmentDocument, AWS } from 'types';
import { keyBy, isPlainObject } from 'lodash';
import { flatten } from './flatten';

const MS_MULTIPLIER = 1000000;

/**
 * Transforms response to format similar to Jaegers as we use Jaeger ui on the frontend.
 */
export function transformResponse(data: XrayTraceData): TraceData & { spans: TraceSpanData[] } {
  let subSegmentSpans: TraceSpanData[] = [];
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

function transformSegment(segment: XrayTraceDataSegmentDocument, parentId?: string): TraceSpanData {
  let references: TraceSpanReference[] = [];
  if (parentId) {
    references.push({ refType: 'CHILD_OF', spanID: parentId, traceID: segment.trace_id });
  }
  const jaegerSpan: TraceSpanData = {
    duration: segment.end_time * MS_MULTIPLIER - segment.start_time * MS_MULTIPLIER,
    flags: 1,
    logs: [],
    operationName: getOperationName(segment),
    processID: segment.parent_id || segment.id,
    startTime: segment.start_time * MS_MULTIPLIER,
    spanID: segment.id,
    traceID: segment.trace_id,
    stackTraces: getStackTrace(segment),
    tags: getTagsForSpan(segment),
    references,
    errorIconColor: getIconColor(segment),
  };

  return jaegerSpan;
}

function getIconColor(segment: XrayTraceDataSegmentDocument) {
  if (segment.error) {
    return '#FFC46E';
  }

  if (segment.throttle) {
    return 'mediumpurple';
  }
  // Throttle should be red so we don't want to set it because it is the default color.
  return undefined;
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

function getStackTrace(segment: XrayTraceDataSegmentDocument) {
  if (!segment.cause) {
    return undefined;
  }
  const stackTraces: string[] = [];
  segment.cause.exceptions.forEach(exception => {
    let stackTrace = `${exception.type}: ${exception.message}\n`;
    exception.stack.forEach(stack => {
      stackTrace = stackTrace.concat(`at ${stack.label} (${stack.path}:${stack.line})\n`);
    });
    stackTraces.push(stackTrace);
  });
  return stackTraces;
}

function getTagsForSpan(segment: XrayTraceDataSegmentDocument) {
  const tags = [...segmentToTag(segment.aws), ...segmentToTag(segment.http)];

  if (segment.error) {
    tags.push({ key: 'error', value: segment.error, type: 'boolean' });
  }

  return tags;
}

function segmentToTag(segment: any | undefined) {
  const result: TraceKeyValuePair[] = [];
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
  const tags: TraceKeyValuePair[] = [];
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

function gatherProcesses(segments: XrayTraceDataSegment[]): Record<string, TraceProcess> {
  const processes = segments.map(segment => createProcessFromSegment(segment.Document));
  segments.forEach(segment => {
    getSubSegments(segment.Document, subSegment => {
      processes.push(createProcessFromSegment(subSegment));
    });
  });
  return keyBy(processes, 'id');
}

function createProcessFromSegment(segment: XrayTraceDataSegmentDocument) {
  const tags: TraceKeyValuePair[] = [{ key: 'name', value: segment.name, type: 'string' }];
  tags.push(...getTagsFromAws(segment.aws));
  if (segment.http?.request?.url) {
    const url = new URL(segment.http.request.url);
    tags.push({ key: 'hostname', value: url.hostname, type: 'string' });
  }
  return {
    serviceName: segment.name,
    id: segment.parent_id || segment.id,
    tags,
  };
}

function valueToTag(key: string, value: string | number | undefined, type: string): TraceKeyValuePair | undefined {
  if (!value || (Array.isArray(value) && !value.length)) {
    return undefined;
  }
  return {
    key,
    type,
    value,
  };
}
