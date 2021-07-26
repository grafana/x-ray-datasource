import { transformTraceResponse } from './transform';

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

const result = {
  processes: {
    DynamoDB: {
      serviceName: 'DynamoDB',
      tags: [
        {
          key: 'name',
          type: 'string',
          value: 'DynamoDB',
        },
      ],
    },
    'myfrontend-dev': {
      serviceName: 'myfrontend-dev',
      tags: [
        {
          key: 'name',
          type: 'string',
          value: 'myfrontend-dev',
        },
      ],
    },
  },
  spans: [
    {
      duration: 47000,
      errorIconColor: '#FFC46E',
      flags: 1,
      logs: [],
      operationName: 'DynamoDB',
      processID: 'DynamoDB',
      references: [
        {
          refType: 'CHILD_OF',
          spanID: 'eebec87ce4dd8225',
          traceID: undefined,
        },
      ],
      spanID: '4ab39ad12cff04b5',
      stackTraces: [
        `ConditionalCheckFailedException: The conditional request failed
at features.constructor.captureAWSRequest [as customRequestHandler] (/var/app/current/node_modules/aws-xray-sdk/lib/patchers/aws_p.js:66)
at features.constructor.addAllRequestListeners (/var/app/current/node_modules/aws-sdk/lib/service.js:266)`,
        `UndefinedStackException: Undefined stack exception`,
      ],
      startTime: 1591872073754000,
      tags: [
        {
          key: 'aws.region',
          type: 'string',
          value: 'us-east-2',
        },
        {
          key: 'aws.resource_names[0]',
          type: 'string',
          value: 'awseb-e-cmpzepijzr-stack-StartupSignupsTable-SGJF3KIBUQNA',
        },
        {
          key: 'http.response.status',
          type: 'number',
          value: 400,
        },
        {
          key: 'in progress',
          type: 'boolean',
          value: false,
        },
        {
          key: 'error',
          type: 'boolean',
          value: true,
        },
      ],
      traceID: undefined,
    },
    {
      duration: 48000,
      errorIconColor: undefined,
      flags: 1,
      logs: [],
      operationName: 'myfrontend-dev',
      processID: 'myfrontend-dev',
      references: [
        {
          refType: 'CHILD_OF',
          spanID: 'myfrontend-devAWS::EC2::Instance',
          traceID: '1-5ee20a4a-bab71b6bbc0660dba2adab3e',
        },
      ],
      spanID: 'eebec87ce4dd8225',
      stackTraces: undefined,
      startTime: 1591872073754000,
      tags: [
        {
          key: 'annotations.theme',
          type: 'string',
          value: 'flatly',
        },
        {
          key: 'in progress',
          type: 'boolean',
          value: false,
        },
        {
          key: 'origin',
          type: 'string',
          value: 'AWS::EC2::Instance',
        },
      ],
      traceID: '1-5ee20a4a-bab71b6bbc0660dba2adab3e',
    },
    {
      duration: 47000,
      errorIconColor: undefined,
      flags: 1,
      logs: [],
      operationName: 'DynamoDB',
      processID: 'DynamoDB',
      references: [
        {
          refType: 'CHILD_OF',
          spanID: 'DynamoDBAWS::DynamoDB::Table',
          traceID: '1-5ee20a4a-bab71b6bbc0660dba2adab3e',
        },
      ],
      spanID: '3f8b028e1847bc4c',
      stackTraces: undefined,
      startTime: 1591872073754000,
      tags: [
        {
          key: 'metadata.http.dns.addresses[0].IP',
          type: 'string',
          value: '4.2.123.160',
        },
        {
          key: 'metadata.http.dns.addresses[1].IP',
          type: 'string',
          value: '22.23.14.122',
        },
        {
          key: 'in progress',
          type: 'boolean',
          value: false,
        },
        {
          key: 'origin',
          type: 'string',
          value: 'AWS::DynamoDB::Table',
        },
        {
          key: 'error',
          type: 'boolean',
          value: true,
        },
      ],
      traceID: '1-5ee20a4a-bab71b6bbc0660dba2adab3e',
    },
    {
      duration: 0,
      flags: 1,
      logs: [],
      operationName: 'AWS::EC2::Instance',
      processID: 'myfrontend-dev',
      spanID: 'myfrontend-devAWS::EC2::Instance',
      startTime: 1591872073754000,
      traceID: '1-5ee20a4a-bab71b6bbc0660dba2adab3e',
    },
    {
      duration: 0,
      flags: 1,
      logs: [],
      operationName: 'AWS::DynamoDB::Table',
      processID: 'DynamoDB',
      spanID: 'DynamoDBAWS::DynamoDB::Table',
      startTime: 1591872073754000,
      traceID: '1-5ee20a4a-bab71b6bbc0660dba2adab3e',
    },
  ],
  traceID: '1-5ee20a4a-bab71b6bbc0660dba2adab3e',
  warnings: null,
};

describe('transformResponse function', () => {
  it('should transform aws x-ray response to jaeger span', () => {
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

    expect(transformTraceResponse(aws as any).spans[1].duration).toBe(0);
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

    expect(transformTraceResponse(aws as any).spans[1].duration).toBe(0);
  });
});
