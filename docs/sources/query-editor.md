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

The AWS Application Signals query editor is where you turn raw telemetry into the answers your team needs during an incident. Use it to pull up a single trace by ID, chart fault and latency trends, surface auto-detected insights, and map service dependencies across accounts — all without leaving your Grafana dashboard.

This document walks through every query mode, shows the exact fields each one exposes, and collects ready-to-paste filter expressions and end-to-end query examples so you can go from a blank panel to a working visualization in minutes.

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
| **Annotation** (X-Ray) | A key-value pair attached to a trace segment by the AWS X-Ray SDK that you can filter on with X-Ray filter expressions. Not the same as [Grafana dashboard annotations](https://grafana.com/docs/grafana/<GRAFANA_VERSION>/dashboards/build-dashboards/annotate-visualizations/), which this data source doesn't support. |
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

Every query starts with two drop-downs in the editor header:

- **Region** — the AWS region to run this query against. If unset, the query uses the data source's default region.
- **Mode** — the set of APIs to query. Choose between:
  - **Traces** — X-Ray traces, trace statistics, analytics, insights, and the service map.
  - **Services** — Application Signals services, operations, dependencies, and SLOs.

## Trace queries

The Traces mode supports the following query types. Select a query type from the cascader in the query row.

### Trace list

Use Trace list to search for traces. Results appear in a table; click the trace ID in the first column to open the trace view.

The **Query** field placeholder reads `Enter service name, annotation, trace ID.` You can enter:

- A [filter expression](https://docs.aws.amazon.com/xray/latest/devguide/xray-console-filters.html), for example `service("frontend") { fault = true }`.
- A single trace ID in one of two formats. The query editor detects the ID and opens the trace directly:
  - X-Ray format: `1-xxxxxxxx-xxxxxxxxxxxxxxxxxxxxxxxx` (for example, `1-5f160a8b-83190adad07f429219c0e259`).
  - 32-character hex format from W3C Trace Context (for example, `5f160a8b83190adad07f429219c0e259`). The plugin converts this to the X-Ray format automatically.

To scope a query to a saved X-Ray group, select the group from the **Group** drop-down — group filtering isn't supported inline in the query field.

The following fields are available:

| Field | Description |
|-------|-------------|
| **Query** | A trace ID or filter expression. Leave empty to return all traces in the time range. |
| **Group** | An optional X-Ray group whose filter expression narrows the query. |

{{< admonition type="caution" >}}
Trace list results are capped at the first 1000 traces returned by the X-Ray API. If you need more data, narrow the time range or tighten the filter expression to make the result set more specific.
{{< /admonition >}}

### Trace statistics

Trace statistics returns a time-series graph and table of error, fault, throttle, success, and total counts plus an average response time. Use it for numeric dashboards and alerts.

The following fields are available:

| Field | Description |
|-------|-------------|
| **Query** | An X-Ray filter expression that narrows the trace population. Leave empty to aggregate across all traces in the time range. |
| **Group** | An optional X-Ray group to apply. |
| **Resolution** | Time bucket granularity: **auto**, **60s**, or **300s**. Auto chooses the value appropriate for the current time range. |
| **Columns** | A multi-select of which statistic columns to return. Leave empty to return all columns. Available values are **Throttle Count**, **Error Count**, **Fault Count**, **Success Count**, **Total Count**, and **Average Response Time**. |

### Trace analytics

Trace analytics fetches up to 10,000 trace summaries for the time range and groups them by a dimension you choose in the cascader. Every result is a three-column table: the grouping dimension, **Count**, and **Percent** of the sampled traces. Traces with no matching root cause are bucketed under `-`.

The cascader exposes the following structure. The dimension column header in the result table is shown in parentheses.

- **Root Cause**
  - **Response Time**
    - **Root Cause** (`Response Time Root Cause`) — last service in each `ResponseTimeRootCauses` chain, formatted as `name (type)`.
    - **Path** (`Response Time Root Cause Path`) — full chain of services and their entity paths, joined with `->` within a service and `=>` between services.
  - **Error**
    - **Root Cause** (`Error Root Cause`) — last service in each `ErrorRootCauses` chain.
    - **Path** (`Error Root Cause Path`) — services in each error chain, with exception names appended along each service's entity path.
    - **Error Message** (`Error Root Cause Message`) — first non-empty exception message found in the error root cause.
  - **Fault**
    - **Root Cause** (`Fault Root Cause`) — last service in each `FaultRootCauses` chain.
    - **Path** (`Fault Root Cause Path`) — services in each fault chain, with exception names appended along each service's entity path.
    - **Error Message** (`Fault Root Cause Message`) — first non-empty exception message found in the fault root cause.
- **End user impact** (`User`) — `Users[].UserName` from each trace summary.
- **URL** (`URL`) — `Http.HttpURL` from each trace summary.
- **HTTP status code** (`Status Code`) — `Http.HttpStatus` from each trace summary.

The following fields are available:

| Field | Description |
|-------|-------------|
| **Query** | An X-Ray filter expression that narrows the trace population before grouping. Leave empty to include all traces in the time range. |
| **Group** | An optional X-Ray group to apply. |

### Insights

Insights returns a table of correlated anomalies detected by X-Ray. Click the **InsightId** to jump to the corresponding page in the AWS console.

The following fields are available:

| Field | Description |
|-------|-------------|
| **Group** | The X-Ray group to scope the insights to. When Insights is the selected query type, the drop-down also offers an **All** option that returns insights across every group. |
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

The following fields are available:

| Field | Description |
|-------|-------------|
| **Group** | An optional X-Ray group whose filter expression narrows the graph. |
| **AccountId** | A multi-select of linked account IDs to include in the graph. Only shown when [cross-account observability](#filter-by-account-id) is configured and the `cloudWatchCrossAccountQuerying` feature toggle is enabled. |

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

### List Service Level Objectives (SLO)

Returns a table of SLOs associated with a given service operation. This query type appears in the UI as **List Service Level Objectives (SLO)**.

The following fields are available:

| Field | Description |
|-------|-------------|
| **Service** | The service that exposes the operation. Required. |
| **Operation** | The service operation whose SLOs to list. Required. |

## Filter expression reference

Filter expressions are the query language X-Ray uses to narrow down which traces are returned. They apply to **Trace list** and **Trace statistics** queries and to the optional filter expression on an X-Ray **Group**.

### Common attributes

The following keywords can appear in a filter expression. For the complete specification, refer to the [AWS X-Ray filter expressions documentation](https://docs.aws.amazon.com/xray/latest/devguide/xray-console-filters.html).

| Attribute | Type | Description |
|-----------|------|-------------|
| `ok` | Boolean | Response status code was 2xx success. |
| `error` | Boolean | Response status code was 4xx client error. |
| `fault` | Boolean | Response status code was 5xx server error. |
| `partial` | Boolean | Request has incomplete segments. |
| `responsetime` | Number | Time the server took to send a response, in seconds. |
| `duration` | Number | Total request duration including all downstream calls, in seconds. |
| `http.status` | Number | Response status code. |
| `http.url` | String | Request URL. |
| `http.method` | String | Request method. |
| `http.useragent` | String | Request user agent string. |
| `http.clientip` | String | Requester's IP address. |
| `user` | String | Value of the `user` field on any segment in the trace. |
| `annotation.<key>` | Any | Value of the X-Ray trace annotation with the given `<key>`. |
| `service(<name>) { ... }` | Complex | Segments produced by the service named `<name>`. The optional curly braces contain a sub-expression applied only to those segments. |
| `edge(<source>, <destination>) { ... }` | Complex | Calls from `<source>` to `<destination>`. The optional curly braces contain a sub-expression applied only to segments on that connection. |

### Filter expression examples

The following expressions match the examples in the in-product cheat sheet. You can paste any of them into the **Query** field of a Trace list or Trace statistics query.

- Traces whose response time was more than 5 seconds:

  ```text
  responsetime > 5
  ```

- Traces whose total duration was between 5 and 8 seconds:

  ```text
  duration > 5 AND duration < 8
  ```

- Traces that called `api.example.com` and carry an annotation named `account` with the value `12345`:

  ```text
  service("api.example.com") AND annotation.account = "12345"
  ```

- Traces where `api.example.com` made a call to `backend.example.com` that failed with a fault:

  ```text
  edge("api.example.com", "backend.example.com")
  ```

- Traces whose URL starts with `http://api.example.com/` and contains `/v2/`, but didn't reach a service named `api.example.com`:

  ```text
  http.url BEGINSWITH "http://api.example.com/" AND http.url CONTAINS "/v2/" AND !service("api.example.com")
  ```

- Traces that completed successfully in under 3 seconds, including all downstream calls:

  ```text
  ok !partial duration < 3
  ```

- When two services share the same name but have different types, you can disambiguate them with the `id` function:

  ```text
  service(id(name: "api.example.com", type: "AWS::EC2::Instance"))
  ```

### Query examples per query type

The following examples show how to wire up common query types end to end.

**Trace list — open a single trace by ID.** Paste a trace ID into the **Query** field; no other configuration is needed:

```text
1-5f160a8b-83190adad07f429219c0e259
```

**Trace list — all faulting requests hitting a service in the last 6 hours.** Set the dashboard time range to `now-6h`, choose **Trace List**, and enter:

```text
service("checkout-api") { fault = true }
```

**Trace statistics — fault rate on a specific endpoint.** Choose **Trace Statistics**, set **Resolution** to `60s`, leave **Columns** empty, and enter:

```text
http.url CONTAINS "/v2/checkout" AND fault = true
```

Use the resulting **Fault Count** series in a time-series panel, or build an alert on it (refer to [Alerting with the AWS Application Signals data source](https://grafana.com/docs/plugins/grafana-x-ray-datasource/latest/alerting/)).

**Service map — scoped to a group and linked accounts.** Choose **Service Map**, select the **checkout** group from the **Group** drop-down, and in the **AccountId** multi-select pick the linked accounts you want to include. Visualize the results with the [Node graph](https://grafana.com/docs/grafana/<GRAFANA_VERSION>/panels-visualizations/visualizations/node-graph/) panel.

**Services — list operations for a specific service.** Switch the mode to **Services**, pick **List service operations** from the **Query Type** drop-down, and select the service you want from the **Service** drop-down.

**Services — list SLOs for a linked-account operation.** Switch to **Services**, pick **List Service Level Objectives (SLO)**, turn on **Include Linked Accounts**, choose the **AccountId**, then pick the **Service** and **Operation**.

## Filter by account ID

When [cross-account observability](https://grafana.com/docs/plugins/grafana-x-ray-datasource/latest/configure/#cross-account-observability) is configured on the monitoring account and the Grafana `cloudWatchCrossAccountQuerying` feature toggle is enabled, the query editor exposes account-ID controls:

- **Service Map (Traces mode):** An **AccountId** multi-select filters the returned graph to the selected accounts. The drop-down populates with account IDs discovered from traces in the current time range.
- **List services and List Service Level Objectives (SLO):** An **Include Linked Accounts** toggle combined with an **AccountId** drop-down filters results to the chosen linked account. For **List services**, the **AccountId** drop-down is always active when visible. For **List Service Level Objectives (SLO)**, the **AccountId** drop-down is disabled until **Include Linked Accounts** is turned on. The drop-down isn't shown for **List service operations** or **List service dependencies** because those APIs don't accept an account filter.

If a query was previously saved with an `accountId` set, the controls remain visible regardless of the feature-toggle state so the saved query keeps working.

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

Trace Statistics queries return numeric time-series data, so you can build Grafana alert rules on top of them to notify on fault rates, error counts, throttled responses, and latency trends.

For step-by-step examples — including fault-rate, throttling, and cross-account alerts — refer to [Alerting with the AWS Application Signals data source](https://grafana.com/docs/plugins/grafana-x-ray-datasource/latest/alerting/).

## Use cases

The following use cases show how Grafana users combine the query types above in real dashboards:

- **Latency investigation:** Pair Trace statistics (for a time-series view of p95 latency and fault rate) with Trace analytics Response Time Root Cause to identify which service or path is responsible for slow requests.
- **Error triage across microservices:** Use Service Map with an account-ID filter for a fleet-wide view, then drill into Trace list for the failing service to inspect individual traces.
- **SLO burn tracking:** List services, then list SLOs for critical operations to monitor SLO attainment alongside CloudWatch metrics in the bundled **X-Ray App Signals** dashboard.
- **Anomaly response:** Surface X-Ray Insights on a dashboard, alert on **Active** insights, and link from the InsightId to the Application Signals console for deep investigation.

## Next steps

- [Build alert rules](https://grafana.com/docs/plugins/grafana-x-ray-datasource/latest/alerting/)
- [Use template variables](https://grafana.com/docs/plugins/grafana-x-ray-datasource/latest/template-variables/)
- [Troubleshoot query issues](https://grafana.com/docs/plugins/grafana-x-ray-datasource/latest/troubleshooting/)
