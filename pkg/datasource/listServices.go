package datasource

import (
	"context"
	"encoding/json"

	"github.com/grafana/grafana-plugin-sdk-go/backend"
	"github.com/grafana/grafana-plugin-sdk-go/data"

	"github.com/aws/aws-sdk-go-v2/service/applicationsignals"
)

type ListServicesQueryData struct {
	Region                string   `json:"region,omitempty"`
	AccountIds            []string `json:"accountIds,omitempty"`
	IncludeLinkedAccounts bool     `json:"includeLinkedAccounts,omitempty"`
}

func (ds *Datasource) ListServices(ctx context.Context, query backend.DataQuery, pluginContext backend.PluginContext) backend.DataResponse {
	queryData := &ListServicesQueryData{}
	err := json.Unmarshal(query.JSON, queryData)

	if err != nil {
		return backend.ErrorResponseWithErrorSource(backend.PluginError(err))
	}

	appSignalsClient, err := ds.getAppSignalsClient(ctx, pluginContext, RequestSettings{Region: queryData.Region})
	if err != nil {
		return backend.ErrorResponseWithErrorSource(backend.PluginError(err))
	}

	input := applicationsignals.ListServicesInput{
		StartTime:             &query.TimeRange.From,
		EndTime:               &query.TimeRange.To,
		IncludeLinkedAccounts: queryData.IncludeLinkedAccounts,
	}
	if len(queryData.AccountIds) > 0 {
		input.AwsAccountId = &queryData.AccountIds[0]
	}

	var listServicesFrame = data.NewFrame(
		"ListServices",
		data.NewField("Type", nil, []string{}),
		data.NewField("ResourceType", nil, []string{}),
		data.NewField("Name", nil, []string{}),
		data.NewField("Identifier", nil, []string{}),
		data.NewField("Environment", nil, []string{}),
		data.NewField("PlatformType", nil, []string{}),
		data.NewField("EKS.Cluster", nil, []string{}),
		data.NewField("K8s.Cluster", nil, []string{}),
		data.NewField("Namespace", nil, []string{}),
		data.NewField("Workload", nil, []string{}),
		data.NewField("Node", nil, []string{}),
		data.NewField("Pod", nil, []string{}),
		data.NewField("EC2.AutoScalingGroup", nil, []string{}),
		data.NewField("EC2.InstanceId", nil, []string{}),
		data.NewField("Host", nil, []string{}),
		data.NewField("Application", nil, []string{}),
		data.NewField("Application.ARN", nil, []string{}),
		data.NewField("Telemetry.SDK", nil, []string{}),
		data.NewField("Telemetry.Agent", nil, []string{}),
		data.NewField("Telemetry.Source", nil, []string{}),
	)

	pager := applicationsignals.NewListServicesPaginator(appSignalsClient, &input)
	var pagerError error
	for pager.HasMorePages() {
		output, err := pager.NextPage(ctx)
		if err != nil {
			pagerError = err
			break
		}

		for _, summary := range output.ServiceSummaries {
			var platformType, eksCluster, k8sCluster, namespace, workload, node, pod, autoScalingGroup, instanceId, host string
			var application, applicationArn string
			var telemetrySDK, telemetryAgent, telemetrySource string
			for _, currMap := range summary.AttributeMaps {
				backend.Logger.Warn("attribute map", "currMap", currMap)
				if currMap["PlatformType"] != "" {
					platformType = currMap["PlatformType"]
					eksCluster = currMap["EKS.Cluster"]
					k8sCluster = currMap["K8s.Cluster"]
					namespace = currMap["K8s.Namespace"]
					workload = currMap["K8s.Workload"]
					node = currMap["K8s.Node"]
					pod = currMap["K8s.Pod"]
					autoScalingGroup = currMap["EC2.AutoScalingGroup"]
					instanceId = currMap["EC2.InstanceId"]
					host = currMap["Host"]
				}

				if currMap["AWS.Application"] != "" {
					application = currMap["AWS.Application"]
					applicationArn = currMap["AWS.Application.ARN"]
				}

				if currMap["Telemetry.SDK"] != "" {
					telemetrySDK = currMap["Telemetry.SDK"]
					telemetryAgent = currMap["Telemetry.Agent"]
					telemetrySource = currMap["Telemetry.Source"]
				}
			}

			listServicesFrame.AppendRow(
				summary.KeyAttributes["Type"],
				summary.KeyAttributes["ResourceType"],
				summary.KeyAttributes["Name"],
				summary.KeyAttributes["Identifier"],
				summary.KeyAttributes["Environment"],

				platformType, eksCluster, k8sCluster, namespace, workload, node, pod, autoScalingGroup, instanceId, host,
				application, applicationArn,
				telemetrySDK, telemetryAgent, telemetrySource,
			)
		}

	}
	if pagerError != nil {
		return backend.ErrorResponseWithErrorSource(backend.DownstreamError(pagerError))
	}

	return backend.DataResponse{
		Frames: data.Frames{listServicesFrame},
	}
}
