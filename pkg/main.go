package main

import (
	"os"

	"github.com/grafana/grafana-plugin-sdk-go/backend/datasource"
	"github.com/grafana/grafana-plugin-sdk-go/backend/log"
	xraydatasource "github.com/grafana/x-ray-datasource/pkg/datasource"
)

func main() {
	// Start listening to requests send from Grafana. This call is blocking so
	// it won't finish until Grafana shutsdown the process or the plugin choose
	// to exit close down by itself
	err := datasource.Serve(xraydatasource.GetServeOpts())

	// Log any error if we could start the plugin.
	if err != nil {
		log.DefaultLogger.Error(err.Error())
		os.Exit(1)
	}
}
