package datasource

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/aws/aws-sdk-go-v2/service/applicationsignals"
	"github.com/aws/aws-sdk-go-v2/service/xray"

	"github.com/grafana/grafana-aws-sdk/pkg/awsds"
	"github.com/grafana/x-ray-datasource/pkg/client"

	"github.com/grafana/grafana-plugin-sdk-go/backend"
	"github.com/grafana/grafana-plugin-sdk-go/backend/instancemgmt"
	"github.com/grafana/grafana-plugin-sdk-go/backend/resource/httpadapter"
	"github.com/grafana/grafana-plugin-sdk-go/experimental/errorsource"
)

type XrayClientFactory = func(ctx context.Context, pluginContext backend.PluginContext, requestSettings RequestSettings) (XrayClient, error)
type AppSignalsClientFactory = func(ctx context.Context, pluginContext backend.PluginContext, requestSettings RequestSettings) (AppSignalsClient, error)

type Datasource struct {
	Settings                awsds.AWSDatasourceSettings
	ResourceMux             backend.CallResourceHandler
	xrayClientFactory       XrayClientFactory
	appSignalsClientFactory AppSignalsClientFactory

	authSettings awsds.AuthSettings
}

func NewServerInstance(ctx context.Context, s backend.DataSourceInstanceSettings) (instancemgmt.Instance, error) {
	settings, err := getDsSettings(s)
	if err != nil {
		return nil, err
	}
	return NewDatasource(ctx, getXrayClient, getAppSignalsClient, settings), nil
}

func NewDatasource(ctx context.Context, xrayClientFactory XrayClientFactory, appSignalsClientFactory AppSignalsClientFactory, settings awsds.AWSDatasourceSettings) *Datasource {
	ds := &Datasource{xrayClientFactory: xrayClientFactory, appSignalsClientFactory: appSignalsClientFactory, Settings: settings}

	// resource handler
	resMux := http.NewServeMux()
	resMux.HandleFunc("/groups", ds.getGroups)
	resMux.HandleFunc("/regions", ds.GetRegions)
	resMux.HandleFunc("/accounts", ds.GetAccounts)
	resMux.HandleFunc("/services", ds.GetServices)
	resMux.HandleFunc("/operations", ds.GetOperations)
	ds.ResourceMux = httpadapter.New(resMux)

	authSettings := awsds.ReadAuthSettings(ctx)
	ds.authSettings = *authSettings
	return ds
}

type QueryModeModel struct {
	QueryMode        string `json:"queryMode"`
	ServiceQueryType string `json:"serviceQueryType"`
}

func (ds *Datasource) QueryData(ctx context.Context, req *backend.QueryDataRequest) (*backend.QueryDataResponse, error) {
	res := backend.NewQueryDataResponse()
	for _, query := range req.Queries {
		var currentRes backend.DataResponse
		model := QueryModeModel{}
		err := json.Unmarshal(query.JSON, &model)
		if err != nil {
			return nil, err
		}

		switch model.QueryMode {
		case ModeServices:
			switch model.ServiceQueryType {
			case QueryListServices:
				currentRes = ds.ListServices(ctx, query, req.PluginContext)
			case QueryListServiceOperations:
				currentRes = ds.ListServiceOperations(ctx, query, req.PluginContext)
			case QueryListServiceDependencies:
				currentRes = ds.ListServiceDependencies(ctx, query, req.PluginContext)
			case QueryListServiceLevelObjectives:
				currentRes = ds.ListServiceLevelObjectives(ctx, query, req.PluginContext)
			default:
				currentRes.Error = errorsource.DownstreamError(fmt.Errorf("unknown service query type: %s", model.ServiceQueryType), false)
			}
		case "":
			fallthrough
		case ModeXRay:
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
				currentRes.Error = errorsource.DownstreamError(fmt.Errorf("unknown query type: %s", query.QueryType), false)
			}
		default:
			currentRes.Error = errorsource.DownstreamError(fmt.Errorf("unknown query mode: %s", model.QueryMode), false)
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
	return ds.xrayClientFactory(ctx, pluginContext, requestSettings)
}

func (ds *Datasource) getAppSignalsClient(ctx context.Context, pluginContext backend.PluginContext, requestSettings RequestSettings) (AppSignalsClient, error) {
	return ds.appSignalsClientFactory(ctx, pluginContext, requestSettings)
}

func getXrayClient(ctx context.Context, pluginContext backend.PluginContext, requestSettings RequestSettings) (XrayClient, error) {
	awsSettings, err := getDsSettings(*pluginContext.DataSourceInstanceSettings)
	if err != nil {
		return nil, err
	}

	// add region from the request body if it's set, otherwise default region will be used
	if requestSettings.Region != "" && requestSettings.Region != "default" {
		awsSettings.Region = requestSettings.Region
	}

	xrayClient, err := client.CreateXrayClient(ctx, awsSettings, *pluginContext.DataSourceInstanceSettings)
	if err != nil {
		return nil, err
	}
	return xrayClient, nil
}

func getAppSignalsClient(ctx context.Context, pluginContext backend.PluginContext, requestSettings RequestSettings) (AppSignalsClient, error) {
	awsSettings, err := getDsSettings(*pluginContext.DataSourceInstanceSettings)
	if err != nil {
		return nil, err
	}

	// add region from the request body if it's set, otherwise default region will be used
	if requestSettings.Region != "" && requestSettings.Region != "default" {
		awsSettings.Region = requestSettings.Region
	}

	appSignalsClient, err := client.CreateAppSignalsClient(ctx, awsSettings, *pluginContext.DataSourceInstanceSettings)
	if err != nil {
		return nil, err
	}
	return appSignalsClient, nil
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

type AppSignalsClient interface {
	applicationsignals.ListServicesAPIClient
	applicationsignals.ListServiceOperationsAPIClient
	applicationsignals.ListServiceDependenciesAPIClient
	applicationsignals.ListServiceLevelObjectivesAPIClient
}
