package datasource_test

import (
	"context"
	"encoding/json"
	"testing"
	"time"

	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/request"
	"github.com/grafana/grafana-plugin-sdk-go/backend"
	"github.com/grafana/x-ray-datasource/pkg/datasource"
	xray "github.com/grafana/x-ray-datasource/pkg/xray"
	"github.com/stretchr/testify/require"
)

type XrayClientMock struct{}

func makeSummary() *xray.TraceSummary {
	http := &xray.Http{
		ClientIp:   aws.String("127.0.0.1"),
		HttpMethod: aws.String("GET"),
		HttpStatus: aws.Int64(200),
		HttpURL:    aws.String("localhost"),
	}

	annotations := make(map[string][]*xray.ValueWithServiceIds)
	annotations["foo"] = []*xray.ValueWithServiceIds{{
		AnnotationValue: &xray.AnnotationValue{},
		ServiceIds:      []*xray.ServiceId{},
	}, {
		AnnotationValue: &xray.AnnotationValue{},
		ServiceIds:      []*xray.ServiceId{},
	}}

	annotations["bar"] = []*xray.ValueWithServiceIds{{
		AnnotationValue: &xray.AnnotationValue{},
		ServiceIds:      []*xray.ServiceId{},
	}}

	return &xray.TraceSummary{
		Annotations: annotations,
		Duration:    aws.Float64(10.5),
		Http:        http,
		Id:          aws.String("id1"),
		ErrorRootCauses: []*xray.ErrorRootCause{
			{
				ClientImpacting: nil,
				Services: []*xray.ErrorRootCauseService{
					{
						Name: aws.String("service_name_1"),
						Type: aws.String("service_type_1"),
						EntityPath: []*xray.ErrorRootCauseEntity{
							{
								Exceptions: []*xray.RootCauseException{
									{
										Name:    aws.String("Test exception"),
										Message: aws.String("Test exception message"),
									},
								},
							},
						},
					},
				},
			},
		},
		FaultRootCauses: []*xray.FaultRootCause{
			{
				ClientImpacting: nil,
				Services: []*xray.FaultRootCauseService{
					{
						Name: aws.String("faulty_service_name_1"),
						Type: aws.String("faulty_service_type_1"),
						EntityPath: []*xray.FaultRootCauseEntity{
							{
								Exceptions: []*xray.RootCauseException{
									{
										Name:    aws.String("Test fault"),
										Message: aws.String("Test fault message"),
									},
								},
							},
						},
					},
				},
			},
		},
		ResponseTimeRootCauses: []*xray.ResponseTimeRootCause{
			{
				ClientImpacting: nil,
				Services: []*xray.ResponseTimeRootCauseService{
					{
						Name: aws.String("response_service_name_1"),
						Type: aws.String("response_service_type_1"),
						EntityPath: []*xray.ResponseTimeRootCauseEntity{
							{Name: aws.String("response_service_name_1")},
							{Name: aws.String("response_sub_service_name_1")},
						},
					},
					{
						Name: aws.String("response_service_name_2"),
						Type: aws.String("response_service_type_2"),
						EntityPath: []*xray.ResponseTimeRootCauseEntity{
							{Name: aws.String("response_service_name_2")},
							{Name: aws.String("response_sub_service_name_2")},
						},
					},
				},
			},
		},
	}
}

func (client *XrayClientMock) GetTraceSummariesPages(input *xray.GetTraceSummariesInput, fn func(*xray.GetTraceSummariesOutput, bool) bool) error {
  resp, err := client.GetTraceSummariesWithContext(context.Background(), input)
	fn(resp, true)
	return err
}


func (client *XrayClientMock) GetTraceSummariesWithContext(ctx aws.Context, input *xray.GetTraceSummariesInput, opts ...request.Option) (*xray.GetTraceSummariesOutput, error) {
  // To make sure we don't panic in this case.
  nilHttpSummary := makeSummary()
  nilHttpSummary.Http.ClientIp = nil
  nilHttpSummary.Http.HttpURL = nil
  nilHttpSummary.Http.HttpMethod = nil
  nilHttpSummary.Http.HttpStatus = nil

  output := &xray.GetTraceSummariesOutput{
    ApproximateTime: aws.Time(time.Now()),
    TraceSummaries:  []*xray.TraceSummary{makeSummary(), nilHttpSummary},
  }

  return output, nil
}

