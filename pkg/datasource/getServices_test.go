package datasource_test

import (
	"context"
	"encoding/json"
	"io"
	"net/http/httptest"
	"testing"

	"github.com/grafana/grafana-aws-sdk/pkg/awsds"
	"github.com/grafana/x-ray-datasource/pkg/datasource"
	"github.com/stretchr/testify/require"
)

type ServiceType struct {
	Environment  string `json:"Environment"`
	Name         string `json:"Name"`
	Type         string `json:"Type"`
	ResourceType string `json:"ResourceType"`
	Identifier   string `json:"Identifier"`
}

func TestServices(t *testing.T) {
	t.Run("when passed a get request it returns a list of all accountIds in the traces in the selected time frame", func(t *testing.T) {
		ds := datasource.NewDatasource(context.Background(), xrayClientFactory, appSignalsClientFactory, awsds.AWSDatasourceSettings{})
		req := httptest.NewRequest("GET", "http://example.com/services?startTime=2022-09-23T00:15:14.365Z&endTime=2022-09-23T01:15:14.365Z&accountId=foo", nil)
		w := httptest.NewRecorder()
		ds.GetServices(w, req)

		resp := w.Result()
		body, _ := io.ReadAll(resp.Body)
		accounts := []ServiceType{}
		require.NoError(t, json.Unmarshal(body, &accounts))
		require.Contains(t, accounts[0].Type, "Service")
		require.Contains(t, accounts[0].Name, "billing-service-python")
		require.Contains(t, accounts[0].Environment, "eks:app-signals-demo/default")

		require.Contains(t, accounts[1].Type, "Resource")
		require.Contains(t, accounts[1].ResourceType, "SomeResource")
		require.Contains(t, accounts[1].Name, "allFields")
		require.Contains(t, accounts[1].Identifier, "id")
		require.Contains(t, accounts[1].Environment, "environment")
	})
}
