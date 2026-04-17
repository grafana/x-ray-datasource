---
description: Use Grafana template variables with the AWS Application Signals data source to build dynamic dashboards driven by regions, accounts, services, and operations.
keywords:
  - grafana
  - aws
  - application signals
  - x-ray
  - template variables
  - variables
labels:
  products:
    - cloud
    - enterprise
    - oss
menuTitle: Template variables
title: AWS Application Signals template variables
weight: 400
review_date: 2026-04-16
---

# AWS Application Signals template variables

Template variables turn a static X-Ray dashboard into an on-call superpower: one dashboard, many services, many accounts, many regions — all driven by drop-downs at the top of the page. Use them to let viewers swap the AWS region, pivot to a linked account, zoom in on a specific service and operation, or combine those selections in filter expressions without rewriting a single query.

This document lists every variable type the data source supports, shows the exact fields each one exposes, and walks through cascading-variable setups, multi-value filters, and the subtle formatting rules you need to keep filter expressions valid.

## Before you begin

- [Configure the AWS Application Signals data source](https://grafana.com/docs/plugins/grafana-x-ray-datasource/latest/configure/).
- Understand [Grafana template variables](https://grafana.com/docs/grafana/<GRAFANA_VERSION>/dashboards/variables/).

## Supported variable types

The AWS Application Signals data source supports the following Grafana variable types:

| Variable type | Supported |
|---------------|-----------|
| Query | Yes |
| Custom | Yes |
| Text box | Yes |
| Constant | Yes |
| Data source | Yes |
| Interval | Yes |
| Ad hoc filters | No |

## Query variable types

When you create a query variable, the data source exposes the following query types. Each type has its own required fields.

| Query type | Description | Required fields |
|------------|-------------|-----------------|
| **Regions** | Returns a fixed list of AWS regions recognized by the plugin, including the `us-gov-*`, `cn-*`, and `us-iso-*` partitions. The list is static because the AWS Go SDK no longer exposes a dynamic regions API. | None |
| **Accounts** | Returns AWS account IDs discovered through CloudWatch cross-account observability, plus a synthetic **All** entry whose value is the literal string `all`. Pass `all` to any of the data source's account-ID selectors to mean "all linked accounts." | **Region**, **Group** |
| **Services** | Returns Application Signals services. | **Region**, **AccountId** |
| **Operations** | Returns service operations for a selected service. | **Region**, **Service** |

{{< admonition type="note" >}}
The **Accounts** query type only returns values when cross-account observability is configured on your AWS account and the data source's IAM identity has the `oam:ListSinks` and `oam:ListAttachedLinks` permissions. Refer to [Cross-account observability](https://grafana.com/docs/plugins/grafana-x-ray-datasource/latest/configure/#cross-account-observability).
{{< /admonition >}}

### The Service variable's value is a JSON blob

The **Service** query type returns each option as an object with two parts:

- A display `text` set to the service's `Name` (for example, `checkout-api`).
- A `value` set to the full service descriptor serialized as JSON (for example, `{"Type":"Service","Name":"checkout-api","Environment":"eks:prod/default"}`).

The JSON value is what the **List service operations**, **List service dependencies**, and **List SLOs** APIs require, so the variable works out of the box when you reference it in those Services-mode drop-downs. However, the JSON form breaks X-Ray filter expressions. When you use the **Service** variable in a Trace list or Trace statistics filter expression, always append the `:text` format to get the display name:

```text
service("${service:text}")
```

Referencing it as `$service` inlines the JSON blob and produces an invalid filter expression.

## Create a query variable

To create a query variable:

1. Open the dashboard and click **Settings** (the gear icon).
1. Select **Variables** > **Add variable**.
1. Set **Select variable type** to **Query**.
1. In **Data source**, select your AWS Application Signals data source.
1. Select a **Query type** (for example, **Services**).
1. Fill in the required fields. Every non-**Regions** query type requires a **Region**, either typed in or provided by another variable.
1. Optionally set **Refresh** to **On dashboard load** or **On time range change**. For cascading variables that depend on the time range, use **On time range change**.
1. Click **Apply**.

### Cascading variable setup

Define variables in dependency order so each drop-down filters the next. The following sequence is the recommended cascade for the AWS Application Signals data source:

| Order | Variable name | Type | Query type | Fields | Depends on |
|-------|---------------|------|------------|--------|------------|
| 1 | `region` | Query | Regions | None | — |
| 2 | `group` | Custom or Text box | — | Free-form value such as `Default` | — |
| 3 | `accountId` | Query | Accounts | Region: `$region`, Group: `$group` | `region`, `group` |
| 4 | `service` | Query | Services | Region: `$region`, AccountId: `$accountId` | `region`, `accountId` |
| 5 | `operation` | Query | Operations | Region: `$region`, Service: `$service` | `region`, `service` |

Set **Refresh** to **On time range change** on `accountId`, `service`, and `operation` so they re-fetch when users adjust the dashboard time range.

If you don't use cross-account observability, skip the `group` and `accountId` variables — leave **AccountId** blank on the `service` variable to query the data source's own account.

## Use variables in queries

The data source interpolates template variables in the following query editor fields:

- Trace list and Trace statistics **Query** (filter expressions)
- **Region** drop-down
- **AccountId** and **AccountIds** drop-downs
- Services mode **Service** drop-down
- Services mode **Operation** drop-down

Reference variables with the standard Grafana syntax:

```text
$region
${service}
[[accountId]]
```

### Format modifiers you're likely to need

Grafana supports [variable format modifiers](https://grafana.com/docs/grafana/<GRAFANA_VERSION>/dashboards/variables/variable-syntax/#advanced-variable-format-options) that control how a variable's value is rendered at query time. The following are the most relevant modifiers for this data source:

| Syntax | Behavior | When to use |
|--------|----------|-------------|
| `${var:text}` | Emits the variable's display text instead of its value. | Always use this when a **Service** variable is referenced inside a filter expression. |
| `${var:raw}` | Emits the raw value without any escaping. | When you've pre-escaped a value yourself and don't want Grafana to double-quote it. |
| `${var:csv}` | Joins a multi-value variable with commas. | Multi-value **AccountIds** used in filter expressions. |
| `${var:doublequote}` | Wraps each multi-value item in double quotes and joins with commas. | Multi-value lists where each item must be quoted. |

### Example — filter by selected service (correct form)

Because the **Service** variable's value is JSON (see [The Service variable's value is a JSON blob](#the-service-variables-value-is-a-json-blob)), use `:text` to filter a Trace list or Trace statistics query by service name:

```text
service("${service:text}")
```

### Example — filter by service and a single account

Combine the `service` and `accountId` variables in a filter expression. `accountId` is a plain string, so no format modifier is needed:

```text
service("${service:text}") { account.id = "$accountId" }
```

### Example — multi-value AccountIds in Service Map

The Service Map query type exposes a first-class **AccountId** multi-select, which is the easiest way to work with multiple accounts. Define an **AccountIds** variable with **Multi-value** enabled (for example, populated from the **Accounts** query type), then select it from the Service Map **AccountId** drop-down. The plugin sends every selected value to the API without requiring any format modifier on your end.

For Trace list and Trace statistics queries, X-Ray filter expressions don't have a documented list operator for `account.id`, so driving them from a multi-value variable isn't reliable. Use one of these approaches instead:

- Set the dashboard account selector to a single value and use `account.id = "$accountId"` in the filter expression.
- Switch to a Service Map query and use its built-in **AccountId** multi-select.

### Example — drive Services-mode drop-downs with variables

In **Services** mode, template variables can populate the plugin's own drop-downs. Select a template variable from the **Service** or **Operation** drop-down instead of a literal value:

- **Region**: `$region`
- **AccountId**: `$accountId` (use the literal `all` value from the **Accounts** query type's synthetic **All** entry to query every linked account)
- **Service**: `$service` — the JSON value is exactly what the underlying APIs expect, so no format modifier is required in these drop-downs.
- **Operation**: `$operation`

### Example — alert on a per-service fault rate

Cascading variables are especially useful for alert rules. Create a Trace statistics panel with the query below and build an alert on it to get one rule per service without hand-maintaining a rule per team:

```text
service("${service:text}") AND fault = true
```

Pair this with the `accountId` variable when you run alerts across linked accounts. Refer to [Alerting with the AWS Application Signals data source](https://grafana.com/docs/plugins/grafana-x-ray-datasource/latest/alerting/) for end-to-end guidance.

## Next steps

- [Query AWS Application Signals](https://grafana.com/docs/plugins/grafana-x-ray-datasource/latest/query-editor/)
- [Troubleshoot template variable issues](https://grafana.com/docs/plugins/grafana-x-ray-datasource/latest/troubleshooting/#template-variable-errors)
