package datasource

import (
  "context"
  "encoding/json"
  "fmt"
  "github.com/aws/aws-sdk-go/aws"
  "github.com/grafana/grafana-plugin-sdk-go/backend"
  "github.com/grafana/grafana-plugin-sdk-go/backend/log"
  "github.com/grafana/grafana-plugin-sdk-go/data"
  "github.com/grafana/x-ray-datasource/pkg/xray"
  "math"
  "math/rand"
  "strconv"
  "sync"
  "time"
)

type GetAnalyticsQueryData struct {
	Query string `json:"query"`
	Group *xray.Group `json:"Group"`
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
		response.Responses[query.RefID] = getSingleAnalyticsResult(ctx, xrayClient, query)
	}

	return response, nil
}

func getSingleAnalyticsResult(ctx context.Context, xrayClient XrayClient, query backend.DataQuery) backend.DataResponse {
	log.DefaultLogger.Debug("getSingleAnalyticsResult", "type", query.QueryType, "RefID", query.RefID)

	traces, err := getTraceSummariesData(ctx, xrayClient, query)

	if err != nil {
		log.DefaultLogger.Debug("getSingleAnalyticsResult", "error", err)
		return backend.DataResponse{
			Error: err,
		}
	}

  log.DefaultLogger.Debug("getSingleAnalyticsResult", "len(traces)", len(traces))
  processor := NewDataProcessor(query.QueryType)
  processor.processTraces(traces)

	return backend.DataResponse{
		Frames: []*data.Frame{processor.dataframe()},
	}
}

func getTraceSummariesData(ctx context.Context, xrayClient XrayClient, query backend.DataQuery) ([]*xray.TraceSummary, error) {
	queryData := &GetAnalyticsQueryData{}
	err := json.Unmarshal(query.JSON, queryData)

	if err != nil {
		return nil, err
	}
	log.DefaultLogger.Debug("getTraceSummariesData", "query", queryData.Query)

  const maxTraces = 10000
  diff := query.TimeRange.To.Sub(query.TimeRange.From)
  log.DefaultLogger.Debug("getTraceSummariesData", "diff", diff.Minutes())
  diffQuarter := diff.Nanoseconds() / 4

  var traces []*xray.TraceSummary
  var requests []*xray.GetTraceSummariesInput
  sampling := float64(1)
  adaptiveSampling := true

  if queryData.Query == "" {
    // Get count of all the traces so we can compute sampling. The API used does not allow for filter expression so
    // we can do this only if we don't have one.
    count, err := getTracesCount(ctx, xrayClient, query.TimeRange.From, query.TimeRange.To, *queryData.Group.GroupARN)
    if err != nil {
      return nil, err
    }
    sampling = math.Min(float64(maxTraces) / float64(count), 1)
    log.DefaultLogger.Debug("getTraceSummariesData static sampling", "sampling", sampling, "maxTraces", maxTraces, "count", count)
    adaptiveSampling = false
  }

  for i := 0; i < 4; i++ {
    requests = append(requests, makeRequest(
      query.TimeRange.From.Add(time.Duration(diffQuarter * int64(i))),
      query.TimeRange.From.Add(time.Duration(diffQuarter * int64(i + 1))),
      sampling,
      queryData.Query,
    ))
  }

  tokens := []string{"first", "first", "first", "first"}

  hasTokens := true

  for hasTokens {
    log.DefaultLogger.Debug("getTraceSummariesData loop start")
    // Run the four parallel requests, returns when all are done
    responses := runRequests(ctx, xrayClient, requests, tokens)

    // Append traces and get tokens for next page for each request
    for i, resp := range responses {
      if resp != nil {
        traces = append(traces, resp.TraceSummaries...)
        if resp.NextToken != nil {
          tokens[i] = *resp.NextToken
        } else {
          tokens[i] = ""
        }
      }
    }

    // Check if we still have at least one next token
    hasTokens = false
    for _, t := range tokens {
      if len(t) > 0 {
        hasTokens = true
        break
      }
    }

    // If we have more traces and did not compute correct sampling beforehand, sample what we already have, set a new
    // sampling value and update requests for next run.
    if len(traces) > maxTraces && adaptiveSampling {
      var originalLen = len(traces)
      traces = sampleTraces(traces)
      sampling = sampling / 2
      for _, req := range requests {
        req.SamplingStrategy.Value = aws.Float64(sampling)
      }

      log.DefaultLogger.Debug("getTraceSummariesData", "len(traces)", originalLen, "maxTraces", maxTraces, "len(sampled)", len(traces), "newSampling", sampling)
    }
  }

  return traces, err
}

func makeRequest(from time.Time, to time.Time, sampling float64, filterExpression string) *xray.GetTraceSummariesInput {
  var filterExpressionNormalised *string
  if filterExpression != "" {
    filterExpressionNormalised = &filterExpression
  }

  return &xray.GetTraceSummariesInput{
    StartTime:        aws.Time(from),
    EndTime:          aws.Time(to),
    FilterExpression: filterExpressionNormalised,
    TimeRangeType:    aws.String("Event"),
    Sampling:         aws.Bool(true),
    SamplingStrategy: &xray.SamplingStrategy{
      Name:  aws.String("FixedRate"),
      Value: aws.Float64(sampling),
    },
  }
}

// sampleTraces just filters 50% of the traces from the provided list.
func sampleTraces(traces []*xray.TraceSummary) []*xray.TraceSummary {
  var samples []*xray.TraceSummary
  s := rand.NewSource(time.Now().UnixNano())
  r := rand.New(s)

  for _, trace := range traces {
    if r.Intn(2) == 1 {
      samples = append(samples, trace)
    }
  }
  return samples
}

