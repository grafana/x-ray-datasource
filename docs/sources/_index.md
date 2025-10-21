---
description: Learn about the Application Signals data source in Grafana
labels:
  products:
    - oss
    - enterprise
keywords:
  - data source
  - plugin
menuTitle: Application Signals data source
title: Application Signals data source
weight: 10
---

# Application Signals data source

The Application Signals data source plugin provides a support for [AWS Application Signals](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-Application-Monitoring-Sections.html) and [AWS X-Ray Traces](https://aws.amazon.com/xray/). This data source was formerly named the AWS X-Ray data source plugin. Add it as a data source, then you are ready to
build dashboards or use Explore with Application Signals to look at traces, analytics, or insights.

## Add the data source

1. In the side menu under the **Configuration** link, click on **Data Sources**.
1. Click the **Add data source** button.
1. Select **Application Signals** in the **Distributed tracing** section.

> **Note:** If you have issues getting this data source to work and Grafana is giving you undescriptive errors, check your log file (/var/log/grafana/grafana.log).

| Name                     | Description                                                                                                       |
| ------------------------ | ----------------------------------------------------------------------------------------------------------------- |
| Name                     | The data source name. This is how you refer to the data source in panels and queries.                             |
| Default                  | Default data source means that it will be pre-selected for new panels.                                            |
| Default Region           | Used in query editor to set region. (can be changed on per query basis)                                           |
| Auth Provider            | Specify the provider to get credentials.                                                                          |
| Credentials profile name | Specify the name of the profile to use (if you use `~/.aws/credentials` file), leave blank for default.           |
| Assume Role Arn          | Specify the ARN of the role to assume.                                                                            |
| External ID              | If you are assuming a role in another account that was created with an external ID, specify the external ID here. |

## Authentication

This section describes the different type of authentication you can use for the AWS Application Signals data source.

### IAM Roles

All access to Application Signals is done server-side by the Grafana backend using the official AWS SDK. If your Grafana
server is running on AWS you can use IAM Roles and authentication will be handled automatically.

See the AWS documentation on [IAM Roles](http://docs.aws.amazon.com/AWSEC2/latest/UserGuide/iam-roles-for-amazon-ec2.html)

> **Note:** [AWS Role Switching](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_use_switch-role-cli.html) is not currently supported.

### IAM Policies

Grafana needs permissions granted via IAM to be able to read X-Ray data
and EC2 tags/instances/regions. You can attach these permissions to IAM roles and
utilize Grafana's built-in support for assuming roles.

Here is a basic policy example:

```bash
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
        "xray:GetServiceGraph",
        "ec2:DescribeRegions"
      ],
      "Resource": "*"
    },
    {
      "Sid": "ApplicationSignalsPermissions",
      "Effect": "Allow",
      "Action": [
        "application-signals:ListServiceLevelObjectives",
        "application-signals:ListServiceDependencies",
        "application-signals:ListServiceOperations",
        "application-signals:ListServices"
      ],
      "Resource": "*"
    }
  ]
}
```

### Example AWS credentials

If the Auth Provider is `Credentials file`, Grafana tries to obtain credentials in the following order:

- Hard-code credentials
- Environment variables (`AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY`)
- Existing default config files
- ~/.aws/credentials
- IAM role for Amazon EC2

See [Configuring the AWS SDK for Go](https://docs.aws.amazon.com/sdk-for-go/v1/developer-guide/configuring-sdk.html) in the AWS documentation for more information.

### AWS credentials file

Create a file at `~/.aws/credentials`. That is the `HOME` path for users running grafana-server.

{{< admonition type="note" >}}
If the credentials file is in the correct directory, but it is not working, try moving your .aws file to '/usr/share/grafana/'. Make sure your credentials file has at most 0644 permissions.
{{< /admonition >}}

Example credential file:

```bash
[default]
aws_access_key_id = <your access key>
aws_secret_access_key = <your access key>
region = us-west-2
```

## Query editor

There are two query modes, Traces and Services.

### Traces queries

There are five X-Ray Traces query types:

- Trace List (Traces in AWS)
- Trace Statistics
- Trace Analytics (Analytics in AWS)
- Insights
- Service map

![x-ray-query-editor](https://user-images.githubusercontent.com/13729989/93520935-8f3adc80-f92f-11ea-9399-e88f67f6aa07.png)

#### Trace List

The Trace List type allows you to search for traces which are shown in a table. Clicking on the `trace id` in the first column opens the trace on the right side. Notice the query field in the editor. You can write queries, filter expressions, or insert a single trace ID that will be shown in a trace view. You can find more detail about filter expressions in [AWS X-Ray Traces documentation](https://docs.aws.amazon.com/xray/latest/devguide/xray-console-filters.html).

![x-ray-trace-list](https://user-images.githubusercontent.com/13729989/93521002-ada0d800-f92f-11ea-9b8b-3f97cd55a763.png)

> **Note:** The Trace List will only show the first 1000 traces.

#### Trace Statistics

In Trace Statistics you can see a graph and a table showing information about error, fault, throttle, success, and total count. You can use the `columns` field in the query editor to only see specified columns.

![x-ray-trace-statistics](https://user-images.githubusercontent.com/13729989/93521032-b691a980-f92f-11ea-894c-534a9e5093d5.png)

#### Trace Analytics

In Trace Analytics you can visualize the following tables:

- Root Cause
  - Response Time
    - Root Cause Service (Last service in path)
    - Path (multiple paths)
  - Error
    - Root Cause Service (Last service in path)
    - Path
    - Error Message
  - Fault
    - Root Cause Service (Last service in path)
    - Path
    - Error Message
- End user Impact
- URL
- HTTP Status Code

#### Insights

In Insights you can see the summary table for Insights. Clicking the `InsightId` will take you to AWS console.

#### Service map

Service map in Grafana enables customers to view a map of their applications built using microservices architecture. Each node on the map represents a service such as an AWS Lambda function or an API running on an API Gateway or DynamoDB table. With this map, customers can easily detect performance issues, or increase in error, fault or throttle rates in any of their services and dive deep into corresponding traces and root cause.

![Service map](https://grafana.com/static/img/docs/node-graph/node-graph-7-4.png 'Service map')

The Service Map query type shows the same data as a Trace Map inside the Application Signals console.

To display the service map:

- Use the [Node graph panel](https://grafana.com/docs/grafana/latest/panels/visualizations/node-graph/) visualization. For details on how to navigate the visualization, see [Node graph panel navigation](https://grafana.com/docs/grafana/latest/panels-visualizations/visualizations/node-graph/#node-graph-navigation).
- Show the data in a simple table. This is the only option if the Node graph panel is unavailable.

![Service map navigation](https://storage.googleapis.com/integration-artifacts/grafana-x-ray-datasource/screenshots/x-ray-service-map-nav.gif 'Service map navigation')

Similar to Trace Map root nodes, nodes in the service map representing the client application are on the left side of the map.

Each service in the map is represented as a circle. Numbers on the inside shows average time per transaction and transactions per minute.

A colored circle around the service also matches colors and meaning from Application Signals console representing percentage of requests.

- green = success
- red = fault
- yellow = errors
- purple = throttled responses

Click on the service or the edge to see a context menu with links additional links for quick navigation to other relevant information from Application Signals. You can use the links to quickly navigate to a list of all error traces for a particular service and then continue to specific trace.

For more information about Service map, refer to the official [AWS X-ray documentation](https://docs.aws.amazon.com/xray/latest/devguide/xray-console-insights.html).

#### Alerting

Since Traces queries can return numeric data, alerts are supported. See the [Alerting](https://grafana.com/docs/grafana/latest/alerting/) documentation for more on Grafana alerts.

### Service queries

Service Queries allow you to fetch the services in your application to monitor current application health and long term performance.

> The data source comes with the [Application Signals: Services dashboard](#application-signals-services-dashboard), which can be imported and is set up to fetch Services and the accompanied metrics for user selected Application Signals and CloudWatch data sources.

There are 4 service query types:

- List Services
- List Service Operations
- List Service Dependencies
- List Service Level Objectives (SLO)

#### List Services

List Services returns a table of the services in your Application Signals datasource.

#### List Service Operations

List Service Operations returns a table of the CloudWatch Metrics for the service operations for a selected service.

#### List Service Dependencies

List Service Dependencies returns a table of the CloudWatch Metrics for the service dependencies for a selected service.

#### List Service Level Objectives (SLO)

List Service Operations returns a table of the SLOs for a selected service operation.

## Application Signals: Services dashboard

The `Application Signals: Services` dashboard can be imported from the datasource and is set up to fetch Services and the accompanied metrics for user selected Application Signals and CloudWatch data sources. This dashboard allows you to select Services, Service Operations, and Service Dependencies to display the associated CloudWatch metrics.

To use this board you must have Application Signals enabled in your CloudWatch account and select the appropriate Application Signals and CloudWatch data sources and region in the dashboard variables.

More information about Application Signals and enabling it in AWS can be found in the [AWS docs](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-Application-Monitoring-Sections.html).

## Pricing

With AWS X-Ray, there are no upfront fees or commitments. You pay only for what you use, based on the number of traces recorded, retrieved, and scanned. The first 1,000,000 traces retrieved or scanned each month are free. Beyond the free tier, traces scanned cost $0.50 per 1 million traces scanned ($0.0000005 per trace).

With AWS Application Signals the first 3 months of usage for each account are free or the limit is hit:

- 100GB data ingested for Application Signals including complete visibility into application transaction spans
- 100 million Signals for Application Signals with no visibility into application transaction spans

Refer to the [CloudWatch pricing page](https://aws.amazon.com/cloudwatch/pricing/) for more details on the pricing for these APIs.

## Configure the data source with provisioning

You can configure data sources using config files with Grafana's provisioning system. For more information regarding how it works and all available settings, see [Provision Grafana](https://grafana.com/docs/grafana/latest/administration/provisioning/).

Here are some provisioning examples for this data source.

### Using a credentials file

If you are using the Credentials file authentication type, use a config similar to this:

```yaml
apiVersion: 1

datasources:
  - name: Application Signals
    type: grafana-x-ray-datasource
    jsonData:
      authType: credentials
      defaultRegion: eu-west-2
```

### Using `accessKey` and `secretKey`

```yaml
apiVersion: 1

datasources:
  - name: Application Signals
    type: grafana-x-ray-datasource
    jsonData:
      authType: keys
      defaultRegion: eu-west-2
    secureJsonData:
      accessKey: '<your access key>'
      secretKey: '<your secret key>'
```

## Cross-Account Observability

The Application Signals plugin allows you to monitor traces across multiple AWS accounts within a region with the Cross-Account Observability feature. Using cross-account observability, you can seamlessly search, visualize and analyze AWS traces without worrying about account boundaries.

### Getting started

To enable cross-account observability, first enable the feature in AWS using the official [CloudWatch docs](http://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-Unified-Cross-Account.html), then add 

```json 
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": ["oam:ListSinks", "oam:ListAttachedLinks"],
      "Effect": "Allow",
      "Resource": "*"
    }
  ]
}
```

to the IAM policy attached to the role/user running the plugin.

## Filtering Traces by Account Id

Once the feature is enabled, you will be able to display traces across multiple accounts and filter those traces by account ID. When you select the `Service Map` query type in Grafana, an account dropdown displays and populates with the account IDs shown in the traces returned in the selected time frame.

You can also add account ID as part of a query filter expression in the Trace List query type.

### Plugin repository

You can request new features, report issues, or contribute code directly through the [Application Signals Github repository](https://github.com/grafana/x-ray-datasource/)