package datasource

import (
  "encoding/json"
  "github.com/aws/aws-sdk-go/service/xray"
  "github.com/grafana/grafana-plugin-sdk-go/backend/log"
  "github.com/grafana/grafana-plugin-sdk-go/backend/resource/httpadapter"
  "net/http"
)

func (ds *Datasource) getGroups(rw http.ResponseWriter, req *http.Request) {
  if req.Method != "GET" {
    rw.WriteHeader(http.StatusMethodNotAllowed)
    return
  }

  pluginConfig := httpadapter.PluginConfigFromContext(req.Context())
  xrayClient, err := ds.xrayClientFactory(&pluginConfig)

  if err != nil {
    sendError(rw, err)
    return
  }

  groupsReq := &xray.GetGroupsInput{}
  var groups []*xray.GroupSummary
  err = xrayClient.GetGroupsPages(groupsReq, func(output *xray.GetGroupsOutput, b bool) bool {
    groups = append(groups, output.Groups...)
    return true
  })

  if err != nil {
    sendError(rw, err)
    return
  }

  body, err := json.Marshal(groups)
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

func sendError(rw http.ResponseWriter, err error) {
  rw.WriteHeader(http.StatusInternalServerError)
  _, writeErr := rw.Write([]byte(err.Error()))
  if writeErr != nil {
    log.DefaultLogger.Error("failed to write error response", "writeError", writeErr.Error(), "originalError", err.Error())
  }
}
