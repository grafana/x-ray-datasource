package configuration

import (
  "encoding/json"
  "fmt"
  "github.com/aws/aws-sdk-go/aws"
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

  jsonData := make(map[string]interface{})
  if err := json.Unmarshal(datasourceSettings.JSONData, &jsonData); err != nil {
    return nil, fmt.Errorf("could not unmarshal DataSourceInstanceSettings.JSONData: %w", err)
  }

  // TODO: use simpleJson or check the errors
  dsInfo := &DatasourceInfo{}
  defaultRegion := jsonData["defaultRegion"].(string)
  if region == "default" {
    region = defaultRegion
  }
  dsInfo.Region = region
  dsInfo.Profile = jsonData["profile"].(string)
  dsInfo.AuthType = jsonData["authType"].(string)
  dsInfo.AssumeRoleArn = jsonData["assumeRoleArn"].(string)
  dsInfo.AccessKey = jsonData["accessKey"].(string)
  dsInfo.SecretKey = jsonData["secretKey"].(string)

  return dsInfo, nil
}
