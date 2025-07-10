package datasource

import (
	"context"
	"encoding/json"
	"io"
	"net/http"
	"net/url"
	"time"

	"github.com/aws/aws-sdk-go-v2/service/applicationsignals"

	"github.com/grafana/grafana-plugin-sdk-go/backend"
	"github.com/grafana/grafana-plugin-sdk-go/backend/log"
	"github.com/grafana/grafana-plugin-sdk-go/experimental/errorsource"
)

func (ds *Datasource) GetOperations(rw http.ResponseWriter, req *http.Request) {
	if req.Method != "POST" {
		rw.WriteHeader(http.StatusMethodNotAllowed)
		return
	}

	urlQuery, err := url.ParseQuery(req.URL.RawQuery)
	if err != nil {
		sendError(rw, err)
		return
	}

	region := urlQuery.Get("region")

	keyAttributes := map[string]string{}
	if req.Body == nil {
		return
	}
	b, err := io.ReadAll(req.Body)
	if err != nil {
		return
	}
	err = json.Unmarshal(b, &keyAttributes)
	if err != nil {
		return
	}

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

	pluginConfig := backend.PluginConfigFromContext(req.Context())
	appSignalsClient, err := ds.getAppSignalsClient(req.Context(), pluginConfig, RequestSettings{Region: region})
	if err != nil {
		sendError(rw, err)
		return
	}

	input := applicationsignals.ListServiceOperationsInput{
		StartTime:     &startTime,
		EndTime:       &endTime,
		KeyAttributes: keyAttributes,
	}

	operations, err := getOperationsFromAppSignals(req.Context(), appSignalsClient, input)
	if err != nil {
		sendError(rw, err)
		return
	}

	body, err := json.Marshal(operations)
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

func getOperationsFromAppSignals(ctx context.Context, appSignalsClient AppSignalsClient, input applicationsignals.ListServiceOperationsInput) ([]string, error) {
	var operations []string
	pager := applicationsignals.NewListServiceOperationsPaginator(appSignalsClient, &input)
	var pagerError error
	for pager.HasMorePages() {
		output, err := pager.NextPage(ctx)
		if err != nil {
			pagerError = err
			break
		}
		for _, operation := range output.ServiceOperations {
			operations = append(operations, *operation.Name)
		}
	}
	if pagerError != nil {
		pagerError = errorsource.DownstreamError(pagerError, false)
	}
	return operations, pagerError
}
