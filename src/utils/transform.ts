import {
  TraceSpanRow,
  TraceKeyValuePair,
  DataFrame,
  FieldType,
  MutableDataFrame,
  FieldColorModeId,
  NodeGraphDataFrameFieldNames,
  Field,
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
import { isPlainObject } from 'lodash';
import { flatten } from './flatten';

const MS_MULTIPLIER = 1000;

/**
 * Transforms response to format used by Grafana.
 */
export function transformTraceResponse(data: XrayTraceData): DataFrame {
  const subSegmentSpans: TraceSpanRow[] = [];
  // parentSpans are artificial spans used to group services that has the same name to mimic how the traces look
  // in X-ray console.
  const parentSpans: TraceSpanRow[] = [];

  const segmentSpans = data.Segments.map((segment) => {
    const [serviceName, serviceTags] = getProcess(segment);
    getSubSegments(segment.Document, (subSegment, segmentParent) => {
      subSegmentSpans.push(transformSegmentDocument(subSegment, serviceName, serviceTags, segmentParent.id));
    });

    let parentSpan = parentSpans.find((ps) => ps.spanID === segment.Document.name + segment.Document.origin);

    if (!parentSpan) {
      parentSpan = {
        // TODO: maybe the duration should be the min(startTime) - max(endTime) of all child spans
        duration: 0,
        logs: [],
        operationName: segment.Document.origin ?? segment.Document.name,
        serviceName,
        serviceTags,
        spanID: segment.Document.name + segment.Document.origin,
        startTime: segment.Document.start_time * MS_MULTIPLIER,
        traceID: segment.Document.trace_id || '',
        parentSpanID: undefined,
      };
      parentSpans.push(parentSpan);
    }

    return transformSegmentDocument(segment.Document, serviceName, serviceTags, parentSpan.spanID);
  });

  const frame = new MutableDataFrame({
    fields: [
      { name: 'traceID', type: FieldType.string },
      { name: 'spanID', type: FieldType.string },
      { name: 'parentSpanID', type: FieldType.string },
      { name: 'operationName', type: FieldType.string },
      { name: 'serviceName', type: FieldType.string },
      { name: 'serviceTags', type: FieldType.other },
      { name: 'startTime', type: FieldType.number },
      { name: 'duration', type: FieldType.number },
      { name: 'logs', type: FieldType.other },
      { name: 'tags', type: FieldType.other },
      { name: 'warnings', type: FieldType.other },
      { name: 'stackTraces', type: FieldType.other },
      { name: 'errorIconColor', type: FieldType.string },
    ],
    meta: {
      preferredVisualisationType: 'trace',
    },
  });

  for (const span of [...parentSpans, ...segmentSpans, ...subSegmentSpans]) {
    frame.add(span);
  }

  return frame;
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

function transformSegmentDocument(
  document: XrayTraceDataSegmentDocument,
  serviceName: string,
  serviceTags: TraceKeyValuePair[],
  parentId?: string
): TraceSpanRow {
  const duration = document.end_time ? document.end_time * MS_MULTIPLIER - document.start_time * MS_MULTIPLIER : 0;
  return {
    traceID: document.trace_id || '',
    spanID: document.id,
    parentSpanID: parentId,
    duration,
    logs: [],
    operationName: document.name,
    serviceName,
    serviceTags,
    startTime: document.start_time * MS_MULTIPLIER,
    stackTraces: getStackTrace(document),
    tags: getTagsForSpan(document),
    errorIconColor: getIconColor(document),
  };
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
    ...segmentToTag({ sql: segment.sql }),
    { key: 'in progress', value: Boolean(segment.in_progress) },
  ];

  if (segment.origin) {
    tags.push({ key: 'origin', value: segment.origin });
  }

  const isError = segment.error || segment.fault || segment.throttle;

  if (isError) {
    tags.push({ key: 'error', value: true });
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
    const tag = valueToTag(key, flattenedObject[key]);
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
        tags.push({ key, value: aws[key] });
      }
    }
  });
  return tags;
}

function getProcess(segment: XrayTraceDataSegment): [string, TraceKeyValuePair[]] {
  const tags: TraceKeyValuePair[] = [{ key: 'name', value: segment.Document.name }];
  tags.push(...getTagsFromAws(segment.Document.aws));
  if (segment.Document.http?.request?.url) {
    try {
      const url = new URL(segment.Document.http.request.url);
      tags.push({ key: 'hostname', value: url.hostname });
    } catch (e) {
      // just skip, sometimes the url may not be a full url just a path and so there is no hostname to extract.
    }
  }
  return [segment.Document.name, tags];
}

