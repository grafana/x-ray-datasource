---
description: Troubleshoot authentication, connection, query, template variable, and performance issues in the AWS Application Signals data source for Grafana.
keywords:
  - grafana
  - aws
  - application signals
  - x-ray
  - troubleshooting
  - errors
  - authentication
  - query
labels:
  products:
    - cloud
    - enterprise
    - oss
menuTitle: Troubleshooting
title: Troubleshoot AWS Application Signals data source issues
weight: 500
review_date: 2026-04-16
---

# Troubleshoot AWS Application Signals data source issues

This document covers common failure modes in the AWS Application Signals data source and how to resolve them. Use the page navigation to jump to the symptom you're seeing.

Sections are grouped by where the problem appears:

- **Authentication errors** — what happens when Grafana can't get AWS credentials.
- **Connection errors** — DNS, networking, regions, and endpoints.
- **Query editor errors** — empty panels, "no data", and query-type-specific failures.
- **Alerting errors** — issues specific to building and evaluating alert rules on Trace Statistics queries.
- **Template variable errors** — variables that return nothing or load slowly.
- **Performance issues** — throttling, slow queries, and quota limits.
- **Enable debug logging** — how to capture plugin and SDK diagnostics.
- **Get additional help** — community and support channels.

## Authentication errors

These errors occur when credentials are invalid, missing, or don't have the required permissions.

### "Access denied" or "not authorized" on Save & test

**Symptoms:**

- Clicking **Save & test** returns an access-denied error.
- Queries return "not authorized to perform" messages.
- Service, account, or region drop-downs are empty.

**Possible causes and solutions:**

