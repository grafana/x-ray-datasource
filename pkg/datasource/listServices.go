package datasource

import (
	"context"
	"encoding/json"
	"fmt"
	"slices"

	"github.com/grafana/grafana-plugin-sdk-go/backend"
	"github.com/grafana/grafana-plugin-sdk-go/data"

	"github.com/aws/aws-sdk-go-v2/service/applicationsignals"
)

type ListServicesQueryData struct {
	Region                string `json:"region,omitempty"`
	AccountId             string `json:"accountId,omitempty"`
	IncludeLinkedAccounts bool   `json:"includeLinkedAccounts,omitempty"`
}

// buildServiceDimensions returns the dimension keys and dimension values we need for cloudwatch metric searches
func buildServiceDimensions(platformInfo map[string]string, service string, accountId string) (string, string) {
	keys := ""
	dimensions := ""

	if cluster, ok := platformInfo["EKS.Cluster"]; ok {
		keys += "\"HostedIn.EKS.Cluster\","
		dimensions += "HostedIn.EKS.Cluster=\"" + cluster + "\" "
	}
	if cluster, ok := platformInfo["K8s.Cluster"]; ok {
		keys += "\"HostedIn.K8s.Cluster\","
		dimensions += "HostedIn.K8s.Cluster=\"" + cluster + "\" "
	}
	if namespace, ok := platformInfo["K8s.Namespace"]; ok {
		keys += "\"HostedIn.K8s.Namespace\","
		dimensions += "HostedIn.K8s.Namespace=\"" + namespace + "\" "
	}

	keys += "\"Service\""
	dimensions += "Service=\"" + service + "\""
	if accountId != "" {
		dimensions += " :aws.AccountId=\"" + accountId + "\""
	}

	return keys, dimensions
}

func buildKeyAttributes(keyAttributes map[string]string) string {
	keys := []string{}
	for key := range keyAttributes {
		keys = append(keys, key)
	}
	slices.Sort(keys)

	keyStr := "{"
	for _, k := range keys {
		keyStr += fmt.Sprintf(`"%s":"%s",`, k, keyAttributes[k])
	}
	keyStr = keyStr[:len(keyStr)-1] + "}"
	return keyStr
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
	if len(queryData.AccountId) > 0 {
		input.AwsAccountId = &queryData.AccountId
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
		data.NewField("DimensionKeys", nil, []string{}),
		data.NewField("Dimensions", nil, []string{}),
		data.NewField("KeyAttributes", nil, []string{}),
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
			var platformType, eksCluster, k8sCluster, namespace, workload, node, pod, autoScalingGroup, instanceId, host, dimensionKeys, dimensions string
			var application, applicationArn string
			var telemetrySDK, telemetryAgent, telemetrySource string
			for _, currentMap := range summary.AttributeMaps {
				if currentMap["PlatformType"] != "" {
					platformType = currentMap["PlatformType"]
					eksCluster = currentMap["EKS.Cluster"]
					k8sCluster = currentMap["K8s.Cluster"]
					namespace = currentMap["K8s.Namespace"]
					workload = currentMap["K8s.Workload"]
					node = currentMap["K8s.Node"]
					pod = currentMap["K8s.Pod"]
					autoScalingGroup = currentMap["EC2.AutoScalingGroup"]
					instanceId = currentMap["EC2.InstanceId"]
					host = currentMap["Host"]

					dimensionKeys, dimensions = buildServiceDimensions(currentMap, summary.KeyAttributes["Name"], queryData.AccountId)
				}

				if currentMap["AWS.Application"] != "" {
					application = currentMap["AWS.Application"]
					applicationArn = currentMap["AWS.Application.ARN"]
				}

				if currentMap["Telemetry.SDK"] != "" {
					telemetrySDK = currentMap["Telemetry.SDK"]
					telemetryAgent = currentMap["Telemetry.Agent"]
					telemetrySource = currentMap["Telemetry.Source"]
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
				dimensionKeys, dimensions, buildKeyAttributes(summary.KeyAttributes),
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
