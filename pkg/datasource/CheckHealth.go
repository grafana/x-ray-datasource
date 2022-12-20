package datasource

import (
	"context"

	"github.com/aws/aws-sdk-go/service/xray"
	"github.com/grafana/grafana-plugin-sdk-go/backend"
	"github.com/grafana/x-ray-datasource/pkg/client"
)

func (ds *Datasource) CheckHealth(ctx context.Context, req *backend.CheckHealthRequest) (*backend.CheckHealthResult, error) {
	dsInfo, err := getDsSettings(req.PluginContext.DataSourceInstanceSettings)
	if err != nil {
		// TODO: not sure if this is correct or CheckHealthResult should also be sent back
		return nil, err
	}

	xrayClient, err := client.CreateXrayClient(dsInfo, req.PluginContext.DataSourceInstanceSettings)
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
		Status:  backend.HealthStatusOk,
		Message: "Data source is working",
	}, nil
}
