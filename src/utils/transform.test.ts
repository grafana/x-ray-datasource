import { transformResponse } from './transform';

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
        error: true,
        http: {
          request: {
            url: 'http://3.23.148.72/signup',
            method: 'POST',
            user_agent:
              'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.97 Safari/537.36',
            client_ip: '80.98.253.126',
          },
          response: {
            status: 409,
            content_length: 0,
          },
        },
        aws: {
          ec2: {
            availability_zone: 'us-east-2b',
            instance_id: 'i-0ec3e264928bf8dba',
          },
        },
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
                content_length: 0,
              },
            },
            aws: {
              retries: 0,
              region: 'us-east-2',
              operation: 'PutItem',
              request_id: '21M4JN68EM661B8Q0MKFJHPHBBVV4KQNSO5AEMVJF66Q9ASUAAJG',
              table_name: 'awseb-e-cmpzepijzr-stack-StartupSignupsTable-SGJF3KIBUQNA',
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
                    {
                      path: '/var/app/current/node_modules/aws-sdk/lib/service.js',
                      line: 191,
                      label: 'features.constructor.makeRequest',
                    },
                    {
                      path: '/var/app/current/node_modules/aws-sdk/lib/service.js',
                      line: 451,
                      label: 'features.constructor.svc.<computed> [as putItem]',
                    },
                    {
                      path: '/var/app/current/app.js',
                      line: 74,
                      label: 'anonymous',
                    },
                    {
                      path: '/var/app/current/node_modules/express/lib/router/layer.js',
                      line: 95,
                      label: 'Layer.handle [as handle_request]',
                    },
                    {
                      path: '/var/app/current/node_modules/express/lib/router/route.js',
                      line: 131,
                      label: 'next',
                    },
                    {
                      path: '/var/app/current/node_modules/express/lib/router/route.js',
                      line: 112,
                      label: 'Route.dispatch',
                    },
                    {
                      path: '/var/app/current/node_modules/express/lib/router/layer.js',
                      line: 95,
                      label: 'Layer.handle [as handle_request]',
                    },
                    {
                      path: '/var/app/current/node_modules/express/lib/router/index.js',
                      line: 277,
                      label: 'anonymous',
                    },
                  ],
                },
              ],
            },
            subsegments: [
              {
                id: 'c3646754310b7ff3',
                name: '169.254.169.254',
                start_time: 1591872073.755,
                end_time: 1591872073.772,
                http: {
                  request: {
                    url: 'http://169.254.169.254/latest/meta-data/iam/security-credentials/',
                    method: 'GET',
                  },
                  response: {
                    status: 200,
                  },
                },
                namespace: 'remote',
                subsegments: [
                  {
                    id: 'c1b5a47d8c1fcf2b',
                    name: '169.254.169.254',
                    start_time: 1591872073.772,
                    end_time: 1591872073.773,
                    http: {
                      request: {
                        url:
                          'http://169.254.169.254/latest/meta-data/iam/security-credentials/xray-sample-SampleInstanceProfileRole-1N81PPD6M0EYP',
                        method: 'GET',
                      },
                      response: {
                        status: 200,
                      },
                    },
                    namespace: 'remote',
                  },
                ],
              },
            ],
          },
        ],
      },
      Id: 'eebec87ce4dd8225',
    },
    {
      Document: {
        id: '2913ae4223e931bb',
        name: '169.254.169.254',
        start_time: 1591872073.755,
        trace_id: '1-5ee20a4a-bab71b6bbc0660dba2adab3e',
        end_time: 1591872073.772,
        parent_id: 'c3646754310b7ff3',
        inferred: true,
        http: {
          request: {
            url: 'http://169.254.169.254/latest/meta-data/iam/security-credentials/',
            method: 'GET',
          },
          response: {
            status: 200,
          },
        },
      },
      Id: '2913ae4223e931bb',
    },
    {
      Document: {
        id: '11af695720598ac5',
        name: '169.254.169.254',
        start_time: 1591872073.772,
        trace_id: '1-5ee20a4a-bab71b6bbc0660dba2adab3e',
        end_time: 1591872073.773,
        parent_id: 'c1b5a47d8c1fcf2b',
        inferred: true,
        http: {
          request: {
            url:
              'http://169.254.169.254/latest/meta-data/iam/security-credentials/xray-sample-SampleInstanceProfileRole-1N81PPD6M0EYP',
            method: 'GET',
          },
          response: {
            status: 200,
          },
        },
      },
      Id: '11af695720598ac5',
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
        error: true,
        http: {
          response: {
            status: 400,
            content_length: 0,
          },
        },
        aws: {
          retries: 0,
          region: 'us-east-2',
          operation: 'PutItem',
          request_id: '21M4JN68EM661B8Q0MKFJHPHBBVV4KQNSO5AEMVJF66Q9ASUAAJG',
          table_name: 'awseb-e-cmpzepijzr-stack-StartupSignupsTable-SGJF3KIBUQNA',
          attribute_names_substituted: [],
          resource_names: ['awseb-e-cmpzepijzr-stack-StartupSignupsTable-SGJF3KIBUQNA'],
        },
        origin: 'AWS::DynamoDB::Table',
      },
      Id: '3f8b028e1847bc4c',
    },
  ],
};

