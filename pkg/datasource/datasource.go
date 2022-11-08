package datasource

import (
	"net/http"

	"github.com/aws/aws-sdk-go/service/ec2"
	"github.com/aws/aws-sdk-go/service/xray"

	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/request"

	"github.com/grafana/x-ray-datasource/pkg/client"

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
	ds := NewDatasource(getXrayClient, getEc2Client)
	ds.im = datasource.NewInstanceManager(newDataSourceInstanceSettings)

	return datasource.ServeOpts{
		QueryDataHandler:    ds.QueryMux,
		CallResourceHandler: ds.ResourceMux,
		CheckHealthHandler:  ds,
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

type XrayClientFactory = func(pluginContext *backend.PluginContext, requestSettings RequestSettings) (XrayClient, error)

// Should probably return an interface similar to XrayClientFactory
type Ec2ClientFactory = func(pluginContext *backend.PluginContext) (*ec2.EC2, error)

type Datasource struct {
	// The instance manager can help with lifecycle management
	// of datasource instances in plugins. It's not a requirements
	// but a best practice that we recommend that you follow.
	im                instancemgmt.InstanceManager
	QueryMux          *datasource.QueryTypeMux
	ResourceMux       backend.CallResourceHandler
	xrayClientFactory XrayClientFactory
	ec2ClientFactory  Ec2ClientFactory
}

// Needs to match XrayQueryType in frontend code
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
	QueryGetServiceMap                            = "getServiceMap"
)

func NewDatasource(
	xrayClientFactory XrayClientFactory,
	ec2ClientFactory Ec2ClientFactory,
) *Datasource {
	ds := &Datasource{
		xrayClientFactory: xrayClientFactory,
		ec2ClientFactory:  ec2ClientFactory,
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
	mux.HandleFunc(QueryGetServiceMap, ds.getServiceMap)

	ds.QueryMux = mux

	resMux := http.NewServeMux()
	resMux.HandleFunc("/groups", ds.getGroups)
	resMux.HandleFunc("/regions", ds.getRegions)
	ds.ResourceMux = httpadapter.New(resMux)
	return ds
}

type RequestSettings struct {
	Region string
}

func getXrayClient(pluginContext *backend.PluginContext, requestSettings RequestSettings) (XrayClient, error) {
	awsSettings, err := getDsSettings(pluginContext.DataSourceInstanceSettings)
	if err != nil {
		return nil, err
	}

	// add region from the request body if it's set, otherwise default region will be used
	if requestSettings.Region != "" && requestSettings.Region != "default" {
		awsSettings.Region = requestSettings.Region
	}

	xrayClient, err := client.CreateXrayClient(awsSettings, pluginContext.DataSourceInstanceSettings)
	if err != nil {
		return nil, err
	}
	return xrayClient, nil
}

func getEc2Client(pluginContext *backend.PluginContext) (*ec2.EC2, error) {
	dsInfo, err := getDsSettings(pluginContext.DataSourceInstanceSettings)
	if err != nil {
		return nil, err
	}

	ec2Client, err := client.CreateEc2Client(dsInfo, pluginContext.DataSourceInstanceSettings)
	if err != nil {
		return nil, err
	}
	return ec2Client, nil
}

type XrayClient interface {
	BatchGetTraces(input *xray.BatchGetTracesInput) (*xray.BatchGetTracesOutput, error)
	GetTraceSummariesWithContext(ctx aws.Context, input *xray.GetTraceSummariesInput, opts ...request.Option) (*xray.GetTraceSummariesOutput, error)
	GetTraceSummariesPages(input *xray.GetTraceSummariesInput, fn func(*xray.GetTraceSummariesOutput, bool) bool) error
	GetTimeSeriesServiceStatisticsPagesWithContext(
		aws.Context,
		*xray.GetTimeSeriesServiceStatisticsInput,
		func(*xray.GetTimeSeriesServiceStatisticsOutput, bool) bool,
		...request.Option,
	) error
	GetInsightSummaries(input *xray.GetInsightSummariesInput) (*xray.GetInsightSummariesOutput, error)
	GetGroupsPages(input *xray.GetGroupsInput, fn func(*xray.GetGroupsOutput, bool) bool) error
	GetServiceGraphPagesWithContext(ctx aws.Context, input *xray.GetServiceGraphInput, fn func(*xray.GetServiceGraphOutput, bool) bool, opts ...request.Option) error
	GetTraceGraphPages(input *xray.GetTraceGraphInput, fn func(*xray.GetTraceGraphOutput, bool) bool) error
}
