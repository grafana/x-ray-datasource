package datasource

import (
	"context"
	"encoding/json"
	"fmt"
	"strings"
	"time"

	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/service/xray"
	"github.com/grafana/grafana-plugin-sdk-go/backend"
	"github.com/grafana/grafana-plugin-sdk-go/backend/log"
	"github.com/grafana/grafana-plugin-sdk-go/data"
	"golang.org/x/text/cases"
	"golang.org/x/text/language"
)

type GetInsightsQueryData struct {
	State  string      `json:"state"`
	Group  *xray.Group `json:"group"`
	Region string      `json:"region"`
}

func (ds *Datasource) getSingleInsight(ctx context.Context, query backend.DataQuery, pluginContext *backend.PluginContext) backend.DataResponse {
	queryData := &GetInsightsQueryData{}
	err := json.Unmarshal(query.JSON, queryData)
	if err != nil {
		return backend.DataResponse{
			Error: err,
		}
	}

	xrayClient, err := ds.getClient(ctx, pluginContext, RequestSettings{Region: queryData.Region})
	if err != nil {
		return backend.DataResponse{
			Error: err,
		}
	}

	var states = []string{strings.ToUpper(queryData.State)}

	log.DefaultLogger.Debug("getSingleInsight", "states", states, "group", queryData.Group)

	responseDataFrame := data.NewFrame(
		"InsightSummaries",
		data.NewField("InsightId", nil, []*string{}),
		data.NewField("Description", nil, []string{}),
		data.NewField("State", nil, []string{}),
		data.NewField("Categories", nil, []string{}),
		data.NewField("Duration", nil, []int64{}),
		data.NewField("Root cause service", nil, []string{}),
		data.NewField("Anomalous services", nil, []string{}),
		data.NewField("Group", nil, []*string{}),
		data.NewField("Start time", nil, []*time.Time{}),
	)

	if queryData.State == "All" || len(queryData.State) == 0 {
		states = nil
	}

	if aws.StringValue(queryData.Group.GroupName) == "All" {
		groups, err := getGroupsFromXray(xrayClient)

		if err != nil {
			return backend.DataResponse{
				Error: err,
			}
		}

		for _, group := range groups {
			err = getInsightSummary(xrayClient, query, states, group.GroupName, responseDataFrame)

			if err != nil {
				return backend.DataResponse{
					Error: err,
				}
			}
		}

	} else {
		err = getInsightSummary(xrayClient, query, states, queryData.Group.GroupName, responseDataFrame)
	}

	if err != nil {
		return backend.DataResponse{
			Error: err,
		}
	}

	return backend.DataResponse{
		Frames: []*data.Frame{responseDataFrame},
	}
}

func getInsightSummary(xrayClient XrayClient, query backend.DataQuery, states []string, groupName *string, responseDataFrame *data.Frame) error {
	insightsResponse, err := xrayClient.GetInsightSummaries(&xray.GetInsightSummariesInput{
		StartTime: &query.TimeRange.From,
		EndTime:   &query.TimeRange.To,
		States:    aws.StringSlice(states),
		GroupName: groupName,
	})

	if err != nil {
		log.DefaultLogger.Debug("GetInsightSummaries", "error", err)
		return err
	}

	for _, insight := range insightsResponse.InsightSummaries {

		rootCauseService := fmt.Sprintf("%s (%s)", aws.StringValue(insight.RootCauseServiceId.Name), aws.StringValue(insight.RootCauseServiceId.Type))
		anomalousService := fmt.Sprintf("%s (%s)", aws.StringValue(insight.TopAnomalousServices[0].ServiceId.Name), aws.StringValue(insight.TopAnomalousServices[0].ServiceId.Type))
		responseDataFrame.AppendRow(
			insight.InsightId,
			getDescription(insight, rootCauseService),
			cases.Title(language.Und).String(strings.ToLower(*insight.State)),
			getCategories(aws.StringValueSlice(insight.Categories)),
			getDuration(insight.StartTime, insight.EndTime),
			rootCauseService,
			anomalousService,
			insight.GroupName,
			insight.StartTime,
		)
	}
	return err
}

func getCategories(categories []string) string {
	for index, category := range categories {
		categories[index] = cases.Title(language.Und).String(strings.ToLower(category))
	}
	return strings.Join(categories, ", ")
}

func getDescription(insight *xray.InsightSummary, rootCauseService string) string {
	if insight.EndTime == nil {
		return aws.StringValue(insight.Summary)
	}

	description := strings.Split(aws.StringValue(insight.Summary), ".")[1]

	if description == "" {
		return "There were failures in " + rootCauseService + " due to " + *insight.Categories[0] + "."
	}

	return strings.TrimSpace(description) + "."
}

func getDuration(startTime *time.Time, endTime *time.Time) int64 {
	if endTime == nil {
		endTime = aws.Time(time.Now())
	}

	return int64(endTime.Sub(aws.TimeValue(startTime)) / time.Millisecond)
}
