package datasource

import (
	"context"
	"encoding/json"
	"time"

	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/service/xray"
	"github.com/grafana/grafana-plugin-sdk-go/backend"
	"github.com/grafana/grafana-plugin-sdk-go/backend/log"
	"github.com/grafana/grafana-plugin-sdk-go/data"
	"github.com/grafana/grafana-plugin-sdk-go/experimental/errorsource"
)

type GetTraceSummariesQueryData struct {
	Query  string `json:"query"`
	Region string `json:"region"`
}

func (ds *Datasource) getTraceSummariesForSingleQuery(ctx context.Context, query backend.DataQuery, pluginContext backend.PluginContext) backend.DataResponse {
	queryData := &GetTraceSummariesQueryData{}
	err := json.Unmarshal(query.JSON, queryData)

	if err != nil {
		return errorsource.Response(errorsource.PluginError(err, false))
	}

	xrayClient, err := ds.getClient(ctx, pluginContext, RequestSettings{Region: queryData.Region})
	if err != nil {
		return errorsource.Response(errorsource.PluginError(err, false))
	}

	log.DefaultLogger.Debug("getTraceSummariesForSingleQuery", "RefID", query.RefID, "query", queryData.Query)

	responseDataFrame := data.NewFrame(
		"TraceSummaries",
		data.NewField("Id", nil, []*string{}),
		data.NewField("Start Time", nil, []*time.Time{}),
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
	err = xrayClient.GetTraceSummariesPages(request, func(page *xray.GetTraceSummariesOutput, _ bool) bool {
		for _, summary := range page.TraceSummaries {
			annotationsCount := 0
			for _, val := range summary.Annotations {
				annotationsCount += len(val)
			}

			responseDataFrame.AppendRow(
				summary.Id,
				summary.StartTime,
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
		return errorsource.Response(errorsource.DownstreamError(err, false))
	}

	return backend.DataResponse{
		Frames: []*data.Frame{responseDataFrame},
	}
}
