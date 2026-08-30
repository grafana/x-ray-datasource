package schema_test

import (
	_ "embed"
	"testing"

	"github.com/grafana/dsconfig/schema"
	"github.com/grafana/grafana-aws-sdk/pkg/awsds"
)

//go:embed dsconfig.json
var configSchemaJSON []byte

//go:generate go test -run TestPlugin -generateArtifacts
func TestPlugin(t *testing.T) {
	schema.RunPluginTests(t, schema.PluginUnderTest{
		ID:                "grafana-x-ray-datasource",
		ConfigSchemaJSON:  configSchemaJSON,
		SettingsJSONModel: awsds.AWSDatasourceSettings{},
		SecureKeys:        []string{"accessKey", "secretKey", "sessionToken"},
	})
}
