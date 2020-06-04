package datasource

import (
  "context"
  "encoding/json"
  "github.com/aws/aws-sdk-go/service/xray"
  "github.com/grafana/grafana-plugin-sdk-go/backend"
  "github.com/grafana/grafana-plugin-sdk-go/backend/log"
  "github.com/grafana/grafana-plugin-sdk-go/data"
)

type GetTraceQueryData struct {
  Query string `json:"query"`
}

func (ds *Datasource) getTrace(ctx context.Context, req *backend.QueryDataRequest) (*backend.QueryDataResponse, error) {
  xrayClient, err := ds.getXrayClient(&req.PluginContext)
  if err != nil {
    return nil, err
  }

  response := &backend.QueryDataResponse{
    Responses: make(map[string]backend.DataResponse),
  }

  // TODO not used in the app but this could actually be done in one call for multiple traceIDs
  for _, query := range req.Queries {

    queryData := &GetTraceQueryData{}
    err = json.Unmarshal(query.JSON, queryData)

    log.DefaultLogger.Debug("getTrace", "RefID", query.RefID, "query", queryData.Query)

    if err != nil {
      response.Responses[query.RefID] = backend.DataResponse{
        Error: err,
      }
      continue
    }
    tracesResponse, err := xrayClient.BatchGetTraces(&xray.BatchGetTracesInput{ TraceIds: []*string{&queryData.Query} })
    if err != nil {
      response.Responses[query.RefID] = backend.DataResponse{
        Error: err,
      }
      continue
    }

    // TODO: implement proper mapping
    response.Responses[query.RefID] = backend.DataResponse{
      Frames: []*data.Frame{
        data.NewFrame(
          "Traces", data.NewField("Trace", nil, []string{*tracesResponse.Traces[0].Id}),
        ),
      },
    }
  }

  return response, nil
}
