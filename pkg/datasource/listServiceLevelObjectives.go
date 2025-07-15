package datasource

import (
	"context"
	"encoding/json"
	"fmt"
	"sort"
	"strings"
	"time"

	"github.com/grafana/grafana-plugin-sdk-go/backend"
	"github.com/grafana/grafana-plugin-sdk-go/data"

	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/service/applicationsignals"
)

type ListServiceLevelObjectivesQueryData struct {
	Region                string `json:"region,omitempty"`
	ServiceString         string `json:"serviceString,omitempty"`
	OperationName         string `json:"operationName,omitempty"`
	IncludeLinkedAccounts bool   `json:"includeLinkedAccounts,omitempty"`
	AccountId             string `json:"accountId,omitempty"`
}

func (ds *Datasource) ListServiceLevelObjectives(ctx context.Context, query backend.DataQuery, pluginContext backend.PluginContext) backend.DataResponse {
	queryData := &ListServiceLevelObjectivesQueryData{}
	err := json.Unmarshal(query.JSON, queryData)
	if err != nil {
		return backend.ErrorResponseWithErrorSource(backend.PluginError(err))
	}

	if len(queryData.ServiceString) == 0 {
		return backend.ErrorResponseWithErrorSource(backend.DownstreamErrorf("Service not set on query"))
	}

	appSignalsClient, err := ds.getAppSignalsClient(ctx, pluginContext, RequestSettings{Region: queryData.Region})
	if err != nil {
		return backend.ErrorResponseWithErrorSource(backend.PluginError(err))
	}

	serviceMap := map[string]string{}
	err = json.Unmarshal([]byte(queryData.ServiceString), &serviceMap)
	if err != nil {
		return backend.ErrorResponseWithErrorSource(backend.PluginError(err))
	}

	input := applicationsignals.ListServiceLevelObjectivesInput{
		OperationName:         aws.String(queryData.OperationName),
		KeyAttributes:         serviceMap,
		IncludeLinkedAccounts: queryData.IncludeLinkedAccounts,
	}

	if input.IncludeLinkedAccounts {
		// only replace the value if accountId is set on the query
		if queryData.AccountId != "" && queryData.AccountId != "all" {
			input.KeyAttributes["AwsAccountId"] = queryData.AccountId
		}
	} else {
		if input.KeyAttributes["AwsAccountId"] != "" {
			// only include accountId attribute of the service if IncludeLinkedAccounts is true
			delete(input.KeyAttributes, "AwsAccountId")
		}

	}

	var listSLOsFrame = data.NewFrame(
		"ListServiceLevelObjectives",
		data.NewField("Name", nil, []*string{}),
		data.NewField("OperationName", nil, []*string{}),
		data.NewField("CreatedTime", nil, []*time.Time{}),
		data.NewField("KeyAttributes", nil, []*string{}),
	)

	pager := applicationsignals.NewListServiceLevelObjectivesPaginator(appSignalsClient, &input)
	var pagerError error

	for pager.HasMorePages() {
		output, err := pager.NextPage(ctx)
		if err != nil {
			pagerError = err
			break
		}

		for _, sloSummary := range output.SloSummaries {
			// sort the keys to ensure consistent ordering and testability
			sortedAttributeKeys := make([]string, 0, len(sloSummary.KeyAttributes))
			for k := range sloSummary.KeyAttributes {
				sortedAttributeKeys = append(sortedAttributeKeys, k)
			}
			sort.Strings(sortedAttributeKeys)

			// build key:value strings for sorted attributes
			attributePairs := make([]string, 0, len(sloSummary.KeyAttributes))
			for _, k := range sortedAttributeKeys {
				attributePairs = append(attributePairs, fmt.Sprintf("%s:%s", k, sloSummary.KeyAttributes[k]))
			}

			finalString := strings.Join(attributePairs, ", ")

			var sloAttrPairsPtr *string
			if len(finalString) > 0 {
				sloAttrPairsPtr = aws.String(finalString)
			}

			listSLOsFrame.AppendRow(
				sloSummary.Name,
				sloSummary.OperationName,
				sloSummary.CreatedTime,
				sloAttrPairsPtr,
			)
		}

	}
	if pagerError != nil {
		return backend.ErrorResponseWithErrorSource(backend.DownstreamError(pagerError))
	}

	return backend.DataResponse{
		Frames: data.Frames{listSLOsFrame},
	}
}
