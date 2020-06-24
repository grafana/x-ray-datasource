package datasource_test

import (
	"context"
  "encoding/json"
  "github.com/aws/aws-sdk-go/aws"
  "github.com/aws/aws-sdk-go/service/xray"
	"github.com/grafana/grafana-plugin-sdk-go/backend"
	"github.com/grafana/x-ray-datasource/pkg/datasource"
  "github.com/stretchr/testify/require"
  "testing"
  "time"
)

type XrayClientMock struct{}

func (client *XrayClientMock) GetTraceSummariesPages(input *xray.GetTraceSummariesInput, fn func(*xray.GetTraceSummariesOutput, bool) bool) error {
  now := time.Now()
  id := "traceId1"
  http := &xray.Http{
    ClientIp:   aws.String("Something"),
    HttpMethod: nil,
    HttpStatus: aws.Int64(200),
    HttpURL:    nil,
    UserAgent:  nil,
  }


  summary := &xray.TraceSummary{
    Annotations:            nil,
    AvailabilityZones:      nil,
    Duration:               nil,
    EntryPoint:             nil,
    ErrorRootCauses:        nil,
    FaultRootCauses:        nil,
    HasError:               nil,
    HasFault:               nil,
    HasThrottle:            nil,
    Http:                   http,
    Id:                     &id,
    InstanceIds:            nil,
    IsPartial:              nil,
    MatchedEventTime:       nil,
    ResourceARNs:           nil,
    ResponseTime:           nil,
    ResponseTimeRootCauses: nil,
    Revision:               nil,
    ServiceIds:             nil,
    Users:                  nil,
  }

  output := &xray.GetTraceSummariesOutput{
    ApproximateTime:      &now,
    NextToken:            nil,
    TraceSummaries:       []*xray.TraceSummary{summary},
    TracesProcessedCount: nil,
  }
  fn(output, true)

  return nil
}

func (client *XrayClientMock) BatchGetTraces(input *xray.BatchGetTracesInput) (*xray.BatchGetTracesOutput, error) {
  duration := 1.0
  traceId := "trace1"
  segmentId := "segment1"
  document := "{}"
	return &xray.BatchGetTracesOutput{
	  Traces: []*xray.Trace{{
	    Duration: &duration,
	    Id: &traceId,
	    Segments: []*xray.Segment{
	      {
	        Id: &segmentId,
	        Document: &document,
        },
      },
    }},
  }, nil
}

func clientFactory(pluginContext *backend.PluginContext) (datasource.XrayClient, error) {
	return &XrayClientMock{}, nil
}

func TestDatasource(t *testing.T) {
	ds := datasource.NewDatasource(clientFactory)

	t.Run("getTrace query", func(t *testing.T) {
	  queryData := datasource.GetTraceQueryData{
	    Query: "traceID",
    }
    jsonData, _ := json.Marshal(queryData)

		response, err := ds.QueryMux.QueryData(
		  context.Background(),
		  &backend.QueryDataRequest{Queries: []backend.DataQuery{{ RefID: "A", QueryType: datasource.QueryGetTrace, JSON: jsonData }}},
    )
		require.NoError(t, err)
    require.NoError(t, response.Responses["A"].Error)

    require.Equal(t, 1, response.Responses["A"].Frames[0].Fields[0].Len())
    require.JSONEq(
      t,
      "{\"Duration\":1,\"Id\":\"trace1\",\"Segments\":[{\"Document\":\"{}\",\"Id\":\"segment1\"}]}",
      response.Responses["A"].Frames[0].Fields[0].At(0).(string),
    )
	})

  t.Run("getTraceSummaries query", func(t *testing.T) {
    queryData := datasource.GetTraceSummariesQueryData{
      Query: "",
    }
    jsonData, _ := json.Marshal(queryData)

    response, err := ds.QueryMux.QueryData(
      context.Background(),
      &backend.QueryDataRequest{Queries: []backend.DataQuery{{ RefID: "A", QueryType: datasource.QueryGetTraceSummaries, JSON: jsonData }}},
    )
    require.NoError(t, err)
    require.NoError(t, response.Responses["A"].Error)

    require.Equal(t, 1, response.Responses["A"].Frames[0].Fields[0].Len())
    require.JSONEq(
      t,
      "{\"Duration\":1,\"Id\":\"trace1\",\"Segments\":[{\"Document\":\"{}\",\"Id\":\"segment1\"}]}",
      response.Responses["A"].Frames[0].Fields[0].At(0).(string),
    )
  })
}
