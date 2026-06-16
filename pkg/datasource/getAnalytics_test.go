package datasource

import (
	"context"
	"encoding/json"
	"math"
	"strconv"
	"testing"
	"time"

	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/service/xray"
	xraytypes "github.com/aws/aws-sdk-go-v2/service/xray/types"

	"github.com/grafana/grafana-aws-sdk/pkg/awsds"
	"github.com/grafana/grafana-plugin-sdk-go/backend"
	"github.com/stretchr/testify/require"
)

type XrayClientMock struct {
	traces []xraytypes.TraceSummary
}

func (client *XrayClientMock) GetServiceGraph(_ context.Context, _ *xray.GetServiceGraphInput, _ ...func(*xray.Options)) (*xray.GetServiceGraphOutput, error) {
	//TODO implement me
	panic("implement me")
}

func (client *XrayClientMock) GetTraceGraph(_ context.Context, _ *xray.GetTraceGraphInput, _ ...func(*xray.Options)) (*xray.GetTraceGraphOutput, error) {
	//TODO implement me
	panic("implement me")
}

func NewXrayClientMock(traces ...[]xraytypes.TraceSummary) *XrayClientMock {
	var allTraces []xraytypes.TraceSummary
	for _, l := range traces {
		allTraces = append(allTraces, l...)
	}
	return &XrayClientMock{
		traces: allTraces,
	}
}

func (client *XrayClientMock) GetTraceSummaries(_ context.Context, input *xray.GetTraceSummariesInput, _ ...func(*xray.Options)) (*xray.GetTraceSummariesOutput, error) {
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
		var sampled []xraytypes.TraceSummary
		m := int(math.Floor(1 / *input.SamplingStrategy.Value))

		for index, trace := range resp.TraceSummaries {
			// Not probabilistic just simple mod so this is stable even reasonable even with small numbers
			if index%m == 0 {
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

func (client *XrayClientMock) BatchGetTraces(_ context.Context, _ *xray.BatchGetTracesInput, _ ...func(*xray.Options)) (*xray.BatchGetTracesOutput, error) {
	return nil, nil
}

func (client *XrayClientMock) GetTimeSeriesServiceStatistics(_ context.Context, _ *xray.GetTimeSeriesServiceStatisticsInput, _ ...func(*xray.Options)) (*xray.GetTimeSeriesServiceStatisticsOutput, error) {
	// We need this in these tests only to get the total count for the happy path without filter expression
	return &xray.GetTimeSeriesServiceStatisticsOutput{
		TimeSeriesServiceStatistics: []xraytypes.TimeSeriesServiceStatistics{
			{
				EdgeSummaryStatistics: &xraytypes.EdgeStatistics{
					TotalCount: aws.Int64(int64(len(client.traces))),
				},
			},
		},
	}, nil
}

func (client *XrayClientMock) GetInsightSummaries(_ context.Context, _ *xray.GetInsightSummariesInput, _ ...func(*xray.Options)) (*xray.GetInsightSummariesOutput, error) {
	return nil, nil
}

func (client *XrayClientMock) GetGroups(_ context.Context, _ *xray.GetGroupsInput, _ ...func(*xray.Options)) (*xray.GetGroupsOutput, error) {
	return nil, nil
}

func getXrayClientFactory(client XrayClient) XrayClientFactory {
	return func(context.Context, backend.PluginContext, RequestSettings) (XrayClient, error) {
		return client, nil
	}
}

func TestGetAnalytics(t *testing.T) {
	t.Run("use precise sampling", func(t *testing.T) {

		xrayMock := NewXrayClientMock(
			makeTrace("2020-09-16T00:00:01Z", "0", 100),
			makeTrace("2020-09-16T00:00:02Z", "0", 100),
			makeTrace("2020-09-16T00:00:03Z", "0", 100),
			makeTrace("2020-09-16T00:00:04Z", "0", 100),
		)
		settings := awsds.AWSDatasourceSettings{}
		ds := NewDatasource(context.Background(), getXrayClientFactory(xrayMock), getAppSignalsClient, settings)
		// This should go happy path use 0.5 sampling and return half of the traces
		traces, err := ds.getTraceSummariesData(
			context.Background(),
			*makeQuery("", "2020-09-16T00:00:00Z", "2020-09-16T00:00:10Z"),
			200,
			backend.PluginContext{},
		)
		require.NoError(t, err)
		require.Equal(t, 200, len(traces))
	})

	t.Run("use approximate sampling", func(t *testing.T) {

		xrayMock := NewXrayClientMock(
			makeTrace("2020-09-16T00:00:01Z", "0", 200),
			makeTrace("2020-09-16T00:00:02Z", "1", 100),

			makeTrace("2020-09-16T00:00:03Z", "0", 200),
			makeTrace("2020-09-16T00:00:03Z", "1", 100),

			makeTrace("2020-09-16T00:00:06Z", "0", 200),
			makeTrace("2020-09-16T00:00:06Z", "1", 100),
		)
		settings := awsds.AWSDatasourceSettings{}
		ds := NewDatasource(context.Background(), getXrayClientFactory(xrayMock), getAppSignalsClient, settings)
		// first loop should return 600 traces which is more than 400
		// sample those 600 to 300 (actual 299 due to probability)
		// second loop returns 150 traces (using 0.5 sampling in the request)
		// now we have 449 traces again and we have to sample again so we have 226 traces
		seed = 42
		traces, err := ds.getTraceSummariesData(
			context.Background(),
			*makeQuery("some expression", "2020-09-16T00:00:00Z", "2020-09-16T00:00:10Z"),
			400,
			backend.PluginContext{},
		)
		require.NoError(t, err)
		require.Equal(t, 226, len(traces))
	})
}

func makeQuery(filter string, from string, to string) *backend.DataQuery {
	parsedFrom, err := time.Parse(time.RFC3339, from)
	if err != nil {
		panic(err)
	}

	parsedTo, err := time.Parse(time.RFC3339, to)
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
			To:   parsedTo,
		},
	}
	return query
}

func makeTrace(t string, id string, count int) []xraytypes.TraceSummary {
	parsed, err := time.Parse(time.RFC3339, t)
	if err != nil {
		panic(err)
	}
	id2 := aws.String(id)
	if id == "0" {
		id2 = nil
	}
	var traces []xraytypes.TraceSummary
	for i := 0; i < count; i++ {
		traces = append(traces, xraytypes.TraceSummary{
			MatchedEventTime: aws.Time(parsed),
			Id:               id2,
		})
	}
	return traces
}
