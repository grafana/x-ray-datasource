package datasource

import (
	"context"
	"encoding/json"
	"fmt"
	"math"
	"math/rand"
	"strconv"
	"time"

	xraytypes "github.com/aws/aws-sdk-go-v2/service/xray/types"

	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/service/xray"
	"github.com/grafana/grafana-plugin-sdk-go/backend"
	"github.com/grafana/grafana-plugin-sdk-go/backend/log"
	"github.com/grafana/grafana-plugin-sdk-go/data"
	"github.com/grafana/grafana-plugin-sdk-go/experimental/errorsource"
	"golang.org/x/sync/errgroup"
)

type GetAnalyticsQueryData struct {
	Query  string           `json:"query"`
	Group  *xraytypes.Group `json:"group"`
	Region string           `json:"region"`
}

func (ds *Datasource) getSingleAnalyticsQueryResult(ctx context.Context, query backend.DataQuery, pluginContext backend.PluginContext) backend.DataResponse {
	log.DefaultLogger.Debug("getSingleAnalyticsResult", "type", query.QueryType, "RefID", query.RefID)

	const maxTraces = 10000
	traces, err := ds.getTraceSummariesData(ctx, query, maxTraces, pluginContext)

	if err != nil {
		log.DefaultLogger.Debug("getSingleAnalyticsResult", "error", err)
		return errorsource.Response(errorsource.DownstreamError(err, false))
	}

	log.DefaultLogger.Debug("getSingleAnalyticsResult", "len(traces)", len(traces))
	processor := NewDataProcessor(query.QueryType)
	processor.processTraces(traces)

	return backend.DataResponse{
		Frames: []*data.Frame{processor.dataframe()},
	}
}

func (ds *Datasource) getTraceSummariesData(ctx context.Context, query backend.DataQuery, maxTraces int, pluginContext backend.PluginContext) ([]xraytypes.TraceSummary, error) {
	queryData := &GetAnalyticsQueryData{}
	err := json.Unmarshal(query.JSON, queryData)
	if err != nil {
		return nil, errorsource.PluginError(err, false)
	}

	xrayClient, err := ds.getClient(ctx, pluginContext, RequestSettings{Region: queryData.Region})
	if err != nil {
		return nil, errorsource.PluginError(err, false)
	}

	log.DefaultLogger.Debug("getTraceSummariesData", "query", queryData.Query)

	diff := query.TimeRange.To.Sub(query.TimeRange.From)
	diffQuarter := diff.Nanoseconds() / 4

	var traces []xraytypes.TraceSummary
	var requests []*xray.GetTraceSummariesInput
	sampling := float64(1)
	adaptiveSampling := true

	if queryData.Query == "" {
		var groupName *string
		if queryData.Group != nil {
			groupName = queryData.Group.GroupName
		}
		// Get count of all the traces so we can compute sampling. The API used does not allow for filter expression so
		// we can do this only if we don't have one.
		count, err := getTracesCount(ctx, xrayClient, query.TimeRange.From, query.TimeRange.To, groupName)
		if err != nil {
			return nil, err
		}
		sampling = math.Min(float64(maxTraces)/float64(count), 1)
		log.DefaultLogger.Debug("getTraceSummariesData static sampling", "sampling", sampling, "maxTraces", maxTraces, "count", count)
		adaptiveSampling = false
	}

	for i := 0; i < 4; i++ {
		requests = append(requests, makeRequest(
			query.TimeRange.From.Add(time.Duration(diffQuarter*int64(i))),
			query.TimeRange.From.Add(time.Duration(diffQuarter*int64(i+1))),
			sampling,
			queryData.Query,
		))
	}

	tokens := []string{"first", "first", "first", "first"}

	hasTokens := true

	for hasTokens {
		// Run the four parallel requests, returns when all are done
		responses, err := runRequests(ctx, xrayClient, requests, tokens)
		if err != nil {
			return nil, err
		}

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

		// Check if we still have at least one next token. Some requests can end paging sooner than other ones.
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

	return traces, nil
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
		TimeRangeType:    xraytypes.TimeRangeTypeEvent,
		Sampling:         aws.Bool(true),
		SamplingStrategy: &xraytypes.SamplingStrategy{
			Name:  "FixedRate",
			Value: aws.Float64(sampling),
		},
	}
}

var seed int64

// sampleTraces just filters 50% of the traces from the provided list.
func sampleTraces(traces []xraytypes.TraceSummary) []xraytypes.TraceSummary {
	var samples []xraytypes.TraceSummary
	s := rand.NewSource(time.Now().UnixNano())
	if seed != 0 {
		s = rand.NewSource(seed)
	}
	r := rand.New(s)

	for _, trace := range traces {
		if r.Intn(2) == 1 {
			samples = append(samples, trace)
		}
	}
	return samples
}

