import { Process, SpanData, TraceData, SpanReference, KeyValuePair } from '@grafana/data';
import { XrayTraceData, XrayTraceDataSegment, XrayTraceDataSegmentDocument } from 'types';
import { keyBy } from 'lodash';

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
    operationName: segment.origin ?? '',
    processID: segment.parent_id || segment.id,
    startTime: segment.start_time * MS_MULTIPLIER,
    spanID: segment.id,
    traceID: segment.trace_id,
    warnings: null,
    tags: undefined,
    references,
  };

  return jaegerSpan;
}

function gatherProcesses(segments: XrayTraceDataSegment[]): Record<string, Process> {
  const processes = segments.map(segmentToService);
  return keyBy(processes, 'id');
}

function segmentToService(segment: XrayTraceDataSegment) {
  const awsTags: KeyValuePair[] = [];
  // const httpTags = [];

  if (segment.Document.aws) {
    Object.keys(segment.Document.aws).map(awsKey => {
      const tag = valueToTag(awsKey, segment.Document.aws![awsKey], 'string');
      if (tag) {
        awsTags.push(tag);
      }
    });
  }

  return {
    serviceName: segment.Document.name,
    id: segment.Document.parent_id || segment.Document.id,
    tags: awsTags,
  };
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
