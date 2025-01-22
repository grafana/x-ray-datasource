package datasource

import (
	"context"
	"fmt"
	"net/http"

	"github.com/aws/aws-sdk-go-v2/service/xray"

	"github.com/grafana/grafana-aws-sdk/pkg/awsds"
	"github.com/grafana/x-ray-datasource/pkg/client"

	"github.com/grafana/grafana-plugin-sdk-go/backend"
	"github.com/grafana/grafana-plugin-sdk-go/backend/instancemgmt"
	"github.com/grafana/grafana-plugin-sdk-go/backend/resource/httpadapter"
	"github.com/grafana/grafana-plugin-sdk-go/experimental/errorsource"
)

type XrayClientFactory = func(ctx context.Context, pluginContext backend.PluginContext, requestSettings RequestSettings, authSettings awsds.AuthSettings, sessions *awsds.SessionCache) (XrayClient, error)

type Datasource struct {
	Settings          awsds.AWSDatasourceSettings
	ResourceMux       backend.CallResourceHandler
	xrayClientFactory XrayClientFactory

	sessions     *awsds.SessionCache
	authSettings awsds.AuthSettings
}

func NewServerInstance(ctx context.Context, s backend.DataSourceInstanceSettings) (instancemgmt.Instance, error) {
	settings, err := getDsSettings(s)
	if err != nil {
		return nil, err
	}
	return NewDatasource(ctx, getXrayClient, settings), nil
}

func NewDatasource(ctx context.Context, xrayClientFactory XrayClientFactory, settings awsds.AWSDatasourceSettings) *Datasource {
	ds := &Datasource{xrayClientFactory: xrayClientFactory, Settings: settings}

	// resource handler
	resMux := http.NewServeMux()
	resMux.HandleFunc("/groups", ds.getGroups)
	resMux.HandleFunc("/regions", ds.GetRegions)
	resMux.HandleFunc("/accounts", ds.GetAccounts)
	ds.ResourceMux = httpadapter.New(resMux)

	authSettings := awsds.ReadAuthSettings(ctx)
	ds.authSettings = *authSettings
	ds.sessions = awsds.NewSessionCache()
	return ds
}

func (ds *Datasource) QueryData(ctx context.Context, req *backend.QueryDataRequest) (*backend.QueryDataResponse, error) {
	res := backend.NewQueryDataResponse()
	for _, query := range req.Queries {
		var currentRes backend.DataResponse
		switch query.QueryType {
		case QueryGetTrace:
			currentRes = ds.getSingleTrace(ctx, query, req.PluginContext)
		case QueryGetTraceSummaries:
			currentRes = ds.getTraceSummariesForSingleQuery(ctx, query, req.PluginContext)
		case QueryGetTimeSeriesServiceStatistics:
			currentRes = ds.getTimeSeriesServiceStatisticsForSingleQuery(ctx, query, req.PluginContext)
		case QueryGetAnalyticsRootCauseResponseTimeService,
			QueryGetAnalyticsRootCauseResponseTimePath,
			QueryGetAnalyticsRootCauseErrorService,
			QueryGetAnalyticsRootCauseErrorPath,
			QueryGetAnalyticsRootCauseErrorMessage,
			QueryGetAnalyticsRootCauseFaultService,
			QueryGetAnalyticsRootCauseFaultPath,
			QueryGetAnalyticsRootCauseFaultMessage,
			QueryGetAnalyticsUser,
			QueryGetAnalyticsUrl,
			QueryGetAnalyticsStatusCode:
			currentRes = ds.getSingleAnalyticsQueryResult(ctx, query, req.PluginContext)
		case QueryGetInsights:
			currentRes = ds.getSingleInsight(ctx, query, req.PluginContext)
		case QueryGetServiceMap:
			currentRes = ds.getSingleServiceMap(ctx, query, req.PluginContext)
		default:
			currentRes.Error = errorsource.PluginError(fmt.Errorf("unknown query type: %s", query.QueryType), false)
		}
		res.Responses[query.RefID] = currentRes
	}
	return res, nil
}

func (ds *Datasource) CallResource(ctx context.Context, req *backend.CallResourceRequest, sender backend.CallResourceResponseSender) error {
	return ds.ResourceMux.CallResource(ctx, req, sender)
}

type RequestSettings struct {
	Region string
}

func (ds *Datasource) getClient(ctx context.Context, pluginContext backend.PluginContext, requestSettings RequestSettings) (XrayClient, error) {
	return ds.xrayClientFactory(ctx, pluginContext, requestSettings, ds.authSettings, ds.sessions)
}

func getXrayClient(ctx context.Context, pluginContext backend.PluginContext, requestSettings RequestSettings, authSettings awsds.AuthSettings, sessions *awsds.SessionCache) (XrayClient, error) {
	awsSettings, err := getDsSettings(*pluginContext.DataSourceInstanceSettings)
	if err != nil {
		return nil, err
	}

	// add region from the request body if it's set, otherwise default region will be used
	if requestSettings.Region != "" && requestSettings.Region != "default" {
		awsSettings.Region = requestSettings.Region
	}

	xrayClient, err := client.CreateXrayClient(ctx, awsSettings, *pluginContext.DataSourceInstanceSettings, sessions)
	if err != nil {
		return nil, err
	}
	return xrayClient, nil
}

type XrayClient interface {
	xray.BatchGetTracesAPIClient
	xray.GetInsightSummariesAPIClient
	xray.GetGroupsAPIClient
	xray.GetServiceGraphAPIClient
	xray.GetTraceGraphAPIClient
	xray.GetTraceSummariesAPIClient
	xray.GetTimeSeriesServiceStatisticsAPIClient
}
