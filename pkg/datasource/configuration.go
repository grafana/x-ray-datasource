package datasource

import (
	"github.com/grafana/grafana-aws-sdk/pkg/awsds"
	"github.com/grafana/grafana-plugin-sdk-go/backend"
	"github.com/grafana/grafana-plugin-sdk-go/experimental/errorsource"
)

func getDsSettings(settings backend.DataSourceInstanceSettings) (awsds.AWSDatasourceSettings, error) {
	dsInfo := awsds.AWSDatasourceSettings{}
	err := dsInfo.Load(settings)
	if err != nil {
		return awsds.AWSDatasourceSettings{}, errorsource.PluginError(err, false)
	}

	// This is here for backward compatibility as we reused the Database field before for profile
	if len(dsInfo.Profile) == 0 && len(settings.Database) > 0 {
		dsInfo.Profile = settings.Database
	}

	return dsInfo, nil
}
