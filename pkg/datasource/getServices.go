package datasource

import (
	"context"
	"encoding/json"
	"net/http"
	"net/url"
	"time"

	"github.com/aws/aws-sdk-go-v2/service/applicationsignals"

	"github.com/grafana/grafana-plugin-sdk-go/backend"
	"github.com/grafana/grafana-plugin-sdk-go/backend/log"
	"github.com/grafana/grafana-plugin-sdk-go/experimental/errorsource"
)

func (ds *Datasource) GetServices(rw http.ResponseWriter, req *http.Request) {
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
	accountId := urlQuery.Get("accountId")

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

	log.DefaultLogger.Debug("getServices", "region", region, "accountId", accountId)
	pluginConfig := backend.PluginConfigFromContext(req.Context())
	appSignalsClient, err := ds.getAppSignalsClient(req.Context(), pluginConfig, RequestSettings{Region: region})
	if err != nil {
		sendError(rw, err)
		return
	}

	input := applicationsignals.ListServicesInput{
		StartTime:             &startTime,
		EndTime:               &endTime,
		IncludeLinkedAccounts: true,
	}
	if accountId != "" && accountId != "all" {
		input.AwsAccountId = &accountId
	}

	groups, err := getServicesFromAppSignals(req.Context(), appSignalsClient, input)
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

func getServicesFromAppSignals(ctx context.Context, appSignalsClient AppSignalsClient, input applicationsignals.ListServicesInput) ([]map[string]string, error) {
	var services []map[string]string
	pager := applicationsignals.NewListServicesPaginator(appSignalsClient, &input)
	var pagerError error
	for pager.HasMorePages() {
		output, err := pager.NextPage(ctx)
		if err != nil {
			pagerError = err
			break
		}
		for _, summary := range output.ServiceSummaries {
			services = append(services, summary.KeyAttributes)
		}
	}
	if pagerError != nil {
		pagerError = errorsource.DownstreamError(pagerError, false)
	}
	return services, pagerError
}
