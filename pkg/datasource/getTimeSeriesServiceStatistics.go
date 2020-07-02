package datasource

import (
  "context"
  "encoding/json"
  "github.com/aws/aws-sdk-go/service/xray"
  "github.com/grafana/grafana-plugin-sdk-go/backend"
  "github.com/grafana/grafana-plugin-sdk-go/backend/log"
  "github.com/grafana/grafana-plugin-sdk-go/data"
  "time"
)

type GetTimeSeriesServiceStatisticsQueryData struct {
  Query string `json:"query"`
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
  valueType interface{}
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

  // Each value type needs its own frame so Grafana will treat them as separate time series.
  valueDefs := []ValueDef{
    { "ErrorStatistics.OtherCount", []int64{} },
    { "ErrorStatistics.ThrottleCount", []int64{} },
    { "ErrorStatistics.TotalCount", []int64{} },
    { "FaultStatistics.OtherCount", []int64{} },
    { "FaultStatistics.TotalCount", []int64{} },
    { "OkCount", []int64{} },
    { "TotalCount", []int64{} },
    { "TotalResponseTime", []float64{} },
  }

  var frames []*data.Frame
  for _, value := range valueDefs {
    frames = append(frames, data.NewFrame(
      value.name,
      // This needs to be called time so the default join in Explore works and knows which column to join on.
      data.NewField("Time", nil, []*time.Time{}),
      data.NewField(value.name, nil, value.valueType),
    ))
  }

  resolution := int64(60)
  if queryData.Resolution != 0 {
    resolution = queryData.Resolution
  }

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
      values := []interface{}{
        *statistics.EdgeSummaryStatistics.ErrorStatistics.OtherCount,
        *statistics.EdgeSummaryStatistics.ErrorStatistics.ThrottleCount,
        *statistics.EdgeSummaryStatistics.ErrorStatistics.TotalCount,
        *statistics.EdgeSummaryStatistics.FaultStatistics.OtherCount,
        *statistics.EdgeSummaryStatistics.FaultStatistics.TotalCount,
        *statistics.EdgeSummaryStatistics.OkCount,
        *statistics.EdgeSummaryStatistics.TotalCount,
        *statistics.EdgeSummaryStatistics.TotalResponseTime,
      }
      for i, val := range values {
        frames[i].AppendRow(
          statistics.Timestamp,
          val,
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

