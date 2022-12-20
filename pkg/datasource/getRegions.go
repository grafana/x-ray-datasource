package datasource

import (
	"encoding/json"
	"net/http"

	"github.com/aws/aws-sdk-go/aws/endpoints"
	"github.com/aws/aws-sdk-go/service/xray"

	"github.com/grafana/grafana-plugin-sdk-go/backend/log"
)

func (ds *Datasource) GetRegions(rw http.ResponseWriter, req *http.Request) {
	if req.Method != "GET" {
		rw.WriteHeader(http.StatusMethodNotAllowed)
		return
	}

	regions := []string{}
	for _, partition := range endpoints.DefaultPartitions() {
		regionsForPartition, exists := endpoints.RegionsForService(endpoints.DefaultPartitions(), partition.ID(), xray.EndpointsID)
		if exists {
			for region := range regionsForPartition {
				regions = append(regions, region)
			}
		}
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
