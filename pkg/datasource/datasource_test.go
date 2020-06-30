package datasource_test

import (
	"context"
  "encoding/json"
  "github.com/aws/aws-sdk-go/service/xray"
	"github.com/grafana/grafana-plugin-sdk-go/backend"
	"github.com/grafana/x-ray-datasource/pkg/datasource"
  "github.com/stretchr/testify/require"
  "testing"
)

type XrayClientMock struct{}

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
}