func (client *XrayClientMock) BatchGetTraces(input *xray.BatchGetTracesInput) (*xray.BatchGetTracesOutput, error) {
	if *input.TraceIds[0] == "notFound" {
		return &xray.BatchGetTracesOutput{
			Traces: []*xray.Trace{},
		}, nil
	}
	return &xray.BatchGetTracesOutput{
		Traces: []*xray.Trace{{
			Duration: aws.Float64(1.0),
			Id:       aws.String("trace1"),
			Segments: []*xray.Segment{
				{
					Id:       aws.String("segment1"),
					Document: aws.String("{}"),
				},
			},
		}},
	}, nil
}

func (client *XrayClientMock) GetTimeSeriesServiceStatisticsPagesWithContext(context aws.Context, input *xray.GetTimeSeriesServiceStatisticsInput, fn func(*xray.GetTimeSeriesServiceStatisticsOutput, bool) bool, options ...request.Option) error {
	output := &xray.GetTimeSeriesServiceStatisticsOutput{
		TimeSeriesServiceStatistics: []*xray.TimeSeriesServiceStatistics{
			makeTimeSeriesRow(0, Edge),
			makeTimeSeriesRow(1, Edge),
			makeTimeSeriesRow(2, Service),
		},
	}
	fn(output, false)
	return nil
}

const insightSummary = "some text. some more."

func (client *XrayClientMock) GetInsightSummaries(input *xray.GetInsightSummariesInput) (*xray.GetInsightSummariesOutput, error) {
	return &xray.GetInsightSummariesOutput{
		InsightSummaries: []*xray.InsightSummary{
			{
				Summary:              aws.String(insightSummary),
				StartTime:            aws.Time(time.Date(2020, 6, 20, 1, 0, 1, 0, time.UTC)),
				EndTime:              aws.Time(time.Date(2020, 6, 20, 1, 20, 1, 0, time.UTC)),
				State:                aws.String("CLOSED"),
				Categories:           aws.StringSlice([]string{"FAULT", "ERROR"}),
				GroupName:            aws.String("Grafana"),
				RootCauseServiceId:   &xray.ServiceId{Name: aws.String("graf"), Type: aws.String("AWS")},
				TopAnomalousServices: []*xray.ImpactedService{{ServiceId: &xray.ServiceId{Name: aws.String("graf2"), Type: aws.String("AWS2")}}},
				InsightId:            aws.String("ID"),
			},
			{
				Summary:              aws.String(insightSummary),
				StartTime:            aws.Time(time.Date(2020, 6, 20, 1, 0, 1, 0, time.UTC)),
				EndTime:              nil,
				Categories:           aws.StringSlice([]string{"a", "b"}),
				State:                aws.String("ACTIVE"),
				GroupName:            aws.String("Grafana"),
				RootCauseServiceId:   &xray.ServiceId{Name: aws.String("graf"), Type: aws.String("AWS")},
				TopAnomalousServices: []*xray.ImpactedService{{ServiceId: &xray.ServiceId{Name: aws.String("graf2"), Type: aws.String("AWS2")}}},
				InsightId:            aws.String("ID2"),
			},
		},
	}, nil
}

func (client *XrayClientMock) GetGroupsPages(input *xray.GetGroupsInput, fn func(*xray.GetGroupsOutput, bool) bool) error {
	output := &xray.GetGroupsOutput{
		Groups: []*xray.GroupSummary{
			{
				GroupARN:         aws.String("arn:1"),
				GroupName:        aws.String("Default"),
				FilterExpression: aws.String(""),
			},
			{
				GroupARN:         aws.String("arn:2"),
				GroupName:        aws.String("GroupTest"),
				FilterExpression: aws.String("service(\"test\")"),
			},
		},
	}
	fn(output, false)
	return nil
}

type StatsType string

const (
	Edge    = "edge"
	Service = "service"
)

func makeTimeSeriesRow(index int, statsType StatsType) *xray.TimeSeriesServiceStatistics {
	stats := &xray.TimeSeriesServiceStatistics{
		EdgeSummaryStatistics: nil,
		ResponseTimeHistogram: []*xray.HistogramEntry{
			{
				Count: aws.Int64(5),
				Value: aws.Float64(42.42),
			},
		},
		ServiceSummaryStatistics: nil,
		Timestamp:                aws.Time(time.Date(2020, 6, 20, 1, index, 1, 0, time.UTC)),
	}
	if statsType == "edge" {
		stats.EdgeSummaryStatistics = &xray.EdgeStatistics{
			ErrorStatistics: &xray.ErrorStatistics{
				OtherCount:    aws.Int64(10),
				ThrottleCount: aws.Int64(10),
				TotalCount:    aws.Int64(20),
			},
			FaultStatistics: &xray.FaultStatistics{
				OtherCount: aws.Int64(15),
				TotalCount: aws.Int64(20),
			},
			OkCount:           aws.Int64(40),
			TotalCount:        aws.Int64(80),
			TotalResponseTime: aws.Float64(3.14),
		}
	} else {
		stats.ServiceSummaryStatistics = &xray.ServiceStatistics{
			ErrorStatistics: &xray.ErrorStatistics{
				OtherCount:    aws.Int64(10),
				ThrottleCount: aws.Int64(11),
				TotalCount:    aws.Int64(20),
			},
			FaultStatistics: &xray.FaultStatistics{
				OtherCount: aws.Int64(15),
				TotalCount: aws.Int64(20),
			},
			OkCount:           aws.Int64(40),
			TotalCount:        aws.Int64(80),
			TotalResponseTime: aws.Float64(3.14),
		}
	}
	return stats
}

