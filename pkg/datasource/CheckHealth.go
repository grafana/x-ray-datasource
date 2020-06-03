package datasource

import (
  "context"
  "github.com/aws/aws-sdk-go/service/xray"
  "github.com/grafana/grafana-plugin-sdk-go/backend"
  "github.com/grafana/x-ray-datasource/pkg/client"
  "github.com/grafana/x-ray-datasource/pkg/configuration"
)

func (ds *Datasource) CheckHealth(ctx context.Context, req *backend.CheckHealthRequest) (*backend.CheckHealthResult, error) {
  var status = backend.HealthStatusOk
  var message = "Data source is working"

  dsInfo, err := configuration.GetDatasourceInfo(req.PluginContext.DataSourceInstanceSettings, "default")
  if err != nil {
    // TODO: not sure if this is correct or CheckHealthResult should also be sent back
    return nil, err
  }

  xrayClient, err := client.CreateXrayClient(dsInfo)
  if err != nil {
    return &backend.CheckHealthResult{
      Status:  backend.HealthStatusError,
      Message: err.Error(),
    }, err
  }

  _, err = xrayClient.GetGroups(&xray.GetGroupsInput{})
  if err != nil {
    return &backend.CheckHealthResult{
      Status:  backend.HealthStatusError,
      Message: err.Error(),
    }, err
  }

  return &backend.CheckHealthResult{
    Status:  status,
    Message: message,
  }, nil
}
