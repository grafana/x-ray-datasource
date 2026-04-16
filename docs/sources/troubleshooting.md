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

This document provides solutions to common issues you might encounter when configuring or using the AWS Application Signals data source. For configuration instructions, refer to [Configure the data source](https://grafana.com/docs/plugins/grafana-x-ray-datasource/latest/configure/).

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
| Wrong authentication method selected | Confirm the method matches where Grafana runs. For example, use **EC2 IAM role** on EC2, **Workspace IAM role** on Amazon Managed Grafana. |
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

## Query errors

These errors occur when executing queries against the data source.

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

1. Select a **Group** in the query editor. Insights queries require a group.
1. Set the **State** filter to **All** to see both active and closed insights.
1. Confirm the IAM identity has `xray:GetInsightSummaries` and `xray:GetInsight`.

## Template variable errors

These errors occur when using template variables with the data source.

### Variables return no values

**Possible causes and solutions:**

| Cause | Solution |
|-------|----------|
| Cross-account observability not configured | The **Accounts** query type requires cross-account observability to be enabled in AWS and the `oam:ListSinks` / `oam:ListAttachedLinks` permissions on the Grafana IAM identity. |
| Parent variable not resolved | For cascading variables (for example, **Operations** depending on **Service**), confirm parent variables have valid values. |
| Required field empty | **Services** requires **AccountId**; **Operations** requires **Service**. Populate the required field either with a constant or another variable. |
| IAM permissions missing | Confirm the identity has `application-signals:ListServices` and related `List*` actions. |

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
