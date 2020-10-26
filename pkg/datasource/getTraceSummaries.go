package datasource

import (
	"context"
	"encoding/json"

	"github.com/aws/aws-sdk-go/aws"
	"github.com/grafana/grafana-plugin-sdk-go/backend"
	"github.com/grafana/grafana-plugin-sdk-go/backend/log"
	"github.com/grafana/grafana-plugin-sdk-go/data"
	xray "github.com/grafana/x-ray-datasource/pkg/xray"
)

type GetTraceSummariesQueryData struct {
	Query  string `json:"query"`
  Region string `json:"region"`
}

func (ds *Datasource) getTraceSummaries(ctx context.Context, req *backend.QueryDataRequest) (*backend.QueryDataResponse, error) {
	response := &backend.QueryDataResponse{
		Responses: make(map[string]backend.DataResponse),
	}

	for _, query := range req.Queries {
		response.Responses[query.RefID] = ds.getTraceSummariesForSingleQuery(query, &req.PluginContext)
	}

	return response, nil
}

func (ds *Datasource) getTraceSummariesForSingleQuery(query backend.DataQuery, pluginContext *backend.PluginContext) backend.DataResponse {
	queryData := &GetTraceSummariesQueryData{}
	err := json.Unmarshal(query.JSON, queryData)

	if err != nil {
		return backend.DataResponse{
			Error: err,
		}
	}

  xrayClient, err := ds.xrayClientFactory(pluginContext, queryData.Region)
  if err != nil {
    return backend.DataResponse{
      Error: err,
    }
  }

	log.DefaultLogger.Debug("getTraceSummariesForSingleQuery", "RefID", query.RefID, "query", queryData.Query)

	responseDataFrame := data.NewFrame(
		"TraceSummaries",
		data.NewField("Id", nil, []*string{}),
		data.NewField("Method", nil, []*string{}),
		data.NewField("Response", nil, []*int64{}),
		data.NewField("Response Time", nil, []*float64{}).SetConfig(&data.FieldConfig{Unit: "s"}),
		data.NewField("URL", nil, []*string{}),
		data.NewField("Client IP", nil, []*string{}),
		data.NewField("Annotations", nil, []*int64{}),
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
				summary.Id,
				summary.Http.HttpMethod,
				summary.Http.HttpStatus,
				summary.Duration,
				summary.Http.HttpURL,
				summary.Http.ClientIp,
				aws.Int64(int64(annotationsCount)),
			)
		}

		count, err := responseDataFrame.RowLen()
		if err != nil {
		  // This should not happen, if it does it's probably a programmatic error.
		  log.DefaultLogger.Error("could not count the rows in response dataframe", "error", err)
    }
    // Hardcode to have similar limit to x-ray console.
		return count < 1000
	})

	if err != nil {
    log.DefaultLogger.Debug("getTraceSummariesForSingleQuery", "error", err)
		return backend.DataResponse{
			Error: err,
		}
	}

	return backend.DataResponse{
		Frames: []*data.Frame{responseDataFrame},
	}
}
