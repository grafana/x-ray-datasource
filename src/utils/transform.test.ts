import { transformTraceResponse } from './transform';
import { DataFrameView, FieldType, MutableDataFrame } from '@grafana/data';
import { XrayTraceData } from 'types';

const awsResponse: XrayTraceData = {
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
                  id: 'exception-1',
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
                  id: 'exception-2',
                  message: 'Undefined stack exception',
                  type: 'UndefinedStackException',
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

const awsResponseWithSql: XrayTraceData = {
  Duration: 0.078,
  Id: '1-12345678-1234567890abcdefghijklmn',
  Segments: [
    {
      Document: {
        id: 'fakeid11111111aaaaaaaa',
        name: 'PetSite',
        start_time: 1675191925.672884,
        trace_id: '1-12345678-1234567890abcdefghijklmn',
        end_time: 1675191925.750568,
        http: {
          request: {
            url: 'http://fake-servi-petsi.us-east-2.elb.amazonaws.com/housekeeping/',
            method: 'GET',
            client_ip: '203.0.113.0',
            x_forwarded_for: true,
          },
          response: {
            status: 200,
          },
        },
        aws: {
          xray: {
            sampling_rule_name: 'Default',
            sdk_version: '2.10.1',
            sdk: 'X-Ray for .NET Core',
          },
        },
        subsegments: [
          {
            id: 'fakeid22222222bbbbbbbb',
            name: 'fake-servi-payfo.us-east-2.elb.amazonaws.com',
            start_time: 1675191925.673018,
            end_time: 1675191925.721133,
            http: {
              request: {
                url: 'http://fake-servi-payfo.us-east-2.elb.amazonaws.com/api/home/cleanupadoptions',
                method: 'POST',
              },
              response: {
                status: 200,
                content_length: 0,
              },
            },
            namespace: 'remote',
          },
          {
            id: 'fakeid33333333cccccccc',
            name: 'SimpleSystemsManagement',
            start_time: 1675191925.722149,
            end_time: 1675191925.750047,
            http: {
              response: {
                status: 200,
                content_length: 210,
              },
            },
            aws: {
              region: 'us-east-2',
              request_id: '164f6465-12fa-48a5-852c-2529d4b0d6d3',
              operation: 'GetParameter',
            },
            namespace: 'aws',
          },
        ],
      },
      Id: 'fakeid11111111aaaaaaaa',
    },
    {
      Document: {
        id: 'fakeid44444444dddddddd',
        name: 'payforadoption',
        start_time: 1675191925.6815343,
        trace_id: '1-12345678-1234567890abcdefghijklmn',
        end_time: 1675191925.7197223,
        parent_id: 'fakeid22222222bbbbbbbb',
        http: {
          request: {
            url: 'http://fake-servi-payfo.us-east-2.elb.amazonaws.com/api/home/cleanupadoptions',
            method: 'POST',
            client_ip: '203.0.113.0',
            x_forwarded_for: true,
          },
          response: {
            status: 200,
          },
        },
        aws: {
          ecs: {
            container: 'ip-203-0-113-0.us-east-2.compute.internal',
          },
          xray: {
            sdk_version: '1.7.0',
            sdk: 'X-Ray for Go',
          },
        },
        metadata: {
          default: {
            timeTakenSeconds: 0.038097434,
          },
        },
        origin: 'AWS::ECS::Container',
        subsegments: [
          {
            id: 'fakeid55555555eeeeeeee',
            name: 'adoptions@fake-services-database.fake-cluster.us-east-2.rds.amazonaws.com',
            start_time: 1675191925.7173781,
            end_time: 1675191925.7185402,
            sql: {
              url: 'postgres://postgres@fake-services-database.fake-cluster..us-east-2.rds.amazonaws.com:5432/adoptions',
              sanitized_query: 'INSERT INTO transactions_history SELECT * FROM transactions',
              database_type: 'Postgres',
              database_version:
                'PostgreSQL 10.18 on x86_64-pc-linux-gnu, compiled by x86_64-pc-linux-gnu-gcc (GCC) 7.4.0, 64-bit',
              driver_version: 'github.com/lib/pq',
              user: 'postgres',
            },
            namespace: 'remote',
          },
        ],
      },
      Id: 'fakeid44444444dddddddd',
    },
    {
      Document: {
        id: 'fakeid66666666ffffffff',
        name: 'adoptions@fake-services-database.fake-cluster.us-east-2.rds.amazonaws.com',
        start_time: 1675191925.7173781,
        trace_id: '1-12345678-1234567890abcdefghijklmn',
        end_time: 1675191925.7185402,
        parent_id: 'fakeid55555555eeeeeeee',
        inferred: true,
        sql: {
          url: 'postgres://postgres@fake-services-database.fake-cluster..us-east-2.rds.amazonaws.com:5432/adoptions',
          sanitized_query: 'INSERT INTO transactions_history SELECT * FROM transactions',
          database_type: 'Postgres',
          database_version:
            'PostgreSQL 10.18 on x86_64-pc-linux-gnu, compiled by x86_64-pc-linux-gnu-gcc (GCC) 7.4.0, 64-bit',
          driver_version: 'github.com/lib/pq',
          user: 'postgres',
        },
        origin: 'Database::SQL',
      },
      Id: 'fakeid66666666ffffffff',
    },

    {
      Document: {
        id: 'fakeid77777777gggggggg',
        name: 'SimpleSystemsManagement',
        start_time: 1675191925.722149,
        trace_id: '1-12345678-1234567890abcdefghijklmn',
        end_time: 1675191925.750047,
        parent_id: 'fakeid33333333cccccccc',
        inferred: true,
        http: {
          response: {
            status: 200,
            content_length: 210,
          },
        },
        aws: {
          region: 'us-east-2',
          request_id: '164f6465-12fa-48a5-852c-2529d4b0d6d3',
          operation: 'GetParameter',
        },
        origin: 'AWS::SimpleSystemsManagement',
      },
      Id: 'fakeid77777777gggggggg',
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
        '1-5ee20a4a-bab71b6bbc0660dba2adab3e',
        '1-5ee20a4a-bab71b6bbc0660dba2adab3e',
        '',
      ],
    },
    {
      name: 'spanID',
      config: {},
      values: [
        'myfrontend-devAWS::EC2::Instance',
        'DynamoDBAWS::DynamoDB::Table',
        'eebec87ce4dd8225',
        '3f8b028e1847bc4c',
        '4ab39ad12cff04b5',
      ],
    },
    {
      name: 'parentSpanID',
      config: {},
      values: [
        undefined,
        undefined,
        'myfrontend-devAWS::EC2::Instance',
        'DynamoDBAWS::DynamoDB::Table',
        'eebec87ce4dd8225',
      ],
    },
    {
      name: 'operationName',
      config: {},
      values: ['AWS::EC2::Instance', 'AWS::DynamoDB::Table', 'myfrontend-dev', 'DynamoDB', 'DynamoDB'],
    },
    {
      name: 'serviceName',
      config: {},
      values: ['myfrontend-dev', 'DynamoDB', 'myfrontend-dev', 'DynamoDB', 'myfrontend-dev'],
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
            value: 'DynamoDB',
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
            value: 'myfrontend-dev',
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
      values: [0, 0, 48, 47, 47],
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
        undefined,
        undefined,
        [
          'ConditionalCheckFailedException: The conditional request failed\nat features.constructor.captureAWSRequest [as customRequestHandler] (/var/app/current/node_modules/aws-xray-sdk/lib/patchers/aws_p.js:66)\nat features.constructor.addAllRequestListeners (/var/app/current/node_modules/aws-sdk/lib/service.js:266)',
          'UndefinedStackException: Undefined stack exception',
        ],
      ],
    },
    {
      name: 'errorIconColor',
      config: {},
      values: [undefined, undefined, undefined, undefined, '#FFC46E'],
    },
  ],
  meta: {
    preferredVisualisationType: 'trace',
  },
});

