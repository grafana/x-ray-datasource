package datasource

import (
	"context"
	"encoding/json"
	"fmt"
	xraytypes "github.com/aws/aws-sdk-go-v2/service/xray/types"
	"strings"
	"time"

	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/service/xray"
	"github.com/grafana/grafana-plugin-sdk-go/backend"
	"github.com/grafana/grafana-plugin-sdk-go/backend/log"
	"github.com/grafana/grafana-plugin-sdk-go/data"
	"golang.org/x/text/cases"
	"golang.org/x/text/language"
)

type GetInsightsQueryData struct {
	State  string           `json:"state"`
	Group  *xraytypes.Group `json:"group"`
	Region string           `json:"region"`
}

func (ds *Datasource) getSingleInsight(ctx context.Context, query backend.DataQuery, pluginContext backend.PluginContext) backend.DataResponse {
	queryData := &GetInsightsQueryData{}
	err := json.Unmarshal(query.JSON, queryData)
	if err != nil {
		return backend.ErrorResponseWithErrorSource(backend.PluginError(err))
	}

	xrayClient, err := ds.getClient(ctx, pluginContext, RequestSettings{Region: queryData.Region})
	if err != nil {
		return backend.ErrorResponseWithErrorSource(backend.PluginError(err))
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

	if Dereference(queryData.Group.GroupName) == "All" {
		groups, err := getGroupsFromXray(ctx, xrayClient)

		if err != nil {
			return backend.ErrorResponseWithErrorSource(err)
		}

		for _, group := range groups {
			err = getInsightSummary(ctx, xrayClient, query, states, group.GroupName, responseDataFrame)

			if err != nil {
				return backend.ErrorResponseWithErrorSource(err)
			}
		}

	} else {
		err = getInsightSummary(ctx, xrayClient, query, states, queryData.Group.GroupName, responseDataFrame)
		if err != nil {
			return backend.ErrorResponseWithErrorSource(err)
		}
	}

	return backend.DataResponse{
		Frames: []*data.Frame{responseDataFrame},
	}
}

func toInsightStates(states []string) []xraytypes.InsightState {
	out := make([]xraytypes.InsightState, len(states))
	for i, state := range states {
		out[i] = xraytypes.InsightState(state)
	}
	return out
}

// Dereference returns the value pointed at, if the pointer is not nil, else a zero value of type T
// TODO: move this somewhere common (maybe grafana-plugin-sdk-go?)
func Dereference[T any](p *T) T {
	var out T
	if p != nil {
		out = *p
	}
	return out
}

func getInsightSummary(ctx context.Context, xrayClient XrayClient, query backend.DataQuery, states []string, groupName *string, responseDataFrame *data.Frame) error {
	insightsResponse, err := xrayClient.GetInsightSummaries(ctx, &xray.GetInsightSummariesInput{
		StartTime: &query.TimeRange.From,
		EndTime:   &query.TimeRange.To,
		States:    toInsightStates(states),
		GroupName: groupName,
	})

	if err != nil {
		log.DefaultLogger.Debug("GetInsightSummaries", "error", err)
		return backend.DownstreamError(err)
	}

	for _, insight := range insightsResponse.InsightSummaries {

		rootCauseService := fmt.Sprintf("%s (%s)", Dereference(insight.RootCauseServiceId.Name), Dereference(insight.RootCauseServiceId.Type))
		anomalousService := fmt.Sprintf("%s (%s)", Dereference(insight.TopAnomalousServices[0].ServiceId.Name), Dereference(insight.TopAnomalousServices[0].ServiceId.Type))
		responseDataFrame.AppendRow(
			insight.InsightId,
			getDescription(insight, rootCauseService),
			cases.Title(language.Und).String(strings.ToLower(string(insight.State))),
			getCategories(insight.Categories),
			getDuration(insight.StartTime, insight.EndTime),
			rootCauseService,
			anomalousService,
			insight.GroupName,
			insight.StartTime,
		)
	}
	return nil
}

func getCategories(categories []xraytypes.InsightCategory) string {
	out := make([]string, len(categories))
	for index, category := range categories {
		out[index] = cases.Title(language.Und).String(strings.ToLower(string(category)))
	}
	return strings.Join(out, ", ")
}

func getDescription(insight xraytypes.InsightSummary, rootCauseService string) string {
	if insight.EndTime == nil {
		return Dereference(insight.Summary)
	}

	description := strings.Split(Dereference(insight.Summary), ".")[1]

	if description == "" {
		return fmt.Sprintf("There were failures in %s due to %s", rootCauseService, insight.Categories[0])
	}

	return strings.TrimSpace(description) + "."
}

func getDuration(startTime *time.Time, endTime *time.Time) int64 {
	if endTime == nil {
		endTime = aws.Time(time.Now())
	}

	return int64(endTime.Sub(Dereference(startTime)) / time.Millisecond)
}
