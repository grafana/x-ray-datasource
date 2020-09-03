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
  "github.com/grafana/grafana-plugin-sdk-go/backend/resource/httpadapter"
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
		CallResourceHandler: ds.ResourceMux,
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
  ResourceMux       backend.CallResourceHandler
	xrayClientFactory func(pluginContext *backend.PluginContext) (XrayClient, error)
}

const (
	QueryGetTrace                                 = "getTrace"
	QueryGetTraceSummaries                        = "getTraceSummaries"
	QueryGetTimeSeriesServiceStatistics           = "getTimeSeriesServiceStatistics"
	QueryGetAnalyticsRootCauseResponseTimeService = "getAnalyticsRootCauseResponseTimeService"
	QueryGetAnalyticsRootCauseResponseTimePath    = "getAnalyticsRootCauseResponseTimePath"
	QueryGetAnalyticsRootCauseErrorService        = "getAnalyticsRootCauseErrorService"
	QueryGetAnalyticsRootCauseErrorPath           = "getAnalyticsRootCauseErrorPath"
	QueryGetAnalyticsRootCauseErrorMessage        = "getAnalyticsRootCauseErrorMessage"
	QueryGetAnalyticsRootCauseFaultService        = "getAnalyticsRootCauseFaultService"
	QueryGetAnalyticsRootCauseFaultPath           = "getAnalyticsRootCauseFaultPath"
	QueryGetAnalyticsRootCauseFaultMessage        = "getAnalyticsRootCauseFaultMessage"
	QueryGetAnalyticsUrl                          = "getAnalyticsUrl"
	QueryGetAnalyticsUser                         = "getAnalyticsUser"
	QueryGetAnalyticsStatusCode                   = "getAnalyticsStatusCode"
	QueryGetInsights                              = "getInsights"
)

func NewDatasource(xrayClientFactory func(pluginContext *backend.PluginContext) (XrayClient, error)) *Datasource {
	ds := &Datasource{
		xrayClientFactory: xrayClientFactory,
	}

	mux := datasource.NewQueryTypeMux()
	mux.HandleFunc(QueryGetTrace, ds.getTrace)
	mux.HandleFunc(QueryGetTraceSummaries, ds.getTraceSummaries)
	mux.HandleFunc(QueryGetTimeSeriesServiceStatistics, ds.getTimeSeriesServiceStatistics)
	mux.HandleFunc(QueryGetAnalyticsRootCauseResponseTimeService, ds.getAnalytics)
	mux.HandleFunc(QueryGetAnalyticsRootCauseResponseTimePath, ds.getAnalytics)
	mux.HandleFunc(QueryGetAnalyticsRootCauseErrorService, ds.getAnalytics)
	mux.HandleFunc(QueryGetAnalyticsRootCauseErrorPath, ds.getAnalytics)
	mux.HandleFunc(QueryGetAnalyticsRootCauseErrorMessage, ds.getAnalytics)
	mux.HandleFunc(QueryGetAnalyticsRootCauseFaultService, ds.getAnalytics)
	mux.HandleFunc(QueryGetAnalyticsRootCauseFaultPath, ds.getAnalytics)
	mux.HandleFunc(QueryGetAnalyticsRootCauseFaultMessage, ds.getAnalytics)
	mux.HandleFunc(QueryGetAnalyticsUser, ds.getAnalytics)
	mux.HandleFunc(QueryGetAnalyticsUrl, ds.getAnalytics)
	mux.HandleFunc(QueryGetAnalyticsStatusCode, ds.getAnalytics)
	mux.HandleFunc(QueryGetInsights, ds.getInsights)

	ds.QueryMux = mux

  resMux := http.NewServeMux()
  resMux.HandleFunc("/groups", ds.getGroups)
  ds.ResourceMux = httpadapter.New(resMux)
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
	GetInsightSummaries(input *xray.GetInsightSummariesInput) (*xray.GetInsightSummariesOutput, error)
	GetGroupsPages(input *xray.GetGroupsInput, fn func(*xray.GetGroupsOutput, bool) bool ) error
}
