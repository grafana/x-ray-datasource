import { Process, SpanData, TraceData } from '@grafana/data';
import { XrayTraceData, XrayTraceDataSegment } from 'types';
import { keyBy } from 'lodash';

/**
 * Transforms response to format similar to Jaegers as we use Jaeger ui on the frontend.
 */
export function transformResponse(data: XrayTraceData): TraceData & { spans: SpanData[] } {
  return {
    processes: gatherProcesses(data.Segments),
    traceID: data.Id,
    spans: data.Segments.map(segment => transformSegment(segment, data.Duration)),
    warnings: null,
  };
}

function transformSegment(segment: XrayTraceDataSegment, duration: number): SpanData {
  const jaegerSpan: SpanData = {
    duration,
    flags: 1,
    logs: [],
    operationName: segment.Document.name,
    processID: segment.Document.origin || segment.Id,
    startTime: segment.Document.start_time,
    spanID: segment.Id,
    traceID: segment.Document.trace_id,
    warnings: null,
    tags: undefined,
    references: undefined,
  };

  return jaegerSpan;
}

function gatherProcesses(segments: XrayTraceDataSegment[]): Record<string, Process> {
  const processes = segments.map(segment => ({ serviceName: segment.Document.origin || segment.Id, tags: [] }));
  return keyBy(processes, 'serviceName');
}
