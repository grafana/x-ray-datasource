import React from 'react';
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
import { defaultRegions } from './components/QueryEditor/useRegions';

const authProviderOptions = [
  { label: 'Access & secret key', value: 'keys' },
  { label: 'Credentials file', value: 'credentials' },
  { label: 'ARN', value: 'arn' },
] as SelectableValue[];

export type Props = DataSourcePluginOptionsEditorProps<XrayJsonData, XraySecureJsonData>;

export function ConfigEditor(props: Props) {
  const { options } = props;
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
                  delete props.options.jsonData.assumeRoleArn;
                }
                onUpdateDatasourceJsonDataOptionSelect(props, 'authType')(option);
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
                  onChange={onUpdateDatasourceJsonDataOptionSelect(props, 'profile')}
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
                      onClick={onUpdateDatasourceResetOption(props as any, 'accessKey')}
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
                      onChange={onUpdateDatasourceSecureJsonDataOption(props, 'accessKey')}
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
                      onClick={onUpdateDatasourceResetOption(props as any, 'secretKey')}
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
                      onChange={onUpdateDatasourceSecureJsonDataOption(props, 'secretKey')}
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
                  onChange={onUpdateDatasourceJsonDataOption(props, 'assumeRoleArn')}
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
            {/*Ideally we would use the useRegions hook and load it from AWS but there are some issues. We do not have*/}
            {/*access to the datasource and it may not have credentials at the moment so this is simple solution for*/}
            {/*now to use just the static regions here.*/}
            <Select
              className="width-30"
              value={defaultRegions.find(region => region.value === options.jsonData.defaultRegion)}
              options={defaultRegions}
              defaultValue={options.jsonData.defaultRegion}
              onChange={onUpdateDatasourceJsonDataOptionSelect(props, 'defaultRegion')}
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default ConfigEditor;
