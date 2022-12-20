package datasource

import (
	"context"
	"encoding/json"
	"fmt"
	"sync"

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

	xrayClient, err := ds.xrayClientFactory(pluginContext, RequestSettings{Region: queryData.Region})
	if err != nil {
		return backend.DataResponse{
			Error: err,
		}
	}

	log.DefaultLogger.Debug("getSingleTrace", "RefID", query.RefID, "query", queryData.Query, "region", queryData.Region)

	var wg sync.WaitGroup
	var tracesResponse *xray.BatchGetTracesOutput
	var tracesError error

	var traceGraphFrame = data.NewFrame(
		"TraceGraph",
		data.NewField("Service", nil, []string{}),
	)
	var traceGraphError error

	wg.Add(1)
	go func() {
		defer wg.Done()
		tracesResponse, tracesError = xrayClient.BatchGetTraces(&xray.BatchGetTracesInput{TraceIds: []*string{&queryData.Query}})
	}()

	// We get the trace graph in parallel but if this fails we still return the trace
	wg.Add(1)
	go func() {
		defer wg.Done()
		traceGraphError = xrayClient.GetTraceGraphPages(
			&xray.GetTraceGraphInput{TraceIds: []*string{&queryData.Query}},
			func(page *xray.GetTraceGraphOutput, hasMore bool) bool {
				for _, service := range page.Services {
					bytes, err := json.Marshal(service)
					if err != nil {
						// TODO: probably does not make sense to fail just because of one service but I assume the layout will fail
						//  because of some edge not connected to anything.
						log.DefaultLogger.Error(
							"getSingleTrace failed to marshal service from trace graph",
							"Name", service.Name,
							"ReferenceId", service.ReferenceId,
						)
					}
					traceGraphFrame.AppendRow(string(bytes))
				}
				return true
			},
		)
	}()

	wg.Wait()

	if tracesError != nil {
		return backend.DataResponse{
			Error: tracesError,
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

	frames := []*data.Frame{
		data.NewFrame(
			"Traces", data.NewField("Trace", nil, []string{string(traceBytes)}),
		),
	}

	if traceGraphError == nil {
		frames = append(frames, traceGraphFrame)
	}

	return backend.DataResponse{
		Frames: frames,
		// TODO not sure what will this show if we have both data and error
		Error: traceGraphError,
	}
}
