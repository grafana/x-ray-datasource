package datasource

import (
  "context"
  "encoding/json"
  "github.com/aws/aws-sdk-go/service/xray"
  "github.com/grafana/grafana-plugin-sdk-go/backend"
  "github.com/grafana/grafana-plugin-sdk-go/backend/log"
  "github.com/grafana/grafana-plugin-sdk-go/data"
  "reflect"
  "strings"
  "time"
)

type GetTimeSeriesServiceStatisticsQueryData struct {
  Query string `json:"query"`
  Columns []string `json:"columns"`
  Resolution int64 `json:"resolution"`
}

func (ds *Datasource) getTimeSeriesServiceStatistics(ctx context.Context, req *backend.QueryDataRequest) (*backend.QueryDataResponse, error) {
  xrayClient, err := ds.xrayClientFactory(&req.PluginContext)
  if err != nil {
    return nil, err
  }

  response := &backend.QueryDataResponse{
    Responses: make(map[string]backend.DataResponse),
  }

  for _, query := range req.Queries {
    response.Responses[query.RefID] = getTimeSeriesServiceStatisticsForSingleQuery(ctx, xrayClient, query)
  }

  return response, nil
}

type ValueDef struct {
  name string
  label string
  valueType interface{}
}

// Each value type needs its own frame so Grafana will treat them as separate time series.
var valueDefs = map[string]interface{}{
  "ErrorStatistics.ThrottleCount": []*int64{},
  "ErrorStatistics.TotalCount": []*int64{},
  "FaultStatistics.TotalCount": []*int64{},
  "OkCount": []*int64{},
  "TotalCount": []*int64{},
}

var labels = map[string]string{
  "ErrorStatistics.ThrottleCount": "Throttle Count",
  "ErrorStatistics.TotalCount": "Error Count",
  "FaultStatistics.TotalCount": "Fault Count",
  "OkCount": "Success Count",
  "TotalCount": "Total Count",
}

func getTimeSeriesServiceStatisticsForSingleQuery(ctx context.Context, xrayClient XrayClient, query backend.DataQuery) backend.DataResponse  {
  queryData := &GetTimeSeriesServiceStatisticsQueryData{}
  err := json.Unmarshal(query.JSON, queryData)

  if err != nil {
    return backend.DataResponse{
      Error: err,
    }
  }

  log.DefaultLogger.Debug("getTimeSeriesServiceStatisticsForSingleQuery", "RefID", query.RefID, "query", queryData.Query)

  var requestedColumns []ValueDef
  if queryData.Columns[0] == "all" {
    // Add all columns
    for key, value := range valueDefs {
      requestedColumns = append(requestedColumns, ValueDef{
        name: key,
        label: labels[key],
        valueType: value,
      })
    }
  } else {
    for _, name := range queryData.Columns {
      requestedColumns = append(requestedColumns, ValueDef{
        name: name,
        label: labels[name],
        valueType: valueDefs[name],
      })
    }
  }

  var frames []*data.Frame
  for _, value := range requestedColumns {
    frames = append(frames, data.NewFrame(
      "",
      // This needs to be called time so the default join in Explore works and knows which column to join on.
      data.NewField("Time", nil, []*time.Time{}),
      data.NewField(value.label, nil, value.valueType),
    ))
  }

  resolution := int64(60)
  if queryData.Resolution != 0 {
    resolution = queryData.Resolution
  }

  // Make sure we do not send empty string as that is validation error in x-ray API.
  var entitySelectorExpression *string
  if queryData.Query != "" {
    entitySelectorExpression = &queryData.Query
  }

  request := &xray.GetTimeSeriesServiceStatisticsInput{
    StartTime: &query.TimeRange.From,
    EndTime: &query.TimeRange.To,
    EntitySelectorExpression: entitySelectorExpression,
    Period: &resolution,
  }
  err = xrayClient.GetTimeSeriesServiceStatisticsPagesWithContext(ctx, request, func(page *xray.GetTimeSeriesServiceStatisticsOutput, lastPage bool) bool {
    for _, statistics := range page.TimeSeriesServiceStatistics {
      stats := *statistics.EdgeSummaryStatistics

      for i, column := range requestedColumns {
        parts := strings.Split(column.name, ".")
        var val = reflect.ValueOf(stats)
        for _, part := range parts {
          val = reflect.Indirect(val).FieldByName(part)
        }

        frames[i].AppendRow(
          statistics.Timestamp,
          val.Interface(),
        )
      }
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
    Frames: frames,
  }
}