func clientFactory(pluginContext *backend.PluginContext) (datasource.XrayClient, error) {
	return &XrayClientMock{}, nil
}

func queryDatasource(ds *datasource.Datasource, queryType string, query interface{}) (*backend.QueryDataResponse, error) {
	jsonData, _ := json.Marshal(query)

	return ds.QueryMux.QueryData(
		context.Background(),
		&backend.QueryDataRequest{Queries: []backend.DataQuery{{RefID: "A", QueryType: queryType, JSON: jsonData}}},
	)
}

type MockSender struct {
	fn func(resp *backend.CallResourceResponse)
}

func (sender *MockSender) Send(resp *backend.CallResourceResponse) error {
	sender.fn(resp)
	return nil
}

func queryDatasourceResource(ds *datasource.Datasource, req *backend.CallResourceRequest) (*backend.CallResourceResponse, error) {
	var resp *backend.CallResourceResponse
	err := ds.ResourceMux.CallResource(
		context.Background(),
		req,
		&MockSender{fn: func(r *backend.CallResourceResponse) {
			resp = r
		}},
	)
	return resp, err
}

func TestDatasource(t *testing.T) {
	ds := datasource.NewDatasource(clientFactory)

	t.Run("getInsightSummaries query", func(t *testing.T) {
		// Insight with nil EndTime should not throw error
		response, err := queryDatasource(ds, datasource.QueryGetInsights, datasource.GetInsightsQueryData{State: "All", Group: &xray.Group{GroupName: aws.String("Grafana")}})
		require.NoError(t, err)
		require.NoError(t, response.Responses["A"].Error)

		// it should remove the first sentence from the summary
		require.Equal(t, "some more.", response.Responses["A"].Frames[0].Fields[1].At(0))

		// Insight with nil EndTime should return the whole Summary
		require.Equal(t, insightSummary, response.Responses["A"].Frames[0].Fields[1].At(1))

		// State should be in Title case
		require.Equal(t, "Active", response.Responses["A"].Frames[0].Fields[2].At(1))

		// Categories should be converted to Title case and one string
		require.Equal(t, "Fault, Error", response.Responses["A"].Frames[0].Fields[3].At(0))

		// duration should be 20 minutes which is 1 200 000 milliseconds
		require.Equal(t, int64(1200000), response.Responses["A"].Frames[0].Fields[4].At(0))

		// RootCauseServiceId should be Name (Type)
		require.Equal(t, "graf (AWS)", response.Responses["A"].Frames[0].Fields[5].At(0))

		// TopAnomalousServices should be Name (Type)
		require.Equal(t, "graf2 (AWS2)", response.Responses["A"].Frames[0].Fields[6].At(0))
	})

	t.Run("getTrace query", func(t *testing.T) {
		response, err := queryDatasource(ds, datasource.QueryGetTrace, datasource.GetTraceQueryData{Query: "traceID"})
		require.NoError(t, err)
		require.NoError(t, response.Responses["A"].Error)

		require.Equal(t, 1, response.Responses["A"].Frames[0].Fields[0].Len())
		require.JSONEq(
			t,
			"{\"Duration\":1,\"Id\":\"trace1\",\"Segments\":[{\"Document\":\"{}\",\"Id\":\"segment1\"}]}",
			response.Responses["A"].Frames[0].Fields[0].At(0).(string),
		)
	})

	t.Run("getTrace query trace not found", func(t *testing.T) {
		response, err := queryDatasource(ds, datasource.QueryGetTrace, datasource.GetTraceQueryData{Query: "notFound"})
		require.NoError(t, err)
		require.Error(t, response.Responses["A"].Error, "trace not found")
	})

	t.Run("getTimeSeriesServiceStatistics query", func(t *testing.T) {
		response, err := queryDatasource(
			ds,
			datasource.QueryGetTimeSeriesServiceStatistics,
			datasource.GetTimeSeriesServiceStatisticsQueryData{Query: "traceID", Columns: []string{}},
		)
		require.NoError(t, err)
		require.NoError(t, response.Responses["A"].Error)

		require.Equal(t, 3, response.Responses["A"].Frames[0].Fields[0].Len())
		require.Equal(t, 6, len(response.Responses["A"].Frames))
		require.Equal(t, "Time", response.Responses["A"].Frames[0].Fields[0].Name)
		require.Equal(t, "Throttle Count", response.Responses["A"].Frames[0].Fields[1].Name)
		require.Equal(t, "Average Response Time", response.Responses["A"].Frames[5].Fields[1].Name)
		require.Equal(
			t,
			time.Date(2020, 6, 20, 1, 0, 1, 0, time.UTC).String(),
			response.Responses["A"].Frames[0].Fields[0].At(0).(*time.Time).String(),
		)
		require.Equal(t, int64(10), *response.Responses["A"].Frames[0].Fields[1].At(0).(*int64))
		require.Equal(t, int64(11), *response.Responses["A"].Frames[0].Fields[1].At(2).(*int64))
		require.Equal(t, 3.14/80, *response.Responses["A"].Frames[5].Fields[1].At(0).(*float64))
	})

	t.Run("getTimeSeriesServiceStatistics query returns filtered columns", func(t *testing.T) {
		response, err := queryDatasource(
			ds,
			datasource.QueryGetTimeSeriesServiceStatistics,
			datasource.GetTimeSeriesServiceStatisticsQueryData{Query: "traceID", Columns: []string{"OkCount", "FaultStatistics.TotalCount"}},
		)
		require.NoError(t, err)
		require.NoError(t, response.Responses["A"].Error)

		require.Equal(t, 2, len(response.Responses["A"].Frames))
		require.Equal(t, "Success Count", response.Responses["A"].Frames[0].Fields[1].Name)
		require.Equal(t, "Fault Count", response.Responses["A"].Frames[1].Fields[1].Name)
	})

	t.Run("getTrace query trace not found", func(t *testing.T) {
		response, err := queryDatasource(ds, datasource.QueryGetTrace, datasource.GetTraceQueryData{Query: "notFound"})
		require.NoError(t, err)
		require.Error(t, response.Responses["A"].Error, "trace not found")
	})

	t.Run("getTimeSeriesServiceStatistics query", func(t *testing.T) {
		response, err := queryDatasource(
			ds,
			datasource.QueryGetTimeSeriesServiceStatistics,
			datasource.GetTimeSeriesServiceStatisticsQueryData{Query: "traceID", Columns: []string{"all"}},
		)
		require.NoError(t, err)
		require.NoError(t, response.Responses["A"].Error)

		require.Equal(t, 3, response.Responses["A"].Frames[0].Fields[0].Len())
		require.Equal(t, 6, len(response.Responses["A"].Frames))
		require.Equal(t, "Time", response.Responses["A"].Frames[0].Fields[0].Name)
		require.Equal(t, "Throttle Count", response.Responses["A"].Frames[0].Fields[1].Name)
		require.Equal(t, "Average Response Time", response.Responses["A"].Frames[5].Fields[1].Name)
		require.Equal(
			t,
			time.Date(2020, 6, 20, 1, 0, 1, 0, time.UTC).String(),
			response.Responses["A"].Frames[0].Fields[0].At(0).(*time.Time).String(),
		)
		require.Equal(t, int64(10), *response.Responses["A"].Frames[0].Fields[1].At(0).(*int64))
		require.Equal(t, int64(11), *response.Responses["A"].Frames[0].Fields[1].At(2).(*int64))
		require.Equal(t, 3.14/80, *response.Responses["A"].Frames[5].Fields[1].At(0).(*float64))
	})

	t.Run("getTimeSeriesServiceStatistics query returns filtered columns", func(t *testing.T) {
		response, err := queryDatasource(
			ds,
			datasource.QueryGetTimeSeriesServiceStatistics,
			datasource.GetTimeSeriesServiceStatisticsQueryData{Query: "traceID", Columns: []string{"OkCount", "FaultStatistics.TotalCount"}},
		)
		require.NoError(t, err)
		require.NoError(t, response.Responses["A"].Error)

		require.Equal(t, 2, len(response.Responses["A"].Frames))
		require.Equal(t, "Success Count", response.Responses["A"].Frames[0].Fields[1].Name)
		require.Equal(t, "Fault Count", response.Responses["A"].Frames[1].Fields[1].Name)
	})

	t.Run("getTraceSummaries query", func(t *testing.T) {
		response, err := queryDatasource(ds, datasource.QueryGetTraceSummaries, datasource.GetTraceSummariesQueryData{Query: ""})
		require.NoError(t, err)
		require.NoError(t, response.Responses["A"].Error)

		frame := response.Responses["A"].Frames[0]
		require.Equal(t, 2, frame.Fields[0].Len())
		require.Equal(t, "id1", *frame.Fields[0].At(0).(*string))
		require.Equal(t, "GET", *frame.Fields[1].At(0).(*string))
		require.Equal(t, 10.5, *frame.Fields[3].At(0).(*float64))
		require.Equal(t, int64(3), *frame.Fields[6].At(0).(*int64))
	})

	//
	// RootCauseError
	//

	t.Run("getAnalyticsRootCauseErrorService query", func(t *testing.T) {
		testAnalytics(t, ds, datasource.QueryGetAnalyticsRootCauseErrorService, [][]interface{}{
			{"service_name_1 (service_type_1)", int64(8), float64(100)},
		})
	})

	t.Run("getAnalyticsRootCauseErrorPath query", func(t *testing.T) {
		testAnalytics(t, ds, datasource.QueryGetAnalyticsRootCauseErrorPath, [][]interface{}{
			{"service_name_1 (service_type_1) -> Test exception", int64(8), float64(100)},
		})
	})

	t.Run("getAnalyticsRootCauseErrorMessage query", func(t *testing.T) {
		testAnalytics(t, ds, datasource.QueryGetAnalyticsRootCauseErrorMessage, [][]interface{}{
			{"Test exception message", int64(8), float64(100)},
		})
	})

	//
	// RootCauseFault
	//

	t.Run("getAnalyticsRootCauseFaultService query", func(t *testing.T) {
		testAnalytics(t, ds, datasource.QueryGetAnalyticsRootCauseFaultService, [][]interface{}{
			{"faulty_service_name_1 (faulty_service_type_1)", int64(8), float64(100)},
		})
	})

	t.Run("getAnalyticsRootCauseFaultPath query", func(t *testing.T) {
		testAnalytics(t, ds, datasource.QueryGetAnalyticsRootCauseFaultPath, [][]interface{}{
			{"faulty_service_name_1 (faulty_service_type_1) -> Test fault", int64(8), float64(100)},
		})
	})

	t.Run("getAnalyticsRootCauseFaultMessage query", func(t *testing.T) {
		testAnalytics(t, ds, datasource.QueryGetAnalyticsRootCauseFaultMessage, [][]interface{}{
			{"Test fault message", int64(8), float64(100)},
		})
	})

	//
	// RootCauseResponseTime
	//

	t.Run("getAnalyticsRootCauseResponseTimeService query", func(t *testing.T) {
		testAnalytics(t, ds, datasource.QueryGetAnalyticsRootCauseResponseTimeService, [][]interface{}{
			{"response_service_name_2 (response_service_type_2)", int64(8), float64(100)},
		})
	})

	t.Run("getAnalyticsRootCauseResponseTimePath query", func(t *testing.T) {
		testAnalytics(t, ds, datasource.QueryGetAnalyticsRootCauseResponseTimePath, [][]interface{}{
			{
				"response_service_name_1 (response_service_type_1) -> response_sub_service_name_1 => response_service_name_2 (response_service_type_2) -> response_sub_service_name_2",
				int64(8),
				float64(100),
			},
		})
	})

	t.Run("getGroups query", func(t *testing.T) {
		resp, err := queryDatasourceResource(ds, &backend.CallResourceRequest{
			Path:   "/groups",
			Method: "GET",
		})
		require.NoError(t, err)

		var data []*xray.GroupSummary
		err = json.Unmarshal(resp.Body, &data)
		require.NoError(t, err)
		require.Equal(t, 2, len(data))
		require.Equal(t, "Default", *data[0].GroupName)
		require.Equal(t, "GroupTest", *data[1].GroupName)
	})
}

func testAnalytics(t *testing.T, ds *datasource.Datasource, queryType string, data [][]interface{}) {
	response, err := queryDatasource(ds, queryType, datasource.GetTraceSummariesQueryData{Query: ""})
	require.NoError(t, err)
	checkResponse(t, response, data)
}

func checkResponse(t *testing.T, response *backend.QueryDataResponse, data [][]interface{}) {
	require.NoError(t, response.Responses["A"].Error)
	frame := response.Responses["A"].Frames[0]
	require.Equal(t, len(data), frame.Fields[0].Len())
	for rowIndex, row := range data {
		for columnIndex, column := range row {
			require.Equal(t, column, frame.Fields[columnIndex].At(rowIndex))
		}
	}
}
