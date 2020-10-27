package configuration

import (
  "github.com/grafana/grafana-plugin-sdk-go/backend"
  "github.com/stretchr/testify/require"
  "testing"
)

func TestGetDatasourceInfo(t *testing.T) {
  t.Run("returns error if dataSourceSettings is nil", func(t *testing.T) {
    _, err := GetDatasourceInfo(nil, "")
    require.Error(t, err)
  })

  t.Run("returns error if JSONData is not valid", func(t *testing.T) {
    dsSettings := &backend.DataSourceInstanceSettings{
      JSONData:                nil,
    }
    _, err := GetDatasourceInfo(dsSettings, "")
    require.Error(t, err)
  })

  t.Run("returns default region if region param is empty", func(t *testing.T) {
    dsSettings := &backend.DataSourceInstanceSettings{
      JSONData:                []byte("{ \"defaultRegion\": \"test-region\"}"),
      DecryptedSecureJSONData: map[string]string{},
    }
    dsInfo, err := GetDatasourceInfo(dsSettings, "")
    require.NoError(t, err)
    require.Equal(t, "test-region", dsInfo.Region)
  })

  t.Run("returns default region if region param is default", func(t *testing.T) {
    dsSettings := &backend.DataSourceInstanceSettings{
      JSONData:                []byte("{ \"defaultRegion\": \"test-region\"}"),
      DecryptedSecureJSONData: map[string]string{},
    }
    dsInfo, err := GetDatasourceInfo(dsSettings, "default")
    require.NoError(t, err)
    require.Equal(t, "test-region", dsInfo.Region)
  })

  t.Run("returns passed region if region param is defined", func(t *testing.T) {
    dsSettings := &backend.DataSourceInstanceSettings{
      JSONData:                []byte("{ \"defaultRegion\": \"test-region\"}"),
      DecryptedSecureJSONData: map[string]string{},
    }
    dsInfo, err := GetDatasourceInfo(dsSettings, "custom-region")
    require.NoError(t, err)
    require.Equal(t, "custom-region", dsInfo.Region)
  })
}
