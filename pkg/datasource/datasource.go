package datasource

import (
	"net/http"

	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/request"

	"github.com/grafana/x-ray-datasource/pkg/client"
	"github.com/grafana/x-ray-datasource/pkg/configuration"
	xray "github.com/grafana/x-ray-datasource/pkg/xray"

	"github.com/grafana/grafana-plugin-sdk-go/backend"
	"github.com/grafana/grafana-plugin-sdk-go/backend/datasource"
	"github.com/grafana/grafana-plugin-sdk-go/backend/instancemgmt"
)

// GetServeOpts returns datasource.ServeOpts.
func GetServeOpts() datasource.ServeOpts {
	// creates a instance manager for your plugin. The function passed
	// into `NewInstanceManger` is called when the instance is created
	// for the first time or when a datasource configuration changed.
	ds := NewDatasource(getXrayClient)
	ds.im = datasource.NewInstanceManager(newDataSourceInstanceSettings)

	return datasource.ServeOpts{
		QueryDataHandler:   ds.QueryMux,
		CheckHealthHandler: ds,
	}
}

type instanceSettings struct {
	httpClient *http.Client
}

func newDataSourceInstanceSettings(setting backend.DataSourceInstanceSettings) (instancemgmt.Instance, error) {
	return &instanceSettings{
		httpClient: &http.Client{},
	}, nil
}

func (s *instanceSettings) Dispose() {
	// Called before creating a new instance to allow plugin authors
	// to cleanup.
}

type Datasource struct {
	// The instance manager can help with lifecycle management
	// of datasource instances in plugins. It's not a requirements
	// but a best practice that we recommend that you follow.
	im                instancemgmt.InstanceManager
	QueryMux          *datasource.QueryTypeMux
	xrayClientFactory func(pluginContext *backend.PluginContext) (XrayClient, error)
}

const (
	QueryGetTrace                       = "getTrace"
	QueryGetTraceSummaries              = "getTraceSummaries"
	QueryGetTimeSeriesServiceStatistics = "getTimeSeriesServiceStatistics"
)

func NewDatasource(xrayClientFactory func(pluginContext *backend.PluginContext) (XrayClient, error)) *Datasource {
	ds := &Datasource{
		xrayClientFactory: xrayClientFactory,
	}

	mux := datasource.NewQueryTypeMux()
	mux.HandleFunc(QueryGetTrace, ds.getTrace)
	mux.HandleFunc(QueryGetTraceSummaries, ds.getTraceSummaries)
	mux.HandleFunc(QueryGetTimeSeriesServiceStatistics, ds.getTimeSeriesServiceStatistics)

	ds.QueryMux = mux
	return ds
}

func getXrayClient(pluginContext *backend.PluginContext) (XrayClient, error) {
	dsInfo, err := configuration.GetDatasourceInfo(pluginContext.DataSourceInstanceSettings, "default")
	if err != nil {
		return nil, err
	}
	xrayClient, err := client.CreateXrayClient(dsInfo)
	if err != nil {
		return nil, err
	}
	return xrayClient, nil
}

type XrayClient interface {
	BatchGetTraces(input *xray.BatchGetTracesInput) (*xray.BatchGetTracesOutput, error)
	GetTraceSummariesPages(input *xray.GetTraceSummariesInput, fn func(*xray.GetTraceSummariesOutput, bool) bool) error
	GetTimeSeriesServiceStatisticsPagesWithContext(
		aws.Context,
		*xray.GetTimeSeriesServiceStatisticsInput,
		func(*xray.GetTimeSeriesServiceStatisticsOutput, bool) bool,
		...request.Option,
	) error
}
