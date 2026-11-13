package client

import (
	"context"
	"testing"

	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/grafana/grafana-aws-sdk/pkg/awsauth"
	"github.com/grafana/grafana-aws-sdk/pkg/awsds"
	"github.com/grafana/grafana-plugin-sdk-go/backend"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

type spyConfigProvider struct {
	captured awsauth.Settings
}

func (s *spyConfigProvider) GetConfig(_ context.Context, settings awsauth.Settings) (aws.Config, error) {
	s.captured = settings
	return aws.Config{}, nil
}

func TestGetAWSConfig_passesGrafanaExternalIDFields(t *testing.T) {
	spy := &spyConfigProvider{}
	origProvider := newAWSConfigProvider
	newAWSConfigProvider = func() awsauth.ConfigProvider { return spy }
	t.Cleanup(func() { newAWSConfigProvider = origProvider })

	usePerDS := true
	_, err := getAWSConfig(context.Background(), awsds.AWSDatasourceSettings{
		AuthType:                   awsds.AuthTypeGrafanaAssumeRole,
		DefaultRegion:              "us-east-1",
		AssumeRoleARN:              "arn:aws:iam::123456789012:role/test",
		GrafanaExternalID:          "stackABC-dsUid1",
		UsePerDatasourceExternalID: &usePerDS,
	}, backend.DataSourceInstanceSettings{})
	require.NoError(t, err)
	assert.Equal(t, "stackABC-dsUid1", spy.captured.GrafanaExternalID)
	require.NotNil(t, spy.captured.UsePerDatasourceExternalID)
	assert.True(t, *spy.captured.UsePerDatasourceExternalID)
}
