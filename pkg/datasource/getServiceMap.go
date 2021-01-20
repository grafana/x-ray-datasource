package datasource

import (
  "context"
  "encoding/json"
  "github.com/grafana/grafana-plugin-sdk-go/backend"
  "github.com/grafana/grafana-plugin-sdk-go/backend/log"
  "github.com/grafana/grafana-plugin-sdk-go/data"
  xray "github.com/grafana/x-ray-datasource/pkg/xray"
)

type GetServiceMapQueryData struct {
  Region string `json:"region"`
  Group  *xray.Group `json:"group"`
}

func (ds *Datasource) getServiceMap(ctx context.Context, req *backend.QueryDataRequest) (*backend.QueryDataResponse, error) {
  response := &backend.QueryDataResponse{
    Responses: make(map[string]backend.DataResponse),
  }

  // TODO not used in the app but this could actually be done in one call for multiple traceIDs
  for _, query := range req.Queries {
    response.Responses[query.RefID] = ds.getSingleServiceMap(ctx, query, &req.PluginContext)
  }

  return response, nil
}

// getSingleTrace returns single trace from BatchGetTraces API and unmarshals it.
func (ds *Datasource) getSingleServiceMap(ctx context.Context, query backend.DataQuery, pluginContext *backend.PluginContext) backend.DataResponse {
  queryData := &GetServiceMapQueryData{}
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

  var frame = data.NewFrame(
    "ServiceMap",
    data.NewField("Service", nil, []string{}),
  )


  log.DefaultLogger.Debug("getSingleServiceMap", "RefID", query.RefID)
  input := &xray.GetServiceGraphInput{
    StartTime:        &query.TimeRange.From,
    EndTime:          &query.TimeRange.To,
    GroupName:        queryData.Group.GroupName,
  }
  err = xrayClient.GetServiceGraphPagesWithContext(ctx, input, func(page *xray.GetServiceGraphOutput, lastPage bool) bool {
    for _, service := range page.Services {
      bytes, err := json.Marshal(service)
      if err != nil {
        // TODO: probably does not make sense to fail just because of one service but I assume the layout will fail
        //  because of some edge not connected to anything.
        log.DefaultLogger.Error("getSingleServiceMap failed to marshal service", "Name", service.Name, "ReferenceId", service.ReferenceId)
      }
      frame.AppendRow(string(bytes))
    }
    // Not sure how many pages there can possibly be but for now try to iterate over all the pages.
    return true
  })

  if err != nil {
    return backend.DataResponse{
      Error: err,
    }
  }

  return backend.DataResponse{
    Frames: []*data.Frame{frame},
  }
}
