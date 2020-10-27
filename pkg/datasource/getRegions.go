package datasource

import (
  "encoding/json"
  "github.com/aws/aws-sdk-go/service/ec2"
  "net/http"

  "github.com/grafana/grafana-plugin-sdk-go/backend/log"
  "github.com/grafana/grafana-plugin-sdk-go/backend/resource/httpadapter"
)

func (ds *Datasource) getRegions(rw http.ResponseWriter, req *http.Request) {
  if req.Method != "GET" {
    rw.WriteHeader(http.StatusMethodNotAllowed)
    return
  }

  pluginConfig := httpadapter.PluginConfigFromContext(req.Context())
  // getRegions should not require region itself
  ec2Client, err := ds.ec2ClientFactory(&pluginConfig, "")

  if err != nil {
    sendError(rw, err)
    return
  }

  regions, err := getRegions(ec2Client)

  if err != nil {
    sendError(rw, err)
    return
  }

  body, err := json.Marshal(regions)
  if err != nil {
    sendError(rw, err)
    return
  }

  rw.Header().Set("content-type", "application/json")
  _, err = rw.Write(body)
  if err != nil {
    log.DefaultLogger.Error("failed to write response", "err", err.Error())
    return
  }
}

func getRegions(client *ec2.EC2) ([]*ec2.Region, error) {
  input := &ec2.DescribeRegionsInput{}
  out, err := client.DescribeRegions(input)
  if err != nil {
    return nil, err
  }
  return out.Regions, err
}