const result = {
  processes: {
    '4ab39ad12cff04b5': {
      id: '4ab39ad12cff04b5',
      serviceName: 'DynamoDB',
      tags: [
        {
          key: 'region',
          type: 'string',
          value: 'us-east-2',
        },
        {
          key: 'operation',
          type: 'string',
          value: 'PutItem',
        },
        {
          key: 'request_id',
          type: 'string',
          value: '21M4JN68EM661B8Q0MKFJHPHBBVV4KQNSO5AEMVJF66Q9ASUAAJG',
        },
        {
          key: 'table_name',
          type: 'string',
          value: 'awseb-e-cmpzepijzr-stack-StartupSignupsTable-SGJF3KIBUQNA',
        },
        {
          key: 'resource_names',
          type: 'string',
          value: ['awseb-e-cmpzepijzr-stack-StartupSignupsTable-SGJF3KIBUQNA'],
        },
      ],
    },
    c1b5a47d8c1fcf2b: {
      id: 'c1b5a47d8c1fcf2b',
      serviceName: '169.254.169.254',
      tags: [],
    },
    c3646754310b7ff3: {
      id: 'c3646754310b7ff3',
      serviceName: '169.254.169.254',
      tags: [],
    },
    eebec87ce4dd8225: {
      id: 'eebec87ce4dd8225',
      serviceName: 'myfrontend-dev',
      tags: [
        {
          key: 'ec2',
          type: 'string',
          value: {
            availability_zone: 'us-east-2b',
            instance_id: 'i-0ec3e264928bf8dba',
          },
        },
      ],
    },
  },
  spans: [
    {
      duration: 48000,
      flags: 1,
      logs: [],
      operationName: 'AWS::EC2::Instance',
      processID: 'eebec87ce4dd8225',
      references: [],
      spanID: 'eebec87ce4dd8225',
      startTime: 1591872073754000,
      tags: undefined,
      traceID: '1-5ee20a4a-bab71b6bbc0660dba2adab3e',
      warnings: null,
    },
    {
      duration: 17000,
      flags: 1,
      logs: [],
      operationName: '',
      processID: 'c3646754310b7ff3',
      references: [],
      spanID: '2913ae4223e931bb',
      startTime: 1591872073755000,
      tags: undefined,
      traceID: '1-5ee20a4a-bab71b6bbc0660dba2adab3e',
      warnings: null,
    },
    {
      duration: 1000,
      flags: 1,
      logs: [],
      operationName: '',
      processID: 'c1b5a47d8c1fcf2b',
      references: [],
      spanID: '11af695720598ac5',
      startTime: 1591872073772000,
      tags: undefined,
      traceID: '1-5ee20a4a-bab71b6bbc0660dba2adab3e',
      warnings: null,
    },
    {
      duration: 47000,
      flags: 1,
      logs: [],
      operationName: 'AWS::DynamoDB::Table',
      processID: '4ab39ad12cff04b5',
      references: [],
      spanID: '3f8b028e1847bc4c',
      startTime: 1591872073754000,
      tags: undefined,
      traceID: '1-5ee20a4a-bab71b6bbc0660dba2adab3e',
      warnings: null,
    },
    {
      duration: 47000,
      flags: 1,
      logs: [],
      operationName: '',
      processID: '4ab39ad12cff04b5',
      references: [
        {
          refType: 'CHILD_OF',
          spanID: 'eebec87ce4dd8225',
          traceID: undefined,
        },
      ],
      spanID: '4ab39ad12cff04b5',
      startTime: 1591872073754000,
      tags: undefined,
      traceID: undefined,
      warnings: null,
    },
    {
      duration: 17000,
      flags: 1,
      logs: [],
      operationName: '',
      processID: 'c3646754310b7ff3',
      references: [
        {
          refType: 'CHILD_OF',
          spanID: '4ab39ad12cff04b5',
          traceID: undefined,
        },
      ],
      spanID: 'c3646754310b7ff3',
      startTime: 1591872073755000,
      tags: undefined,
      traceID: undefined,
      warnings: null,
    },
    {
      duration: 1000,
      flags: 1,
      logs: [],
      operationName: '',
      processID: 'c1b5a47d8c1fcf2b',
      references: [
        {
          refType: 'CHILD_OF',
          spanID: 'c3646754310b7ff3',
          traceID: undefined,
        },
      ],
      spanID: 'c1b5a47d8c1fcf2b',
      startTime: 1591872073772000,
      tags: undefined,
      traceID: undefined,
      warnings: null,
    },
  ],
  traceID: '1-5ee20a4a-bab71b6bbc0660dba2adab3e',
  warnings: null,
};

describe('transformResponse function', () => {
  it('should transform aws x-ray response to jaeger span', () => {
    expect(transformResponse(awsResponse as any)).toEqual(result);
  });
});
