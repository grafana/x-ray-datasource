package client

import (
	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/xray"
	"github.com/grafana/grafana-aws-sdk/pkg/awsds"
	"github.com/grafana/grafana-plugin-sdk-go/backend"
	"github.com/grafana/grafana-plugin-sdk-go/backend/httpclient"
)

// Global session cache
var sessions = awsds.NewSessionCache()

// CreateXrayClient creates a new session and xray client and sets tracking header on that client
func CreateXrayClient(datasourceInfo *awsds.AWSDatasourceSettings, backendSettings *backend.DataSourceInstanceSettings) (*xray.XRay, error) {
	sess, err := getXRaySession(datasourceInfo, backendSettings)
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

func getXRaySession(datasourceInfo *awsds.AWSDatasourceSettings, backendSettings *backend.DataSourceInstanceSettings) (*session.Session, error) {
	httpClientProvider := httpclient.NewProvider()
	httpClientOptions, err := backendSettings.HTTPClientOptions()
	if err != nil {
		return nil, err
	}

	httpClient, err := httpClientProvider.New(httpClientOptions)
	if err != nil {
		backend.Logger.Error("failed to create HTTP client", "error", err.Error())
		return nil, err
	}

	return sessions.GetSession(awsds.SessionConfig{
		Settings:      *datasourceInfo,
		HTTPClient:    httpClient,
		UserAgentName: aws.String("X-ray"),
	})
}
