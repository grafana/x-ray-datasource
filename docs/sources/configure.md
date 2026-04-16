---
aliases:
  - ../authentication/
  - ../provisioning/
description: Configure the AWS Application Signals data source in Grafana, including authentication, IAM permissions, cross-account observability, provisioning, and Terraform.
keywords:
  - grafana
  - aws
  - application signals
  - x-ray
  - configure
  - authentication
  - iam
  - provisioning
  - terraform
labels:
  products:
    - cloud
    - enterprise
    - oss
menuTitle: Configure
title: Configure the AWS Application Signals data source
weight: 200
review_date: 2026-04-16
---

# Configure the AWS Application Signals data source

This document explains how to configure the AWS Application Signals data source in Grafana, including authentication options, IAM permissions, cross-account observability, and provisioning with YAML or Terraform.

## Before you begin

Before you configure the data source, ensure you have:

- **Grafana permissions:** The `Admin` role in your Grafana organization so you can add and edit data sources. For provisioning, you need access to the Grafana configuration directory on the host.
- **AWS account:** Access to an AWS account with [AWS X-Ray](https://docs.aws.amazon.com/xray/latest/devguide/aws-xray.html) and/or [AWS Application Signals](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-Application-Monitoring-Sections.html) enabled.
- **IAM credentials:** An IAM identity (user or role) with read access to X-Ray and Application Signals. See [IAM policy](#iam-policy).
- **Grafana version:** Grafana `10.4.0` or later.

## Key concepts

If you're new to AWS X-Ray or Application Signals, these terms are used throughout the configuration:

| Term | Description |
|------|-------------|
| **AWS X-Ray** | AWS distributed tracing service that records trace segments for requests flowing through your applications. |
| **AWS Application Signals** | AWS service built on CloudWatch that tracks application health through services, service operations, dependencies, and SLOs. |
| **IAM policy** | A JSON document attached to an IAM user or role that grants AWS API permissions. |
| **Assume role** | An AWS mechanism that lets one identity take on temporary credentials for another role, often used for cross-account access. |
| **OAM (Observability Access Manager)** | AWS service that connects monitoring accounts to source accounts so you can observe telemetry across accounts. |

## Add the data source

To add the data source:

1. Click **Connections** in the left-side menu.
1. Click **Add new connection**.
1. Type `AWS Application Signals` in the search bar.
1. Select **AWS Application Signals**.
1. Click **Add new data source** in the upper right.

You're taken to the **Settings** tab where you can configure the data source.

## Configure settings

The following settings are available in the data source configuration page:

| Setting | Description |
|---------|-------------|
| **Name** | The display name for this data source. This name is shown in panels and queries. |
| **Default** | Toggle to make this the default data source for new panels. |
| **Default region** | The AWS region used when a query doesn't specify its own region. You can override this per-query in the query editor. |

## Choose an authentication method

The AWS Application Signals data source uses the shared Grafana AWS SDK authentication component, which supports the following methods. Choose the method that matches where Grafana is running and how you manage credentials.

| Authentication method | Best for | Requirements |
|-----------------------|----------|--------------|
| **AWS SDK Default** | Grafana instances running on AWS with an attached role, or environments that set standard AWS SDK variables. | No additional credentials; the SDK uses the default provider chain. |
| **Access and secret key** | Local development, simple setups, or when you want to provision explicit keys. | An IAM user with an access key and secret key. |
| **Credentials file** | Self-hosted Grafana with credentials in `~/.aws/credentials` on the Grafana host. | A credentials file readable by the `grafana` user. |
| **EC2 IAM role** | Grafana running on an EC2 instance. | An IAM role attached to the EC2 instance. |
| **Workspace IAM role** | Amazon Managed Grafana workspaces. | A workspace IAM role provided by Amazon Managed Grafana. |
| **Grafana Assume Role** | Cross-account access where Grafana assumes a role in another AWS account. | A trust policy on the target role that allows your Grafana identity to assume it. |

After selecting an authentication method, fill in the following fields as needed:

| Field | Description |
|-------|-------------|
| **Assume Role ARN** | The ARN of an IAM role to assume after authenticating with the chosen method. Optional. |
| **External ID** | An external ID used in the role's trust policy. Required when the target role is configured with an external ID. |
| **Endpoint** | An optional custom service endpoint to use instead of the default AWS endpoint. Useful for VPC endpoints or AWS GovCloud. |
| **Default Region** | The AWS region used for requests when a query doesn't specify its own region. |

{{< admonition type="note" >}}
Plain [AWS role switching](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_use_switch-role-cli.html) as configured in `~/.aws/config` profiles isn't supported. Use the **Assume Role ARN** field in the data source configuration or the **Grafana Assume Role** authentication method instead.
{{< /admonition >}}

### Grafana Assume Role

Grafana Assume Role lets Grafana use its own IAM identity to assume a role you control in your AWS account, without sharing long-lived credentials.

To use Grafana Assume Role:

1. In your AWS account, create an IAM role with the [IAM policy](#iam-policy) attached.
1. Add a trust policy to the role that allows Grafana's IAM identity to assume it. Refer to the [Grafana Assume Role documentation](https://grafana.com/docs/grafana-cloud/connect-externally-hosted/data-source-management/aws-iam-role/) for the exact trust policy.
1. In the Grafana data source settings, select **Grafana Assume Role** as the authentication provider.
1. Enter the **Assume Role ARN** and, if used, the **External ID**.

Session tokens are supported for temporary credentials, which are refreshed automatically.

### Credentials file

To authenticate with a credentials file, create a file at `~/.aws/credentials` under the `HOME` path of the user running `grafana-server`:

```ini
[default]
aws_access_key_id = <ACCESS_KEY>
aws_secret_access_key = <SECRET_KEY>
region = us-east-1
```

{{< admonition type="note" >}}
If the credentials file is in the correct directory but isn't picked up, try moving the `.aws` directory to `/usr/share/grafana/`. The credentials file must have permissions no broader than `0644`.
{{< /admonition >}}

If the auth provider is **Credentials file**, Grafana obtains credentials in the following order:

1. Hard-coded credentials.
1. Environment variables (`AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY`).
1. The existing default AWS config files.
1. `~/.aws/credentials`.
1. IAM role for Amazon EC2.

For more information, refer to [Configuring the AWS SDK for Go](https://docs.aws.amazon.com/sdk-for-go/v1/developer-guide/configuring-sdk.html) in the AWS documentation.

## IAM policy

The IAM identity Grafana uses must have permission to read X-Ray data, Application Signals resources, EC2 region metadata, and - for cross-account observability - OAM sinks and links.

The following policy grants the minimum permissions needed by the plugin:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "XrayPermissions",
      "Effect": "Allow",
      "Action": [
        "xray:BatchGetTraces",
        "xray:GetTraceSummaries",
        "xray:GetTraceGraph",
        "xray:GetGroups",
        "xray:GetTimeSeriesServiceStatistics",
        "xray:GetInsightSummaries",
        "xray:GetInsight",
        "xray:GetServiceGraph"
      ],
      "Resource": "*"
    },
    {
      "Sid": "ApplicationSignalsPermissions",
      "Effect": "Allow",
      "Action": [
        "application-signals:ListServices",
        "application-signals:ListServiceOperations",
        "application-signals:ListServiceDependencies",
        "application-signals:ListServiceLevelObjectives"
      ],
      "Resource": "*"
    },
    {
      "Sid": "EC2Regions",
      "Effect": "Allow",
      "Action": ["ec2:DescribeRegions"],
      "Resource": "*"
    },
    {
      "Sid": "CrossAccountObservability",
      "Effect": "Allow",
      "Action": [
        "oam:ListSinks",
        "oam:ListAttachedLinks"
      ],
      "Resource": "*"
    }
  ]
}
```

{{< admonition type="caution" >}}
If you omit the `oam:ListSinks` and `oam:ListAttachedLinks` actions, cross-account observability features fail silently: the account-ID drop-down is empty and service maps only show resources from the current account.
{{< /admonition >}}

## Cross-account observability

AWS Application Signals supports cross-account observability through [CloudWatch cross-account observability](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-Unified-Cross-Account.html), which uses OAM to connect a monitoring account to one or more source accounts.

To enable cross-account observability in Grafana:

1. In AWS, configure a CloudWatch cross-account observability **sink** in your monitoring account and **links** from the source accounts. Refer to the [AWS cross-account observability documentation](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-Unified-Cross-Account.html).
1. Attach the `oam:ListSinks` and `oam:ListAttachedLinks` permissions to the Grafana IAM identity. Refer to [IAM policy](#iam-policy).
1. Configure the Grafana data source in the monitoring account.

After configuration, Service Map queries and Service queries include an account-ID drop-down you can use to filter across accounts.

For more details about how cross-account filtering appears in the query editor, refer to [Filter by account ID](https://grafana.com/docs/plugins/grafana-x-ray-datasource/latest/query-editor/#filter-by-account-id).

## Private Data source Connect

This data source supports [Private Data source Connect (PDC)](https://grafana.com/docs/grafana-cloud/connect-externally-hosted/private-data-source-connect/) on Grafana `10.0.0` and later. Use PDC to reach AWS endpoints that aren't exposed to the public internet, such as VPC endpoints for X-Ray.

To enable PDC:

1. Set up a PDC agent in your private network. Refer to the [PDC setup documentation](https://grafana.com/docs/grafana-cloud/connect-externally-hosted/private-data-source-connect/).
1. In the data source settings, scroll to the **Secure Socks Proxy** section and select your PDC network.

## Verify the connection

Click **Save & test** at the bottom of the configuration page. On success, Grafana displays the message **Data source is working**.

If the test fails, refer to [Troubleshoot AWS Application Signals data source issues](https://grafana.com/docs/plugins/grafana-x-ray-datasource/latest/troubleshooting/).

## Provision the data source

You can define the AWS Application Signals data source in YAML as part of [Grafana's provisioning system](https://grafana.com/docs/grafana/<GRAFANA_VERSION>/administration/provisioning/#data-sources). Provisioning lets you manage data source configuration in version control.

### Access and secret key

```yaml
apiVersion: 1

datasources:
  - name: AWS Application Signals
    type: grafana-x-ray-datasource
    access: proxy
    jsonData:
      authType: keys
      defaultRegion: us-east-1
    secureJsonData:
      accessKey: <ACCESS_KEY>
      secretKey: <SECRET_KEY>
```

### Credentials file

```yaml
apiVersion: 1

datasources:
  - name: AWS Application Signals
    type: grafana-x-ray-datasource
    access: proxy
    jsonData:
      authType: credentials
      defaultRegion: us-east-1
      profile: default
```

### Default AWS SDK credential chain

Use this when Grafana runs on an EC2 instance or in another AWS environment that provides credentials automatically:

```yaml
apiVersion: 1

datasources:
  - name: AWS Application Signals
    type: grafana-x-ray-datasource
    access: proxy
    jsonData:
      authType: default
      defaultRegion: us-east-1
```

### Grafana Assume Role

```yaml
apiVersion: 1

datasources:
  - name: AWS Application Signals
    type: grafana-x-ray-datasource
    access: proxy
    jsonData:
      authType: grafana_assume_role
      defaultRegion: us-east-1
      assumeRoleArn: <ROLE_ARN>
      externalId: <EXTERNAL_ID>
```

### Custom endpoint

You can add a custom **endpoint** to any of the examples above, for example to use a VPC endpoint or AWS GovCloud:

```yaml
jsonData:
  authType: keys
  defaultRegion: us-gov-west-1
  endpoint: https://xray.us-gov-west-1.amazonaws.com
```

## Configure with Terraform

You can configure the AWS Application Signals data source using the [Grafana Terraform provider](https://registry.terraform.io/providers/grafana/grafana/latest/docs). This approach enables infrastructure-as-code workflows and version control for your Grafana configuration.

### Terraform prerequisites

- [Terraform](https://www.terraform.io/downloads) installed.
- The Grafana Terraform provider configured with appropriate credentials.
- For Grafana Cloud: A [Cloud Access Policy token](https://grafana.com/docs/grafana-cloud/account-management/authentication-and-permissions/access-policies/) with data source permissions.

### Provider configuration

Configure the Grafana provider to connect to your Grafana instance:

```hcl
terraform {
  required_providers {
    grafana = {
      source  = "grafana/grafana"
      version = ">= 2.0.0"
    }
  }
}

provider "grafana" {
  url  = "<GRAFANA_URL>"
  auth = "<API_KEY_OR_SERVICE_ACCOUNT_TOKEN>"
}
```

### Terraform examples

The following examples show how to configure the AWS Application Signals data source for each authentication method.

**Access and secret key:**

```hcl
resource "grafana_data_source" "application_signals" {
  type = "grafana-x-ray-datasource"
  name = "AWS Application Signals"

  json_data_encoded = jsonencode({
    authType      = "keys"
    defaultRegion = "us-east-1"
  })

  secure_json_data_encoded = jsonencode({
    accessKey = "<ACCESS_KEY>"
    secretKey = "<SECRET_KEY>"
  })
}
```

**Default AWS SDK credential chain:**

```hcl
resource "grafana_data_source" "application_signals" {
  type = "grafana-x-ray-datasource"
  name = "AWS Application Signals"

  json_data_encoded = jsonencode({
    authType      = "default"
    defaultRegion = "us-east-1"
  })
}
```

**Grafana Assume Role with external ID:**

```hcl
resource "grafana_data_source" "application_signals" {
  type = "grafana-x-ray-datasource"
  name = "AWS Application Signals"

  json_data_encoded = jsonencode({
    authType      = "grafana_assume_role"
    defaultRegion = "us-east-1"
    assumeRoleArn = "<ROLE_ARN>"
    externalId    = "<EXTERNAL_ID>"
  })
}
```

**Custom endpoint:**

Add `endpoint` to `json_data_encoded` for any of the preceding examples:

```hcl
resource "grafana_data_source" "application_signals" {
  type = "grafana-x-ray-datasource"
  name = "AWS Application Signals (GovCloud)"

  json_data_encoded = jsonencode({
    authType      = "keys"
    defaultRegion = "us-gov-west-1"
    endpoint      = "https://xray.us-gov-west-1.amazonaws.com"
  })

  secure_json_data_encoded = jsonencode({
    accessKey = "<ACCESS_KEY>"
    secretKey = "<SECRET_KEY>"
  })
}
```

For more information about the Grafana Terraform provider, refer to the [provider documentation](https://registry.terraform.io/providers/grafana/grafana/latest/docs) and the [`grafana_data_source` resource](https://registry.terraform.io/providers/grafana/grafana/latest/docs/resources/data_source).

## Next steps

- [Query AWS Application Signals](https://grafana.com/docs/plugins/grafana-x-ray-datasource/latest/query-editor/)
- [Use template variables](https://grafana.com/docs/plugins/grafana-x-ray-datasource/latest/template-variables/)
- [Troubleshoot issues](https://grafana.com/docs/plugins/grafana-x-ray-datasource/latest/troubleshooting/)
