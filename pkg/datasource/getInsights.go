package datasource

import (
	"context"
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
	Query string `json:"query"`
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
	insightsResponse, err := xrayClient.GetInsightSummaries(&xray.GetInsightSummariesInput{
		StartTime: &query.TimeRange.From,
		EndTime:   &query.TimeRange.To,
		GroupName: aws.String("Grafana"),
	})

	if err != nil {
		log.DefaultLogger.Debug("GetInsightSummaries", "error", err)
		return backend.DataResponse{
			Error: err,
		}
	}

	if len(insightsResponse.InsightSummaries) == 0 {
		return backend.DataResponse{
			Error: fmt.Errorf("Insight not found"),
		}
	}

	responseDataFrame := data.NewFrame(
		"InsightSummaries",
		data.NewField("InsightId", nil, []*string{}),
		data.NewField("Description", nil, []string{}),
		data.NewField("Duration", nil, []int64{}),
		data.NewField("Root cause service", nil, []*string{}),
		data.NewField("Anomalous services", nil, []*string{}),
		data.NewField("Group", nil, []*string{}),
		data.NewField("Start time", nil, []*time.Time{}),
	)

	for _, insight := range insightsResponse.InsightSummaries {
		description := strings.Split(aws.StringValue(insight.Summary), ".")[1] + "."
		responseDataFrame.AppendRow(
			insight.InsightId,
			description,
			int64(insight.EndTime.Sub(aws.TimeValue(insight.StartTime))/time.Millisecond),
			insight.RootCauseServiceId.Name,
			insight.TopAnomalousServices[0].ServiceId.Name,
			insight.GroupName,
			insight.StartTime,
		)
	}

	return backend.DataResponse{
		Frames: []*data.Frame{responseDataFrame},
	}
}