const resultWithSql = new MutableDataFrame({
  fields: [
    {
      config: {},
      name: 'traceID',
      type: FieldType.string,
      values: [
        '1-12345678-1234567890abcdefghijklmn',
        '1-12345678-1234567890abcdefghijklmn',
        '1-12345678-1234567890abcdefghijklmn',
        '1-12345678-1234567890abcdefghijklmn',
        '1-12345678-1234567890abcdefghijklmn',
        '1-12345678-1234567890abcdefghijklmn',
        '1-12345678-1234567890abcdefghijklmn',
        '1-12345678-1234567890abcdefghijklmn',
        '',
        '',
        '',
      ],
    },
    {
      config: {},
      name: 'spanID',
      type: FieldType.string,
      values: [
        'PetSiteundefined',
        'payforadoptionAWS::ECS::Container',
        'adoptions@fake-services-database.fake-cluster.us-east-2.rds.amazonaws.comDatabase::SQL',
        'SimpleSystemsManagementAWS::SimpleSystemsManagement',
        'fakeid11111111aaaaaaaa',
        'fakeid44444444dddddddd',
        'fakeid66666666ffffffff',
        'fakeid77777777gggggggg',
        'fakeid22222222bbbbbbbb',
        'fakeid33333333cccccccc',
        'fakeid55555555eeeeeeee',
      ],
    },
    {
      config: {},
      name: 'parentSpanID',
      type: FieldType.string,
      values: [
        undefined,
        undefined,
        undefined,
        undefined,
        'PetSiteundefined',
        'payforadoptionAWS::ECS::Container',
        'adoptions@fake-services-database.fake-cluster.us-east-2.rds.amazonaws.comDatabase::SQL',
        'SimpleSystemsManagementAWS::SimpleSystemsManagement',
        'fakeid11111111aaaaaaaa',
        'fakeid11111111aaaaaaaa',
        'fakeid44444444dddddddd',
      ],
    },
    {
      config: {},
      name: 'operationName',
      type: FieldType.string,
      values: [
        'PetSite',
        'AWS::ECS::Container',
        'Database::SQL',
        'AWS::SimpleSystemsManagement',
        'PetSite',
        'payforadoption',
        'adoptions@fake-services-database.fake-cluster.us-east-2.rds.amazonaws.com',
        'SimpleSystemsManagement',
        'fake-servi-payfo.us-east-2.elb.amazonaws.com',
        'SimpleSystemsManagement',
        'adoptions@fake-services-database.fake-cluster.us-east-2.rds.amazonaws.com',
      ],
    },
    {
      config: {},
      name: 'serviceName',
      type: FieldType.string,
      values: [
        'PetSite',
        'payforadoption',
        'adoptions@fake-services-database.fake-cluster.us-east-2.rds.amazonaws.com',
        'SimpleSystemsManagement',
        'PetSite',
        'payforadoption',
        'adoptions@fake-services-database.fake-cluster.us-east-2.rds.amazonaws.com',
        'SimpleSystemsManagement',
        'PetSite',
        'PetSite',
        'payforadoption',
      ],
    },
    {
      config: {},
      name: 'serviceTags',
      type: FieldType.other,
      values: [
        [
          {
            key: 'name',
            value: 'PetSite',
          },
          {
            key: 'hostname',
            value: 'fake-servi-petsi.us-east-2.elb.amazonaws.com',
          },
        ],
        [
          {
            key: 'name',
            value: 'payforadoption',
          },
          {
            key: 'container',
            value: 'ip-203-0-113-0.us-east-2.compute.internal',
          },
          {
            key: 'hostname',
            value: 'fake-servi-payfo.us-east-2.elb.amazonaws.com',
          },
        ],
        [
          {
            key: 'name',
            value: 'adoptions@fake-services-database.fake-cluster.us-east-2.rds.amazonaws.com',
          },
        ],
        [
          {
            key: 'name',
            value: 'SimpleSystemsManagement',
          },
          {
            key: 'region',
            value: 'us-east-2',
          },
        ],
        [
          {
            key: 'name',
            value: 'PetSite',
          },
          {
            key: 'hostname',
            value: 'fake-servi-petsi.us-east-2.elb.amazonaws.com',
          },
        ],
        [
          {
            key: 'name',
            value: 'payforadoption',
          },
          {
            key: 'container',
            value: 'ip-203-0-113-0.us-east-2.compute.internal',
          },
          {
            key: 'hostname',
            value: 'fake-servi-payfo.us-east-2.elb.amazonaws.com',
          },
        ],
        [
          {
            key: 'name',
            value: 'adoptions@fake-services-database.fake-cluster.us-east-2.rds.amazonaws.com',
          },
        ],
        [
          {
            key: 'name',
            value: 'SimpleSystemsManagement',
          },
          {
            key: 'region',
            value: 'us-east-2',
          },
        ],
        [
          {
            key: 'name',
            value: 'PetSite',
          },
          {
            key: 'hostname',
            value: 'fake-servi-petsi.us-east-2.elb.amazonaws.com',
          },
        ],
        [
          {
            key: 'name',
            value: 'PetSite',
          },
          {
            key: 'hostname',
            value: 'fake-servi-petsi.us-east-2.elb.amazonaws.com',
          },
        ],
        [
          {
            key: 'name',
            value: 'payforadoption',
          },
          {
            key: 'container',
            value: 'ip-203-0-113-0.us-east-2.compute.internal',
          },
          {
            key: 'hostname',
            value: 'fake-servi-payfo.us-east-2.elb.amazonaws.com',
          },
        ],
      ],
    },
    {
      config: {},
      name: 'startTime',
      type: FieldType.number,
      values: [
        1675191925672.884, 1675191925681.5342, 1675191925717.3782, 1675191925722.149, 1675191925672.884,
        1675191925681.5342, 1675191925717.3782, 1675191925722.149, 1675191925673.018, 1675191925722.149,
        1675191925717.3782,
      ],
    },
    {
      config: {},
      name: 'duration',
      type: FieldType.number,
      values: [
        0, 0, 0, 0, 77.683837890625, 38.18798828125, 1.162109375, 27.89794921875, 48.114990234375, 27.89794921875,
        1.162109375,
      ],
    },
    {
      config: {},
      name: 'logs',
      type: FieldType.other,
      values: [[], [], [], [], [], [], [], [], [], [], []],
    },
    {
      config: {},
      name: 'tags',
      type: FieldType.other,
      values: [
        undefined,
        undefined,
        undefined,
        undefined,
        [
          {
            key: 'aws.xray.sampling_rule_name',
            value: 'Default',
          },
          {
            key: 'aws.xray.sdk_version',
            value: '2.10.1',
          },
          {
            key: 'aws.xray.sdk',
            value: 'X-Ray for .NET Core',
          },
          {
            key: 'http.request.url',
            value: 'http://fake-servi-petsi.us-east-2.elb.amazonaws.com/housekeeping/',
          },
          {
            key: 'http.request.method',
            value: 'GET',
          },
          {
            key: 'http.request.client_ip',
            value: '203.0.113.0',
          },
          {
            key: 'http.request.x_forwarded_for',
            value: true,
          },
          {
            key: 'http.response.status',
            value: 200,
          },
          {
            key: 'in progress',
            value: false,
          },
        ],
        [
          {
            key: 'aws.ecs.container',
            value: 'ip-203-0-113-0.us-east-2.compute.internal',
          },
          {
            key: 'aws.xray.sdk_version',
            value: '1.7.0',
          },
          {
            key: 'aws.xray.sdk',
            value: 'X-Ray for Go',
          },
          {
            key: 'http.request.url',
            value: 'http://fake-servi-payfo.us-east-2.elb.amazonaws.com/api/home/cleanupadoptions',
          },
          {
            key: 'http.request.method',
            value: 'POST',
          },
          {
            key: 'http.request.client_ip',
            value: '203.0.113.0',
          },
          {
            key: 'http.request.x_forwarded_for',
            value: true,
          },
          {
            key: 'http.response.status',
            value: 200,
          },
          {
            key: 'metadata.default.timeTakenSeconds',
            value: 0.038097434,
          },
          {
            key: 'in progress',
            value: false,
          },
          {
            key: 'origin',
            value: 'AWS::ECS::Container',
          },
        ],
        [
          {
            key: 'sql.url',
            value:
              'postgres://postgres@fake-services-database.fake-cluster..us-east-2.rds.amazonaws.com:5432/adoptions',
          },
          {
            key: 'sql.sanitized_query',
            value: 'INSERT INTO transactions_history SELECT * FROM transactions',
          },
          {
            key: 'sql.database_type',
            value: 'Postgres',
          },
          {
            key: 'sql.database_version',
            value: 'PostgreSQL 10.18 on x86_64-pc-linux-gnu, compiled by x86_64-pc-linux-gnu-gcc (GCC) 7.4.0, 64-bit',
          },
          {
            key: 'sql.driver_version',
            value: 'github.com/lib/pq',
          },
          {
            key: 'sql.user',
            value: 'postgres',
          },
          {
            key: 'in progress',
            value: false,
          },
          {
            key: 'origin',
            value: 'Database::SQL',
          },
        ],
        [
          {
            key: 'aws.region',
            value: 'us-east-2',
          },
          {
            key: 'aws.request_id',
            value: '164f6465-12fa-48a5-852c-2529d4b0d6d3',
          },
          {
            key: 'aws.operation',
            value: 'GetParameter',
          },
          {
            key: 'http.response.status',
            value: 200,
          },
          {
            key: 'http.response.content_length',
            value: 210,
          },
          {
            key: 'in progress',
            value: false,
          },
          {
            key: 'origin',
            value: 'AWS::SimpleSystemsManagement',
          },
        ],
        [
          {
            key: 'http.request.url',
            value: 'http://fake-servi-payfo.us-east-2.elb.amazonaws.com/api/home/cleanupadoptions',
          },
          {
            key: 'http.request.method',
            value: 'POST',
          },
          {
            key: 'http.response.status',
            value: 200,
          },
          {
            key: 'in progress',
            value: false,
          },
        ],
        [
          {
            key: 'aws.region',
            value: 'us-east-2',
          },
          {
            key: 'aws.request_id',
            value: '164f6465-12fa-48a5-852c-2529d4b0d6d3',
          },
          {
            key: 'aws.operation',
            value: 'GetParameter',
          },
          {
            key: 'http.response.status',
            value: 200,
          },
          {
            key: 'http.response.content_length',
            value: 210,
          },
          {
            key: 'in progress',
            value: false,
          },
        ],
        [
          {
            key: 'sql.url',
            value:
              'postgres://postgres@fake-services-database.fake-cluster..us-east-2.rds.amazonaws.com:5432/adoptions',
          },
          {
            key: 'sql.sanitized_query',
            value: 'INSERT INTO transactions_history SELECT * FROM transactions',
          },
          {
            key: 'sql.database_type',
            value: 'Postgres',
          },
          {
            key: 'sql.database_version',
            value: 'PostgreSQL 10.18 on x86_64-pc-linux-gnu, compiled by x86_64-pc-linux-gnu-gcc (GCC) 7.4.0, 64-bit',
          },
          {
            key: 'sql.driver_version',
            value: 'github.com/lib/pq',
          },
          {
            key: 'sql.user',
            value: 'postgres',
          },
          {
            key: 'in progress',
            value: false,
          },
        ],
      ],
    },
    {
      config: {},
      name: 'warnings',
      type: FieldType.other,
      values: [
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
      ],
    },
    {
      config: {},
      name: 'stackTraces',
      type: FieldType.other,
      values: [
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
      ],
    },
    {
      config: {},
      name: 'errorIconColor',
      type: FieldType.string,
      values: [
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
      ],
    },
  ],
  meta: {
    preferredVisualisationType: 'trace',
  },
});

describe('transformTraceResponse function', () => {
  it('should transform aws x-ray response to jaeger span', () => {
    expect(JSON.stringify(transformTraceResponse(awsResponse))).toEqual(JSON.stringify(result));
  });

  it('should transform an aws x-ray response with sql to jaeger span', () => {
    expect(JSON.stringify(transformTraceResponse(awsResponseWithSql))).toEqual(JSON.stringify(resultWithSql));
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
