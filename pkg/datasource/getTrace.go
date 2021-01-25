package datasource

import (
	"context"
	"encoding/json"
	"fmt"

	"github.com/aws/aws-sdk-go/service/xray"
	"github.com/grafana/grafana-plugin-sdk-go/backend"
	"github.com/grafana/grafana-plugin-sdk-go/backend/log"
	"github.com/grafana/grafana-plugin-sdk-go/data"
)

type GetTraceQueryData struct {
	Query  string `json:"query"`
	Region string `json:"region"`
}

func (ds *Datasource) getTrace(ctx context.Context, req *backend.QueryDataRequest) (*backend.QueryDataResponse, error) {
	response := &backend.QueryDataResponse{
		Responses: make(map[string]backend.DataResponse),
	}

	// TODO not used in the app but this could actually be done in one call for multiple traceIDs
	for _, query := range req.Queries {
		response.Responses[query.RefID] = ds.getSingleTrace(query, &req.PluginContext)
	}

	return response, nil
}

// getSingleTrace returns single trace from BatchGetTraces API and unmarshals it.
func (ds *Datasource) getSingleTrace(query backend.DataQuery, pluginContext *backend.PluginContext) backend.DataResponse {
	queryData := &GetTraceQueryData{}
	err := json.Unmarshal(query.JSON, queryData)

	if err != nil {
		return backend.DataResponse{
			Error: err,
		}
	}

	xrayClient, err := ds.xrayClientFactory(pluginContext, queryData.Region)
	if err != nil {
		return backend.DataResponse{
			Error: err,
		}
	}

	log.DefaultLogger.Debug("getSingleTrace", "RefID", query.RefID, "query", queryData.Query)

	tracesResponse, err := xrayClient.BatchGetTraces(&xray.BatchGetTracesInput{TraceIds: []*string{&queryData.Query}})
	if err != nil {
		return backend.DataResponse{
			Error: err,
		}
	}

	if len(tracesResponse.Traces) == 0 {
		return backend.DataResponse{
			Error: fmt.Errorf("trace not found"),
		}
	}

	// We assume only single trace at this moment is returned from the API call
	trace := tracesResponse.Traces[0]
	traceBytes, err := json.Marshal(trace)
	if err != nil {
		return backend.DataResponse{
			Error: fmt.Errorf("failed to json.Marshal trace \"%s\" :%w", *trace.Id, err),
		}
	}

	return backend.DataResponse{
		Frames: []*data.Frame{
			data.NewFrame(
				"Traces", data.NewField("Trace", nil, []string{string(traceBytes)}),
			),
		},
	}
}
