import React, { PureComponent } from 'react';
import { InlineFormLabel, LegacyForms, Button } from '@grafana/ui';
const { Select, Input } = LegacyForms;
import {
  DataSourcePluginOptionsEditorProps,
  onUpdateDatasourceJsonDataOptionSelect,
  onUpdateDatasourceResetOption,
  onUpdateDatasourceJsonDataOption,
  onUpdateDatasourceSecureJsonDataOption,
} from '@grafana/data';
import { SelectableValue } from '@grafana/data';
import { XrayJsonData, XraySecureJsonData } from './types';

const authProviderOptions = [
  { label: 'Access & secret key', value: 'keys' },
  { label: 'Credentials file', value: 'credentials' },
  { label: 'ARN', value: 'arn' },
] as SelectableValue[];

export type Props = DataSourcePluginOptionsEditorProps<XrayJsonData, XraySecureJsonData>;

export interface State {
  regions: SelectableValue[];
}

export class ConfigEditor extends PureComponent<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      // TODO: we have an api to load this but the problem is at this moment we do not have credentials. We will have
      //  them on the backend after saving the datasource
      regions: defaultRegions.map((region: string) => ({
        value: region,
        label: region,
      })),
    };
  }

  render() {
    const { regions } = this.state;
    const { options } = this.props;
    const secureJsonData = (options.secureJsonData || {}) as XraySecureJsonData;

    return (
      <>
        <h3 className="page-heading">X-Ray Details</h3>
        <div className="gf-form-group">
          <div className="gf-form-inline">
            <div className="gf-form">
              <InlineFormLabel className="width-14">Auth Provider</InlineFormLabel>
              <Select
                className="width-30"
                value={authProviderOptions.find(authProvider => authProvider.value === options.jsonData.authType)}
                options={authProviderOptions}
                defaultValue={options.jsonData.authType}
                onChange={option => {
                  if (options.jsonData.authType === 'arn' && option.value !== 'arn') {
                    delete this.props.options.jsonData.assumeRoleArn;
                  }
                  onUpdateDatasourceJsonDataOptionSelect(this.props, 'authType')(option);
                }}
              />
            </div>
          </div>
          {options.jsonData.authType === 'credentials' && (
            <div className="gf-form-inline">
              <div className="gf-form">
                <InlineFormLabel
                  className="width-14"
                  tooltip="Credentials profile name, as specified in ~/.aws/credentials, leave blank for default."
                >
                  Credentials Profile Name
                </InlineFormLabel>
                <div className="width-30">
                  <Input
                    className="width-30"
                    placeholder="default"
                    value={options.jsonData.database}
                    onChange={onUpdateDatasourceJsonDataOptionSelect(this.props, 'profile')}
                  />
                </div>
              </div>
            </div>
          )}
          {options.jsonData.authType === 'keys' && (
            <div>
              {options.secureJsonFields?.accessKey ? (
                <div className="gf-form-inline">
                  <div className="gf-form">
                    <InlineFormLabel className="width-14">Access Key ID</InlineFormLabel>
                    <Input className="width-25" placeholder="Configured" disabled={true} />
                  </div>
                  <div className="gf-form">
                    <div className="max-width-30 gf-form-inline">
                      <Button
                        variant="secondary"
                        type="button"
                        onClick={onUpdateDatasourceResetOption(this.props as any, 'accessKey')}
                      >
                        Reset
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="gf-form-inline">
                  <div className="gf-form">
                    <InlineFormLabel className="width-14">Access Key ID</InlineFormLabel>
                    <div className="width-30">
                      <Input
                        className="width-30"
                        value={secureJsonData.accessKey || ''}
                        onChange={onUpdateDatasourceSecureJsonDataOption(this.props, 'accessKey')}
                      />
                    </div>
                  </div>
                </div>
              )}
              {options.secureJsonFields?.secretKey ? (
                <div className="gf-form-inline">
                  <div className="gf-form">
                    <InlineFormLabel className="width-14">Secret Access Key</InlineFormLabel>
                    <Input className="width-25" placeholder="Configured" disabled={true} />
                  </div>
                  <div className="gf-form">
                    <div className="max-width-30 gf-form-inline">
                      <Button
                        variant="secondary"
                        type="button"
                        onClick={onUpdateDatasourceResetOption(this.props as any, 'secretKey')}
                      >
                        Reset
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="gf-form-inline">
                  <div className="gf-form">
                    <InlineFormLabel className="width-14">Secret Access Key</InlineFormLabel>
                    <div className="width-30">
                      <Input
                        className="width-30"
                        value={secureJsonData.secretKey || ''}
                        onChange={onUpdateDatasourceSecureJsonDataOption(this.props, 'secretKey')}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
          {options.jsonData.authType === 'arn' && (
            <div className="gf-form-inline">
              <div className="gf-form">
                <InlineFormLabel className="width-14" tooltip="ARN of Assume Role">
                  Assume Role ARN
                </InlineFormLabel>
                <div className="width-30">
                  <Input
                    className="width-30"
                    placeholder="arn:aws:iam:*"
                    value={options.jsonData.assumeRoleArn || ''}
                    onChange={onUpdateDatasourceJsonDataOption(this.props, 'assumeRoleArn')}
                  />
                </div>
              </div>
            </div>
          )}
          <div className="gf-form-inline">
            <div className="gf-form">
              <InlineFormLabel
                className="width-14"
                tooltip="Specify the region, such as for US West (Oregon) use ` us-west-2 ` as the region."
              >
                Default Region
              </InlineFormLabel>
              <Select
                className="width-30"
                value={regions.find(region => region.value === options.jsonData.defaultRegion)}
                options={regions}
                defaultValue={options.jsonData.defaultRegion}
                onChange={onUpdateDatasourceJsonDataOptionSelect(this.props, 'defaultRegion')}
              />
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default ConfigEditor;

const defaultRegions = [
  'ap-east-1',
  'ap-northeast-1',
  'ap-northeast-2',
  'ap-northeast-3',
  'ap-south-1',
  'ap-southeast-1',
  'ap-southeast-2',
  'ca-central-1',
  'cn-north-1',
  'cn-northwest-1',
  'eu-central-1',
  'eu-north-1',
  'eu-west-1',
  'eu-west-2',
  'eu-west-3',
  'me-south-1',
  'sa-east-1',
  'us-east-1',
  'us-east-2',
  'us-gov-east-1',
  'us-gov-west-1',
  'us-iso-east-1',
  'us-isob-east-1',
  'us-west-1',
  'us-west-2',
];
