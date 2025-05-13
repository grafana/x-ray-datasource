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

type Account struct {
	Id string
}

func TestAccounts(t *testing.T) {
	t.Run("when passed a get request it returns a list of all accountIds in the traces in the selected time frame", func(t *testing.T) {
		ds := datasource.NewDatasource(context.Background(), xrayClientFactory, appSignalsClientFactory, awsds.AWSDatasourceSettings{})
		req := httptest.NewRequest("GET", "http://example.com/accounts?startTime=2022-09-23T00:15:14.365Z&endTime=2022-09-23T01:15:14.365Z&group=somegroup", nil)
		w := httptest.NewRecorder()
		ds.GetAccounts(w, req)
		resp := w.Result()
		body, _ := io.ReadAll(resp.Body)
		accounts := []Account{}
		require.NoError(t, json.Unmarshal(body, &accounts))
		require.Contains(t, accounts[0].Id, "testAccount1")
		require.Contains(t, accounts[1].Id, "testAccount2")
	})
}
