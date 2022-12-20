import { transformTraceResponse } from './transform';
import { DataFrameView, FieldType, MutableDataFrame } from '@grafana/data';

const awsResponse = {
  Duration: 0.048,
  Id: '1-5ee20a4a-bab71b6bbc0660dba2adab3e',
  Segments: [
    {
      Document: {
        id: 'eebec87ce4dd8225',
        name: 'myfrontend-dev',
        start_time: 1591872073.754,
        trace_id: '1-5ee20a4a-bab71b6bbc0660dba2adab3e',
        end_time: 1591872073.802,
        annotations: {
          theme: 'flatly',
        },
        origin: 'AWS::EC2::Instance',
        subsegments: [
          {
            id: '4ab39ad12cff04b5',
            name: 'DynamoDB',
            start_time: 1591872073.754,
            end_time: 1591872073.801,
            error: true,
            http: {
              response: {
                status: 400,
              },
            },
            aws: {
              retries: 0,
              region: 'us-east-2',
              attribute_names_substituted: [],
              resource_names: ['awseb-e-cmpzepijzr-stack-StartupSignupsTable-SGJF3KIBUQNA'],
            },
            namespace: 'aws',
            cause: {
              working_directory: '/var/app/current',
              exceptions: [
                {
                  message: 'The conditional request failed',
                  type: 'ConditionalCheckFailedException',
                  stack: [
                    {
                      path: '/var/app/current/node_modules/aws-xray-sdk/lib/patchers/aws_p.js',
                      line: 66,
                      label: 'features.constructor.captureAWSRequest [as customRequestHandler]',
                    },
                    {
                      path: '/var/app/current/node_modules/aws-sdk/lib/service.js',
                      line: 266,
                      label: 'features.constructor.addAllRequestListeners',
                    },
                  ],
                },
                {
                  message: 'Undefined stack exception',
                  type: 'UndefinedStackException',
                  stack: undefined,
                },
              ],
            },
          },
        ],
      },
      Id: 'eebec87ce4dd8225',
    },
    {
      Document: {
        id: '3f8b028e1847bc4c',
        name: 'DynamoDB',
        start_time: 1591872073.754,
        trace_id: '1-5ee20a4a-bab71b6bbc0660dba2adab3e',
        end_time: 1591872073.801,
        parent_id: '4ab39ad12cff04b5',
        inferred: true,
        error: false,
        fault: true,
        metadata: {
          http: {
            dns: {
              addresses: [
                {
                  Zone: '',
                  IP: '4.2.123.160',
                },
                {
                  Zone: '',
                  IP: '22.23.14.122',
                },
              ],
            },
          },
        },
        origin: 'AWS::DynamoDB::Table',
      },
      Id: '3f8b028e1847bc4c',
    },
  ],
};

