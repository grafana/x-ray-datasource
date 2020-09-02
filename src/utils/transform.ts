import { TraceProcess, TraceSpanData, TraceData, TraceSpanReference, TraceKeyValuePair } from '@grafana/data';
import { XrayTraceData, XrayTraceDataSegment, XrayTraceDataSegmentDocument, AWS } from 'types';
import { keyBy, isPlainObject } from 'lodash';
import { flatten } from './flatten';

const MS_MULTIPLIER = 1000000;

/**
 * Transforms response to format similar to Jaegers as we use Jaeger ui on the frontend.
 */
export function transformResponse(data: XrayTraceData): TraceData & { spans: TraceSpanData[] } {
  const processes = gatherProcesses(data.Segments);

  const subSegmentSpans: TraceSpanData[] = [];
  // parentSpans is used to group services that has the same name
  const parentSpans: TraceSpanData[] = [];
  const segmentSpans = data.Segments.map(segment => {
    let subSegmentProcessId = segment.Document.name;
    getSubSegments(segment.Document, (subSegment, segmentParent) => {
      subSegmentProcessId = processes[subSegment.name]?.serviceName ?? subSegmentProcessId;
      subSegmentSpans.push(transformSegment(subSegment, subSegmentProcessId, segmentParent.id));
    });

    let parentSpan = parentSpans.find(ps => ps.spanID === segment.Document.name + segment.Document.origin);

    if (!parentSpan) {
      parentSpan = {
        duration: 0,
        flags: 1,
        logs: [],
        operationName: segment.Document.origin ?? segment.Document.name,
        processID: segment.Document.name,
        spanID: segment.Document.name + segment.Document.origin,
        startTime: segment.Document.start_time * MS_MULTIPLIER,
        traceID: segment.Document.trace_id,
      };
      parentSpans.push(parentSpan);
    }

    return transformSegment(segment.Document, segment.Document.name, parentSpan.spanID);
  });

  return {
    processes,
    traceID: data.Id,
    spans: [...subSegmentSpans, ...segmentSpans, ...parentSpans],
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

function transformSegment(segment: XrayTraceDataSegmentDocument, processID: string, parentId?: string): TraceSpanData {
  let references: TraceSpanReference[] = [];
  if (parentId) {
    references.push({ refType: 'CHILD_OF', spanID: parentId, traceID: segment.trace_id });
  }
  const duration = segment.end_time ? segment.end_time * MS_MULTIPLIER - segment.start_time * MS_MULTIPLIER : 0;
  const jaegerSpan: TraceSpanData = {
    duration,
    flags: 1,
    logs: [],
    operationName: segment.name,
    processID,
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
  // Fault should be red so we don't want to set it because it is the default color.
  return undefined;
}

function getStackTrace(segment: XrayTraceDataSegmentDocument) {
  if (!segment.cause?.exceptions) {
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
  const tags = [
    ...segmentToTag({ aws: segment.aws }),
    ...segmentToTag({ http: segment.http }),
    ...segmentToTag({ annotations: segment.annotations }),
    ...segmentToTag({ metadata: segment.metadata }),
  ];

  const isError = segment.error || segment.fault || segment.throttle;

  if (isError) {
    tags.push({ key: 'error', value: true, type: 'boolean' });
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
  const processes = segments.map(segment => {
    const tags: TraceKeyValuePair[] = [{ key: 'name', value: segment.Document.name, type: 'string' }];
    tags.push(...getTagsFromAws(segment.Document.aws));
    if (segment.Document.http?.request?.url) {
      const url = new URL(segment.Document.http.request.url);
      tags.push({ key: 'hostname', value: url.hostname, type: 'string' });
    }
    return {
      serviceName: segment.Document.name,
      tags,
    };
  });
  return keyBy(processes, 'serviceName');
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
