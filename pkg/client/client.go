package client

import (
	"context"

	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/service/applicationsignals"
	"github.com/aws/aws-sdk-go-v2/service/xray"

	//"github.com/aws/aws-sdk-go-v2/session"
	"github.com/grafana/grafana-aws-sdk/pkg/awsds"
	"github.com/grafana/grafana-plugin-sdk-go/backend"
	"github.com/grafana/grafana-plugin-sdk-go/backend/httpclient"
	"github.com/grafana/grafana-plugin-sdk-go/experimental/errorsource"
)

// CreateXrayClient creates a new session and xray client and sets tracking header on that client
func CreateXrayClient(ctx context.Context, datasourceInfo awsds.AWSDatasourceSettings, backendSettings backend.DataSourceInstanceSettings, sessions *awsds.SessionCache) (*xray.Client, error) {
	provider, err := getXRaySession(ctx, datasourceInfo, backendSettings, sessions)
	if err != nil {
		return nil, err
	}

	config := aws.Config{
		Credentials: provider,
	}
	if datasourceInfo.Endpoint != "" {
		config.BaseEndpoint = aws.String(datasourceInfo.Endpoint)
	}

	backend.Logger.Debug("CreateXrayClient", "userAgent", awsds.GetUserAgentString("X-ray"))

	return xray.NewFromConfig(config, func(opt *xray.Options) { opt.Region = datasourceInfo.Region }), nil
}

func CreateAppSignalsClient(ctx context.Context, datasourceInfo awsds.AWSDatasourceSettings, backendSettings backend.DataSourceInstanceSettings, sessions *awsds.SessionCache) (*applicationsignals.Client, error) {
	provider, err := getXRaySession(ctx, datasourceInfo, backendSettings, sessions)
	if err != nil {
		return nil, err
	}

	config := aws.Config{
		Credentials: provider,
	}
	if datasourceInfo.Endpoint != "" {
		config.BaseEndpoint = aws.String(datasourceInfo.Endpoint)
	}

	backend.Logger.Debug("CreateApplicationSignalsClient", "userAgent", awsds.GetUserAgentString("X-ray"))
	return applicationsignals.NewFromConfig(config, func(opt *applicationsignals.Options) { opt.Region = datasourceInfo.Region }), nil
}

func getXRaySession(ctx context.Context, datasourceInfo awsds.AWSDatasourceSettings, backendSettings backend.DataSourceInstanceSettings, sessions *awsds.SessionCache) (aws.CredentialsProvider, error) {
	httpClientProvider := httpclient.NewProvider()
	httpClientOptions, err := backendSettings.HTTPClientOptions(ctx)
	if err != nil {
		return nil, errorsource.PluginError(err, false)
	}

	httpClient, err := httpClientProvider.New(httpClientOptions)
	if err != nil {
		backend.Logger.Error("failed to create HTTP client", "error", err.Error())
		return nil, errorsource.PluginError(err, false)
	}

	provider, err := sessions.CredentialsProviderV2(ctx, awsds.GetSessionConfig{
		Settings:      datasourceInfo,
		HTTPClient:    httpClient,
		UserAgentName: aws.String("X-ray"),
	})
	if err != nil {
		err = errorsource.PluginError(err, false)
	}
	return provider, err
}
