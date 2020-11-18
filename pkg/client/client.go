package client

import (
	"fmt"
	"os"
	"runtime"

	"github.com/grafana/grafana-aws-sdk/pkg/awsds"
	"github.com/grafana/grafana-plugin-sdk-go/backend/log"

	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/request"
	"github.com/aws/aws-sdk-go/service/ec2"
	xray "github.com/grafana/x-ray-datasource/pkg/xray"
)

// Global session cache
var sessions = awsds.NewSessionCache()

// CreateXrayClient creates a new session and xray client and sets tracking header on that client
func CreateXrayClient(region string, datasourceInfo *awsds.AWSDatasourceSettings) (*xray.XRay, error) {
	sess, err := sessions.GetSession(region, *datasourceInfo)
	if err != nil {
		return nil, err
	}

	config := &aws.Config{}
	if datasourceInfo.Endpoint != "" {
		config.Endpoint = aws.String(datasourceInfo.Endpoint)
	}

	clt := xray.New(sess, config)
	clt.Handlers.Send.PushFront(func(r *request.Request) {
		r.HTTPRequest.Header.Set("User-Agent", userAgentString())
		log.DefaultLogger.Debug("CreateXrayClient", "userAgent", userAgentString())
	})

	return clt, nil
}

// CreateEc2Client creates client for EC2 api. We need this for some introspection queries like getting regions.
func CreateEc2Client(region string, datasourceInfo *awsds.AWSDatasourceSettings) (*ec2.EC2, error) {
	sess, err := sessions.GetSession(region, *datasourceInfo)
	if err != nil {
		return nil, err
	}

	ec2Client := ec2.New(sess, &aws.Config{})
	ec2Client.Handlers.Send.PushFront(func(r *request.Request) {
		r.HTTPRequest.Header.Set("User-Agent", userAgentString())
	})
	return ec2Client, nil
}

func userAgentString() string {
	return fmt.Sprintf("%s/%s (%s; %s) Grafana/%s", aws.SDKName, aws.SDKVersion, runtime.Version(), runtime.GOOS, os.Getenv("GF_VERSION"))
}
