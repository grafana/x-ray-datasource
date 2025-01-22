package datasource

import (
	"context"
	"encoding/json"
	"fmt"
	"reflect"
	"strings"
	"time"

	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/service/xray"
	xraytypes "github.com/aws/aws-sdk-go-v2/service/xray/types"
	"github.com/grafana/grafana-plugin-sdk-go/backend"
	"github.com/grafana/grafana-plugin-sdk-go/backend/log"
	"github.com/grafana/grafana-plugin-sdk-go/data"
)

type GetTimeSeriesServiceStatisticsQueryData struct {
	Query      string   `json:"query"`
	Columns    []string `json:"columns"`
	Resolution int32    `json:"resolution"`
	Region     string   `json:"region"`
}

type ValueDef struct {
	name      string
	label     string
	valueType interface{}
}

// Definition of possible columns. User can ask to see only some of them and we have to filter it here from the
// response.
var valueDefs = []ValueDef{
	{
		name:      "ErrorStatistics.ThrottleCount",
		label:     "Throttle Count",
		valueType: []*int64{},
	},
	{
		name:      "ErrorStatistics.TotalCount",
		label:     "Error Count",
		valueType: []*int64{},
	},
	{
		name:      "FaultStatistics.TotalCount",
		label:     "Fault Count",
		valueType: []*int64{},
	},
	{
		name:      "OkCount",
		label:     "Success Count",
		valueType: []*int64{},
	},
	{
		name:      "TotalCount",
		label:     "Total Count",
		valueType: []*int64{},
	},
	{
		name:      "Computed.AverageResponseTime",
		label:     "Average Response Time",
		valueType: []*float64{},
	},
}

func (ds *Datasource) getTimeSeriesServiceStatisticsForSingleQuery(ctx context.Context, query backend.DataQuery, pluginContext backend.PluginContext) backend.DataResponse {
	queryData := &GetTimeSeriesServiceStatisticsQueryData{}
	err := json.Unmarshal(query.JSON, queryData)

	if err != nil {
		return backend.ErrorResponseWithErrorSource(backend.PluginError(err))
	}

	xrayClient, err := ds.getClient(ctx, pluginContext, RequestSettings{Region: queryData.Region})
	if err != nil {
		return backend.ErrorResponseWithErrorSource(backend.PluginError(err))
	}

	log.DefaultLogger.Debug("getTimeSeriesServiceStatisticsForSingleQuery", "RefID", query.RefID, "query", queryData.Query)

	// First get the columns user actually wants. There is no query language for this so we filter it here after we get
	// the response.
	var requestedColumns []ValueDef
	// Preferred way to select all columns is to send empty array but "all" is here for backward compatibility
	if len(queryData.Columns) == 0 || queryData.Columns[0] == "all" {
		// Add all columns
		requestedColumns = valueDefs
	} else {
		valueDefMap := make(map[string]ValueDef)
		for _, val := range valueDefs {
			valueDefMap[val.name] = val
		}

		for _, name := range queryData.Columns {
			requestedColumns = append(requestedColumns, ValueDef{
				name:      name,
				label:     valueDefMap[name].label,
				valueType: valueDefMap[name].valueType,
			})
		}
	}

	// Create the data frames. Separate dataframe for each column. Not 100% this is needed to show each as separate
	// series.
	// TODO: check if it isn't simpler to create one dataframe with all the columns
	var frames []*data.Frame
	for _, value := range requestedColumns {
		frames = append(frames, data.NewFrame(
			"",
			// This needs to be called time so the default join in Explore works and knows which column to join on.
			data.NewField("Time", nil, []*time.Time{}),
			data.NewField(value.label, nil, value.valueType),
		))
	}

	resolution := int32(60)
	if queryData.Resolution != 0 {
		resolution = queryData.Resolution
	}

	// Make sure we do not send empty string as that is validation error in x-ray API.
	var entitySelectorExpression *string
	if queryData.Query != "" {
		entitySelectorExpression = &queryData.Query
	}

	request := &xray.GetTimeSeriesServiceStatisticsInput{
		StartTime:                &query.TimeRange.From,
		EndTime:                  &query.TimeRange.To,
		EntitySelectorExpression: entitySelectorExpression,
		Period:                   &resolution,
	}
	pager := xray.NewGetTimeSeriesServiceStatisticsPaginator(xrayClient, request)
	var pagerError error
	for pager.HasMorePages() {
		page, err := pager.NextPage(ctx)
		if err != nil {
			pagerError = err
			break
		}
		for _, statistics := range page.TimeSeriesServiceStatistics {
			// Use reflection to append values to correct data frame based on the requested columns.
			for i, column := range requestedColumns {
				var val reflect.Value

				// There seems to be cases when EdgeSummaryStatistics is nil. Not sure why it does not seem to be the case
				// in x-ray console so it is being investigated
				if statistics.EdgeSummaryStatistics != nil {
					val = reflect.ValueOf(statistics.EdgeSummaryStatistics)
				} else if statistics.ServiceSummaryStatistics != nil {
					val = reflect.ValueOf(statistics.ServiceSummaryStatistics)
				} else {
					// Hope this should not happen but I think skipping the row in that case should be safe for now.
					continue
				}

				parts := strings.Split(column.name, ".")
				if parts[0] == "Computed" {
					val = reflect.ValueOf(computeAggregation(parts[1], val.Interface()))
				} else {
					for _, part := range parts {
						val = reflect.Indirect(val).FieldByName(part)
					}
				}

				frames[i].AppendRow(
					statistics.Timestamp,
					val.Interface(),
				)
			}
		}
	}

	if pagerError != nil {
		return backend.ErrorResponseWithErrorSource(backend.DownstreamError(pagerError))
	}

	return backend.DataResponse{
		Frames: frames,
	}
}

// computeAggregation computes new values on top of the API.
// values is an interface{} because it can be either EdgeStatistics or ServiceStatistics and they are
// the same but are different types.
func computeAggregation(name string, values interface{}) interface{} {
	switch name {
	case "AverageResponseTime":
		return aws.Float64(*getResponseTime(values) / float64(*getTotalCount(values)))
	default:
		panic(fmt.Sprintf("Unknown computed column: %s", name))
	}
}

func getResponseTime(stats interface{}) *float64 {
	if val, ok := stats.(*xraytypes.EdgeStatistics); ok {
		return val.TotalResponseTime
	} else if val, ok := stats.(*xraytypes.ServiceStatistics); ok {
		return val.TotalResponseTime
	}
	panic("stats is not xray.EdgeStatistics nor xray.ServiceStatistics")
}

func getTotalCount(stats interface{}) *int64 {
	if val, ok := stats.(*xraytypes.EdgeStatistics); ok {
		return val.TotalCount
	} else if val, ok := stats.(*xraytypes.ServiceStatistics); ok {
		return val.TotalCount
	}
	panic("stats is not xray.EdgeStatistics nor xray.ServiceStatistics")
}
