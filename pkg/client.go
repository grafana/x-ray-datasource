package main

import (
  "fmt"
  "github.com/aws/aws-sdk-go/aws"
  "github.com/aws/aws-sdk-go/aws/request"
  "github.com/aws/aws-sdk-go/aws/session"
  "github.com/aws/aws-sdk-go/service/ec2"
  "github.com/aws/aws-sdk-go/service/xray"
  "github.com/grafana/grafana-plugin-sdk-go/backend/log"
  "github.com/grafana/simple-datasource-backend/pkg/configuration"
)

// CreateXrayClient creates a new session and xray client and sets tracking header on that client
func CreateXrayClient(datasourceInfo *configuration.DatasourceInfo) (*xray.XRay, error) {
  log.DefaultLogger.Info("createclient1")
  config, sess, err := createConfigAndSession(datasourceInfo)
  if err != nil {
    return nil, err
  }

  log.DefaultLogger.Info("createclient2")
  clt := xray.New(sess, config)
  clt.Handlers.Send.PushFront(func(r *request.Request) {
    // TODO: fix, get from the GF_VERSION env var
    //r.HTTPRequest.Header.Set("User-Agent", fmt.Sprintf("Grafana/%s", setting.BuildVersion))
    r.HTTPRequest.Header.Set("User-Agent", fmt.Sprintf("Grafana/%s", "7.1"))
  })

  return clt, nil
}

// CreateEc2Client creates client for EC2 api. We need this for some introspection queries like getting regions.
func CreateEc2Client(datasourceInfo *configuration.DatasourceInfo) (*ec2.EC2, error) {
  config, sess, err := createConfigAndSession(datasourceInfo)
  if err != nil {
    return nil, err
  }

  ec2Client := ec2.New(sess, config)
  ec2Client.Handlers.Send.PushFront(func(r *request.Request) {
    // TODO: fix, get from the GF_VERSION env var
    //r.HTTPRequest.Header.Set("User-Agent", fmt.Sprintf("Grafana/%s", setting.BuildVersion))
    r.HTTPRequest.Header.Set("User-Agent", fmt.Sprintf("Grafana/%s", "7.1"))
  })
  return ec2Client, nil
}

func createConfigAndSession(datasourceInfo *configuration.DatasourceInfo) (*aws.Config, *session.Session, error) {
  log.DefaultLogger.Info("createConfigAndSession1")
  cfg, err := configuration.GetAwsConfig(datasourceInfo)
  if err != nil {
    return nil, nil, err
  }
  log.DefaultLogger.Info("createConfigAndSession2")
  sess, err := session.NewSession(cfg)
  if err != nil {
    return nil, nil, err
  }

  return cfg, sess, nil
}
