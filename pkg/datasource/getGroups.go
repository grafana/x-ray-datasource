package datasource

import (
	"context"
	"encoding/json"
	xraytypes "github.com/aws/aws-sdk-go-v2/service/xray/types"
	"net/http"
	"net/url"

	"github.com/aws/aws-sdk-go-v2/service/xray"
	"github.com/grafana/grafana-plugin-sdk-go/backend/log"
	"github.com/grafana/grafana-plugin-sdk-go/backend/resource/httpadapter"
	"github.com/grafana/grafana-plugin-sdk-go/experimental/errorsource"
)

func (ds *Datasource) getGroups(rw http.ResponseWriter, req *http.Request) {
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

	log.DefaultLogger.Debug("getGroups", "region", region)

	pluginConfig := httpadapter.PluginConfigFromContext(req.Context()) //nolint:staticcheck
	xrayClient, err := ds.getClient(req.Context(), pluginConfig, RequestSettings{Region: region})

	if err != nil {
		sendError(rw, err)
		return
	}

	groups, err := getGroupsFromXray(req.Context(), xrayClient)

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

func getGroupsFromXray(ctx context.Context, xrayClient XrayClient) ([]xraytypes.GroupSummary, error) {
	groupsReq := &xray.GetGroupsInput{}
	var groups []xraytypes.GroupSummary
	pager := xray.NewGetGroupsPaginator(xrayClient, groupsReq)
	var pagerError error
	for pager.HasMorePages() {
		output, err := pager.NextPage(ctx)
		if err != nil {
			pagerError = err
			break
		}
		groups = append(groups, output.Groups...)

	}
	if pagerError != nil {
		pagerError = errorsource.DownstreamError(pagerError, false)
	}
	return groups, pagerError
}
