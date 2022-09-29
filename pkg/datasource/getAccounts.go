package datasource

import (
	"encoding/json"
	"net/http"
	"net/url"
	"time"

	"github.com/aws/aws-sdk-go/service/xray"
	"github.com/grafana/grafana-plugin-sdk-go/backend/resource/httpadapter"
)

type Account struct {
  Id string
}

func (ds *Datasource) GetAccounts(rw http.ResponseWriter, req *http.Request) {
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

  urlQuery, err := url.ParseQuery(req.URL.RawQuery)
	group := urlQuery.Get("group")

  layout := "2006-01-02T15:04:05.000Z"
  startTime, err := time.Parse(layout, urlQuery.Get("startTime"))
  if err != nil {
    sendError(rw, err)
    return
  }
  
  endTime, err := time.Parse(layout, urlQuery.Get("endTime"))
  if err != nil {
    sendError(rw, err)
    return
  }

  input := &xray.GetServiceGraphInput{
		StartTime: &startTime,
		EndTime:   &endTime,
		GroupName: &group,
	}

  accounts := []Account{};

  err = xrayClient.GetServiceGraphPagesWithContext(req.Context(), input, func(page *xray.GetServiceGraphOutput, lastPage bool) bool {
		for _, service := range page.Services {
      if service.AccountId != nil {
        account := Account{
          Id: *service.AccountId,
        }
        accounts = append(accounts, account)
      }        
		}
		// Not sure how many pages there can possibly be but for now try to iterate over all the pages.
		return true
	})

  body, err := json.Marshal(accounts)
  if err != nil {
    sendError(rw, err)
    return
  }

  rw.Header().Set("content-type", "application/json")
  _, err = rw.Write(body)
}