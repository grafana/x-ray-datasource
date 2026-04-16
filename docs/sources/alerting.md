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
weight: 450
review_date: 2026-04-16
---

# Alerting with the AWS Application Signals data source

Use [Grafana Alerting](https://grafana.com/docs/grafana/<GRAFANA_VERSION>/alerting/) with the AWS Application Signals data source to notify your team about fault rates, latency regressions, throttling, and error spikes before they become incidents.

The primary alerting target is the **Trace Statistics** query type, which returns per-bucket counts for errors, faults, throttled responses, successes, and totals, plus a computed **Average Response Time**. This page walks through every alertable query type, gives you copy-paste-ready recipes for the four most common patterns (fault rate, error-and-fault count, throttling, latency), shows how to scope alerts to a linked AWS account, and collects the gotchas to watch for when you put rules into production.

## Before you begin

- [Configure the AWS Application Signals data source](https://grafana.com/docs/plugins/grafana-x-ray-datasource/latest/configure/).
- Read the [AWS Application Signals query editor documentation](https://grafana.com/docs/plugins/grafana-x-ray-datasource/latest/query-editor/) and confirm Trace Statistics queries return the data you expect.
- Understand the fundamentals of [Grafana Alerting](https://grafana.com/docs/grafana/<GRAFANA_VERSION>/alerting/) and [how to create an alert rule](https://grafana.com/docs/grafana/<GRAFANA_VERSION>/alerting/alerting-rules/create-grafana-managed-rule/).

## Alerting-compatible query types

Not every query type returns data Grafana can alert on. Use this table to choose the right query type.

| Query type | Returns numeric time series | Alertable | Notes |
|------------|-----------------------------|-----------|-------|
| **Trace Statistics** | Yes | Yes | Primary alerting target. Returns **Throttle Count**, **Error Count**, **Fault Count**, **Success Count**, **Total Count**, and **Average Response Time** per time bucket. |
| **Trace List** | No | No | Returns a trace table, not numeric series. Use a Trace Statistics query with the same filter expression instead. |
| **Trace analytics** | No | No | Returns root-cause summary tables. Use a Trace Statistics query if you want to alert on the same trace population. |
| **Insights** | No | No | Returns an insight summary table. Insights are correlated anomalies, not metrics — there's no equivalent Trace Statistics conversion. To be notified when X-Ray detects new insights, configure an [X-Ray insights notification](https://docs.aws.amazon.com/xray/latest/devguide/xray-console-insights.html) in AWS instead. |
| **Service Map** | No | No | Returns a graph visualization. |
| **List services / operations / dependencies / SLOs** | No | No | These queries return CloudWatch metric **references** (metric name, namespace, dimensions), not metric values. To alert on the underlying numbers, use the [CloudWatch data source](https://grafana.com/docs/grafana/<GRAFANA_VERSION>/datasources/aws-cloudwatch/) to query each metric reference, or set up native CloudWatch alarms on the Application Signals metrics directly. |

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
   - **Columns:** select only the columns you need (for example, **Error Count**, **Success Count**, **Total Count**)
1. Add a **Reduce** expression that reduces the Trace Statistics series to `last`, `mean`, or `sum`.
1. Add a **Threshold** expression and set your condition.
1. Configure **Folder**, **Evaluation group and interval**, and **Labels and notifications**.
1. Click **Save rule and exit**.

{{< admonition type="note" >}}
Trace Statistics buckets are aligned to the selected **Resolution**. Pick a Resolution that divides evenly into your alert evaluation interval so you don't alert on partially-filled buckets.
{{< /admonition >}}

## Example: fault rate alert on a service

Alert when more than 1% of requests to the `frontend` service fault over the last five minutes.

A Trace Statistics query returns one series per selected column, so a Reduce expression against a multi-column query collapses every column at once and can't pick out fault vs. total. The reliable pattern is two single-column queries that each reduce to one labeled value, then a Math expression that divides them.

**Query A — fault count**

| Field | Value |
|-------|-------|
| Query Type | Trace Statistics |
| Region | `us-east-1` |
| Query | `service("frontend")` |
| Resolution | `60s` |
| Columns | **Fault Count** |

**Query B — total count**

| Field | Value |
|-------|-------|
| Query Type | Trace Statistics |
| Region | `us-east-1` |
| Query | `service("frontend")` |
| Resolution | `60s` |
| Columns | **Total Count** |

**Expression C — reduce fault count**

| Field | Value |
|-------|-------|
| Input | `A` |
| Function | `sum` |
| Mode | Replace non-numeric values with zero |

**Expression D — reduce total count**

| Field | Value |
|-------|-------|
| Input | `B` |
| Function | `sum` |
| Mode | Replace non-numeric values with zero |

**Expression E — fault ratio with divide-by-zero guard**

| Field | Value |
|-------|-------|
| Type | Math |
| Expression | `$D == 0 ? 0 : $C / $D` |

**Expression F — threshold**

| Field | Value |
|-------|-------|
| Input | `E` |
| Condition | `IS ABOVE 0.01` |

Set the **Evaluation interval** to `1m` and the **Pending period** to `5m` so the rule fires after five consecutive minutes above the 1% threshold. Without the divide-by-zero guard, quiet traffic windows can put the rule into **Error** state. Refer to [Fault-rate alert fires when there's no traffic](https://grafana.com/docs/plugins/grafana-x-ray-datasource/latest/troubleshooting/#fault-rate-alert-fires-when-theres-no-traffic) for background.

## Example: error-and-fault count alert

Alert when the combined error and fault count for the `checkout-api` service exceeds 50 over a five-minute window. Because Trace Statistics doesn't expose a combined error+fault column, sum the two columns in a Math expression.

**Query A — error count**

| Field | Value |
|-------|-------|
| Query Type | Trace Statistics |
| Query | `service("checkout-api")` |
| Resolution | `60s` |
| Columns | **Error Count** |

**Query B — fault count**

| Field | Value |
|-------|-------|
| Query Type | Trace Statistics |
| Query | `service("checkout-api")` |
| Resolution | `60s` |
| Columns | **Fault Count** |

**Expression C — reduce error count**

| Input | `A` |
| Function | `sum` |
| Mode | Replace non-numeric values with zero |

**Expression D — reduce fault count**

| Input | `B` |
| Function | `sum` |
| Mode | Replace non-numeric values with zero |

**Expression E — sum error + fault**

| Type | Math |
| Expression | `$C + $D` |

**Expression F — threshold**

| Input | `E` |
| Condition | `IS ABOVE 50` |

## Example: throttling alert

Alert when throttled responses exceed 10 per minute on the `payments` service. A sustained rise in throttles usually means a downstream quota (for example, DynamoDB or a third-party API) is saturated.

**Query A — Trace Statistics**

| Field | Value |
|-------|-------|
| Query Type | Trace Statistics |
| Query | `service("payments")` |
| Resolution | `60s` |
| Columns | **Throttle Count** |

**Expression B — reduce**

| Input | `A` |
| Function | `last` |
| Mode | Replace non-numeric values with zero |

**Expression C — threshold**

| Input | `B` |
| Condition | `IS ABOVE 10` |

Throttling alerts are often paired with a secondary condition that requires traffic — for example, only fire when **Total Count** is also above some floor, so a dormant service doesn't stay silent while still firing on a stale throttle burst.

## Example: latency regression on average response time

Alert when the `search-api` service's average response time exceeds 500 ms over a five-minute window.

**Query A — Trace Statistics**

| Field | Value |
|-------|-------|
| Query Type | Trace Statistics |
| Query | `service("search-api")` |
| Resolution | `60s` |
| Columns | **Average Response Time** |

**Expression B — reduce**

| Input | `A` |
| Function | `mean` |
| Mode | Drop non-numeric values |

**Expression C — threshold**

| Input | `B` |
| Condition | `IS ABOVE 0.5` |

{{< admonition type="note" >}}
**Average Response Time** is returned in seconds, so use `0.5` for a 500 ms threshold, not `500`. For short-duration regressions, lower the **Pending period**; for noisy traffic, use `Mean of last 5` in a secondary Reduce stage to smooth spikes.
{{< /admonition >}}

## Example: group-driven alert

When you maintain a shared X-Ray group such as `critical-paths` in AWS, you can alert on that group's traffic without hard-coding a filter expression in Grafana. Changing the group's filter expression in AWS automatically changes the population the alert evaluates on.

**Query A — fault count in the group**

| Field | Value |
|-------|-------|
| Query Type | Trace Statistics |
| Region | `us-east-1` |
| Query | leave empty |
| Group | `critical-paths` |
| Resolution | `60s` |
| Columns | **Fault Count** |

**Query B — total count in the group**

| Field | Value |
|-------|-------|
| Query Type | Trace Statistics |
| Region | `us-east-1` |
| Query | leave empty |
| Group | `critical-paths` |
| Resolution | `60s` |
| Columns | **Total Count** |

Then reduce each query and divide them exactly as in the [fault rate example](#example-fault-rate-alert-on-a-service).

## Example: cross-account fault rate

When [cross-account observability](https://grafana.com/docs/plugins/grafana-x-ray-datasource/latest/configure/#cross-account-observability) is configured, scope an alert to a specific linked account with the `account.id` attribute inside a `service()` filter expression.

**Query A — fault count in a linked account**

| Field | Value |
|-------|-------|
| Query Type | Trace Statistics |
| Region | `us-east-1` |
| Query | `service("frontend") { account.id = "123456789012" }` |
| Resolution | `60s` |
| Columns | **Fault Count** |

**Query B — total count in a linked account**

| Field | Value |
|-------|-------|
| Query Type | Trace Statistics |
| Region | `us-east-1` |
| Query | `service("frontend") { account.id = "123456789012" }` |
| Resolution | `60s` |
| Columns | **Total Count** |

Then reduce each series and divide them exactly as in the [fault rate example](#example-fault-rate-alert-on-a-service). To get one alert rule per linked account without duplicating rules, add labels such as `account_id="123456789012"` to the rule and route through a notification policy that matches on `account_id`.

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

The plugin's **List Service Level Objectives (SLO)** query returns SLO metadata — name, operation, creation time, key attributes — not a numeric attainment or burn-rate value, so you can't alert on it directly in Grafana.

For production SLO alerting, use one of these options instead:

- **Native CloudWatch alarms on the SLO metrics Application Signals publishes.** Configure the alarms in AWS (in the Application Signals or CloudWatch console) and let them fire into your existing incident pipeline. This is the tightest integration with the AWS SLO dashboards.
- **Grafana alerts on the CloudWatch SLO metrics.** Query the same metrics through the [CloudWatch data source](https://grafana.com/docs/grafana/<GRAFANA_VERSION>/datasources/aws-cloudwatch/) and build Grafana-managed alert rules on them — useful when you want SLO alerts to route through the same notification policies as the rest of your Grafana alerting stack.
- **Burn-rate proxies from Trace Statistics.** If you can't query the CloudWatch SLO metrics, approximate the same signal with a Trace Statistics fault-rate alert on the service + operation the SLO covers. This won't match AWS's SLO evaluation exactly but catches the same underlying failures.

## Next steps

- [Query AWS Application Signals](https://grafana.com/docs/plugins/grafana-x-ray-datasource/latest/query-editor/)
- [Use template variables](https://grafana.com/docs/plugins/grafana-x-ray-datasource/latest/template-variables/)
- [Troubleshoot AWS Application Signals issues](https://grafana.com/docs/plugins/grafana-x-ray-datasource/latest/troubleshooting/)
