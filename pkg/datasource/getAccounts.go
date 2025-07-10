package datasource

import (
	"encoding/json"
	"net/http"
	"net/url"
	"time"

	"github.com/aws/aws-sdk-go-v2/service/xray"
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
	urlQuery, err := url.ParseQuery(req.URL.RawQuery)
	if err != nil {
		sendError(rw, err)
		return
	}
	region := urlQuery.Get("region")

	pluginConfig := httpadapter.PluginConfigFromContext(req.Context()) //nolint:staticcheck
	xrayClient, err := ds.getClient(req.Context(), pluginConfig, RequestSettings{Region: region})

	if err != nil {
		sendError(rw, err)
		return
	}

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

	accounts := []Account{}

	pager := xray.NewGetServiceGraphPaginator(xrayClient, input)
	var pagerError error
	for pager.HasMorePages() {
		page, err := pager.NextPage(req.Context())
		if err != nil {
			pagerError = err
			break
		}
		for _, service := range page.Services {
			if service.AccountId != nil && *service.AccountId != "all" {
				account := Account{
					Id: *service.AccountId,
				}
				accounts = append(accounts, account)
			}
		}

	}
	if pagerError != nil {
		sendError(rw, pagerError)
		return
	}

	body, err := json.Marshal(accounts)
	if err != nil {
		sendError(rw, err)
		return
	}

	rw.Header().Set("content-type", "application/json")
	_, err = rw.Write(body)
	if err != nil {
		sendError(rw, err)
		return
	}
}
