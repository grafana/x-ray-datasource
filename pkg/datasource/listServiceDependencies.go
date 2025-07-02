package datasource

import (
	"context"
	"encoding/json"
	"fmt"
	"sort"
	"strings"

	"github.com/grafana/grafana-plugin-sdk-go/backend"
	"github.com/grafana/grafana-plugin-sdk-go/data"

	"github.com/aws/aws-sdk-go-v2/service/applicationsignals"
)

type ListServiceDependenciesQueryData struct {
	Region        string `json:"region,omitempty"`
	ServiceString string `json:"serviceString,omitempty"`
}

func (ds *Datasource) ListServiceDependencies(ctx context.Context, query backend.DataQuery, pluginContext backend.PluginContext) backend.DataResponse {
	queryData := &ListServiceDependenciesQueryData{}
	err := json.Unmarshal(query.JSON, queryData)
	if err != nil {
		return backend.ErrorResponseWithErrorSource(backend.PluginError(err))
	}

	if len(queryData.ServiceString) == 0 {
		return backend.ErrorResponseWithErrorSource(backend.DownstreamErrorf("Service not set on query"))
	}

	appSignalsClient, err := ds.getAppSignalsClient(ctx, pluginContext, RequestSettings{Region: queryData.Region})
	if err != nil {
		return backend.ErrorResponseWithErrorSource(backend.PluginError(err))
	}

	serviceMap := map[string]string{}
	err = json.Unmarshal([]byte(queryData.ServiceString), &serviceMap)
	if err != nil {
		return backend.ErrorResponseWithErrorSource(backend.PluginError(err))
	}

	input := applicationsignals.ListServiceDependenciesInput{
		StartTime:     &query.TimeRange.From,
		EndTime:       &query.TimeRange.To,
		KeyAttributes: serviceMap,
	}

	var listServiceDependenciesFrame = data.NewFrame(
		"ListServiceDependencies",
		data.NewField("OperationName", nil, []*string{}),
		data.NewField("DependencyKeyAttributes", nil, []*string{}),
		data.NewField("DependencyOperationName", nil, []*string{}),

		data.NewField("MetricName", nil, []*string{}),
		data.NewField("MetricType", nil, []*string{}),
		data.NewField("Namespace", nil, []*string{}),
		data.NewField("AccountId", nil, []*string{}),
		data.NewField("Dimensions", nil, []*string{}),
	)

	pager := applicationsignals.NewListServiceDependenciesPaginator(appSignalsClient, &input)
	var pagerError error

	for pager.HasMorePages() {
		output, err := pager.NextPage(ctx)
		if err != nil {
			pagerError = err
			break
		}

		for _, dependency := range output.ServiceDependencies {
			for _, metric := range dependency.MetricReferences {
				dimensions := ""
				for i, dimension := range metric.Dimensions {
					if i > 0 {
						dimensions += " "
					}
					dimensions += *dimension.Name + "=\"" + *dimension.Value + "\""
				}
				var dimensionsPtr *string
				if len(dimensions) > 0 {
					dimensionsPtr = &dimensions
				}

				// sort the keys to ensure consistent ordering and testability
				sortedAttributeKeys := make([]string, 0, len(dependency.DependencyKeyAttributes))
				for k := range dependency.DependencyKeyAttributes {
					sortedAttributeKeys = append(sortedAttributeKeys, k)
				}
				sort.Strings(sortedAttributeKeys)

				// build key:value strings for sorted attributes
				attributePairs := make([]string, 0, len(dependency.DependencyKeyAttributes))
				for _, k := range sortedAttributeKeys {
					attributePairs = append(attributePairs, fmt.Sprintf("%s:%s", k, dependency.DependencyKeyAttributes[k]))
				}

				finalString := strings.Join(attributePairs, ", ")

				var dependencyKeyAttributesPtr *string
				if len(finalString) > 0 {
					dependencyKeyAttributesPtr = &finalString
				}

				listServiceDependenciesFrame.AppendRow(
					dependency.OperationName,
					dependencyKeyAttributesPtr,
					dependency.DependencyOperationName,
					metric.MetricName,
					metric.MetricType,
					metric.Namespace,
					metric.AccountId,
					dimensionsPtr,
				)
			}
		}

	}
	if pagerError != nil {
		return backend.ErrorResponseWithErrorSource(backend.DownstreamError(pagerError))
	}

	return backend.DataResponse{
		Frames: data.Frames{listServiceDependenciesFrame},
	}
}
