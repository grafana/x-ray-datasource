package datasource

import (
  "context"
  "encoding/json"
  "fmt"
  "github.com/aws/aws-sdk-go/aws"
  "github.com/aws/aws-sdk-go/service/xray"
  "github.com/grafana/grafana-plugin-sdk-go/backend"
  "github.com/grafana/grafana-plugin-sdk-go/backend/log"
  "github.com/grafana/grafana-plugin-sdk-go/data"
  "strconv"
)

type GetAnalyticsQueryData struct {
  Query string `json:"query"`
}

func (ds *Datasource) getAnalytics(ctx context.Context, req *backend.QueryDataRequest) (*backend.QueryDataResponse, error) {
  xrayClient, err := ds.xrayClientFactory(&req.PluginContext)
  if err != nil {
    return nil, err
  }

  response := &backend.QueryDataResponse{
    Responses: make(map[string]backend.DataResponse),
  }

  for _, query := range req.Queries {
    response.Responses[query.RefID] = getSingleAnalyticsResult(xrayClient, query)
  }

  return response, nil
}

func getSingleAnalyticsResult(xrayClient XrayClient, query backend.DataQuery) backend.DataResponse {
  log.DefaultLogger.Debug("getSingleAnalyticsResult", "type", query.QueryType, "RefID", query.RefID)

  processor := NewDataProcessor(query.QueryType)
  err := getTraceSummariesData(xrayClient, query, processor.processSummary)
  log.DefaultLogger.Debug("getSingleAnalyticsResult", "processor.total", processor.total)


  if err != nil {
    log.DefaultLogger.Debug("getSingleAnalyticsResult", "error", err)
    return backend.DataResponse{
      Error: err,
    }
  }

  return backend.DataResponse{
    Frames: []*data.Frame{processor.dataframe()},
  }
}

func getTraceSummariesData(xrayClient XrayClient, query backend.DataQuery, processFn func(*xray.TraceSummary)) error {
  queryData := &GetAnalyticsQueryData{}
  err := json.Unmarshal(query.JSON, queryData)

  if err != nil {
    return err
  }
  log.DefaultLogger.Debug("getTraceSummaries", "query", queryData.Query)

  var filterExpression *string
  if queryData.Query != "" {
    filterExpression = &queryData.Query
  }

  request := &xray.GetTraceSummariesInput{
    StartTime:        &query.TimeRange.From,
    EndTime:          &query.TimeRange.To,
    FilterExpression: filterExpression,
    TimeRangeType:    aws.String("Event"),
    Sampling: aws.Bool(true),
    SamplingStrategy: &xray.SamplingStrategy{
      Name: aws.String("FixedRate"),
      Value: aws.Float64(1),
    },
  }
  err = xrayClient.GetTraceSummariesPages(request, func(page *xray.GetTraceSummariesOutput, lastPage bool) bool {
    log.DefaultLogger.Debug("getTraceSummaries", "TracesProcessedCount", page.TracesProcessedCount, "lastPage", lastPage, "nextToken", page.NextToken)
    for _, summary := range page.TraceSummaries {
      processFn(summary)
    }
    // Not sure how many pages there can possibly be but for now try to iterate over all the pages.
    return true
  })
  return err
}

type DataProcessor struct {
  counts map[string]int64
  total int64
  queryType string
}

func NewDataProcessor(queryType string) *DataProcessor {
  return &DataProcessor{
    counts: make(map[string]int64),
    queryType: queryType,
  }
}

