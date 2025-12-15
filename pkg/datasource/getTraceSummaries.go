package datasource

import (
	"context"
	"encoding/json"
	"time"

	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/service/xray"
	"github.com/aws/aws-sdk-go-v2/service/xray/types"
	"github.com/grafana/grafana-plugin-sdk-go/backend"
	"github.com/grafana/grafana-plugin-sdk-go/backend/log"
	"github.com/grafana/grafana-plugin-sdk-go/data"
)

type GetTraceSummariesQueryData struct {
	Query   string   `json:"query"`
	Region  string   `json:"region"`
	Columns []string `json:"columns"`
}

// TraceSummaryColumn defines a column in the trace summaries response.
// The name is used for column selection, label is the display name.
type TraceSummaryColumn struct {
	name   string
	label  string
	config *data.FieldConfig
}

// traceSummaryColumns defines all available columns for trace summaries.
// Order matters - it determines the default column order when no columns are specified.
var traceSummaryColumns = []TraceSummaryColumn{
	{name: "Id", label: "Id", config: nil},
	{name: "StartTime", label: "Start Time", config: nil},
	{name: "Method", label: "Method", config: nil},
	{name: "Response", label: "Response", config: nil},
	{name: "ResponseTime", label: "Response Time", config: &data.FieldConfig{Unit: "s"}},
	{name: "Duration", label: "Duration", config: &data.FieldConfig{Unit: "s"}},
	{name: "URL", label: "URL", config: nil},
	{name: "ClientIP", label: "Client IP", config: nil},
	{name: "Annotations", label: "Annotations", config: nil},
	{name: "AnnotationsJSON", label: "Annotations JSON", config: nil},
}

