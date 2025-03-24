package client

import (
	"context"
	"github.com/grafana/grafana-aws-sdk/pkg/awsauth"
	"net/http"

	"github.com/aws/aws-sdk-go-v2/service/xray"
	//"github.com/aws/aws-sdk-go-v2/session"
	"github.com/grafana/grafana-aws-sdk/pkg/awsds"
	"github.com/grafana/grafana-plugin-sdk-go/backend"
	"github.com/grafana/grafana-plugin-sdk-go/backend/httpclient"
	"github.com/grafana/grafana-plugin-sdk-go/experimental/errorsource"
)

// CreateXrayClient creates a new session and xray client and sets tracking header on that client
func CreateXrayClient(ctx context.Context, settings awsds.AWSDatasourceSettings, backendSettings backend.DataSourceInstanceSettings, sessions *awsds.SessionCache) (*xray.Client, error) {
	region := settings.Region
	if region == "" || region == "default" {
		region = settings.DefaultRegion
	}
	httpClient, err := getHTTPClient(ctx, backendSettings)
	if err != nil {
		return nil, err
	}
	cfg, err := awsauth.NewConfigProvider().GetConfig(ctx, awsauth.Settings{
		LegacyAuthType:     settings.AuthType,
		AccessKey:          settings.AccessKey,
		SecretKey:          settings.SecretKey,
		Region:             region,
		CredentialsProfile: settings.Profile,
		AssumeRoleARN:      settings.AssumeRoleARN,
		Endpoint:           settings.Endpoint,
		ExternalID:         settings.ExternalID,
		HTTPClient:         httpClient,
	})
	if err != nil {
		return nil, err
	}
	return xray.NewFromConfig(cfg), nil
}

func getHTTPClient(ctx context.Context, backendSettings backend.DataSourceInstanceSettings) (*http.Client, error) {
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
	return httpClient, nil

}
