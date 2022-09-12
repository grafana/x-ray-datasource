package datasource_test

import (
	"io"
	"testing"

	"net/http/httptest"

	"github.com/grafana/x-ray-datasource/pkg/datasource"
	"github.com/stretchr/testify/require"
)

func TestGetRegions(t *testing.T) {
	t.Run("when passed a get request it returns a list of regions from aws from all supported clouds", func(t *testing.T) {
		ds := datasource.NewDatasource(xrayClientFactory)
		req := httptest.NewRequest("GET", "http://example.com/regions", nil)
		w := httptest.NewRecorder()
		ds.GetRegions(w, req)
		resp := w.Result()
		body, _ := io.ReadAll(resp.Body)
		regionsList := string(body)
		require.Contains(t, regionsList, "us-east-1")
		require.Contains(t, regionsList, "us-gov-east-1")
		require.Contains(t, regionsList, "cn-north-1")
	});
}