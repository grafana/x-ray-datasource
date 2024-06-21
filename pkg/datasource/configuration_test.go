package datasource

import (
	"testing"
	"time"

	"github.com/grafana/grafana-aws-sdk/pkg/awsds"
	"github.com/grafana/grafana-plugin-sdk-go/backend"
	"github.com/stretchr/testify/assert"
)

func Test_getDsSettings(t *testing.T) {
	awsSettings, err := getDsSettings(backend.DataSourceInstanceSettings{
		ID:               33,
		BasicAuthEnabled: false,
		JSONData: []byte(`{
      "profile": "some-profile",
      "region": "some-region",
      "assumeRoleARN": "some-assume-role-arn",
      "externalId": "some-external-id",
			"authType": "keys",
			"defaultDatabase": "sampleDB",
			"defaultMeasure": "speed",
			"defaultRegion": "us-west-2",
			"defaultTable": "IoT"
		  }`),
		DecryptedSecureJSONData: map[string]string{
			"accessKey":    "some-access-key",
			"secretKey":    "some-secret-key",
			"sessionToken": "some-session-token",
		},
		Updated: time.Time{},
	})

	assert.Nil(t, err)
	assert.Equal(t, awsds.AWSDatasourceSettings{
		Profile:       "some-profile",
		Region:        "some-region",
		AuthType:      2,
		AssumeRoleARN: "some-assume-role-arn",
		ExternalID:    "some-external-id",
		DefaultRegion: "us-west-2",
		AccessKey:     "some-access-key",
		SecretKey:     "some-secret-key",
		SessionToken:  "some-session-token",
	}, awsSettings)
}
