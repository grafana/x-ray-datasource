package datasource

import (
	"context"
	"encoding/json"

	"github.com/aws/aws-sdk-go/service/xray"
	"github.com/grafana/grafana-plugin-sdk-go/backend"
	"github.com/grafana/grafana-plugin-sdk-go/backend/log"
	"github.com/grafana/grafana-plugin-sdk-go/data"
)

type GetTraceSummariesQueryData struct {
	Query string `json:"query"`
}

func (ds *Datasource) getTraceSummaries(ctx context.Context, req *backend.QueryDataRequest) (*backend.QueryDataResponse, error) {
	xrayClient, err := ds.xrayClientFactory(&req.PluginContext)
	if err != nil {
		return nil, err
	}

	response := &backend.QueryDataResponse{
		Responses: make(map[string]backend.DataResponse),
	}

	for _, query := range req.Queries {
		response.Responses[query.RefID] = getTraceSummariesForSingleQuery(xrayClient, query)
	}

	return response, nil
}

func getTraceSummariesForSingleQuery(xrayClient XrayClient, query backend.DataQuery) backend.DataResponse {
	queryData := &GetTraceSummariesQueryData{}
	err := json.Unmarshal(query.JSON, queryData)

	if err != nil {
		return backend.DataResponse{
			Error: err,
		}
	}

	log.DefaultLogger.Debug("getTraceSummariesForSingleQuery", "RefID", query.RefID, "query", queryData.Query)

	responseDataFrame := data.NewFrame(
		"TraceSummaries",
		data.NewField("Id", nil, []string{}),
		data.NewField("Method", nil, []string{}),
		data.NewField("Response", nil, []int64{}),
		data.NewField("Response Time", nil, []float64{}),
		data.NewField("URL", nil, []string{}),
		data.NewField("Client IP", nil, []string{}),
		data.NewField("Annotations", nil, []int64{}),
	)

  var filterExpression *string
  if queryData.Query != "" {
    filterExpression = &queryData.Query
  }

	request := &xray.GetTraceSummariesInput{
		StartTime:        &query.TimeRange.From,
		EndTime:          &query.TimeRange.To,
		FilterExpression: filterExpression,
	}
	err = xrayClient.GetTraceSummariesPages(request, func(page *xray.GetTraceSummariesOutput, lastPage bool) bool {
		for _, summary := range page.TraceSummaries {
			annotationsCount := 0
			for _, val := range summary.Annotations {
				annotationsCount += len(val)
			}

			responseDataFrame.AppendRow(
				*summary.Id,
				*summary.Http.HttpMethod,
				*summary.Http.HttpStatus,
				*summary.Duration,
				*summary.Http.HttpURL,
				*summary.Http.ClientIp,
				int64(annotationsCount),
			)
		}

		// Not sure how many pages there can possibly be but for now try to iterate over all the pages.
		return true
	})

	log.DefaultLogger.Debug("getTraceSummariesForSingleQuery", "error", err)
	if err != nil {
		return backend.DataResponse{
			Error: err,
		}
	}

	return backend.DataResponse{
		Frames: []*data.Frame{responseDataFrame},
	}
}
