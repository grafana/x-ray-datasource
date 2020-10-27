package configuration

import (
  "fmt"
  "github.com/aws/aws-sdk-go/aws"
  "github.com/bitly/go-simplejson"
  "github.com/grafana/grafana-plugin-sdk-go/backend"
)

func GetAwsConfig(dsInfo *DatasourceInfo) (*aws.Config, error) {
  creds, err := getCredentials(dsInfo)
  if err != nil {
    return nil, err
  }

  cfg := &aws.Config{
    Region:      aws.String(dsInfo.Region),
    Credentials: creds,
  }

  return cfg, nil
}

func GetDatasourceInfo(datasourceSettings *backend.DataSourceInstanceSettings, region string) (*DatasourceInfo, error) {
  if datasourceSettings == nil {
    return nil, fmt.Errorf("missing datasource settings")
  }

  jsonData, err := simplejson.NewJson(datasourceSettings.JSONData)
  if err != nil {
    return nil, fmt.Errorf("could not unmarshal DataSourceInstanceSettings.JSONData: %w", err)
  }

  dsInfo := &DatasourceInfo{}
  defaultRegion := jsonData.Get("defaultRegion").MustString("")
  if region == "default" || region == "" {
    region = defaultRegion
  }
  dsInfo.Region = region
  dsInfo.Profile = jsonData.Get("profile").MustString("")
  dsInfo.AuthType = jsonData.Get("authType").MustString("")
  dsInfo.AssumeRoleArn = jsonData.Get("assumeRoleArn").MustString("")
  dsInfo.AccessKey = datasourceSettings.DecryptedSecureJSONData["accessKey"]
  dsInfo.SecretKey = datasourceSettings.DecryptedSecureJSONData["secretKey"]

  return dsInfo, nil
}
