package datasource

import (
	"context"
	"fmt"
	"net/http"

	"github.com/aws/aws-sdk-go/service/xray"

	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/request"

	"github.com/grafana/grafana-aws-sdk/pkg/awsds"
	"github.com/grafana/x-ray-datasource/pkg/client"

	"github.com/grafana/grafana-plugin-sdk-go/backend"
	"github.com/grafana/grafana-plugin-sdk-go/backend/instancemgmt"
	"github.com/grafana/grafana-plugin-sdk-go/backend/resource/httpadapter"
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

	authSettings, _ := awsds.ReadAuthSettingsFromContext(ctx)
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
			res.Responses[query.RefID] = backend.DataResponse{
				Error: fmt.Errorf("unknown query type: %s", query.QueryType),
			}
			continue
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

	xrayClient, err := client.CreateXrayClient(ctx, awsSettings, *pluginContext.DataSourceInstanceSettings, authSettings, sessions)
	if err != nil {
		return nil, err
	}
	return xrayClient, nil
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
