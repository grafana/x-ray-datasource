package datasource

import (
	"context"

	"github.com/aws/aws-sdk-go-v2/service/xray"
	"github.com/grafana/grafana-plugin-sdk-go/backend"
	"github.com/grafana/x-ray-datasource/pkg/client"
)

func (ds *Datasource) CheckHealth(ctx context.Context, req *backend.CheckHealthRequest) (*backend.CheckHealthResult, error) {
	xrayClient, err := client.CreateXrayClient(ctx, ds.Settings, *req.PluginContext.DataSourceInstanceSettings)
	if err != nil {
		return &backend.CheckHealthResult{
			Status:  backend.HealthStatusError,
			Message: err.Error(),
		}, err
	}

	_, err = xrayClient.GetGroups(ctx, &xray.GetGroupsInput{})
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
