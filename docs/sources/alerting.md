---
description: Build Grafana alert rules on AWS Application Signals and AWS X-Ray data using Trace Statistics queries, with practical examples for fault rates, latency, and throttling.
keywords:
  - grafana
  - aws
  - application signals
  - x-ray
  - alerting
  - alerts
  - trace statistics
  - fault rate
  - latency
labels:
  products:
    - cloud
    - enterprise
    - oss
menuTitle: Alerting
title: Alerting with the AWS Application Signals data source
weight: 350
review_date: 2026-04-16
---

# Alerting with the AWS Application Signals data source

The AWS Application Signals data source supports [Grafana Alerting](https://grafana.com/docs/grafana/<GRAFANA_VERSION>/alerting/) on any query that returns numeric time-series data. The primary alerting target is the **Trace Statistics** query type, which returns per-bucket counts for errors, faults, throttled responses, successes, and totals. This document shows how to build practical alert rules on those metrics.

## Before you begin

- [Configure the AWS Application Signals data source](https://grafana.com/docs/plugins/grafana-x-ray-datasource/latest/configure/).
- Read the [AWS Application Signals query editor documentation](https://grafana.com/docs/plugins/grafana-x-ray-datasource/latest/query-editor/) and confirm Trace Statistics queries return the data you expect.
- Understand the fundamentals of [Grafana Alerting](https://grafana.com/docs/grafana/<GRAFANA_VERSION>/alerting/) and [how to create an alert rule](https://grafana.com/docs/grafana/<GRAFANA_VERSION>/alerting/alerting-rules/create-grafana-managed-rule/).

## Alerting-compatible query types

Not every query type returns data Grafana can alert on. Use this table to choose the right query type.

| Query type | Returns numeric time series | Alertable | Notes |
|------------|-----------------------------|-----------|-------|
| **Trace Statistics** | Yes | Yes | Primary alerting target. Returns error, fault, throttle, success, and total counts per time bucket. |
| **Trace list** | No | No | Returns a trace table, not numeric series. Use a Trace Statistics query with the same filter expression instead. |
| **Trace analytics** | Partially | Limited | Returns root-cause summary tables. Not well-suited for alerting. |
| **Insights** | No | No | Returns insight summary table; alert on Active insight count by converting it to a Trace Statistics count if needed. |
| **Service map** | No | No | Returns a graph visualization. |
| **List services / operations / dependencies / SLOs** | Returns CloudWatch metrics tables | Sometimes | Can be alertable where the query returns numeric CloudWatch values. For pure Application Signals SLO alerting, prefer CloudWatch alarms on Application Signals SLO metrics. |

## Build an alert rule on Trace Statistics

The standard pattern is:

1. Write a Trace Statistics query that returns the metric you want to alert on.
1. Add a Reduce or Math expression that collapses the series into a single number.
1. Set a threshold condition.
1. Configure evaluation, labels, and notifications.

To create an alert:

1. Click **Alerts & IRM** > **Alerting** > **Alert rules** in the left-side menu.
1. Click **New alert rule**.
1. Under **Define query and alert condition**, select your **AWS Application Signals** data source.
1. Set the query:
   - **Query Type:** **Trace Statistics**
   - **Region:** the region where the services run
   - **Query:** a filter expression that scopes the population (for example, `service("frontend")`)
   - **Group:** optional; attach a pre-defined X-Ray group
   - **Resolution:** **60s** or **300s** (match to your evaluation interval)
   - **Columns:** select only the columns you need (for example, `ErrorCount`, `OkCount`, `TotalCount`)
1. Add a **Reduce** expression that reduces the Trace Statistics series to `last`, `mean`, or `sum`.
1. Add a **Threshold** expression and set your condition.
1. Configure **Folder**, **Evaluation group and interval**, and **Labels and notifications**.
1. Click **Save rule and exit**.

{{< admonition type="note" >}}
Trace Statistics buckets are aligned to the selected **Resolution**. Pick a Resolution that divides evenly into your alert evaluation interval so you don't alert on partially-filled buckets.
{{< /admonition >}}

## Example: Fault rate alert on a service

Alert when more than 1% of requests to the `frontend` service fault over the last five minutes.

**Query A — Trace Statistics**

| Field | Value |
|-------|-------|
| Query Type | Trace Statistics |
| Region | `us-east-1` |
| Query | `service("frontend")` |
| Resolution | `60s` |
| Columns | `FaultCount`, `TotalCount` |

**Expression B — Reduce fault count**

| Field | Value |
|-------|-------|
| Input | `A` (the `FaultCount` series) |
| Function | `sum` |
| Mode | Strict |

**Expression C — Reduce total count**

| Field | Value |
|-------|-------|
| Input | `A` (the `TotalCount` series) |
| Function | `sum` |
| Mode | Strict |

**Expression D — Fault ratio**

| Field | Value |
|-------|-------|
| Type | Math |
| Expression | `$B / $C` |

**Expression E — Threshold**

| Field | Value |
|-------|-------|
| Input | `D` |
| Condition | `IS ABOVE 0.01` |

Set the **Evaluation interval** to `1m` and the **Pending period** to `5m` so the rule fires after five consecutive minutes above the 1% threshold.

## Example: Error-and-fault count alert

Alert when the combined error and fault count for any service exceeds 50 in a five-minute window.

**Query A — Trace Statistics**

| Field | Value |
|-------|-------|
| Query Type | Trace Statistics |
| Query | leave empty to return all traces |
| Resolution | `60s` |
| Columns | `ErrorCount`, `FaultCount` |

**Expression B — Reduce**

| Field | Value |
|-------|-------|
| Input | `A` |
| Function | `sum` |
| Mode | Strict |

**Expression C — Threshold**

| Field | Value |
|-------|-------|
| Input | `B` |
| Condition | `IS ABOVE 50` |

## Example: Throttling alert

Alert when throttled responses exceed 10 per minute on the `payments` service, which often indicates hitting a downstream quota.

**Query A — Trace Statistics**

| Field | Value |
|-------|-------|
| Query Type | Trace Statistics |
| Query | `service("payments")` |
| Resolution | `60s` |
| Columns | `ThrottleCount` |

**Expression B — Reduce**

| Function | `last` |

**Expression C — Threshold**

| Condition | `IS ABOVE 10` |

## Example: Cross-account fault rate

When cross-account observability is configured, scope an alert to a specific account using the `account.id` filter expression attribute.

```text
service("frontend") { account.id = "123456789012" }
```

This query returns Trace Statistics only for traces from account `123456789012`, even when the data source spans multiple linked accounts.

## Use template variables in alert queries

Grafana Alerting supports limited variable interpolation. To parameterize alerts:

- Use **Constant** or **Text box** dashboard variables, not query-driven variables, because alert rules are evaluated without a dashboard context.
- Prefer hard-coded service or account IDs in the alert filter expression when you need deterministic evaluation.
- If you must parameterize an alert across multiple services, create one alert rule per service and use consistent label naming so a single notification policy can route them.

## Alerting best practices

- **Alert on rates, not raw counts, wherever possible.** Raw counts scale with traffic volume and cause noisy alerts.
- **Choose resolution carefully.** Higher resolution (`60s`) gives faster detection but increases AWS X-Ray API calls. Use `300s` for long-horizon alerts.
- **Use groups to stabilize filters.** An X-Ray [group](https://docs.aws.amazon.com/xray/latest/devguide/xray-console-groups.html) lets you share a filter expression across multiple alerts and dashboards. If the group definition changes in AWS, all alerts update automatically.
- **Tune the pending period.** A short pending period catches transient issues; a longer pending period avoids noise from brief blips.
- **Label alerts with ownership metadata.** Add `team` and `service` labels so notification policies can route to the right channel.
- **Mind X-Ray API throttling.** If you create many frequent alert rules, you can exceed [X-Ray API limits](https://docs.aws.amazon.com/general/latest/gr/xray.html). Consolidate rules or raise Resolution to reduce call frequency.

{{< admonition type="caution" >}}
Trace Statistics data can arrive late. Traces are typically indexed within a minute, but AWS may take longer during high-volume periods. Set the alert **For** duration (pending period) to at least two evaluation intervals to avoid firing on a temporarily empty bucket.
{{< /admonition >}}

## Alerting on Application Signals SLOs

For Application Signals SLOs, you have two options:

- **Query the SLO in Grafana and alert on burn rate.** Use a Services mode **List Service Level Objectives (SLO)** query and reduce it to the current SLO attainment. Alert when attainment drops below the target.
- **Use native CloudWatch alarms on SLO metrics.** Application Signals publishes SLO metrics to CloudWatch. You can alert on those via the [CloudWatch data source](https://grafana.com/docs/grafana/<GRAFANA_VERSION>/datasources/aws-cloudwatch/) or directly in AWS. CloudWatch alarms are usually the better fit for production SLO alerting because they integrate with AWS SLO dashboards natively.

## Next steps

- [Query AWS Application Signals](https://grafana.com/docs/plugins/grafana-x-ray-datasource/latest/query-editor/)
- [Use template variables](https://grafana.com/docs/plugins/grafana-x-ray-datasource/latest/template-variables/)
- [Troubleshoot AWS Application Signals issues](https://grafana.com/docs/plugins/grafana-x-ray-datasource/latest/troubleshooting/)
