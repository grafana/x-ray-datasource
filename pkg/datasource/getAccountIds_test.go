package datasource_test

import (
	"io"
	"testing"

	"net/http/httptest"

	"github.com/grafana/x-ray-datasource/pkg/datasource"
	"github.com/stretchr/testify/require"
)

func TestAccountIds(t *testing.T) {
	t.Run("when passed a get request it returns a list of all accountIds in the traces in the selected time frame", func(t *testing.T) {
		ds := datasource.NewDatasource(xrayClientFactory, ec2clientFactory)
		req := httptest.NewRequest("GET", "http://example.com/accountIds?startTime=2022-09-23T00:15:14.365Z&endTime=2022-09-23T01:15:14.365Z&group=somegroup", nil)
		w := httptest.NewRecorder()
		ds.GetAccountIds(w, req)
		resp := w.Result()
		body, _ := io.ReadAll(resp.Body)
		accountIdList := string(body)
		require.Contains(t, accountIdList, "testAccount1")
		require.Contains(t, accountIdList, "testAccount2")
	});
}