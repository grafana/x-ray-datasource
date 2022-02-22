package client

import (
	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/service/ec2"
	"github.com/aws/aws-sdk-go/service/xray"
	"github.com/grafana/grafana-aws-sdk/pkg/awsds"
	"github.com/grafana/grafana-plugin-sdk-go/backend"
	"github.com/grafana/grafana-plugin-sdk-go/backend/httpclient"
)

// Global session cache
var sessions = awsds.NewSessionCache()

// CreateXrayClient creates a new session and xray client and sets tracking header on that client
func CreateXrayClient(datasourceInfo *awsds.AWSDatasourceSettings, backendSettings *backend.DataSourceInstanceSettings) (*xray.XRay, error) {
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

	sess, err := sessions.GetSession(awsds.SessionConfig{
		Settings:      *datasourceInfo,
		HTTPClient:    httpClient,
		UserAgentName: aws.String("X-ray"),
	})
	if err != nil {
		return nil, err
	}

	config := &aws.Config{}
	if datasourceInfo.Endpoint != "" {
		config.Endpoint = aws.String(datasourceInfo.Endpoint)
	}

	return xray.New(sess, config), nil
}

// CreateEc2Client creates client for EC2 api. We need this for some introspection queries like getting regions.
func CreateEc2Client(awsSettings *awsds.AWSDatasourceSettings, backendSettings *backend.DataSourceInstanceSettings) (*ec2.EC2, error) {
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

	sess, err := sessions.GetSession(awsds.SessionConfig{
		Settings:      *awsSettings,
		HTTPClient:    httpClient,
		UserAgentName: aws.String("X-ray"),
	})
	if err != nil {
		return nil, err
	}

	return ec2.New(sess, &aws.Config{}), nil
}
