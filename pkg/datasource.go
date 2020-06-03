package main

import (
  "context"
  "encoding/json"
  "fmt"
  "github.com/aws/aws-sdk-go/service/ec2"
  "github.com/aws/aws-sdk-go/service/xray"
  "github.com/grafana/simple-datasource-backend/pkg/configuration"
  "net/http"

  "github.com/grafana/grafana-plugin-sdk-go/backend"
  "github.com/grafana/grafana-plugin-sdk-go/backend/datasource"
  "github.com/grafana/grafana-plugin-sdk-go/backend/instancemgmt"
  "github.com/grafana/grafana-plugin-sdk-go/backend/log"
  "github.com/grafana/grafana-plugin-sdk-go/data"
)

// newDatasource returns datasource.ServeOpts.
func newDatasource() datasource.ServeOpts {
	// creates a instance manager for your plugin. The function passed
	// into `NewInstanceManger` is called when the instance is created
	// for the first time or when a datasource configuration changed.
	im := datasource.NewInstanceManager(newDataSourceInstance)
	ds := &SampleDatasource{
		im: im,
	}

	return datasource.ServeOpts{
		QueryDataHandler:   ds,
		CheckHealthHandler: ds,
	}
}

// SampleDatasource is an example datasource used to scaffold
// new datasource plugins with an backend.
type SampleDatasource struct {
	// The instance manager can help with lifecycle management
	// of datasource instances in plugins. It's not a requirements
	// but a best practice that we recommend that you follow.
	im instancemgmt.InstanceManager
}

// QueryData handles multiple queries and returns multiple responses.
// req contains the queries []DataQuery (where each query contains RefID as a unique identifer).
// The QueryDataResponse contains a map of RefID to the response for each query, and each response
// contains Frames ([]*Frame).
func (td *SampleDatasource) QueryData(ctx context.Context, req *backend.QueryDataRequest) (*backend.QueryDataResponse, error) {
	log.DefaultLogger.Info("QueryData", "request", req)

	// create response struct
	response := backend.NewQueryDataResponse()
  log.DefaultLogger.Info("QueryData 2")

	// loop over queries and execute them individually.
	for _, q := range req.Queries {
    log.DefaultLogger.Info("QueryData 3")
		res := td.query(ctx, q, &req.PluginContext)

		// save the response in a hashmap
		// based on with RefID as identifier
		response.Responses[q.RefID] = res
	}

	return response, nil
}

type queryModel struct {
	Type string `json:"type"`
  SubType string `json:"subtype"`
}

func (td *SampleDatasource) query(ctx context.Context, query backend.DataQuery, pluginContext *backend.PluginContext) backend.DataResponse {
	// Unmarshal the json into our queryModel
	var qm queryModel

	response := backend.DataResponse{}

  log.DefaultLogger.Info("query")
	response.Error = json.Unmarshal(query.JSON, &qm)
	if response.Error != nil {
		return response
	}

  switch qm.Type {
  case "getRegions":
    dsInfo, err := configuration.GetDatasourceInfo(pluginContext.DataSourceInstanceSettings, "default")
    if err != nil {
      return makeErrorResponse(err)
    }
    ec2Client, err := CreateEc2Client(dsInfo)
    if err != nil {
      return makeErrorResponse(err)
    }
    result, err := handleGetRegions(ec2Client)
    if err != nil {
      return backend.DataResponse{Error: err}
    }

    frame := data.NewFrame("response")

    // add values
    frame.Fields = append(frame.Fields,
      data.NewField("regions", nil, result),
    )

    // add the frames to the response
    response.Frames = append(response.Frames, frame)
    return response
  default:
    return backend.DataResponse{Error: fmt.Errorf("unknown query type")}
  }
}

// CheckHealth handles health checks sent from Grafana to the plugin.
// The main use case for these health checks is the test button on the
// datasource configuration page which allows users to verify that
// a datasource is working as expected.
func (td *SampleDatasource) CheckHealth(ctx context.Context, req *backend.CheckHealthRequest) (*backend.CheckHealthResult, error) {
	var status = backend.HealthStatusOk
	var message = "Data source is working"

  dsInfo, err := configuration.GetDatasourceInfo(req.PluginContext.DataSourceInstanceSettings, "default")
  if err != nil {
    // TODO: not sure if this is correct or CheckHealthResult should also be sent back
    return nil, err
  }

  client, err := CreateXrayClient(dsInfo)
  if err != nil {
    return &backend.CheckHealthResult{
      Status:  backend.HealthStatusError,
      Message: err.Error(),
    }, err
  }

	_, err = client.GetGroups(&xray.GetGroupsInput{})
	if err != nil {
    return &backend.CheckHealthResult{
      Status:  backend.HealthStatusError,
      Message: err.Error(),
    }, err
  }

	return &backend.CheckHealthResult{
		Status:  status,
		Message: message,
	}, nil
}

type instanceSettings struct {
	httpClient *http.Client
}

func newDataSourceInstance(setting backend.DataSourceInstanceSettings) (instancemgmt.Instance, error) {
	return &instanceSettings{
		httpClient: &http.Client{},
	}, nil
}

func (s *instanceSettings) Dispose() {
	// Called before creatinga a new instance to allow plugin authors
	// to cleanup.
}

func handleGetRegions(ec2Client *ec2.EC2) ([]string, error) {
  log.DefaultLogger.Info("handleGetRegions")
  response, err := ec2Client.DescribeRegions(&ec2.DescribeRegionsInput{})
  if err != nil {
    return nil, err
  }
  regions := make([]string, len(response.Regions))
  for _, reg := range response.Regions {
    regions = append(regions, *reg.RegionName)
  }

  return regions, nil
}

func makeErrorResponse(err error) backend.DataResponse {
  return backend.DataResponse{
    Error: err,
  }
}
