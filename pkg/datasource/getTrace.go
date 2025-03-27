package datasource

import (
	"context"
	"encoding/json"
	"fmt"
	"strings"
	"sync"

	"github.com/aws/aws-sdk-go-v2/service/xray"
	"github.com/grafana/grafana-plugin-sdk-go/backend"
	"github.com/grafana/grafana-plugin-sdk-go/backend/log"
	"github.com/grafana/grafana-plugin-sdk-go/data"
	"github.com/grafana/grafana-plugin-sdk-go/experimental/errorsource"
)

type GetTraceQueryData struct {
	Query  string `json:"query"`
	Region string `json:"region"`
}

// isW3CTraceID checks if the trace ID is in W3C format
func isW3CTraceID(traceID string) bool {
	// W3C trace IDs are 32 hex characters (16 bytes)
	return len(traceID) == 32 && !strings.Contains(traceID, "-")
}

// convertW3CToXRayTraceID converts a W3C format trace ID to X-Ray format
func convertW3CToXRayTraceID(w3cTraceID string) string {
	// X-Ray format: 1-{8 chars}-{24 chars}
	if len(w3cTraceID) == 32 {
		return fmt.Sprintf("1-%s-%s", w3cTraceID[0:8], w3cTraceID[8:])
	}
	return w3cTraceID
}

// getSingleTrace returns single trace from BatchGetTraces API and unmarshals it.
func (ds *Datasource) getSingleTrace(ctx context.Context, query backend.DataQuery, pluginContext backend.PluginContext) backend.DataResponse {
	queryData := &GetTraceQueryData{}
	err := json.Unmarshal(query.JSON, queryData)

	if err != nil {
		return errorsource.Response(err)
	}

	xrayClient, err := ds.getClient(ctx, pluginContext, RequestSettings{Region: queryData.Region})
	if err != nil {
		return errorsource.Response(err)
	}

	// Handle W3C format trace IDs by converting to X-Ray format
	traceID := queryData.Query
	if isW3CTraceID(traceID) {
		traceID = convertW3CToXRayTraceID(traceID)
		log.DefaultLogger.Debug("Converted W3C trace ID to X-Ray format", "original", queryData.Query, "converted", traceID)
	}

	log.DefaultLogger.Debug("getSingleTrace", "RefID", query.RefID, "query", queryData.Query, "traceID", traceID, "region", queryData.Region)

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
		tracesResponse, tracesError = xrayClient.BatchGetTraces(ctx, &xray.BatchGetTracesInput{TraceIds: []string{traceID}})
	}()

	// We get the trace graph in parallel but if this fails we still return the trace
	wg.Add(1)
	go func() {
		defer wg.Done()
		pager := xray.NewGetTraceGraphPaginator(xrayClient, &xray.GetTraceGraphInput{TraceIds: []string{traceID}})
		for pager.HasMorePages() {
			page, err := pager.NextPage(ctx)
			if err != nil {
				log.DefaultLogger.Error(
					"getSingleTrace paginator error",
					"error", err,
				)
				break
			}
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
		}
	}()

	wg.Wait()

	if tracesError != nil {
		return errorsource.Response(errorsource.DownstreamError(tracesError, false))
	}

	if len(tracesResponse.Traces) == 0 {
		return errorsource.Response(errorsource.DownstreamError(fmt.Errorf("trace not found"), false))
	}

	// We assume only single trace at this moment is returned from the API call
	trace := tracesResponse.Traces[0]
	traceBytes, err := json.Marshal(trace)
	if err != nil {
		return errorsource.Response(
			errorsource.DownstreamError(fmt.Errorf("failed to json.Marshal trace \"%s\" :%w", *trace.Id, err), false),
		)
	}

	frames := []*data.Frame{
		data.NewFrame(
			"Traces", data.NewField("Trace", nil, []string{string(traceBytes)}),
		),
	}

	response := backend.DataResponse{}
	if traceGraphError == nil {
		frames = append(frames, traceGraphFrame)
	} else {
		response = errorsource.Response(errorsource.DownstreamError(traceGraphError, false))
	}
	// TODO not sure what will this show if we have both data and error
	response.Frames = frames
	return response
}