const result = new MutableDataFrame({
  fields: [
    {
      name: 'traceID',
      config: {},
      values: [
        '1-5ee20a4a-bab71b6bbc0660dba2adab3e',
        '1-5ee20a4a-bab71b6bbc0660dba2adab3e',
        undefined,
        '1-5ee20a4a-bab71b6bbc0660dba2adab3e',
        '1-5ee20a4a-bab71b6bbc0660dba2adab3e',
      ],
    },
    {
      name: 'spanID',
      config: {},
      values: [
        'myfrontend-devAWS::EC2::Instance',
        'eebec87ce4dd8225',
        '4ab39ad12cff04b5',
        'DynamoDBAWS::DynamoDB::Table',
        '3f8b028e1847bc4c',
      ],
    },
    {
      name: 'parentSpanID',
      type: FieldType.string,
      config: {},
      values: [
        undefined,
        'myfrontend-devAWS::EC2::Instance',
        'eebec87ce4dd8225',
        undefined,
        'DynamoDBAWS::DynamoDB::Table',
      ],
    },
    {
      name: 'operationName',
      config: {},
      values: ['AWS::EC2::Instance', 'myfrontend-dev', 'DynamoDB', 'AWS::DynamoDB::Table', 'DynamoDB'],
    },
    {
      name: 'serviceName',
      config: {},
      values: ['myfrontend-dev', 'myfrontend-dev', 'myfrontend-dev', 'DynamoDB', 'DynamoDB'],
    },
    {
      name: 'serviceTags',
      config: {},
      values: [
        [
          {
            key: 'name',
            value: 'myfrontend-dev',
          },
        ],
        [
          {
            key: 'name',
            value: 'myfrontend-dev',
          },
        ],
        [
          {
            key: 'name',
            value: 'myfrontend-dev',
          },
        ],
        [
          {
            key: 'name',
            value: 'DynamoDB',
          },
        ],
        [
          {
            key: 'name',
            value: 'DynamoDB',
          },
        ],
      ],
    },
    {
      name: 'startTime',
      config: {},
      values: [1591872073754, 1591872073754, 1591872073754, 1591872073754, 1591872073754],
    },
    {
      name: 'duration',
      config: {},
      values: [0, 48, 47, 0, 47],
    },
    {
      name: 'logs',
      config: {},
      values: [[], [], [], [], []],
    },
    {
      name: 'tags',
      config: {},
      values: [
        undefined,
        [
          {
            key: 'annotations.theme',
            value: 'flatly',
          },
          {
            key: 'in progress',
            value: false,
          },
          {
            key: 'origin',
            value: 'AWS::EC2::Instance',
          },
        ],
        [
          {
            key: 'aws.region',
            value: 'us-east-2',
          },
          {
            key: 'aws.resource_names[0]',
            value: 'awseb-e-cmpzepijzr-stack-StartupSignupsTable-SGJF3KIBUQNA',
          },
          {
            key: 'http.response.status',
            value: 400,
          },
          {
            key: 'in progress',
            value: false,
          },
          {
            key: 'error',
            value: true,
          },
        ],
        undefined,
        [
          {
            key: 'metadata.http.dns.addresses[0].IP',
            value: '4.2.123.160',
          },
          {
            key: 'metadata.http.dns.addresses[1].IP',
            value: '22.23.14.122',
          },
          {
            key: 'in progress',
            value: false,
          },
          {
            key: 'origin',
            value: 'AWS::DynamoDB::Table',
          },
          {
            key: 'error',
            value: true,
          },
        ],
      ],
    },
    {
      name: 'warnings',
      config: {},
      values: [undefined, undefined, undefined, undefined, undefined],
    },
    {
      name: 'stackTraces',
      config: {},
      values: [
        undefined,
        undefined,
        [
          'ConditionalCheckFailedException: The conditional request failed\nat features.constructor.captureAWSRequest [as customRequestHandler] (/var/app/current/node_modules/aws-xray-sdk/lib/patchers/aws_p.js:66)\nat features.constructor.addAllRequestListeners (/var/app/current/node_modules/aws-sdk/lib/service.js:266)',
          'UndefinedStackException: Undefined stack exception',
        ],
        undefined,
        undefined,
      ],
    },
    {
      name: 'errorIconColor',
      type: FieldType.string,
      config: {},
      values: [undefined, undefined, '#FFC46E', undefined, undefined],
    },
    {
      config: {},
      labels: undefined,
      name: '__log_group',
      type: FieldType.string,
      values: ['', '', '', '', ''],
    },
    {
      config: {},
      labels: undefined,
      name: '__request_id',
      type: FieldType.string,
      values: [undefined, undefined, undefined, undefined, undefined],
    },
  ],
  meta: {
    preferredVisualisationType: 'trace',
  },
});

describe('transformResponse function', () => {
  it('should transform aws x-ray response to correct format', () => {
    expect(transformTraceResponse(awsResponse as any)).toEqual(result);
  });

  it("should handle response that is in progress (doesn't have an end time)", () => {
    const aws = {
      Id: '1-5efdaeaa-f2a07d044bad19595ac13935',
      Segments: [
        {
          Document: {
            id: '5c6cc52b0685e278',
            name: 'myfrontend-dev',
            origin: 'AWS::EC2::Instance',
            subsegments: [
              {
                id: 'e5ea9d95ecda4d8a',
                name: 'response',
                start_time: 1595878288.1899369,
                in_progress: true,
              },
            ],
          },
        },
      ],
    };

    const view = new DataFrameView(transformTraceResponse(aws as any));
    expect(view.get(1).duration).toBe(0);
  });

  it('should handle response without full url', () => {
    const aws = {
      Id: '1-5efdaeaa-f2a07d044bad19595ac13935',
      Segments: [
        {
          Document: {
            id: '5c6cc52b0685e278',
            name: 'myfrontend-dev',
            origin: 'AWS::EC2::Instance',
            http: {
              request: {
                url: '/path/something',
              },
            },
            subsegments: [
              {
                id: 'e5ea9d95ecda4d8a',
                name: 'response',
                start_time: 1595878288.1899369,
                in_progress: true,
              },
            ],
          },
        },
      ],
    };

    const view = new DataFrameView(transformTraceResponse(aws as any));
    expect(view.get(1).duration).toBe(0);
  });
});
