import {
  TraceProcess,
  TraceSpanData,
  TraceData,
  TraceSpanReference,
  TraceKeyValuePair,
  DataFrame,
  FieldType,
  ArrayVector,
  MutableDataFrame,
  FieldColorModeId,
} from '@grafana/data';
import {
  XrayTraceData,
  XrayTraceDataSegment,
  XrayTraceDataSegmentDocument,
  AWS,
  SummaryStatistics,
  XrayService,
  XrayQuery,
  XrayEdge,
} from 'types';
import { keyBy, isPlainObject } from 'lodash';
import { NodeGraphDataFrameFieldNames } from '@grafana/ui';
import { flatten } from './flatten';

const MS_MULTIPLIER = 1000000;

/**
 * Transforms response to format similar to Jaegers as we use Jaeger ui on the frontend.
 */
export function transformTraceResponse(data: XrayTraceData): TraceData & { spans: TraceSpanData[] } {
  const processes = gatherProcesses(data.Segments);

  const subSegmentSpans: TraceSpanData[] = [];
  // parentSpans is used to group services that has the same name
  const parentSpans: TraceSpanData[] = [];
  const segmentSpans = data.Segments.map((segment) => {
    let subSegmentProcessId = segment.Document.name;
    getSubSegments(segment.Document, (subSegment, segmentParent) => {
      subSegmentProcessId = processes[subSegment.name]?.serviceName ?? subSegmentProcessId;
      subSegmentSpans.push(transformSegment(subSegment, subSegmentProcessId, segmentParent.id));
    });

    let parentSpan = parentSpans.find((ps) => ps.spanID === segment.Document.name + segment.Document.origin);

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
    segment.subsegments.forEach((subSegment) => {
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

function getStackTrace(segment: XrayTraceDataSegmentDocument): string[] | undefined {
  if (!segment.cause?.exceptions) {
    return undefined;
  }
  const stackTraces: string[] = [];
  segment.cause.exceptions.forEach((exception) => {
    let stackTrace = `${exception.type}: ${exception.message}`;
    exception.stack?.forEach((stack) => {
      stackTrace = stackTrace.concat(`\nat ${stack.label} (${stack.path}:${stack.line})`);
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
    { key: 'in progress', value: Boolean(segment.in_progress), type: 'boolean' },
  ];

  if (segment.origin) {
    tags.push({ key: 'origin', value: segment.origin, type: 'string' });
  }

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
  Object.keys(flattenedObject).map((key) => {
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
  awsKeys.forEach((key) => {
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
  const processes = segments.map((segment) => {
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

/**
 * Get data frame to be shown in NodeGraph in Grafana with all the required stats. As we process both service map
 * requests and trace graph requests here you have to set whether to show traces per minute stat or request count as
 * trace graph cannot compute traces pre minute.
 */
export function parseGraphResponse(response: DataFrame, query?: XrayQuery, options?: { showRequestCounts: boolean }) {
  // Again assuming this will be single field with single value which will be the trace data blob
  const services: XrayService[] = response.fields[0].values.toArray().map((serviceJson) => {
    return JSON.parse(serviceJson);
  });

  const showRequestCounts = options?.showRequestCounts ?? false;

  const idField = {
    name: NodeGraphDataFrameFieldNames.id,
    type: FieldType.string,
    values: new ArrayVector(),
  };
  const titleField = {
    name: NodeGraphDataFrameFieldNames.title,
    type: FieldType.string,
    values: new ArrayVector(),
    config: { displayName: 'Name' },
  };

  const typeField = {
    name: NodeGraphDataFrameFieldNames.subTitle,
    type: FieldType.string,
    values: new ArrayVector(),
    config: { displayName: 'Type' },
  };

  const mainStatField = {
    name: NodeGraphDataFrameFieldNames.mainStat,
    type: FieldType.number,
    values: new ArrayVector(),
    config: { unit: 'ms/t', displayName: 'Average response time' },
  };

  const secondaryStatField = showRequestCounts
    ? {
        name: NodeGraphDataFrameFieldNames.secondaryStat,
        type: FieldType.string,
        values: new ArrayVector(),
        config: { displayName: 'Requests count' },
      }
    : {
        name: NodeGraphDataFrameFieldNames.secondaryStat,
        type: FieldType.number,
        values: new ArrayVector(),
        config: { unit: 't/min', displayName: 'Transactions per minute' },
      };

  const successField = {
    name: NodeGraphDataFrameFieldNames.arc + 'success',
    type: FieldType.number,
    values: new ArrayVector(),
    config: { color: { fixedColor: 'green', mode: FieldColorModeId.Fixed } },
  };

  const errorsField = {
    name: NodeGraphDataFrameFieldNames.arc + 'errors',
    type: FieldType.number,
    values: new ArrayVector(),
    config: { color: { fixedColor: 'semi-dark-yellow', mode: FieldColorModeId.Fixed } },
  };

  const faultsField = {
    name: NodeGraphDataFrameFieldNames.arc + 'faults',
    type: FieldType.number,
    values: new ArrayVector(),
    config: { color: { fixedColor: 'red', mode: FieldColorModeId.Fixed } },
  };

  const throttledField = {
    name: NodeGraphDataFrameFieldNames.arc + 'throttled',
    type: FieldType.number,
    values: new ArrayVector(),
    config: { color: { fixedColor: 'purple', mode: FieldColorModeId.Fixed } },
  };

  const edgeIdField = {
    name: NodeGraphDataFrameFieldNames.id,
    type: FieldType.string,
    values: new ArrayVector(),
  };
  const edgeSourceField = {
    name: NodeGraphDataFrameFieldNames.source,
    type: FieldType.string,
    values: new ArrayVector(),
  };
  const edgeTargetField = {
    name: NodeGraphDataFrameFieldNames.target,
    type: FieldType.string,
    values: new ArrayVector(),
  };

  // These are needed for links to work
  const edgeSourceNameField = {
    name: 'sourceName',
    type: FieldType.string,
    values: new ArrayVector(),
  };
  const edgeTargetNameField = {
    name: 'targetName',
    type: FieldType.string,
    values: new ArrayVector(),
  };

  // This has to be different a bit because we put different percentages here and want specific prefix based on which
  // value we put in. So it can be success for one row but errors for second. We can only do that if we send it as a
  // string.
  const edgeMainStatField = {
    name: NodeGraphDataFrameFieldNames.mainStat,
    type: FieldType.string,
    values: new ArrayVector(),
    config: { displayName: 'Response percentage' },
  };

  const edgeSecondaryStatField = showRequestCounts
    ? {
        name: NodeGraphDataFrameFieldNames.secondaryStat,
        type: FieldType.string,
        values: new ArrayVector(),
        config: { displayName: 'Requests count' },
      }
    : {
        name: NodeGraphDataFrameFieldNames.secondaryStat,
        type: FieldType.number,
        values: new ArrayVector(),
        config: { unit: 't/min', displayName: 'Transactions per minute' },
      };

  const servicesMap: { [refId: number]: XrayService } = {};
  const edges: Array<{
    edge: XrayEdge;
    source: XrayService;
  }> = [];

  for (const service of services) {
    const statsSource = service.SummaryStatistics ? service : service.Edges[0];
    const stats = statsSource.SummaryStatistics;

    idField.values.add(service.ReferenceId);
    titleField.values.add(service.Name);
    typeField.values.add(service.Type);
    mainStatField.values.add(avgResponseTime(stats));

    if (showRequestCounts) {
      const count = statsSource.ResponseTimeHistogram.reduce((acc, h) => acc + h.Count, 0);
      secondaryStatField.values.add(count + ' Request' + (count > 1 ? 's' : ''));
    } else {
      secondaryStatField.values.add(
        service.SummaryStatistics
          ? tracesPerMinute(stats, service.StartTime, service.EndTime)
          : // For root nodes we compute stats from it's edge
            tracesPerMinute(stats, service.Edges[0].StartTime, service.Edges[0].EndTime)
      );
    }
    successField.values.add(successPercentage(stats));
    errorsField.values.add(errorsPercentage(stats));
    faultsField.values.add(faultsPercentage(stats));
    throttledField.values.add(throttledPercentage(stats));

    servicesMap[service.ReferenceId] = service;
    edges.push(...service.Edges.map((e) => ({ edge: e, source: service })));
  }

  for (const edgeData of edges) {
    const { edge, source } = edgeData;
    const target = servicesMap[edge.ReferenceId];
    edgeIdField.values.add(source.ReferenceId + '__' + target.ReferenceId);
    edgeSourceField.values.add(source.ReferenceId);
    edgeTargetField.values.add(edge.ReferenceId);
    edgeSourceNameField.values.add(source.Name);
    edgeTargetNameField.values.add(target.Name);

    const stats = edge.SummaryStatistics;

    const success = successPercentage(edge.SummaryStatistics);
    if (success === 1) {
      edgeMainStatField.values.add(`Success ${(success * 100).toFixed(2)}%`);
    } else {
      const firstNonZero = ([
        [faultsPercentage(stats), 'Faults'],
        [errorsPercentage(stats), 'Errors'],
        [throttledPercentage(stats), 'Throttled'],
      ] as Array<[number, string]>).find((v) => v[0] !== 0);
      if (!firstNonZero) {
        edgeMainStatField.values.add(`N/A`);
      } else {
        edgeMainStatField.values.add(`${firstNonZero[1]} ${(firstNonZero[0] * 100).toFixed(2)}%`);
      }
    }

    if (showRequestCounts) {
      const count = edge.ResponseTimeHistogram.reduce((acc, h) => acc + h.Count, 0);
      edgeSecondaryStatField.values.add(count + ' Request' + (count > 1 ? 's' : ''));
    } else {
      edgeSecondaryStatField.values.add(tracesPerMinute(edge.SummaryStatistics, edge.StartTime, edge.EndTime));
    }
  }

  return [
    new MutableDataFrame({
      name: 'nodes',
      refId: query?.refId,
      fields: [
        idField,
        titleField,
        typeField,
        mainStatField,
        secondaryStatField,
        successField,
        faultsField,
        errorsField,
        throttledField,
      ],
      meta: {
        preferredVisualisationType: 'nodeGraph',
      },
    }),
    new MutableDataFrame({
      name: 'edges',
      refId: query?.refId,
      fields: [
        edgeIdField,
        edgeSourceField,
        edgeSourceNameField,
        edgeTargetField,
        edgeTargetNameField,
        edgeMainStatField,
        edgeSecondaryStatField,
      ],
      meta: {
        preferredVisualisationType: 'nodeGraph',
      },
    }),
  ];
}

export function avgResponseTime(statistics: SummaryStatistics) {
  return (statistics.TotalResponseTime / statistics.TotalCount) * 1000;
}

export function tracesPerMinute(statistics: SummaryStatistics, startTime: number | string, endTime: number | string) {
  return endTime && startTime ? statistics.TotalCount / ((toMs(endTime) - toMs(startTime)) / (60 * 1000)) : undefined;
}

export function successPercentage(statistics: SummaryStatistics) {
  return statistics.OkCount / statistics.TotalCount;
}

export function throttledPercentage(statistics: SummaryStatistics) {
  return statistics.ErrorStatistics.ThrottleCount / statistics.TotalCount;
}

export function errorsPercentage(statistics: SummaryStatistics) {
  return (statistics.ErrorStatistics.TotalCount - statistics.ErrorStatistics.ThrottleCount) / statistics.TotalCount;
}

export function faultsPercentage(statistics: SummaryStatistics) {
  return statistics.FaultStatistics.TotalCount / statistics.TotalCount;
}

function toMs(time: number | string): number {
  if (typeof time === 'number') {
    return time * 1000;
  } else {
    return new Date(time).valueOf();
  }
}