function valueToTag(key: string, value: string | number | undefined): TraceKeyValuePair | undefined {
  if (!value || (Array.isArray(value) && !value.length)) {
    return undefined;
  }
  return {
    key,
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

  const idField: Field<number> = {
    name: NodeGraphDataFrameFieldNames.id,
    type: FieldType.string,
    values: [],
    config: {},
  };
  const titleField: Field<string> = {
    name: NodeGraphDataFrameFieldNames.title,
    type: FieldType.string,
    values: [],
    config: { displayName: 'Name' },
  };

  const typeField: Field<string> = {
    name: NodeGraphDataFrameFieldNames.subTitle,
    type: FieldType.string,
    values: [],
    config: { displayName: 'Type' },
  };

  const mainStatField: Field<number> = {
    name: NodeGraphDataFrameFieldNames.mainStat,
    type: FieldType.number,
    values: [],
    config: { unit: 'ms/t', displayName: 'Average response time' },
  };

  const secondaryStatField: Field<string | number | undefined> = showRequestCounts
    ? {
        name: NodeGraphDataFrameFieldNames.secondaryStat,
        type: FieldType.string,
        values: [],
        config: { displayName: 'Requests count' },
      }
    : {
        name: NodeGraphDataFrameFieldNames.secondaryStat,
        type: FieldType.number,
        values: [],
        config: { unit: 't/min', displayName: 'Transactions per minute' },
      };

  const successField: Field<number> = {
    name: NodeGraphDataFrameFieldNames.arc + 'success',
    type: FieldType.number,
    values: [],
    config: { color: { fixedColor: 'green', mode: FieldColorModeId.Fixed }, displayName: 'Success' },
  };

  const errorsField: Field<number> = {
    name: NodeGraphDataFrameFieldNames.arc + 'errors',
    type: FieldType.number,
    values: [],
    config: { color: { fixedColor: 'semi-dark-yellow', mode: FieldColorModeId.Fixed }, displayName: 'Error' },
  };

  const faultsField: Field<number> = {
    name: NodeGraphDataFrameFieldNames.arc + 'faults',
    type: FieldType.number,
    values: [],
    config: { color: { fixedColor: 'red', mode: FieldColorModeId.Fixed }, displayName: 'Fault' },
  };

  const throttledField: Field<number> = {
    name: NodeGraphDataFrameFieldNames.arc + 'throttled',
    type: FieldType.number,
    values: [],
    config: { color: { fixedColor: 'purple', mode: FieldColorModeId.Fixed }, displayName: 'Throttled' },
  };

  const edgeIdField: Field<string> = {
    name: NodeGraphDataFrameFieldNames.id,
    type: FieldType.string,
    values: [],
    config: {},
  };
  const edgeSourceField: Field<number> = {
    name: NodeGraphDataFrameFieldNames.source,
    type: FieldType.string,
    values: [],
    config: {},
  };
  const edgeTargetField: Field<number> = {
    name: NodeGraphDataFrameFieldNames.target,
    type: FieldType.string,
    values: [],
    config: {},
  };

  // These are needed for links to work
  const edgeSourceNameField: Field<string> = {
    name: 'sourceName',
    type: FieldType.string,
    values: [],
    config: {},
  };
  const edgeTargetNameField: Field<string> = {
    name: 'targetName',
    type: FieldType.string,
    values: [],
    config: {},
  };

  // This has to be different a bit because we put different percentages here and want specific prefix based on which
  // value we put in. So it can be success for one row but errors for second. We can only do that if we send it as a
  // string.
  const edgeMainStatField: Field<string> = {
    name: NodeGraphDataFrameFieldNames.mainStat,
    type: FieldType.string,
    values: [],
    config: { displayName: 'Response percentage' },
  };

  const edgeSecondaryStatField: Field<string | number | undefined> = showRequestCounts
    ? {
        name: NodeGraphDataFrameFieldNames.secondaryStat,
        type: FieldType.string,
        values: [],
        config: { displayName: 'Requests count' },
      }
    : {
        name: NodeGraphDataFrameFieldNames.secondaryStat,
        type: FieldType.number,
        values: [],
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
    idField.values.push(service.ReferenceId);
    titleField.values.push(service.Name);
    typeField.values.push(service.Type);
    mainStatField.values.push(avgResponseTime(stats));

    if (showRequestCounts) {
      const count = statsSource.ResponseTimeHistogram.reduce((acc, h) => acc + h.Count, 0);
      secondaryStatField.values.push(count + ' Request' + (count > 1 ? 's' : ''));
    } else {
      secondaryStatField.values.push(
        service.SummaryStatistics
          ? tracesPerMinute(stats, service.StartTime, service.EndTime)
          : // For root nodes we compute stats from it's edge
            tracesPerMinute(stats, service.Edges[0].StartTime, service.Edges[0].EndTime)
      );
    }
    successField.values.push(successPercentage(stats));
    errorsField.values.push(errorsPercentage(stats));
    faultsField.values.push(faultsPercentage(stats));
    throttledField.values.push(throttledPercentage(stats));

    servicesMap[service.ReferenceId] = service;
    edges.push(...service.Edges.map((e) => ({ edge: e, source: service })));
  }

  for (const edgeData of edges) {
    const { edge, source } = edgeData;
    const target = servicesMap[edge.ReferenceId];
    // when filtering results by account id, not every target/source will always be returned
    // if this is the case, there's no need to render an edge
    if (!target) {
      continue;
    }
    edgeIdField.values.push(source.ReferenceId + '__' + target.ReferenceId);
    edgeSourceField.values.push(source.ReferenceId);
    edgeTargetField.values.push(edge.ReferenceId);
    edgeSourceNameField.values.push(source.Name);
    edgeTargetNameField.values.push(target.Name);

    const stats = edge.SummaryStatistics;

    const success = successPercentage(edge.SummaryStatistics);
    if (success === 1) {
      edgeMainStatField.values.push(`Success ${(success * 100).toFixed(2)}%`);
    } else {
      const firstNonZero = (
        [
          [faultsPercentage(stats), 'Faults'],
          [errorsPercentage(stats), 'Errors'],
          [throttledPercentage(stats), 'Throttled'],
        ] as Array<[number, string]>
      ).find((v) => v[0] !== 0);
      if (!firstNonZero) {
        edgeMainStatField.values.push(`N/A`);
      } else {
        edgeMainStatField.values.push(`${firstNonZero[1]} ${(firstNonZero[0] * 100).toFixed(2)}%`);
      }
    }

    if (showRequestCounts) {
      const count = edge.ResponseTimeHistogram.reduce((acc, h) => acc + h.Count, 0);
      edgeSecondaryStatField.values.push(count + ' Request' + (count > 1 ? 's' : ''));
    } else {
      edgeSecondaryStatField.values.push(tracesPerMinute(edge.SummaryStatistics, edge.StartTime, edge.EndTime));
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
  if (!statistics.TotalResponseTime || !statistics.TotalCount) {
    return 0;
  }
  return (statistics.TotalResponseTime / statistics.TotalCount) * 1000;
}

export function tracesPerMinute(statistics: SummaryStatistics, startTime: number | string, endTime: number | string) {
  if (!statistics.TotalCount) {
    return undefined;
  }
  return endTime && startTime ? statistics.TotalCount / ((toMs(endTime) - toMs(startTime)) / (60 * 1000)) : undefined;
}

export function successPercentage(statistics: SummaryStatistics) {
  if (!statistics.OkCount || !statistics.TotalCount) {
    return 0;
  }
  return statistics.OkCount / statistics.TotalCount;
}

export function throttledPercentage(statistics: SummaryStatistics) {
  if (!statistics.ErrorStatistics || !statistics.TotalCount) {
    return 0;
  }
  return statistics.ErrorStatistics.ThrottleCount / statistics.TotalCount;
}

export function errorsPercentage(statistics: SummaryStatistics) {
  if (!statistics.ErrorStatistics || !statistics.TotalCount) {
    return 0;
  }
  return (statistics.ErrorStatistics.TotalCount - statistics.ErrorStatistics.ThrottleCount) / statistics.TotalCount;
}

export function faultsPercentage(statistics: SummaryStatistics) {
  if (!statistics.FaultStatistics || !statistics.TotalCount) {
    return 0;
  }
  return statistics.FaultStatistics.TotalCount / statistics.TotalCount;
}

function toMs(time: number | string): number {
  if (typeof time === 'number') {
    return time * 1000;
  } else {
    return new Date(time).valueOf();
  }
}