func (ds *Datasource) getTraceSummariesForSingleQuery(ctx context.Context, query backend.DataQuery, pluginContext backend.PluginContext) backend.DataResponse {
	queryData := &GetTraceSummariesQueryData{}
	err := json.Unmarshal(query.JSON, queryData)

	if err != nil {
		return backend.ErrorResponseWithErrorSource(backend.PluginError(err))
	}

	xrayClient, err := ds.getClient(ctx, pluginContext, RequestSettings{Region: queryData.Region})
	if err != nil {
		return backend.ErrorResponseWithErrorSource(backend.PluginError(err))
	}

	log.DefaultLogger.Debug("getTraceSummariesForSingleQuery", "RefID", query.RefID, "query", queryData.Query)

	// Determine which columns to include
	var requestedColumns []TraceSummaryColumn
	if len(queryData.Columns) == 0 {
		// Default: all columns
		requestedColumns = traceSummaryColumns
	} else {
		// Filter to requested columns only
		columnMap := make(map[string]TraceSummaryColumn)
		for _, col := range traceSummaryColumns {
			columnMap[col.name] = col
		}
		for _, name := range queryData.Columns {
			if col, ok := columnMap[name]; ok {
				requestedColumns = append(requestedColumns, col)
			}
		}
	}

	// Build a set of included column names for quick lookup
	includedColumns := make(map[string]bool)
	for _, col := range requestedColumns {
		includedColumns[col.name] = true
	}

	// Create data frame fields dynamically based on requested columns
	var fields []*data.Field
	for _, col := range requestedColumns {
		var field *data.Field
		switch col.name {
		case "Id":
			field = data.NewField(col.label, nil, []*string{})
		case "StartTime":
			field = data.NewField(col.label, nil, []*time.Time{})
		case "Method":
			field = data.NewField(col.label, nil, []*string{})
		case "Response":
			field = data.NewField(col.label, nil, []*int32{})
		case "ResponseTime":
			field = data.NewField(col.label, nil, []*float64{})
		case "Duration":
			field = data.NewField(col.label, nil, []*float64{})
		case "URL":
			field = data.NewField(col.label, nil, []*string{})
		case "ClientIP":
			field = data.NewField(col.label, nil, []*string{})
		case "Annotations":
			field = data.NewField(col.label, nil, []*int64{})
		case "AnnotationsJSON":
			field = data.NewField(col.label, nil, []*string{})
		}
		if col.config != nil {
			field.SetConfig(col.config)
		}
		fields = append(fields, field)
	}

	responseDataFrame := data.NewFrame("TraceSummaries", fields...)

	var filterExpression *string
	if queryData.Query != "" {
		filterExpression = &queryData.Query
	}

	request := &xray.GetTraceSummariesInput{
		StartTime:        &query.TimeRange.From,
		EndTime:          &query.TimeRange.To,
		FilterExpression: filterExpression,
	}
	pager := xray.NewGetTraceSummariesPaginator(xrayClient, request)
	var pagerError error
	for pager.HasMorePages() {
		page, err := pager.NextPage(ctx)
		if err != nil {
			pagerError = err
			break
		}
		for _, summary := range page.TraceSummaries {
			// Compute annotation values only if needed
			var annotationsCount int64
			var annotationsJSON *string

			if includedColumns["Annotations"] || includedColumns["AnnotationsJSON"] {
				count := 0
				for _, val := range summary.Annotations {
					count += len(val)
				}
				annotationsCount = int64(count)

				// Serialise annotations to JSON if that column is included.
				// When multiple services in a trace record the same annotation key,
				// all values are preserved as an array.
				if includedColumns["AnnotationsJSON"] && len(summary.Annotations) > 0 {
					annotationsMap := make(map[string]any)
					for key, values := range summary.Annotations {
						if len(values) > 0 {
							var valArray []any
							for _, vws := range values {
								switch v := vws.AnnotationValue.(type) {
								case *types.AnnotationValueMemberStringValue:
									valArray = append(valArray, v.Value)
								case *types.AnnotationValueMemberNumberValue:
									valArray = append(valArray, v.Value)
								case *types.AnnotationValueMemberBooleanValue:
									valArray = append(valArray, v.Value)
								}
							}
							// Single value: store as scalar for simpler access
							// Multiple values: store as array to preserve all data
							if len(valArray) == 1 {
								annotationsMap[key] = valArray[0]
							} else {
								annotationsMap[key] = valArray
							}
						}
					}
					if jsonBytes, err := json.Marshal(annotationsMap); err == nil {
						annotationsJSON = aws.String(string(jsonBytes))
					}
				}
			}

			// Build row values in the same order as requestedColumns
			var rowValues []any
			for _, col := range requestedColumns {
				switch col.name {
				case "Id":
					rowValues = append(rowValues, summary.Id)
				case "StartTime":
					rowValues = append(rowValues, summary.StartTime)
				case "Method":
					rowValues = append(rowValues, summary.Http.HttpMethod)
				case "Response":
					rowValues = append(rowValues, summary.Http.HttpStatus)
				case "ResponseTime":
					rowValues = append(rowValues, summary.ResponseTime)
				case "Duration":
					rowValues = append(rowValues, summary.Duration)
				case "URL":
					rowValues = append(rowValues, summary.Http.HttpURL)
				case "ClientIP":
					rowValues = append(rowValues, summary.Http.ClientIp)
				case "Annotations":
					rowValues = append(rowValues, aws.Int64(annotationsCount))
				case "AnnotationsJSON":
					rowValues = append(rowValues, annotationsJSON)
				}
			}

			responseDataFrame.AppendRow(rowValues...)
		}

		count, err := responseDataFrame.RowLen()
		if err != nil {
			// This should not happen, if it does it's probably a programmatic error.
			log.DefaultLogger.Error("could not count the rows in response dataframe", "error", err)
		}
		// Hardcode to have similar limit to x-ray console.
		if count >= 1000 {
			break
		}
	}

	if pagerError != nil {
		log.DefaultLogger.Debug("getTraceSummariesForSingleQuery", "error", pagerError)
		return backend.ErrorResponseWithErrorSource(backend.DownstreamError(pagerError))
	}

	return backend.DataResponse{
		Frames: []*data.Frame{responseDataFrame},
	}
}