// runRequests runs 4 trace summary requests and in parallel and returns slice of responses once all are done.
func runRequests(ctx context.Context, xrayClient XrayClient, requests []*xray.GetTraceSummariesInput, tokens []string) []*xray.GetTraceSummariesOutput {
  var wg sync.WaitGroup
  responses := []*xray.GetTraceSummariesOutput{nil, nil, nil, nil}

  for i, request := range requests {
    if len(tokens[i]) > 0 {
      if tokens[i] != "first" {
        request.NextToken = aws.String(tokens[i])
      }
      wg.Add(1)
      go getTraceSummaries(ctx, xrayClient, request, &wg, &responses, i)
    }
  }

  wg.Wait()
  return responses
}

func getTraceSummaries(ctx context.Context, xrayClient XrayClient, request *xray.GetTraceSummariesInput, wg *sync.WaitGroup, responses *[]*xray.GetTraceSummariesOutput, index int) {
  defer wg.Done()
  resp, err := xrayClient.GetTraceSummariesWithContext(ctx, request)
  if err != nil {
    log.DefaultLogger.Error("getTraceSummaries", "err", err)
  }
  log.DefaultLogger.Debug(
    "getTraceSummaries",
    "from", request.StartTime,
    "to", request.EndTime,
    "len(traces)", len(resp.TraceSummaries),
    "resp.NextToken", resp.NextToken,
    "req.NextToken", request.NextToken,
    "req.FilterExpression", request.FilterExpression,
  )
  (*responses)[index] = resp
}

// getTracesCount returns count of all the traces in the time range. It uses Service Graph API for that to go through
// counts per service which should be the most efficient way to do that right now. One caveat is that it does not allow
// for filter expression.
func getTracesCount(ctx context.Context, xrayClient XrayClient, from time.Time, to time.Time, groupArn string) (int64, error) {
  input := &xray.GetServiceGraphInput{
    StartTime:             aws.Time(from),
    EndTime:               aws.Time(to),
    GroupARN:              aws.String(groupArn),
  }
  count := int64(0)
  log.DefaultLogger.Debug("getTracesCount", "from", from, "to", to, "groupARN", groupArn)
  err := xrayClient.GetServiceGraphPagesWithContext(ctx, input, func(output *xray.GetServiceGraphOutput, b bool) bool {
    for _, service := range output.Services {
      if service.SummaryStatistics != nil {
        count += *service.SummaryStatistics.TotalCount
      }
    }
    return true
  })

  return count, err

}

type DataProcessor struct {
	counts    map[string]int64
	total     int64
	queryType string
}

func NewDataProcessor(queryType string) *DataProcessor {
	return &DataProcessor{
		counts:    make(map[string]int64),
		queryType: queryType,
	}
}

func (dataProcessor *DataProcessor) processTraces(traces []*xray.TraceSummary) {
  for _, trace := range traces {
    dataProcessor.processSummary(trace)
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
					if index < len(cause.Services)-1 {
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
				service := cause.Services[len(cause.Services)-1]
				key = fmt.Sprintf("%s (%s)", *service.Name, *service.Type)
			} else if dataProcessor.queryType == QueryGetAnalyticsRootCauseErrorPath {
				for index, service := range cause.Services {
					key += fmt.Sprintf("%s (%s)", *service.Name, *service.Type)

					for _, path := range service.EntityPath {
						for _, exception := range path.Exceptions {
							key += fmt.Sprintf(" -> %s", *exception.Name)
						}
					}
					if index < len(cause.Services)-1 {
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
				service := cause.Services[len(cause.Services)-1]
				key = fmt.Sprintf("%s (%s)", *service.Name, *service.Type)
			} else if dataProcessor.queryType == QueryGetAnalyticsRootCauseFaultPath {
				for index, service := range cause.Services {
					key += fmt.Sprintf("%s (%s)", *service.Name, *service.Type)

					for _, path := range service.EntityPath {
						for _, exception := range path.Exceptions {
							key += fmt.Sprintf(" -> %s", *exception.Name)
						}
					}
					if index < len(cause.Services)-1 {
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
  log.DefaultLogger.Debug("dataframe()", "label", labels[dataProcessor.queryType], "query", dataProcessor.queryType)
	frame := data.NewFrame(
		labels[dataProcessor.queryType],
		data.NewField(labels[dataProcessor.queryType], nil, []string{}),
		data.NewField("Count", nil, []int64{}),
		data.NewField("Percent", nil, []float64{}),
	)

	for key, value := range dataProcessor.counts {
		frame.AppendRow(key, value, float64(value)/float64(dataProcessor.total)*100)
	}

	return frame
}

var labels = map[string]string{
	QueryGetAnalyticsRootCauseResponseTimeService: "Response Time Root Cause",
	QueryGetAnalyticsRootCauseResponseTimePath:    "Response Time Root Cause Path",
	QueryGetAnalyticsRootCauseErrorService:        "Error Root Cause",
	QueryGetAnalyticsRootCauseErrorPath:           "Error Root Cause Path",
	QueryGetAnalyticsRootCauseErrorMessage:        "Error Root Cause Message",
	QueryGetAnalyticsRootCauseFaultService:        "Fault Root Cause",
	QueryGetAnalyticsRootCauseFaultPath:           "Fault Root Cause Path",
	QueryGetAnalyticsRootCauseFaultMessage:        "Fault Root Cause Message",
  QueryGetAnalyticsUrl:                          "URL",
  QueryGetAnalyticsUser:                         "User",
  QueryGetAnalyticsStatusCode:                   "Status Code",
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