func (dataProcessor *DataProcessor) processSummary(summary *xray.TraceSummary) {
  switch dataProcessor.queryType {
  case QueryGetAnalyticsRootCauseResponseTimeService, QueryGetAnalyticsRootCauseResponseTimePath:
    if len(summary.ResponseTimeRootCauses) == 0 {
      dataProcessor.counts["-"]++
      dataProcessor.total++
    }
    for _, cause := range summary.ResponseTimeRootCauses {
      var key string
      if dataProcessor.queryType == QueryGetAnalyticsRootCauseResponseTimeService {
        service := cause.Services[len(cause.Services)-1]
        key = fmt.Sprintf("%s (%s)", *service.Name, *service.Type)
      } else {
        for index, service := range cause.Services {
          key += fmt.Sprintf("%s (%s)", *service.Name, *service.Type)
          for _, path := range service.EntityPath[1:] {
            key += fmt.Sprintf(" -> %s", *path.Name)
          }
          if index < len(cause.Services) - 1 {
            key += " => "
          }
        }
      }
      dataProcessor.counts[key]++
      dataProcessor.total++
    }
  case QueryGetAnalyticsRootCauseErrorService, QueryGetAnalyticsRootCauseErrorPath, QueryGetAnalyticsRootCauseErrorMessage:
    if len(summary.ErrorRootCauses) == 0 {
      dataProcessor.counts["-"]++
      dataProcessor.total++
    }
    for _, cause := range summary.ErrorRootCauses {
      var key string
      if dataProcessor.queryType == QueryGetAnalyticsRootCauseErrorService {
        service := cause.Services[len(cause.Services) - 1]
        key = fmt.Sprintf("%s (%s)", *service.Name, *service.Type)
      } else if dataProcessor.queryType == QueryGetAnalyticsRootCauseErrorPath {
        for index, service := range cause.Services {
          key += fmt.Sprintf("%s (%s)", *service.Name, *service.Type)

          for _, path := range service.EntityPath {
            for _, exception := range path.Exceptions {
              key += fmt.Sprintf(" -> %s", *exception.Name)
            }
          }
          if index < len(cause.Services) - 1 {
            key += " => "
          }
        }
      } else {
        key = getErrorMessage(cause)
      }
      dataProcessor.counts[key]++
      dataProcessor.total++
    }
  case QueryGetAnalyticsRootCauseFaultService, QueryGetAnalyticsRootCauseFaultPath, QueryGetAnalyticsRootCauseFaultMessage:
    if len(summary.FaultRootCauses) == 0 {
      dataProcessor.counts["-"]++
      dataProcessor.total++
    }
    for _, cause := range summary.FaultRootCauses {
      var key string
      if dataProcessor.queryType == QueryGetAnalyticsRootCauseFaultService {
        service := cause.Services[len(cause.Services) - 1]
        key = fmt.Sprintf("%s (%s)", *service.Name, *service.Type)
      } else if dataProcessor.queryType == QueryGetAnalyticsRootCauseFaultPath {
        for index, service := range cause.Services {
          key += fmt.Sprintf("%s (%s)", *service.Name, *service.Type)

          for _, path := range service.EntityPath {
            for _, exception := range path.Exceptions {
              key += fmt.Sprintf(" -> %s", *exception.Name)
            }
          }
          if index < len(cause.Services) - 1 {
            key += " => "
          }
        }
      } else if dataProcessor.queryType == QueryGetAnalyticsRootCauseFaultMessage {
        key = getFaultMessage(cause)
      } else {
        key = getFaultMessage(cause)
      }
      dataProcessor.counts[key]++
      dataProcessor.total++
    }
  case QueryGetAnalyticsUrl:
    if summary.Http != nil && summary.Http.HttpURL != nil {
      dataProcessor.counts[*summary.Http.HttpURL]++
    } else {
      dataProcessor.counts["-"]++
    }
    dataProcessor.total++
  case QueryGetAnalyticsUser:
    if len(summary.Users) == 0 {
      dataProcessor.counts["-"]++
      dataProcessor.total++
    }
    for _, user := range summary.Users {
      if user.UserName != nil {
        dataProcessor.counts[*user.UserName]++
        dataProcessor.total++
      }
    }
  case QueryGetAnalyticsStatusCode:
    if summary.Http != nil && summary.Http.HttpStatus != nil {
      dataProcessor.counts[strconv.FormatInt(*summary.Http.HttpStatus, 10)]++
    } else {
      dataProcessor.counts["-"]++
    }
    dataProcessor.total++
  }
}

func (dataProcessor *DataProcessor) dataframe() *data.Frame {
  frame := data.NewFrame(
    labels[dataProcessor.queryType],
    data.NewField(labels[dataProcessor.queryType], nil, []string{}),
    data.NewField("Count", nil, []int64{}),
    data.NewField("Percent", nil, []float64{}),
  )

  for key, value := range dataProcessor.counts {
    frame.AppendRow(key, value, float64(value) / float64(dataProcessor.total) * 100)
  }

  return frame
}

var labels = map[string]string{
  QueryGetAnalyticsRootCauseResponseTimeService: "Response Time Root Cause",
  QueryGetAnalyticsRootCauseResponseTimePath: "Response Time Root Cause Path",
  QueryGetAnalyticsRootCauseErrorService: "Error Root Cause",
  QueryGetAnalyticsRootCauseErrorPath: "Error Root Cause Path",
  QueryGetAnalyticsRootCauseErrorMessage: "Error Root Cause Message",
  QueryGetAnalyticsRootCauseFaultService: "Fault Root Cause",
  QueryGetAnalyticsRootCauseFaultPath: "Fault Root Cause Path",
  QueryGetAnalyticsRootCauseFaultMessage: "Fault Root Cause Message",
}

func getErrorMessage(cause *xray.ErrorRootCause) string {
  for _, service := range cause.Services {
    for _, path := range service.EntityPath {
      for _, exc := range path.Exceptions {
        if exc.Message != nil {
          return *exc.Message
        }
      }
    }
  }
  return "-"
}

func getFaultMessage(cause *xray.FaultRootCause) string {
  for _, service := range cause.Services {
    for _, path := range service.EntityPath {
      for _, exc := range path.Exceptions {
        if exc.Message != nil {
          return *exc.Message
        }
      }
    }
  }
  return "-"
}
