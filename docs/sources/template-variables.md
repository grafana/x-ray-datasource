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

Use template variables to build dynamic, reusable dashboards that let viewers change regions, accounts, services, and operations without editing queries.

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
| **Regions** | Returns the list of AWS regions available to the data source. | None |
| **Accounts** | Returns AWS account IDs discovered through CloudWatch cross-account observability. | **Group** |
| **Services** | Returns Application Signals services. | **AccountId** |
| **Operations** | Returns service operations for a selected service. | **Service** |

{{< admonition type="note" >}}
The **Accounts** query type only returns values when cross-account observability is configured on your AWS account and the data source's IAM identity has the `oam:ListSinks` and `oam:ListAttachedLinks` permissions. Refer to [Cross-account observability](https://grafana.com/docs/plugins/grafana-x-ray-datasource/latest/configure/#cross-account-observability).
{{< /admonition >}}

{{< admonition type="note" >}}
A **Groups** query type exists in the plugin internals but isn't currently exposed in the variable editor. If you need to filter by group, define the group name as a **Custom** or **Text box** variable and use it in the **Group** field of your queries.
{{< /admonition >}}

## Create a query variable

To create a query variable:

1. Open the dashboard and click **Settings** (the gear icon).
1. Select **Variables** > **Add variable**.
1. Set **Select variable type** to **Query**.
1. In **Data source**, select your AWS Application Signals data source.
1. Select a **Query type** (for example, **Services**).
1. Fill in any required fields, such as **AccountId** for the **Services** query type.
1. Optionally set **Refresh** to **On dashboard load** or **On time range change**.
1. Click **Apply**.

Cascading variables let viewers pick a service, then see only that service's operations. Define them in dependency order: for example, a `region` variable first, then `accountId` (depends on nothing in this plugin), then `service` (depends on `accountId`), then `operation` (depends on `service`).

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

Example Trace list filter expression using a variable for the service name:

```text
service("$service")
```

Example Trace list filter expression that restricts results to a selected account:

```text
service("$service") { account.id = "$accountId" }
```

## Next steps

- [Query AWS Application Signals](https://grafana.com/docs/plugins/grafana-x-ray-datasource/latest/query-editor/)
- [Troubleshoot template variable issues](https://grafana.com/docs/plugins/grafana-x-ray-datasource/latest/troubleshooting/#template-variable-errors)
