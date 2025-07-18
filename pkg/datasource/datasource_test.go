package datasource_test

import (
	"context"
	"encoding/json"
	"strings"
	"testing"
	"time"

	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/service/applicationsignals"
	appSignalsTypes "github.com/aws/aws-sdk-go-v2/service/applicationsignals/types"
	"github.com/aws/aws-sdk-go-v2/service/xray"
	xraytypes "github.com/aws/aws-sdk-go-v2/service/xray/types"
	"github.com/grafana/grafana-aws-sdk/pkg/awsds"
	"github.com/grafana/grafana-plugin-sdk-go/backend"
	"github.com/grafana/grafana-plugin-sdk-go/data"
	"github.com/grafana/x-ray-datasource/pkg/datasource"
	"github.com/stretchr/testify/require"
)

type XrayClientMock struct {
	queryCalledWithRegion string
}

func (client *XrayClientMock) GetServiceGraph(_ context.Context, _ *xray.GetServiceGraphInput, _ ...func(*xray.Options)) (*xray.GetServiceGraphOutput, error) {
	serviceName := "mockServiceName"
	if client.queryCalledWithRegion != "" {
		serviceName = serviceName + "-" + client.queryCalledWithRegion
	}
	return &xray.GetServiceGraphOutput{
		NextToken: nil,
		Services: []xraytypes.Service{
			{
				Name:      aws.String(serviceName),
				AccountId: aws.String("testAccount1"),
			},
			{
				Name:      aws.String(serviceName + "2"),
				AccountId: aws.String("testAccount2"),
			},
		},
	}, nil
}

func (client *XrayClientMock) GetTraceGraph(_ context.Context, _ *xray.GetTraceGraphInput, _ ...func(*xray.Options)) (*xray.GetTraceGraphOutput, error) {
	return &xray.GetTraceGraphOutput{
		NextToken: nil,
		Services: []xraytypes.Service{
			{},
		},
	}, nil
}

