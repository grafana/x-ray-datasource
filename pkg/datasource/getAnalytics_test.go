package datasource

import (
  "context"
  "encoding/json"
  "github.com/aws/aws-sdk-go/aws"
  "github.com/aws/aws-sdk-go/aws/request"
  "github.com/grafana/grafana-plugin-sdk-go/backend"
  xray "github.com/grafana/x-ray-datasource/pkg/xray"
  "github.com/stretchr/testify/require"
  "math"
  "strconv"
  "testing"
  "time"
)

type XrayClientMock struct {
  traces []*xray.TraceSummary
}

func NewXrayClientMock(traces ...[]*xray.TraceSummary) *XrayClientMock {
  var allTraces []*xray.TraceSummary
  for _, l := range traces {
    allTraces = append(allTraces, l...)
  }
  return &XrayClientMock{
    traces: allTraces,
  }
}

func (client *XrayClientMock) GetTraceSummariesPages(input *xray.GetTraceSummariesInput, fn func(*xray.GetTraceSummariesOutput, bool) bool) error {
  return nil
}

func (client *XrayClientMock) GetTraceSummariesWithContext(ctx aws.Context, input *xray.GetTraceSummariesInput, opts ...request.Option) (*xray.GetTraceSummariesOutput, error) {
  resp := &xray.GetTraceSummariesOutput{}

  // We use ID to mark what group the trace should be in so we can simulate multiple multiple paged request as that is
  // translated to NextToken that needs to be used to get that particular trace. There is some shenanigans because we
  // translate 0 -> nil etc which probably could be simplified.
  reqToken := tokenToNumber(input.NextToken)
  nextToken := reqToken
  for _, trace := range client.traces {
    if trace.MatchedEventTime.After(*input.StartTime) && (trace.MatchedEventTime.Before(*input.EndTime) || trace.MatchedEventTime.Equal(*input.EndTime)) {
      traceToken := tokenToNumber(trace.Id)
      if reqToken == traceToken {
        resp.TraceSummaries = append(resp.TraceSummaries, trace)
      } else if traceToken > reqToken && (traceToken < nextToken || nextToken == reqToken) {
        // If there are traces with different tokens, mark it as possible candidate for NextToken to be sent back.
        nextToken = traceToken
      }
    }
  }
  if nextToken == 0 || nextToken == reqToken {
    // There was nothing more to so we are on "last page"
    resp.NextToken = nil
  } else {
    // there were some traces with higher token so send this back and let the client to request it later
    resp.NextToken = aws.String(strconv.Itoa(nextToken))
  }

  // Simple sampling if sampling strategy is used
  if input.SamplingStrategy != nil {
    var sampled []*xray.TraceSummary
    m := int(math.Floor(1 / *input.SamplingStrategy.Value))

    for index, trace := range resp.TraceSummaries {
      // Not probabilistic just simple mod so this is stable even reasonable even with small numbers
      if index % m == 0 {
        sampled = append(sampled, trace)
      }
    }
    resp.TraceSummaries = sampled
  }

  return resp, nil
}

func tokenToNumber(token *string) int {
  if token == nil {
    return 0
  }
  t, err := strconv.Atoi(*token)
  if err != nil {
    panic("token needs to number")
  }
  return t
}

func (client *XrayClientMock) BatchGetTraces(input *xray.BatchGetTracesInput) (*xray.BatchGetTracesOutput, error) {
  return nil, nil
}

func (client *XrayClientMock) GetTimeSeriesServiceStatisticsPagesWithContext(context aws.Context, input *xray.GetTimeSeriesServiceStatisticsInput, fn func(*xray.GetTimeSeriesServiceStatisticsOutput, bool) bool, options ...request.Option) error {
  // We need this in these tests only to get the total count for the happy path without filter expression
  out := &xray.GetTimeSeriesServiceStatisticsOutput{
    TimeSeriesServiceStatistics: []*xray.TimeSeriesServiceStatistics{
      {
        EdgeSummaryStatistics: &xray.EdgeStatistics{
          TotalCount: aws.Int64(int64(len(client.traces))),
        },
      },
    },
  }
  fn(out, true)
  return nil
}

func (client *XrayClientMock) GetInsightSummaries(input *xray.GetInsightSummariesInput) (*xray.GetInsightSummariesOutput, error) {
  return nil, nil
}

func (client *XrayClientMock) GetGroupsPages(input *xray.GetGroupsInput, fn func(*xray.GetGroupsOutput, bool) bool) error {
  return nil
}


func TestGetAnalytics(t *testing.T) {
  t.Run("getInsightSummaries", func(t *testing.T) {
    // This should go happy path use 0.5 sampling and return half of the traces
    traces, err := getTraceSummariesData(context.Background(), NewXrayClientMock(
      makeTrace("2020-09-16T00:00:01Z", "0", 100),
      makeTrace("2020-09-16T00:00:02Z", "0", 100),
      makeTrace("2020-09-16T00:00:03Z", "0", 100),
      makeTrace("2020-09-16T00:00:04Z", "0", 100),
    ), *makeQuery("", "2020-09-16T00:00:00Z", "2020-09-16T00:00:10Z"), 200)
    require.NoError(t, err)
    require.Equal(t, 200, len(traces))
  })

  t.Run("getInsightSummaries", func(t *testing.T) {
    // first loop should return 600 traces which is more than 400
    // sample those 600 to 300 (actual 299 due to probability)
    // second loop returns 150 traces (using 0.5 sampling in the request)
    // now we have 449 traces again and we have to sample again so we have 226 traces
    seed = 42
    traces, err := getTraceSummariesData(context.Background(), NewXrayClientMock(
      makeTrace("2020-09-16T00:00:01Z", "0", 200),
      makeTrace("2020-09-16T00:00:02Z", "1", 100),

      makeTrace("2020-09-16T00:00:03Z", "0", 200),
      makeTrace("2020-09-16T00:00:03Z", "1", 100),

      makeTrace("2020-09-16T00:00:06Z", "0", 200),
      makeTrace("2020-09-16T00:00:06Z", "1", 100),
    ), *makeQuery("some expression", "2020-09-16T00:00:00Z", "2020-09-16T00:00:10Z"), 400)
    require.NoError(t, err)
    require.Equal(t, 226, len(traces))
  })
}

func makeQuery(filter string, from string, to string) *backend.DataQuery {
  parsedFrom, err := time.Parse(time.RFC3339 , from)
  if err != nil {
    panic(err)
  }

  parsedTo, err := time.Parse(time.RFC3339 , to)
  if err != nil {
    panic(err)
  }
  queryData := &GetAnalyticsQueryData{
    Query: filter,
  }
  jsonData, _ := json.Marshal(queryData)
  query := &backend.DataQuery{
    JSON: jsonData,
    TimeRange: backend.TimeRange{
      From: parsedFrom,
      To: parsedTo,
    },
  }
  return query
}

func makeTrace(t string, id string, count int) []*xray.TraceSummary {
  parsed, err := time.Parse(time.RFC3339 , t)
  if err != nil {
    panic(err)
  }
  id2 := aws.String(id)
  if id == "0" {
    id2 = nil
  }
  var traces []*xray.TraceSummary
  for i := 0; i < count; i++ {
    traces = append(traces, &xray.TraceSummary{
      MatchedEventTime: aws.Time(parsed),
      Id: id2,
    })
  }
  return traces
}
