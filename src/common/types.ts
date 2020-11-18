import { DataSourceJsonData, SelectableValue } from '@grafana/data';

export enum AwsAuthType {
  Keys = 'keys',
  Credentials = 'credentials',
  Default = 'default', // was 'arn',
}

export interface AwsDataSourceJsonData extends DataSourceJsonData {
  authType?: AwsAuthType;
  assumeRoleArn?: string;
  externalId?: string;
  profile?: string; // Credentials profile name, as specified in ~/.aws/credentials
  defaultRegion?: string; // region if it is not defined by your credentials file
  endpoint?: string;
}

export interface AwsDataSourceSecureJsonData {
  accessKey?: string;
  secretKey?: string;
}

export const awsAuthProviderOptions = [
  { label: 'AWS SDK Default', value: AwsAuthType.Default },
  { label: 'Access & secret key', value: AwsAuthType.Keys },
  { label: 'Credentials file', value: AwsAuthType.Credentials },
] as Array<SelectableValue<AwsAuthType>>;
