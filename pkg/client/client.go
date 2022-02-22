package client

import (
	"fmt"
	"os"
	"runtime"

	"github.com/grafana/grafana-aws-sdk/pkg/awsds"
	"github.com/grafana/grafana-plugin-sdk-go/backend"
	"github.com/grafana/grafana-plugin-sdk-go/backend/httpclient"
	"github.com/grafana/grafana-plugin-sdk-go/backend/log"

	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/request"
	"github.com/aws/aws-sdk-go/service/ec2"
	"github.com/aws/aws-sdk-go/service/xray"
)

// Global session cache
var sessions = awsds.NewSessionCache()

// CreateXrayClient creates a new session and xray client and sets tracking header on that client
func CreateXrayClient(awsSettings *awsds.AWSDatasourceSettings, backendSettings *backend.DataSourceInstanceSettings) (*xray.XRay, error) {
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

	config := &aws.Config{}
	if awsSettings.Endpoint != "" {
		config.Endpoint = aws.String(awsSettings.Endpoint)
	}

	clt := xray.New(sess, config)
	clt.Handlers.Send.PushFront(func(r *request.Request) {
		r.HTTPRequest.Header.Set("User-Agent", userAgentString())
		log.DefaultLogger.Debug("CreateXrayClient", "userAgent", userAgentString())
	})

	return clt, nil
}

// CreateEc2Client creates client for EC2 api. We need this for some introspection queries like getting regions.
func CreateEc2Client(awsSettings *awsds.AWSDatasourceSettings, backendSettings *backend.DataSourceInstanceSettings) (*ec2.EC2, error) {
	if awsSettings == nil {
		return nil, fmt.Errorf("x-ray datasource settings required")
	}
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

	ec2Client := ec2.New(sess, &aws.Config{})
	ec2Client.Handlers.Send.PushFront(func(r *request.Request) {
		r.HTTPRequest.Header.Set("User-Agent", userAgentString())
	})
	return ec2Client, nil
}

func userAgentString() string {
	return fmt.Sprintf("%s/%s (%s; %s) Grafana/%s", aws.SDKName, aws.SDKVersion, runtime.Version(), runtime.GOOS, os.Getenv("GF_VERSION"))
}