// runRequests runs 4 trace summary requests in parallel and returns slice of responses once all are done.
func runRequests(ctx context.Context, xrayClient XrayClient, requests []*xray.GetTraceSummariesInput, tokens []string) ([]*xray.GetTraceSummariesOutput, error) {
	group, groupCtx := errgroup.WithContext(ctx)

	// We need to keep the responses ordered the same way the requests were. Reason is we need to update the requests with
	// NextToken for the next run and each request pages through different time range so they need to be correctly matched
	// later on.
	responses := []*xray.GetTraceSummariesOutput{nil, nil, nil, nil}

	for i, request := range requests {
		if len(tokens[i]) > 0 {
			if tokens[i] != "first" {
				request.NextToken = aws.String(tokens[i])
			}
			// Capture these for the go routine closure
			index := i
			req := *request
			group.Go(func() error {
				resp, err := getTraceSummaries(groupCtx, xrayClient, req)
				if err != nil {
					return errorsource.DownstreamError(err, false)
				}
				responses[index] = resp
				return nil
			})
		}
	}

	if err := group.Wait(); err != nil {
		return nil, err
	}
	return responses, nil
}

func getTraceSummaries(ctx context.Context, xrayClient XrayClient, request xray.GetTraceSummariesInput) (*xray.GetTraceSummariesOutput, error) {
	resp, err := xrayClient.GetTraceSummaries(ctx, &request)
	if err != nil {
		return nil, errorsource.DownstreamError(err, false)
	}
	log.DefaultLogger.Debug("getTraceSummaries", "from", request.StartTime, "to", request.EndTime, "len(traces)", len(resp.TraceSummaries))
	return resp, nil
}

// getTracesCount returns count of all the traces in the time range. It uses TimeSeries API for that to go through
// counts per service or edge which should be the most efficient way to do that right now. One caveat is that it does
// not allow for filter expression (or it does but only in some subset of expressions).
func getTracesCount(ctx context.Context, xrayClient XrayClient, from time.Time, to time.Time, groupName *string) (int64, error) {
	log.DefaultLogger.Debug("getTracesCount", "from", from, "to", to, "groupName", groupName)
	input := &xray.GetTimeSeriesServiceStatisticsInput{
		StartTime: aws.Time(from),
		EndTime:   aws.Time(to),
		GroupName: groupName,
		Period:    aws.Int32(60),
	}

	count := int64(0)
	pager := xray.NewGetTimeSeriesServiceStatisticsPaginator(xrayClient, input)
	var pagerError error
	for pager.HasMorePages() {
		page, err := pager.NextPage(ctx)
		if err != nil {
			pagerError = err
			break
		}
		for _, stats := range page.TimeSeriesServiceStatistics {
			if stats.ServiceSummaryStatistics != nil {
				count += *stats.ServiceSummaryStatistics.TotalCount
			} else if stats.EdgeSummaryStatistics != nil {
				count += *stats.EdgeSummaryStatistics.TotalCount
			}
		}
	}

	if pagerError != nil {
		pagerError = errorsource.DownstreamError(pagerError, false)
	}
	return count, pagerError
}

// DataProcessor is responsible for counting and aggregating the trace data byt different columns. It is stateful mainly
// because before it just provided a callback to process one trace at the time. After sampling was added this processes
// the whole array of traces so could be refactored to stateless function.
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

func (dataProcessor *DataProcessor) processTraces(traces []xraytypes.TraceSummary) {
	for _, trace := range traces {
		dataProcessor.processSingleTrace(trace)
	}
}

// processSingleTrace mainly figures out the proper aggregation key for the trace. There is lots of duplication because
// even though various attributes in the trace summary have the same structure they have different types.
func (dataProcessor *DataProcessor) processSingleTrace(summary xraytypes.TraceSummary) {
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
			switch dataProcessor.queryType {
			case QueryGetAnalyticsRootCauseErrorService:
				service := cause.Services[len(cause.Services)-1]
				key = fmt.Sprintf("%s (%s)", *service.Name, *service.Type)
			case QueryGetAnalyticsRootCauseErrorPath:
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

			default:
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
			switch dataProcessor.queryType {
			case QueryGetAnalyticsRootCauseFaultService:
				service := cause.Services[len(cause.Services)-1]
				key = fmt.Sprintf("%s (%s)", *service.Name, *service.Type)
			case QueryGetAnalyticsRootCauseFaultPath:
				for index, service := range cause.Services {
					key += fmt.Sprintf("%s (%s)", *service.Name, *service.Type)

					for _, path := range service.EntityPath {
						for _, exception := range path.Exceptions {
							if exception.Name != nil {
								key += fmt.Sprintf(" -> %s", *exception.Name)
							} else {
								key += " -> unknown"
							}
						}
					}
					if index < len(cause.Services)-1 {
						key += " => "
					}
				}
			case QueryGetAnalyticsRootCauseFaultMessage:
				key = getFaultMessage(cause)
			default:
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
			dataProcessor.counts[strconv.FormatInt(int64(*summary.Http.HttpStatus), 10)]++
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
		data.NewField("Percent", nil, []float64{}).SetConfig(&data.FieldConfig{Unit: "percent", Decimals: aws.Uint16(2)}),
	)

	for key, value := range dataProcessor.counts {
		frame.AppendRow(key, value, float64(value)/float64(dataProcessor.total)*100)
	}

	return frame
}

// Labels that will be used for column name.
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

func getErrorMessage(cause xraytypes.ErrorRootCause) string {
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

func getFaultMessage(cause xraytypes.FaultRootCause) string {
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
