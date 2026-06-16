package datasource

import (
	"context"
	"encoding/json"

	"github.com/aws/aws-sdk-go-v2/service/xray"
	xraytypes "github.com/aws/aws-sdk-go-v2/service/xray/types"

	"github.com/grafana/grafana-plugin-sdk-go/backend"
	"github.com/grafana/grafana-plugin-sdk-go/backend/log"
	"github.com/grafana/grafana-plugin-sdk-go/data"
)

type GetServiceMapQueryData struct {
	Region     string           `json:"region"`
	Group      *xraytypes.Group `json:"group"`
	AccountIds []string         `json:"accountIds,omitempty"`
}

// getSingleTrace returns single trace from BatchGetTraces API and unmarshals it.
func (ds *Datasource) getSingleServiceMap(ctx context.Context, query backend.DataQuery, pluginContext backend.PluginContext) backend.DataResponse {
	queryData := &GetServiceMapQueryData{}
	err := json.Unmarshal(query.JSON, queryData)

	if err != nil {
		return backend.ErrorResponseWithErrorSource(backend.PluginError(err))
	}

	xrayClient, err := ds.getClient(ctx, pluginContext, RequestSettings{Region: queryData.Region})
	if err != nil {
		return backend.ErrorResponseWithErrorSource(backend.PluginError(err))
	}

	var frame = data.NewFrame(
		"ServiceMap",
		data.NewField("Service", nil, []string{}),
	)

	log.DefaultLogger.Debug("getSingleServiceMap", "RefID", query.RefID)
	input := &xray.GetServiceGraphInput{
		StartTime: &query.TimeRange.From,
		EndTime:   &query.TimeRange.To,
		GroupName: queryData.Group.GroupName,
	}

	accountIdsToFilterBy := make(map[string]bool)
	for _, value := range queryData.AccountIds {
		accountIdsToFilterBy[value] = true
	}

	pager := xray.NewGetServiceGraphPaginator(xrayClient, input)
	var pagerError error
	for pager.HasMorePages() {
		page, err := pager.NextPage(ctx)
		if err != nil {
			pagerError = err
			break
		}
		for _, service := range page.Services {
			// filter out non matching account ids, if user has selected them
			if len(queryData.AccountIds) > 0 {
				// sometimes traces don't have accountId data, without knowing where it came from we have to filter it out
				if service.AccountId == nil || *service.AccountId == "all" {
					continue
				}

				if !accountIdsToFilterBy[*service.AccountId] {
					continue
				}
			}
			bytes, err := json.Marshal(service)
			if err != nil {
				// TODO: probably does not make sense to fail just because of one service but I assume the layout will fail
				//  because of some edge not connected to anything.
				log.DefaultLogger.Error("getSingleServiceMap failed to marshal service", "Name", service.Name, "ReferenceId", service.ReferenceId)
			}
			frame.AppendRow(string(bytes))
		}
	}

	if pagerError != nil {
		return backend.ErrorResponseWithErrorSource(backend.DownstreamError(pagerError))
	}

	return backend.DataResponse{
		Frames: []*data.Frame{frame},
	}
}
