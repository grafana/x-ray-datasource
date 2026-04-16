---
aliases:
  - ../query-editor/
description: Use the AWS Application Signals query editor in Grafana to explore X-Ray traces, service maps, insights, and Application Signals services, operations, dependencies, and SLOs.
keywords:
  - grafana
  - aws
  - application signals
  - x-ray
  - query editor
  - traces
  - service map
  - insights
  - slo
labels:
  products:
    - cloud
    - enterprise
    - oss
menuTitle: Query editor
title: AWS Application Signals query editor
weight: 300
review_date: 2026-04-16
---

# AWS Application Signals query editor

This document explains how to use the AWS Application Signals query editor to explore X-Ray traces and Application Signals services.

## Before you begin

- [Configure the AWS Application Signals data source](https://grafana.com/docs/plugins/grafana-x-ray-datasource/latest/configure/).
- Verify that your IAM identity has read access to X-Ray and Application Signals. See the [IAM policy](https://grafana.com/docs/plugins/grafana-x-ray-datasource/latest/configure/#iam-policy).
- Make sure your dashboard time range contains trace data.

## Key concepts

| Term | Description |
|------|-------------|
| **Trace** | The end-to-end record of a request as it passes through services and resources in your application. |
| **Trace ID** | A unique identifier for a trace. Pasting a trace ID into the query field opens that trace directly. |
| **Segment** | A unit of work within a trace. Each service a request touches creates one or more segments. |
| **Annotation** | A key-value pair attached to a segment that you can filter on with X-Ray filter expressions. |
| **Filter expression** | A query language used by X-Ray to narrow down which traces are returned. Refer to the [AWS X-Ray filter expressions documentation](https://docs.aws.amazon.com/xray/latest/devguide/xray-console-filters.html). |
| **Group** | A named, reusable filter expression defined in X-Ray that narrows the scope of Trace queries. |
| **Service map** | A visual representation of how services and resources in your application interact, including latency and error rates. |
| **Insight** | A correlated set of anomalies in trace data that X-Ray surfaces automatically. |
| **Service** | An Application Signals entity that represents a monitored component of your application. |
| **Service operation** | An individual operation exposed by a service, such as an HTTP endpoint. |
| **Service dependency** | Another service that a service calls downstream. |
| **SLO** | A service-level objective defined in Application Signals that tracks performance against a target. |
| **Account ID** | The AWS account ID that owns a given trace or resource. Used for cross-account filtering. |

## Query modes

The query editor header lets you choose between two modes:

- **Traces:** Query X-Ray traces, trace statistics, analytics, insights, and the service map.
- **Services:** Query Application Signals services, operations, dependencies, and SLOs.

The header also includes a **Region** drop-down that overrides the data source default region for the current query.

## Trace queries

The Traces mode supports the following query types. Select a query type from the cascader in the query row.

### Trace list

Use Trace list to search for traces matching a filter expression. Results are shown in a table; clicking the trace ID in the first column opens the trace view.

You can enter:

- A single trace ID to open that trace directly.
- A [filter expression](https://docs.aws.amazon.com/xray/latest/devguide/xray-console-filters.html) such as `service("frontend") { fault = true }`.
- A leading `#` followed by a group name to scope the query to an X-Ray group.

{{< admonition type="caution" >}}
Trace list results are capped at the first 1000 traces returned by the X-Ray API. If you need more data, narrow the time range or add filters to make the result set more specific.
{{< /admonition >}}

### Trace statistics

Trace statistics returns a time-series graph and table of error, fault, throttle, success, and total counts. Use it for numeric dashboards and alerts.

The following fields are available:

| Field | Description |
|-------|-------------|
| **Query** | An X-Ray filter expression that narrows the trace population. |
| **Group** | An optional X-Ray group to apply. |
| **Resolution** | Time bucket granularity: **Auto**, **60s**, or **300s**. Auto chooses the value appropriate for the current time range. |
| **Columns** | A multi-select of which statistic columns to return. Leave empty to return all columns. |

### Trace analytics

Trace analytics surfaces the most common response-time, error, and fault contributors. Choose from the following sub-types in the cascader:

- **Root Cause > Response Time**
  - **Root Cause Service** — the last service in each path
  - **Path** — multiple paths
- **Root Cause > Error**
  - **Root Cause Service**
  - **Path**
  - **Error Message**
- **Root Cause > Fault**
  - **Root Cause Service**
  - **Path**
  - **Error Message**
- **End user impact**
- **URL**
- **HTTP status code**

Each sub-type returns a table summarizing the top contributors to response time, errors, or faults in your trace data.

### Insights

Insights returns a table of correlated anomalies detected by X-Ray. Clicking the **InsightId** takes you to the AWS console.

The following fields are available:

| Field | Description |
|-------|-------------|
| **Group** | Required. The X-Ray group to scope the insights to. |
| **State** | Filter insights by state: **All**, **Active**, or **Closed**. Defaults to **All**. |

### Service map

Service map returns a graph of services and resources in your application, including latency and error rates. The map shows the same data as the Trace Map in the Application Signals console.

To display the service map:

- Use the [Node graph](https://grafana.com/docs/grafana/<GRAFANA_VERSION>/panels-visualizations/visualizations/node-graph/) panel for the visual graph.
- Use a table panel if the Node graph isn't available in your Grafana version.

Each service appears as a circle. The numbers inside show average latency per transaction and transactions per minute. The colored outer ring represents the mix of response types:

| Color | Meaning |
|-------|---------|
| Green | Success |
| Red | Fault |
| Yellow | Error |
| Purple | Throttled response |

Click a node or edge to open a context menu with links that navigate to related traces in the current data source or the Application Signals console.

For more information, refer to the [AWS X-Ray service map documentation](https://docs.aws.amazon.com/xray/latest/devguide/xray-console-servicemap.html).

## Service queries

The Services mode returns data from AWS Application Signals.

### List services

Returns a table of the services discovered in your Application Signals environment. Use this query type as a source for template variables or to audit the services being monitored.

### List service operations

Returns a table of CloudWatch metrics for the operations of a selected service.

The following fields are available:

| Field | Description |
|-------|-------------|
| **Service** | The service whose operations to list. Required. |

### List service dependencies

Returns a table of CloudWatch metrics for the dependencies of a selected service.

The following fields are available:

| Field | Description |
|-------|-------------|
| **Service** | The service whose dependencies to list. Required. |

### List service level objectives (SLOs)

Returns a table of SLOs associated with a given service operation.

The following fields are available:

| Field | Description |
|-------|-------------|
| **Service** | The service that exposes the operation. Required. |
| **Operation** | The service operation whose SLOs to list. Required. |

## Filter by account ID

When [cross-account observability](https://grafana.com/docs/plugins/grafana-x-ray-datasource/latest/configure/#cross-account-observability) is enabled on the data source, the query editor shows an account-ID control:

- **Service Map (Traces mode):** An **AccountId** multi-select that filters the returned graph to the selected accounts. The drop-down populates with account IDs discovered from traces in the current time range.
- **Services mode:** An **Include linked accounts** toggle and an **AccountId** drop-down that filters services, operations, dependencies, and SLOs by account.

You can also reference an account ID directly in a Trace list filter expression, for example:

```text
service("frontend") { account.id = "123456789012" }
```

## Use template variables in queries

The query editor interpolates Grafana template variables before queries are sent to AWS. Variables are supported in the following fields:

- Trace list and Trace statistics **Query** (filter expressions)
- **Region**
- **AccountId** and **AccountIds** selectors
- **Service** (Services mode)
- **Operation** (Services mode)

Reference variables with the standard Grafana syntax, for example `$region`, `${service}`, or `[[accountId]]`. For more information, refer to [Template variables](https://grafana.com/docs/plugins/grafana-x-ray-datasource/latest/template-variables/).

## Alerting

Because Trace Statistics queries return numeric time-series data, you can build Grafana alerts on top of them. For example, alert when the fault count on your frontend service exceeds a threshold over five minutes.

For details, refer to the [Grafana Alerting documentation](https://grafana.com/docs/grafana/<GRAFANA_VERSION>/alerting/).

## Use cases

The following use cases show how Grafana users combine the query types above in real dashboards:

- **Latency investigation:** Pair Trace statistics (for a time-series view of p95 latency and fault rate) with Trace analytics Response Time Root Cause to identify which service or path is responsible for slow requests.
- **Error triage across microservices:** Use Service Map with an account-ID filter for a fleet-wide view, then drill into Trace list for the failing service to inspect individual traces.
- **SLO burn tracking:** List services, then list SLOs for critical operations to monitor SLO attainment alongside CloudWatch metrics in the bundled **X-Ray App Signals** dashboard.
- **Anomaly response:** Surface X-Ray Insights on a dashboard, alert on **Active** insights, and link from the InsightId to the Application Signals console for deep investigation.

## Next steps

- [Use template variables](https://grafana.com/docs/plugins/grafana-x-ray-datasource/latest/template-variables/)
- [Troubleshoot query issues](https://grafana.com/docs/plugins/grafana-x-ray-datasource/latest/troubleshooting/)