| Cause | Solution |
|-------|----------|
| IAM identity is missing required actions | Apply the [IAM policy](https://grafana.com/docs/plugins/grafana-x-ray-datasource/latest/configure/#iam-policy). Include `xray:*` read actions, `application-signals:List*`, `ec2:DescribeRegions`, and the OAM actions for cross-account. |
| Wrong authentication method selected | Confirm the method matches where Grafana runs. Use **EC2 IAM role** on EC2, and **AWS SDK Default** on Amazon Managed Grafana or anywhere the SDK credential chain is already set up (environment variables, container role, instance profile, or workspace role). |
| Invalid access key or secret key | Verify the keys in the AWS IAM console. Rotate them if necessary and update the data source. |
| Assume Role trust policy doesn't allow the Grafana identity | Update the target role's trust policy to allow `sts:AssumeRole` from your Grafana IAM identity. For Grafana Cloud, refer to the [Grafana Assume Role documentation](https://grafana.com/docs/grafana-cloud/connect-externally-hosted/data-source-management/aws-iam-role/). |
| External ID mismatch | Make sure the **External ID** in the data source matches the `sts:ExternalId` condition on the target role's trust policy. |

### "Could not load credentials" or "no valid providers in chain"

**Symptoms:**

- Save & test fails with credential-chain errors.
- Grafana log shows "NoCredentialProviders" or "could not find credentials".

**Solutions:**

1. For **Credentials file** auth, confirm `~/.aws/credentials` exists for the user running `grafana-server` and is readable (permissions `0644` or stricter).
1. For **AWS SDK Default**, confirm the environment exposes credentials (environment variables, EC2 role, or container role).
1. For **EC2 IAM role**, confirm a role is attached to the EC2 instance and the instance metadata service is reachable.
1. Restart `grafana-server` after changing environment variables or credentials files.

### "ExpiredToken" or "The security token included in the request is expired"

**Symptoms:**

- Queries that previously worked start returning token-expired errors.
- The error only happens after a long period of idleness.

**Solutions:**

1. For static session tokens: regenerate the temporary credentials and update the data source. The plugin's Grafana Assume Role authentication refreshes session tokens automatically.
1. For Grafana Assume Role: confirm the target role's maximum session duration is long enough for your usage pattern.
1. For Credentials file auth: regenerate the credentials and update `~/.aws/credentials`.

## Connection errors

These errors occur when Grafana can't reach the AWS X-Ray or Application Signals endpoints.

### Connection timeouts or "dial tcp: connection refused"

**Symptoms:**

- Save & test hangs and then times out.
- Queries intermittently fail with network errors.
- Errors mention `xray.<region>.amazonaws.com` or `application-signals.<region>.amazonaws.com`.

**Solutions:**

1. Verify outbound HTTPS (port 443) is allowed from the Grafana host to the AWS X-Ray and Application Signals endpoints.
1. Confirm the **Default region** is set to a region where your resources exist.
1. If you use a custom **Endpoint**, confirm the URL is correct and reachable from Grafana.
1. For private AWS networks or VPC endpoints in Grafana Cloud, configure [Private Data source Connect](https://grafana.com/docs/grafana-cloud/connect-externally-hosted/private-data-source-connect/) and select a PDC network in the data source settings.

### Endpoint or region mismatch

**Symptoms:**

- Queries return `ResourceNotFound` or empty results even though data exists in AWS.
- The service map or services list is unexpectedly empty.

**Solutions:**

1. Confirm the query's **Region** matches where your traces and services exist.
1. If you set a custom **Endpoint**, make sure it corresponds to the same region as **Default region**.
1. Clear any custom endpoint you no longer need. A stale endpoint silently routes requests to the wrong service.

## Query editor errors

These errors surface in the query editor when executing queries against the data source. Each symptom below maps to a specific query type or field, so match what you see in your panel before jumping to a solution.

### "No data" or empty results

**Symptoms:**

- The panel shows **No data** even though you expect traces or services to exist.

**Possible causes and solutions:**

| Cause | Solution |
|-------|----------|
| Time range doesn't contain trace data | Expand the dashboard time range and confirm traces exist in X-Ray or Application Signals for that range. |
| Wrong region | Change the **Region** in the query header to where your application is instrumented. |
| Overly restrictive filter expression | Simplify the filter expression or remove it entirely to confirm traces are returned. |
| Trace not yet indexed by X-Ray | X-Ray can take up to one minute to index new traces. Retry after a short wait. |
| IAM identity lacks read access on the target resource | Confirm the IAM identity has `xray:BatchGetTraces` and `xray:GetTraceSummaries`. See the [IAM policy](https://grafana.com/docs/plugins/grafana-x-ray-datasource/latest/configure/#iam-policy). |

### "Trace not found"

**Symptoms:**

- Pasting a trace ID into the query field returns a "trace not found" error.

**Solutions:**

1. Verify the trace ID is correct and hasn't been truncated.
1. Confirm the trace exists in the **Default region** of the data source, or select the correct region in the query header.
1. X-Ray retains traces for 30 days by default. Older traces are no longer retrievable.
1. If the trace uses the W3C format, the plugin automatically converts it. If it still can't be found, retry with the X-Ray trace ID format (`1-xxxxxxxx-xxxxxxxxxxxxxxxxxxxxxxxx`).

### "Service not set on query"

**Symptoms:**

- A Services mode query fails with "Service not set on query".

**Solutions:**

1. Select a **Service** in the query editor. **List service operations**, **List service dependencies**, and **List SLOs** all require a selected service.
1. If you use a template variable for service, confirm it's populated (for example, depending on **AccountId**) before the dependent query runs.

### "Unknown query type" or "unknown service query type"

**Symptoms:**

- Queries fail with "unknown query type" or "unknown service query type".

**Solutions:**

1. The query was likely saved by an older or newer plugin version. Open the query in the editor and reselect the query type.
1. Update the plugin to the latest version. Navigate to **Plugins and data** > **Plugins**.

### Trace list returns only 1000 results

**Symptoms:**

- Trace list results appear capped.
- You expect more than 1000 traces in the time range but only 1000 are returned.

**Solutions:**

1. Narrow the time range to reduce the number of traces returned.
1. Add a filter expression or select a group to make the result set more specific.
1. Split the query across multiple panels or time ranges if you need a full audit.

### Insights queries return no data

**Symptoms:**

- The Insights query type returns an empty table even though active insights exist.

**Solutions:**

1. Make a selection in the **Group** drop-down. The drop-down includes a synthetic **All** option that iterates every group — pick it if you don't want to scope to a specific group.
1. Set the **State** filter to **All** to see both active and closed insights.
1. Confirm the IAM identity has `xray:GetInsightSummaries` and `xray:GetInsight`.
1. Insights are only generated for groups that contain enough trace volume to detect anomalies. Verify in the AWS console that the selected group has active insights.

### Service map is empty

**Symptoms:**

- The Service Map query returns no nodes even though traces exist in the selected time range.

**Solutions:**

1. Confirm the dashboard time range covers a window in which traces were captured.
1. If cross-account observability is configured, check the **AccountId** multi-select. Leaving it empty returns only the data source's own account; selecting linked accounts widens the map.
1. Use a [Node graph](https://grafana.com/docs/grafana/<GRAFANA_VERSION>/panels-visualizations/visualizations/node-graph/) panel — the service map data isn't designed for table or time-series visualizations.
1. Confirm the IAM identity has `xray:GetServiceGraph`.

### Service variable produces broken filter expressions

**Symptoms:**

- A Trace list or Trace statistics query that references `$service` returns a filter-expression parse error.
- The query's effective filter expression contains JSON like `service("{"Type":"Service","Name":"checkout-api"...}")`.

**Cause:**

The **Service** template variable's value is a JSON blob (that's what the Application Signals APIs consume), not a service name.

**Solution:**

Use the `:text` format modifier to emit the display name:

```text
service("${service:text}")
```

Refer to [Template variables — The Service variable's value is a JSON blob](https://grafana.com/docs/plugins/grafana-x-ray-datasource/latest/template-variables/#the-service-variables-value-is-a-json-blob).

## Alerting errors

These issues surface when building or evaluating [Grafana alert rules](https://grafana.com/docs/plugins/grafana-x-ray-datasource/latest/alerting/) on AWS Application Signals or X-Ray data.

### Alert rule can't be created on a query

**Symptoms:**

- The **Set alert rule** button is disabled on a panel.
- An alert rule saves but always evaluates as **No Data**.

**Cause:**

Grafana Alerting only evaluates queries that return numeric time series. Query types such as **Trace list**, **Service Map**, **Insights**, and most **Trace Analytics** sub-types return tables or graphs and can't be reduced to a single number.

**Solution:**

Rewrite the query as a **Trace Statistics** query with the same filter expression. Refer to the [alerting-compatible query types table](https://grafana.com/docs/plugins/grafana-x-ray-datasource/latest/alerting/#alerting-compatible-query-types).

### Alert evaluates as "No Data"

**Symptoms:**

- The alert rule shows **No Data** in the rule list or firing history.
- The same query in a panel returns data.

**Possible causes and solutions:**

| Cause | Solution |
|-------|----------|
| Alert evaluation interval starts before the first Trace Statistics bucket is filled | Set the **Pending period** to at least two evaluation intervals so partial buckets don't cause transient **No Data** states. |
| The filter expression references a dashboard template variable | Alert rules evaluate without dashboard context. Use a **Constant** or **Text box** variable, or hard-code the value in the alert filter expression. Refer to [Use template variables in alert queries](https://grafana.com/docs/plugins/grafana-x-ray-datasource/latest/alerting/#use-template-variables-in-alert-queries). |
| Resolution doesn't align with evaluation interval | Set **Resolution** to a value that divides evenly into the evaluation interval (for example, `60s` for a `1m` interval). |
| Selected **Columns** don't include the metric the alert reduces | Add the required column — for example, an alert on fault ratio needs both **Fault Count** and **Total Count**. |

### Fault-rate alert fires when there's no traffic

**Symptoms:**

- An alert like `FaultCount / TotalCount > 0.01` fires during quiet hours.
- The rule evaluates to `NaN` or `+Inf`.

**Cause:**

Dividing by a zero **Total Count** produces `NaN` or infinity, which can either fire the rule or send it into **Error** state depending on how you reduce the result.

**Solution:**

Add a guard expression before the threshold. For example, add an intermediate Math expression that returns `0` when the total count is zero:

```text
$TotalCount == 0 ? 0 : $FaultCount / $TotalCount
```

Or require a minimum traffic volume before the ratio alert can fire — for example, alert only when `TotalCount > 100` and `FaultCount / TotalCount > 0.01`.

### Alert rule loses its series between evaluations

**Symptoms:**

- The alert transitions rapidly between **Firing**, **No Data**, and **Normal**.
- Firing history shows inconsistent label sets.

**Cause:**

Trace Statistics queries return one series per non-empty column and per group dimension. When a column has no data in a given bucket, its series disappears, changing the series set.

**Solution:**

1. In the **Reduce** expression, set the **Mode** to **Drop non-numeric values** or **Replace non-numeric values with zero** depending on intent.
1. Use a single column per alert rule (for example, only **Fault Count**) so the series set is deterministic.
1. Set **Resolution** to `300s` for low-traffic services so each bucket has enough data to produce a stable series.

### Alert throttled by the X-Ray API

**Symptoms:**

- The alert occasionally transitions to **Error** with messages such as `ThrottlingException` or `Rate exceeded`.

**Solution:**

Refer to [X-Ray API throttling or "Rate exceeded"](#x-ray-api-throttling-or-rate-exceeded). For alert-specific mitigation:

1. Increase **Resolution** from `60s` to `300s` to reduce `GetTimeSeriesServiceStatistics` call volume.
1. Consolidate multiple per-service alerts into one alert with a broader filter expression and label-based routing.
1. Request a [quota increase](https://docs.aws.amazon.com/general/latest/gr/xray.html) from AWS if you run many concurrent alert rules.

### Alerting on Application Signals SLOs doesn't match AWS SLO state

**Symptoms:**

- A Grafana alert built on a **List Service Level Objectives (SLO)** query fires or clears out of sync with AWS's own SLO status.

**Cause:**

The plugin's SLO query returns the current SLO snapshot at query time, not the AWS-calculated SLO burn rate.

**Solution:**

For production SLO alerting, prefer native CloudWatch alarms on the SLO metrics Application Signals publishes. Refer to [Alerting on Application Signals SLOs](https://grafana.com/docs/plugins/grafana-x-ray-datasource/latest/alerting/#alerting-on-application-signals-slos).

## Template variable errors

These errors occur when using template variables with the data source.

### Variables return no values

**Possible causes and solutions:**

| Cause | Solution |
|-------|----------|
| Cross-account observability not configured | The **Accounts** query type requires cross-account observability to be enabled in AWS and the `oam:ListSinks` / `oam:ListAttachedLinks` permissions on the Grafana IAM identity. |
| Parent variable not resolved | For cascading variables (for example, **Operations** depending on **Service**), confirm parent variables have valid values. Set **Refresh** to **On time range change** on dependent variables. |
| Required field empty | Every non-**Regions** query type requires **Region**. **Operations** additionally requires **Service**. **Services** doesn't strictly require **AccountId** — leave it blank to query the data source's own account. |
| IAM permissions missing | Confirm the identity has `application-signals:ListServices` and related `List*` actions. |
| Service variable value is JSON | If another plugin or panel expects a plain service name, switch to `${service:text}`. Refer to [Template variables — The Service variable's value is a JSON blob](https://grafana.com/docs/plugins/grafana-x-ray-datasource/latest/template-variables/#the-service-variables-value-is-a-json-blob). |

### Variables are slow to load

**Solutions:**

1. Set variable **Refresh** to **On dashboard load** instead of **On time range change** so the query only runs when the dashboard opens.
1. Narrow the scope of variable queries (for example, restrict **Services** to a single account).
1. Enable query caching in Grafana Cloud or Grafana Enterprise.

## Performance issues

These issues relate to slow queries or AWS API limits.

### X-Ray API throttling or "Rate exceeded"

**Symptoms:**

- Queries fail intermittently with "Rate exceeded" or `ThrottlingException`.
- Dashboards with many panels fail to load simultaneously.

**Solutions:**

1. Reduce the dashboard refresh interval.
1. Increase **Resolution** on Trace statistics queries (for example, from **60s** to **300s**) to reduce the number of API calls.
1. Combine multiple narrow panels into a single broader query where possible.
1. Enable [query caching](https://grafana.com/docs/grafana/<GRAFANA_VERSION>/administration/data-source-management/#query-caching) in Grafana Cloud or Grafana Enterprise.
1. Request a quota increase from AWS if you have a high-traffic monitoring account.

### Slow service map or trace list queries

**Solutions:**

1. Narrow the time range. Service map and Trace list performance degrade as the number of traces in the range grows.
1. Add a filter expression to reduce the trace population.
1. Use an X-Ray **Group** with a pre-defined filter expression for commonly inspected slices.

## Enable debug logging

To capture detailed error information for troubleshooting:

1. Set the Grafana log level to `debug` in the Grafana configuration file:

   ```ini
   [log]
   level = debug
   ```

1. Restart `grafana-server`.
1. Reproduce the issue and review logs in `/var/log/grafana/grafana.log` (or your configured log location).
1. Look for entries that include request and response details for X-Ray or Application Signals.
1. Reset the log level to `info` after troubleshooting to avoid excessive log volume.

{{< admonition type="note" >}}
On Grafana Cloud, contact Grafana Support to enable debug logging. You can't change `grafana.ini` directly on managed instances.
{{< /admonition >}}

## Get additional help

If you've tried the solutions above and still encounter issues:

1. Search the [Grafana community forums](https://community.grafana.com/) for similar issues.
1. Review or open an issue on the [AWS Application Signals plugin GitHub repository](https://github.com/grafana/x-ray-datasource/issues).
1. Consult the [AWS X-Ray documentation](https://docs.aws.amazon.com/xray/latest/devguide/aws-xray.html) and [AWS Application Signals documentation](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-Application-Monitoring-Sections.html) for service-specific guidance.
1. Contact [Grafana Support](https://grafana.com/support/) if you're a Grafana Cloud or Grafana Enterprise customer.
1. When reporting issues, include:
   - Grafana version.
   - Plugin version (visible in **Plugins and data** > **Plugins**).
   - Error messages, with sensitive information redacted.
   - Steps to reproduce.
   - The relevant data source configuration, with credentials redacted.
