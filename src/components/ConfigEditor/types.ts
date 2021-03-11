import { AwsAuthType } from '@grafana/aws-sdk';
import { SelectableValue } from '@grafana/data';

export const awsAuthProviderOptions = [
  { label: 'AWS SDK Default', value: AwsAuthType.Default },
  { label: 'Access & secret key', value: AwsAuthType.Keys },
  { label: 'Credentials file', value: AwsAuthType.Credentials },
] as Array<SelectableValue<AwsAuthType>>;
