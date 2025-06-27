package datasource

import (
	"context"
	"encoding/json"

	"github.com/grafana/grafana-plugin-sdk-go/backend"
	"github.com/grafana/grafana-plugin-sdk-go/data"

	"github.com/aws/aws-sdk-go-v2/service/applicationsignals"
)

type ListServiceOperationsQueryData struct {
	Region        string `json:"region,omitempty"`
	ServiceString string `json:"serviceString,omitempty"`
}

func (ds *Datasource) ListServiceOperations(ctx context.Context, query backend.DataQuery, pluginContext backend.PluginContext) backend.DataResponse {
	queryData := &ListServiceOperationsQueryData{}
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

	input := applicationsignals.ListServiceOperationsInput{
		StartTime:     &query.TimeRange.From,
		EndTime:       &query.TimeRange.To,
		KeyAttributes: serviceMap,
	}

	var listServicesFrame = data.NewFrame(
		"ListServices",
		data.NewField("Name", nil, []*string{}),
		data.NewField("MetricName", nil, []*string{}),
		data.NewField("MetricType", nil, []*string{}),
		data.NewField("Namespace", nil, []*string{}),
		data.NewField("AccountId", nil, []*string{}),
		data.NewField("Dimensions", nil, []*string{}),
	)

	pager := applicationsignals.NewListServiceOperationsPaginator(appSignalsClient, &input)
	var pagerError error

	for pager.HasMorePages() {
		output, err := pager.NextPage(ctx)
		if err != nil {
			pagerError = err
			break
		}

		for _, operation := range output.ServiceOperations {
			for _, metric := range operation.MetricReferences {
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
				listServicesFrame.AppendRow(
					operation.Name,
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
		Frames: data.Frames{listServicesFrame},
	}
}
