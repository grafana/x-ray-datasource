package client

import (
	"context"

	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/xray"
	"github.com/grafana/grafana-aws-sdk/pkg/awsds"
	"github.com/grafana/grafana-plugin-sdk-go/backend"
	"github.com/grafana/grafana-plugin-sdk-go/backend/httpclient"
)

// CreateXrayClient creates a new session and xray client and sets tracking header on that client
func CreateXrayClient(ctx context.Context, datasourceInfo awsds.AWSDatasourceSettings, backendSettings backend.DataSourceInstanceSettings, authSettings awsds.AuthSettings, sessions *awsds.SessionCache) (*xray.XRay, error) {
	sess, err := getXRaySession(ctx, datasourceInfo, backendSettings, authSettings, sessions)
	if err != nil {
		return nil, err
	}

	config := &aws.Config{}
	if datasourceInfo.Endpoint != "" {
		config.Endpoint = aws.String(datasourceInfo.Endpoint)
	}

	backend.Logger.Debug("CreateXrayClient", "userAgent", awsds.GetUserAgentString("X-ray"))

	return xray.New(sess, config), nil
}

func getXRaySession(ctx context.Context, datasourceInfo awsds.AWSDatasourceSettings, backendSettings backend.DataSourceInstanceSettings, authSettings awsds.AuthSettings, sessions *awsds.SessionCache) (*session.Session, error) {
	httpClientProvider := httpclient.NewProvider()
	httpClientOptions, err := backendSettings.HTTPClientOptions(ctx)
	if err != nil {
		return nil, err
	}

	httpClient, err := httpClientProvider.New(httpClientOptions)
	if err != nil {
		backend.Logger.Error("failed to create HTTP client", "error", err.Error())
		return nil, err
	}

	return sessions.GetSessionWithAuthSettings(awsds.GetSessionConfig{
		Settings:      datasourceInfo,
		HTTPClient:    httpClient,
		UserAgentName: aws.String("X-ray"),
	}, authSettings)
}
