package datasource

import (
	"context"
	"encoding/json"
	"fmt"
	"strings"
	"time"

	"github.com/aws/aws-sdk-go/aws"
	"github.com/grafana/grafana-plugin-sdk-go/backend"
	"github.com/grafana/grafana-plugin-sdk-go/backend/log"
	"github.com/grafana/grafana-plugin-sdk-go/data"
	xray "github.com/grafana/x-ray-datasource/pkg/xray"
)

type GetInsightsQueryData struct {
	State string `json:"state"`
	Group string `json:"group"`
}

func (ds *Datasource) getInsights(ctx context.Context, req *backend.QueryDataRequest) (*backend.QueryDataResponse, error) {
	xrayClient, err := ds.xrayClientFactory(&req.PluginContext)
	if err != nil {
		return nil, err
	}

	response := &backend.QueryDataResponse{
		Responses: make(map[string]backend.DataResponse),
	}

	for _, query := range req.Queries {
		response.Responses[query.RefID] = getSingleInsight(xrayClient, query)
	}

	return response, nil
}

func getSingleInsight(xrayClient XrayClient, query backend.DataQuery) backend.DataResponse {
	queryData := &GetInsightsQueryData{}
	err := json.Unmarshal(query.JSON, queryData)

	if err != nil {
		return backend.DataResponse{
			Error: err,
		}
	}

	var states []string = []string{strings.ToUpper(queryData.State)}

	log.DefaultLogger.Debug("getSingleInsight", "states", states, "group", queryData.Group)

	if queryData.State == "All" || len(queryData.State) == 0 {
		states = nil
	}

	insightsResponse, err := xrayClient.GetInsightSummaries(&xray.GetInsightSummariesInput{
		StartTime: &query.TimeRange.From,
		EndTime:   &query.TimeRange.To,
		States:    aws.StringSlice(states),
		GroupName: aws.String("Grafana"),
	})

	if err != nil {
		log.DefaultLogger.Debug("GetInsightSummaries", "error", err)
		return backend.DataResponse{
			Error: err,
		}
	}

	responseDataFrame := data.NewFrame(
		"InsightSummaries",
		data.NewField("InsightId", nil, []*string{}),
		data.NewField("Description", nil, []string{}),
		data.NewField("Duration", nil, []int64{}),
		data.NewField("Root cause service", nil, []string{}),
		data.NewField("Anomalous services", nil, []string{}),
		data.NewField("Group", nil, []*string{}),
		data.NewField("Start time", nil, []*time.Time{}),
	)

	for _, insight := range insightsResponse.InsightSummaries {
		description := strings.Split(aws.StringValue(insight.Summary), ".")[1]
		description = strings.TrimSpace(description) + "."
		rootCauseService := fmt.Sprintf("%s (%s)", aws.StringValue(insight.RootCauseServiceId.Name), aws.StringValue(insight.RootCauseServiceId.Type))
		anomalousService := fmt.Sprintf("%s (%s)", aws.StringValue(insight.TopAnomalousServices[0].ServiceId.Name), aws.StringValue(insight.TopAnomalousServices[0].ServiceId.Type))
		responseDataFrame.AppendRow(
			insight.InsightId,
			description,
			int64(insight.EndTime.Sub(aws.TimeValue(insight.StartTime))/time.Millisecond),
			rootCauseService,
			anomalousService,
			insight.GroupName,
			insight.StartTime,
		)
	}

	return backend.DataResponse{
		Frames: []*data.Frame{responseDataFrame},
	}
}
