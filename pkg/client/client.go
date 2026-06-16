package client

import (
	"context"
	"net/http"

	"github.com/grafana/grafana-aws-sdk/pkg/awsauth"

	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/service/applicationsignals"
	"github.com/aws/aws-sdk-go-v2/service/xray"

	//"github.com/aws/aws-sdk-go-v2/session"
	"github.com/grafana/grafana-aws-sdk/pkg/awsds"
	"github.com/grafana/grafana-plugin-sdk-go/backend"
	"github.com/grafana/grafana-plugin-sdk-go/backend/httpclient"
)

// CreateXrayClient creates a new session and xray client and sets tracking header on that client
func CreateXrayClient(ctx context.Context, settings awsds.AWSDatasourceSettings, backendSettings backend.DataSourceInstanceSettings) (*xray.Client, error) {
	cfg, err := getAWSConfig(ctx, settings, backendSettings)
	if err != nil {
		return nil, err
	}
	return xray.NewFromConfig(cfg), nil
}

func CreateAppSignalsClient(ctx context.Context, settings awsds.AWSDatasourceSettings, backendSettings backend.DataSourceInstanceSettings) (*applicationsignals.Client, error) {
	cfg, err := getAWSConfig(ctx, settings, backendSettings)
	if err != nil {
		return nil, err
	}
	backend.Logger.Debug("CreateApplicationSignalsClient", "userAgent", awsds.GetUserAgentString("X-ray"))
	return applicationsignals.NewFromConfig(cfg), nil
}

func getAWSConfig(ctx context.Context, settings awsds.AWSDatasourceSettings, backendSettings backend.DataSourceInstanceSettings) (aws.Config, error) {
	region := settings.Region
	if region == "" || region == "default" {
		region = settings.DefaultRegion
	}
	httpClient, err := getHTTPClient(ctx, backendSettings)
	if err != nil {
		return aws.Config{}, err
	}
	return awsauth.NewConfigProvider().GetConfig(ctx, awsauth.Settings{
		LegacyAuthType:     settings.AuthType,
		AccessKey:          settings.AccessKey,
		SecretKey:          settings.SecretKey,
		SessionToken:       settings.SessionToken,
		Region:             region,
		CredentialsProfile: settings.Profile,
		AssumeRoleARN:      settings.AssumeRoleARN,
		Endpoint:           settings.Endpoint,
		ExternalID:         settings.ExternalID,
		HTTPClient:         httpClient,
	})
}

func getHTTPClient(ctx context.Context, backendSettings backend.DataSourceInstanceSettings) (*http.Client, error) {
	httpClientProvider := httpclient.NewProvider()
	httpClientOptions, err := backendSettings.HTTPClientOptions(ctx)
	if err != nil {
		return nil, backend.PluginError(err)
	}

	httpClient, err := httpClientProvider.New(httpClientOptions)
	if err != nil {
		backend.Logger.Error("failed to create HTTP client", "error", err.Error())
		return nil, backend.PluginError(err)
	}
	return httpClient, nil

}