func makeSummary(region string) xraytypes.TraceSummary {
	http := &xraytypes.Http{
		ClientIp:   aws.String("127.0.0.1"),
		HttpMethod: aws.String("GET"),
		HttpStatus: aws.Int32(200),
		HttpURL:    aws.String("localhost"),
	}

	annotations := make(map[string][]xraytypes.ValueWithServiceIds)
	annotations["foo"] = []xraytypes.ValueWithServiceIds{{
		ServiceIds: []xraytypes.ServiceId{},
	}, {
		ServiceIds: []xraytypes.ServiceId{},
	}}

	annotations["bar"] = []xraytypes.ValueWithServiceIds{{
		ServiceIds: []xraytypes.ServiceId{},
	}}

	traceId := "id1"
	if region != "" {
		traceId = "id-" + region
	}

	return xraytypes.TraceSummary{
		Annotations: annotations,
		Duration:    aws.Float64(10.5),
		StartTime:   aws.Time(time.Date(2023, time.January, 1, 12, 0, 0, 0, time.UTC)),
		Http:        http,
		Id:          aws.String(traceId),
		ErrorRootCauses: []xraytypes.ErrorRootCause{
			{
				ClientImpacting: nil,
				Services: []xraytypes.ErrorRootCauseService{
					{
						Name: aws.String("service_name_1"),
						Type: aws.String("service_type_1"),
						EntityPath: []xraytypes.ErrorRootCauseEntity{
							{
								Exceptions: []xraytypes.RootCauseException{
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
		FaultRootCauses: []xraytypes.FaultRootCause{
			{
				ClientImpacting: nil,
				Services: []xraytypes.FaultRootCauseService{
					{
						Name: aws.String("faulty_service_name_1"),
						Type: aws.String("faulty_service_type_1"),
						EntityPath: []xraytypes.FaultRootCauseEntity{
							{
								Exceptions: []xraytypes.RootCauseException{
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
		ResponseTimeRootCauses: []xraytypes.ResponseTimeRootCause{
			{
				ClientImpacting: nil,
				Services: []xraytypes.ResponseTimeRootCauseService{
					{
						Name: aws.String("response_service_name_1"),
						Type: aws.String("response_service_type_1"),
						EntityPath: []xraytypes.ResponseTimeRootCauseEntity{
							{Name: aws.String("response_service_name_1")},
							{Name: aws.String("response_sub_service_name_1")},
						},
					},
					{
						Name: aws.String("response_service_name_2"),
						Type: aws.String("response_service_type_2"),
						EntityPath: []xraytypes.ResponseTimeRootCauseEntity{
							{Name: aws.String("response_service_name_2")},
							{Name: aws.String("response_sub_service_name_2")},
						},
					},
				},
			},
		},
	}
}

func (client *XrayClientMock) GetTraceSummaries(_ context.Context, _ *xray.GetTraceSummariesInput, _ ...func(*xray.Options)) (*xray.GetTraceSummariesOutput, error) {
	// To make sure we don't panic in this case.
	nilHttpSummary := makeSummary(client.queryCalledWithRegion)
	nilHttpSummary.Http.ClientIp = nil
	nilHttpSummary.Http.HttpURL = nil
	nilHttpSummary.Http.HttpMethod = nil
	nilHttpSummary.Http.HttpStatus = nil

	output := &xray.GetTraceSummariesOutput{
		ApproximateTime: aws.Time(time.Now()),
		TraceSummaries:  []xraytypes.TraceSummary{makeSummary(client.queryCalledWithRegion), nilHttpSummary},
	}

	return output, nil
}

func (client *XrayClientMock) BatchGetTraces(_ context.Context, input *xray.BatchGetTracesInput, _ ...func(*xray.Options)) (*xray.BatchGetTracesOutput, error) {
	if input.TraceIds[0] == "notFound" {
		return &xray.BatchGetTracesOutput{
			Traces: []xraytypes.Trace{},
		}, nil
	}
	traceId := input.TraceIds[0]
	if client.queryCalledWithRegion != "" {
		traceId = traceId + "-" + client.queryCalledWithRegion
	}
	return &xray.BatchGetTracesOutput{
		Traces: []xraytypes.Trace{{
			Duration: aws.Float64(1.0),
			Id:       aws.String(traceId),
			Segments: []xraytypes.Segment{
				{
					Id:       aws.String("segment1"),
					Document: aws.String("{}"),
				},
			},
		}},
	}, nil
}

func (client *XrayClientMock) GetTimeSeriesServiceStatistics(_ context.Context, _ *xray.GetTimeSeriesServiceStatisticsInput, _ ...func(*xray.Options)) (*xray.GetTimeSeriesServiceStatisticsOutput, error) {
	firstRow := 0
	if client.queryCalledWithRegion != "" {
		firstRow = 13
	}

	output := &xray.GetTimeSeriesServiceStatisticsOutput{
		TimeSeriesServiceStatistics: []xraytypes.TimeSeriesServiceStatistics{
			makeTimeSeriesRow(firstRow, Edge),
			makeTimeSeriesRow(1, Edge),
			makeTimeSeriesRow(2, Service),
		},
	}
	return output, nil
}

const insightSummary = "some text. some more."

func (client *XrayClientMock) GetInsightSummaries(_ context.Context, _ *xray.GetInsightSummariesInput, _ ...func(*xray.Options)) (*xray.GetInsightSummariesOutput, error) {
	return &xray.GetInsightSummariesOutput{
		InsightSummaries: []xraytypes.InsightSummary{
			{
				Summary:              aws.String(insightSummary),
				StartTime:            aws.Time(time.Date(2020, 6, 20, 1, 0, 1, 0, time.UTC)),
				EndTime:              aws.Time(time.Date(2020, 6, 20, 1, 20, 1, 0, time.UTC)),
				State:                xraytypes.InsightStateClosed,
				Categories:           []xraytypes.InsightCategory{xraytypes.InsightCategoryFault, "ERROR"},
				GroupName:            aws.String("Grafana"),
				RootCauseServiceId:   &xraytypes.ServiceId{Name: aws.String("graf"), Type: aws.String("AWS")},
				TopAnomalousServices: []xraytypes.AnomalousService{{ServiceId: &xraytypes.ServiceId{Name: aws.String("graf2"), Type: aws.String("AWS2")}}},
				InsightId:            aws.String("id-" + client.queryCalledWithRegion),
			},
			{
				Summary:              aws.String(insightSummary),
				StartTime:            aws.Time(time.Date(2020, 6, 20, 1, 0, 1, 0, time.UTC)),
				EndTime:              nil,
				Categories:           []xraytypes.InsightCategory{"a", "b"},
				State:                xraytypes.InsightStateActive,
				GroupName:            aws.String("Grafana"),
				RootCauseServiceId:   &xraytypes.ServiceId{Name: aws.String("graf"), Type: aws.String("AWS")},
				TopAnomalousServices: []xraytypes.AnomalousService{{ServiceId: &xraytypes.ServiceId{Name: aws.String("graf2"), Type: aws.String("AWS2")}}},
				InsightId:            aws.String("id-2-" + client.queryCalledWithRegion),
			},
		},
	}, nil
}

func (client *XrayClientMock) GetGroups(_ context.Context, _ *xray.GetGroupsInput, _ ...func(*xray.Options)) (*xray.GetGroupsOutput, error) {
	return &xray.GetGroupsOutput{
		Groups: []xraytypes.GroupSummary{
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
	}, nil
}

type StatsType string

const (
	Edge    = "edge"
	Service = "service"
)

func makeTimeSeriesRow(index int, statsType StatsType) xraytypes.TimeSeriesServiceStatistics {
	stats := xraytypes.TimeSeriesServiceStatistics{
		EdgeSummaryStatistics: nil,
		ResponseTimeHistogram: []xraytypes.HistogramEntry{
			{
				Count: 5,
				Value: 42.42,
			},
		},
		ServiceSummaryStatistics: nil,
		Timestamp:                aws.Time(time.Date(2020, 6, 20, 1, index, 1, 0, time.UTC)),
	}
	if statsType == "edge" {
		stats.EdgeSummaryStatistics = &xraytypes.EdgeStatistics{
			ErrorStatistics: &xraytypes.ErrorStatistics{
				OtherCount:    aws.Int64(10),
				ThrottleCount: aws.Int64(10),
				TotalCount:    aws.Int64(20),
			},
			FaultStatistics: &xraytypes.FaultStatistics{
				OtherCount: aws.Int64(15),
				TotalCount: aws.Int64(20),
			},
			OkCount:           aws.Int64(40),
			TotalCount:        aws.Int64(80),
			TotalResponseTime: aws.Float64(3.14),
		}
	} else {
		stats.ServiceSummaryStatistics = &xraytypes.ServiceStatistics{
			ErrorStatistics: &xraytypes.ErrorStatistics{
				OtherCount:    aws.Int64(10),
				ThrottleCount: aws.Int64(11),
				TotalCount:    aws.Int64(20),
			},
			FaultStatistics: &xraytypes.FaultStatistics{
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

func xrayClientFactory(_ context.Context, _ backend.PluginContext, requestSettings datasource.RequestSettings) (datasource.XrayClient, error) {
	return &XrayClientMock{
		queryCalledWithRegion: requestSettings.Region,
	}, nil
}

type AppSignalsClientMock struct {
	queryCalledWithRegion string
}

func (client *AppSignalsClientMock) ListServices(context.Context, *applicationsignals.ListServicesInput, ...func(*applicationsignals.Options)) (*applicationsignals.ListServicesOutput, error) {
	return &applicationsignals.ListServicesOutput{
		ServiceSummaries: []appSignalsTypes.ServiceSummary{
			{
				KeyAttributes: map[string]string{
					"Type":        "Service",
					"Name":        "billing-service-python",
					"Environment": "eks:app-signals-demo/default",
				},
				AttributeMaps: []map[string]string{
					{
						"PlatformType":         "AWS::EKS",
						"EKS.Cluster":          "app-signals-demo",
						"K8s.Namespace":        "default",
						"K8s.Workload":         "billing-service-python",
						"EC2.AutoScalingGroup": "scaling",
						"EC2.InstanceId":       "id",
						"Host":                 "hostname",
					},
				},
			},
			{
				KeyAttributes: map[string]string{
					"Type":         "Resource",
					"ResourceType": "SomeResource",
					"Name":         "allFields",
					"Identifier":   "id",
					"Environment":  "environment",
				},
				AttributeMaps: []map[string]string{
					{
						"PlatformType":  "K8s",
						"K8s.Cluster":   "fake-resource",
						"K8s.Namespace": "default",
						"K8s.Workload":  "allFields",
						"K8s.Node":      "node",
						"K8s.Pod":       "pod",
					},
					{
						"AWS.Application":     "applicationName",
						"AWS.Application.ARN": "applicationArn",
					},
					{
						"Telemetry.SDK":    "sdk",
						"Telemetry.Agent":  "agent",
						"Telemetry.Source": "source",
					},
				},
			},
		},
	}, nil
}

func (client *AppSignalsClientMock) ListServiceOperations(context.Context, *applicationsignals.ListServiceOperationsInput, ...func(*applicationsignals.Options)) (*applicationsignals.ListServiceOperationsOutput, error) {
	return &applicationsignals.ListServiceOperationsOutput{
		ServiceOperations: []appSignalsTypes.ServiceOperation{
			{
				Name: aws.String("InternalOperation"),
				MetricReferences: []appSignalsTypes.MetricReference{
					{
						MetricName: aws.String("Latency"),
						MetricType: aws.String("LATENCY"),
						Namespace:  aws.String("AppSignals"),
						AccountId:  aws.String("id"),
						Dimensions: []appSignalsTypes.Dimension{
							{Name: aws.String("foo"), Value: aws.String("bar")},
							{Name: aws.String("baz"), Value: aws.String("tab")},
						},
					},
					{
						MetricName: aws.String("Fault"),
						MetricType: aws.String("FAULT"),
						Namespace:  aws.String("AppSignals"),
						Dimensions: []appSignalsTypes.Dimension{},
					},
				},
			},
			{
				Name: aws.String("ExternalOperation"),
				MetricReferences: []appSignalsTypes.MetricReference{
					{
						MetricName: aws.String("Error"),
						MetricType: aws.String("ERROR"),
						Namespace:  aws.String("AppSignals"),
						Dimensions: []appSignalsTypes.Dimension{
							{Name: aws.String("foo"), Value: aws.String("bar")},
						},
					},
				},
			},
		},
	}, nil
}
func (client *AppSignalsClientMock) ListServiceDependencies(context.Context, *applicationsignals.ListServiceDependenciesInput, ...func(*applicationsignals.Options)) (*applicationsignals.ListServiceDependenciesOutput, error) {
	return &applicationsignals.ListServiceDependenciesOutput{

		ServiceDependencies: []appSignalsTypes.ServiceDependency{
			{
				OperationName:           aws.String("InternalOperation"),
				DependencyOperationName: aws.String("PUT /eureka"),
				DependencyKeyAttributes: map[string]string{
					"Name": "discovery-server:8761",
					"Type": "InternalService",
				},
				MetricReferences: []appSignalsTypes.MetricReference{
					{
						MetricName: aws.String("Latency"),
						MetricType: aws.String("LATENCY"),
						Namespace:  aws.String("AppSignals"),
						AccountId:  aws.String("id"),
						Dimensions: []appSignalsTypes.Dimension{
							{Name: aws.String("foo"), Value: aws.String("bar")},
							{Name: aws.String("baz"), Value: aws.String("tab")},
						},
					},
					{
						MetricName: aws.String("Fault"),
						MetricType: aws.String("FAULT"),
						Namespace:  aws.String("AppSignals"),
						Dimensions: []appSignalsTypes.Dimension{},
					},
				},
			},
			{
				OperationName:           aws.String("ExternalOperation"),
				DependencyOperationName: aws.String("GET /eureka"),
				DependencyKeyAttributes: map[string]string{
					"Name": "external-server:8761",
					"Type": "RemoteService",
				},
				MetricReferences: []appSignalsTypes.MetricReference{
					{
						MetricName: aws.String("Error"),
						MetricType: aws.String("ERROR"),
						Namespace:  aws.String("AppSignals"),
						Dimensions: []appSignalsTypes.Dimension{
							{Name: aws.String("foo"), Value: aws.String("bar")},
						},
					},
				},
			},
		},
	}, nil
}

func (client *AppSignalsClientMock) ListServiceLevelObjectives(context.Context, *applicationsignals.ListServiceLevelObjectivesInput, ...func(*applicationsignals.Options)) (*applicationsignals.ListServiceLevelObjectivesOutput, error) {
	return &applicationsignals.ListServiceLevelObjectivesOutput{
		SloSummaries: []appSignalsTypes.ServiceLevelObjectiveSummary{
			{
				Name:          aws.String("testSLO"),
				OperationName: aws.String("GET /**"),
				CreatedTime:   aws.Time(time.Date(2023, time.January, 1, 12, 0, 0, 0, time.UTC)),
				KeyAttributes: map[string]string{
					"Environment":  "eks:app-signals-demo/default",
					"Name":         "vets-service-java",
					"AwsAccountId": "000000000000",
				},
			},
			{
				Name:          aws.String("Latency for Frontend InternalOperationInternalOperation"),
				OperationName: aws.String("InternalOperation"),
				CreatedTime:   aws.Time(time.Date(2025, time.February, 1, 12, 0, 0, 0, time.UTC)),
				KeyAttributes: map[string]string{
					"Type":         "Service",
					"Name":         "pet-clinic-frontend-java",
					"AwsAccountId": "999999999999",
				},
			},
		},
	}, nil
}

func appSignalsClientFactory(_ context.Context, _ backend.PluginContext, requestSettings datasource.RequestSettings) (datasource.AppSignalsClient, error) {
	return &AppSignalsClientMock{
		queryCalledWithRegion: requestSettings.Region,
	}, nil
}

func queryDatasource(ds *datasource.Datasource, queryType string, query interface{}) (*backend.QueryDataResponse, error) {
	jsonData, _ := json.Marshal(query)

	return ds.QueryData(
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
	settings := awsds.AWSDatasourceSettings{}
	ds := datasource.NewDatasource(context.Background(), xrayClientFactory, appSignalsClientFactory, settings)

	t.Run("getInsightSummaries query", func(t *testing.T) {
		// Insight with nil EndTime should not throw error
		response, err := queryDatasource(ds, datasource.QueryGetInsights, datasource.GetInsightsQueryData{State: "All", Group: &xraytypes.Group{GroupName: aws.String("Grafana")}})
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

	t.Run("getInsightSummaries query with different region", func(t *testing.T) {
		response, err := queryDatasource(ds, datasource.QueryGetInsights, datasource.GetInsightsQueryData{State: "All", Group: &xraytypes.Group{GroupName: aws.String("Grafana")}, Region: "us-east-1"})
		require.NoError(t, err)
		require.NoError(t, response.Responses["A"].Error)
		frame := response.Responses["A"].Frames[0]

		require.Equal(t, "id-us-east-1", *frame.Fields[0].At(0).(*string))
	})

	t.Run("getTrace query", func(t *testing.T) {
		response, err := queryDatasource(ds, datasource.QueryGetTrace, datasource.GetTraceQueryData{Query: "trace1"})
		require.NoError(t, err)
		require.NoError(t, response.Responses["A"].Error)

		require.Equal(t, 2, len(response.Responses["A"].Frames))
		require.Equal(t, "TraceGraph", response.Responses["A"].Frames[1].Name)
		require.Equal(t, 1, response.Responses["A"].Frames[1].Fields[0].Len())
		require.Equal(t, 1, response.Responses["A"].Frames[0].Fields[0].Len())
		require.JSONEq(
			t,
			"{\"Duration\":1,\"Id\":\"trace1\",\"LimitExceeded\":null,\"Segments\":[{\"Document\":\"{}\",\"Id\":\"segment1\"}]}",
			response.Responses["A"].Frames[0].Fields[0].At(0).(string),
		)
	})

	t.Run("getTrace query with different region", func(t *testing.T) {
		response, err := queryDatasource(ds, datasource.QueryGetTrace, datasource.GetTraceQueryData{Query: "trace1", Region: "us-east-1"})
		require.NoError(t, err)
		require.NoError(t, response.Responses["A"].Error)
		require.JSONEq(
			t,
			"{\"Duration\":1,\"Id\":\"trace1-us-east-1\",\"LimitExceeded\":null,\"Segments\":[{\"Document\":\"{}\",\"Id\":\"segment1\"}]}",
			response.Responses["A"].Frames[0].Fields[0].At(0).(string),
		)
	})

	t.Run("getTrace query with W3C format trace ID", func(t *testing.T) {
		// Use a valid W3C format trace ID (32 hex characters)
		w3cTraceID := "1234567890abcdef1234567890abcdef"

		response, err := queryDatasource(ds, datasource.QueryGetTrace, datasource.GetTraceQueryData{Query: w3cTraceID})
		require.NoError(t, err)
		require.NoError(t, response.Responses["A"].Error)

		// Verify we get correct frames
		require.Equal(t, 2, len(response.Responses["A"].Frames))
		require.Equal(t, "TraceGraph", response.Responses["A"].Frames[1].Name)
		require.Equal(t, 1, response.Responses["A"].Frames[1].Fields[0].Len())
		require.Equal(t, 1, response.Responses["A"].Frames[0].Fields[0].Len())

		// Verify that the trace ID was correctly converted from W3C format to X-Ray format
		require.JSONEq(
			t,
			"{\"Duration\":1,\"Id\":\"1-12345678-90abcdef1234567890abcdef\",\"LimitExceeded\":null,\"Segments\":[{\"Document\":\"{}\",\"Id\":\"segment1\"}]}",
			response.Responses["A"].Frames[0].Fields[0].At(0).(string),
		)
	})

	t.Run("getTrace query trace not found", func(t *testing.T) {
		response, err := queryDatasource(ds, datasource.QueryGetTrace, datasource.GetTraceQueryData{Query: "notFound"})
		require.NoError(t, err)
		require.Error(t, response.Responses["A"].Error, "trace not found")
	})

	t.Run("getTimeSeriesServiceStatistics query with no columns selected", func(t *testing.T) {
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

	t.Run("getTimeSeriesServiceStatistics query with region", func(t *testing.T) {
		response, err := queryDatasource(
			ds,
			datasource.QueryGetTimeSeriesServiceStatistics,
			datasource.GetTimeSeriesServiceStatisticsQueryData{Query: "traceID", Columns: []string{}, Region: "us-east-1"},
		)
		require.NoError(t, err)
		require.NoError(t, response.Responses["A"].Error)

		// expect different time as a stand-in for different results based on region, notice 13
		require.Equal(
			t,
			time.Date(2020, 6, 20, 1, 13, 1, 0, time.UTC).String(),
			response.Responses["A"].Frames[0].Fields[0].At(0).(*time.Time).String(),
		)
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

	t.Run("getTimeSeriesServiceStatistics query with all columns selected", func(t *testing.T) {
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

	t.Run("getTraceSummaries query", func(t *testing.T) {
		response, err := queryDatasource(ds, datasource.QueryGetTraceSummaries, datasource.GetTraceSummariesQueryData{Query: ""})
		require.NoError(t, err)
		require.NoError(t, response.Responses["A"].Error)

		frame := response.Responses["A"].Frames[0]
		require.Equal(t, 2, frame.Fields[0].Len())
		require.Equal(t, "id1", *frame.Fields[0].At(0).(*string))
		require.Equal(t, time.Date(2023, time.January, 1, 12, 0, 0, 0, time.UTC), *frame.Fields[1].At(0).(*time.Time))
		require.Equal(t, "GET", *frame.Fields[2].At(0).(*string))
		require.Equal(t, 10.5, *frame.Fields[4].At(0).(*float64))
		require.Equal(t, int64(3), *frame.Fields[7].At(0).(*int64))
	})
	t.Run("getTraceSummaries query with region", func(t *testing.T) {
		response, err := queryDatasource(ds, datasource.QueryGetTraceSummaries, datasource.GetTraceSummariesQueryData{Query: "", Region: "us-east-1"})
		require.NoError(t, err)
		require.NoError(t, response.Responses["A"].Error)

		frame := response.Responses["A"].Frames[0]
		require.Equal(t, "id-us-east-1", *frame.Fields[0].At(0).(*string))
	})

	t.Run("getServiceMap query", func(t *testing.T) {
		response, err := queryDatasource(ds, datasource.QueryGetServiceMap, datasource.GetServiceMapQueryData{Group: &xraytypes.Group{}})
		require.NoError(t, err)
		require.NoError(t, response.Responses["A"].Error)

		// Bit simplistic test but right now we just send each service as a json to frontend and do transform there.
		frame := response.Responses["A"].Frames[0]
		require.Equal(t, 2, frame.Fields[0].Len()) // 2 because of the 2 services added to the mock
	})

	t.Run("getServiceMap query with region", func(t *testing.T) {
		response, err := queryDatasource(ds, datasource.QueryGetServiceMap, datasource.GetServiceMapQueryData{Group: &xraytypes.Group{}, Region: "us-east-1"})
		require.NoError(t, err)
		require.NoError(t, response.Responses["A"].Error)

		// Bit simplistic test but right now we just send each service as a json to frontend and do transform there.
		frame := response.Responses["A"].Frames[0]
		require.Equal(t, 2, frame.Fields[0].Len())
		require.True(t, strings.Contains(frame.Fields[0].At(0).(string), "mockServiceName-us-east-1"))
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

	t.Run("listServices query", func(t *testing.T) {
		response, err := queryDatasource(ds, "", map[string]string{
			"queryMode": datasource.ModeServices, "serviceQueryType": datasource.QueryListServices, "region": "us-east-1",
		})
		require.NoError(t, err)
		require.NoError(t, response.Responses["A"].Error)

		frame := response.Responses["A"].Frames[0]
		expectedFrame := data.Frame{
			Name: "ListServices",
			Fields: []*data.Field{
				data.NewField("Type", nil, []string{"Service", "Resource"}),
				data.NewField("ResourceType", nil, []string{"", "SomeResource"}),
				data.NewField("Name", nil, []string{"billing-service-python", "allFields"}),
				data.NewField("Identifier", nil, []string{"", "id"}),
				data.NewField("Environment", nil, []string{"eks:app-signals-demo/default", "environment"}),
				data.NewField("PlatformType", nil, []string{"AWS::EKS", "K8s"}),
				data.NewField("EKS.Cluster", nil, []string{"app-signals-demo", ""}),
				data.NewField("K8s.Cluster", nil, []string{"", "fake-resource"}),
				data.NewField("Namespace", nil, []string{"default", "default"}),
				data.NewField("Workload", nil, []string{"billing-service-python", "allFields"}),
				data.NewField("Node", nil, []string{"", "node"}),
				data.NewField("Pod", nil, []string{"", "pod"}),
				data.NewField("EC2.AutoScalingGroup", nil, []string{"scaling", ""}),
				data.NewField("EC2.InstanceId", nil, []string{"id", ""}),
				data.NewField("Host", nil, []string{"hostname", ""}),
				data.NewField("Application", nil, []string{"", "applicationName"}),
				data.NewField("Application.ARN", nil, []string{"", "applicationArn"}),
				data.NewField("Telemetry.SDK", nil, []string{"", "sdk"}),
				data.NewField("Telemetry.Agent", nil, []string{"", "agent"}),
				data.NewField("Telemetry.Source", nil, []string{"", "source"}),
				data.NewField("KeyAttributes", nil, []string{
					`{"Environment":"eks:app-signals-demo/default","Name":"billing-service-python","Type":"Service"}`,
					`{"Environment":"environment","Identifier":"id","Name":"allFields","ResourceType":"SomeResource","Type":"Resource"}`,
				}),
			},
		}
		require.Equal(t, expectedFrame, *frame)
	})

	t.Run("listServiceOperations query", func(t *testing.T) {
		service := map[string]string{
			"AwsAccountId": "569069006612",
			"Environment":  "eks:datasources-cluster-eksCluster-91305f0/amazon-cloudwatch",
			"Name":         "datasources-graphite-latest-07978676",
			"Type":         "Service",
		}
		serviceStr, err := json.Marshal(service)
		require.NoError(t, err)
		response, err := queryDatasource(ds, "", map[string]interface{}{
			"queryMode": datasource.ModeServices, "serviceQueryType": datasource.QueryListServiceOperations, "region": "us-east-1",
			"ServiceString": string(serviceStr),
		})
		require.NoError(t, err)
		require.NoError(t, response.Responses["A"].Error)

		frame := response.Responses["A"].Frames[0]
		expectedFrame := data.Frame{
			Name: "ListServices",
			Fields: []*data.Field{
				data.NewField("Name", nil, []*string{aws.String("InternalOperation"), aws.String("InternalOperation"), aws.String("ExternalOperation")}),
				data.NewField("MetricName", nil, []*string{aws.String("Latency"), aws.String("Fault"), aws.String("Error")}),
				data.NewField("MetricType", nil, []*string{aws.String("LATENCY"), aws.String("FAULT"), aws.String("ERROR")}),
				data.NewField("Namespace", nil, []*string{aws.String("AppSignals"), aws.String("AppSignals"), aws.String("AppSignals")}),
				data.NewField("AccountId", nil, []*string{aws.String("id"), nil, nil}),
				data.NewField("Dimensions", nil, []*string{aws.String(`foo="bar" baz="tab"`), nil, aws.String(`foo="bar"`)}),
			},
		}
		require.Equal(t, expectedFrame, *frame)
	})

	t.Run("listServiceDependencies query", func(t *testing.T) {
		service := map[string]string{
			"AwsAccountId": "569069006612",
			"Environment":  "eks:datasources-cluster-eksCluster-91305f0/amazon-cloudwatch",
			"Name":         "datasources-graphite-latest-07978676",
			"Type":         "Service",
		}
		serviceStr, err := json.Marshal(service)
		require.NoError(t, err)
		response, err := queryDatasource(ds, "", map[string]interface{}{
			"queryMode": datasource.ModeServices, "serviceQueryType": datasource.QueryListServiceDependencies, "region": "us-east-1",
			"ServiceString": string(serviceStr),
		})
		require.NoError(t, err)
		require.NoError(t, response.Responses["A"].Error)

		frame := response.Responses["A"].Frames[0]
		expectedFrame := data.Frame{
			Name: "ListServiceDependencies",
			Fields: []*data.Field{
				data.NewField("OperationName", nil, []*string{aws.String("InternalOperation"), aws.String("InternalOperation"), aws.String("ExternalOperation")}),
				data.NewField("DependencyKeyAttributes", nil, []*string{aws.String("Name:discovery-server:8761, Type:InternalService"), aws.String("Name:discovery-server:8761, Type:InternalService"), aws.String("Name:external-server:8761, Type:RemoteService")}),
				data.NewField("DependencyOperationName", nil, []*string{aws.String("PUT /eureka"), aws.String("PUT /eureka"), aws.String("GET /eureka")}),
				data.NewField("MetricName", nil, []*string{aws.String("Latency"), aws.String("Fault"), aws.String("Error")}),
				data.NewField("MetricType", nil, []*string{aws.String("LATENCY"), aws.String("FAULT"), aws.String("ERROR")}),
				data.NewField("Namespace", nil, []*string{aws.String("AppSignals"), aws.String("AppSignals"), aws.String("AppSignals")}),
				data.NewField("AccountId", nil, []*string{aws.String("id"), nil, nil}),
				data.NewField("Dimensions", nil, []*string{aws.String(`foo="bar" baz="tab"`), nil, aws.String(`foo="bar"`)}),
			},
		}
		require.Equal(t, expectedFrame, *frame)
	})

	t.Run("listServiceLevelObjectives query", func(t *testing.T) {
		service := map[string]string{
			"AwsAccountId": "569069006612",
			"Environment":  "eks:datasources-cluster-eksCluster-91305f0/amazon-cloudwatch",
			"Name":         "datasources-graphite-latest-07978676",
			"Type":         "Service",
		}
		serviceStr, err := json.Marshal(service)
		require.NoError(t, err)

		response, err := queryDatasource(ds, "", map[string]interface{}{
			"queryMode": datasource.ModeServices, "serviceQueryType": datasource.QueryListServiceLevelObjectives, "region": "us-east-1",
			"ServiceString": string(serviceStr),
		})
		require.NoError(t, err)
		require.NoError(t, response.Responses["A"].Error)

		frame := response.Responses["A"].Frames[0]
		expectedFrame := data.Frame{
			Name: "ListServiceLevelObjectives",
			Fields: []*data.Field{
				data.NewField("Name", nil, []*string{aws.String("testSLO"), aws.String("Latency for Frontend InternalOperationInternalOperation")}),
				data.NewField("OperationName", nil, []*string{aws.String("GET /**"), aws.String("InternalOperation")}),
				data.NewField("CreatedTime", nil, []*time.Time{
					aws.Time(time.Date(2023, time.January, 1, 12, 0, 0, 0, time.UTC)),
					aws.Time(time.Date(2025, time.February, 1, 12, 0, 0, 0, time.UTC))}),
				data.NewField("KeyAttributes", nil, []*string{
					aws.String("AwsAccountId:000000000000, Environment:eks:app-signals-demo/default, Name:vets-service-java"),
					aws.String("AwsAccountId:999999999999, Name:pet-clinic-frontend-java, Type:Service")}),
			},
		}
		require.Equal(t, expectedFrame, *frame)
	})

	t.Run("getGroups query", func(t *testing.T) {
		resp, err := queryDatasourceResource(ds, &backend.CallResourceRequest{
			Path:   "/groups",
			Method: "GET",
		})
		require.NoError(t, err)

		var data []*xraytypes.GroupSummary
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
