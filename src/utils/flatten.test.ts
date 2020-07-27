import { flatten } from './flatten';

describe('flatten function', () => {
  it('should flatten nested object', () => {
    const awsResponse = {
      http: {
        request: {
          client_ip: '80.98.253.126',
        },
        response: {
          status: 409,
        },
      },
      aws: {
        resource_names: ['orders', 'products'],
      },
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
    };

    expect(flatten(awsResponse)).toEqual({
      'aws.resource_names0': 'orders',
      'aws.resource_names1': 'products',
      'http.request.client_ip': '80.98.253.126',
      'http.response.status': 409,
      'metadata.http.dns.addresses0.IP': '4.2.123.160',
      'metadata.http.dns.addresses0.Zone': '',
      'metadata.http.dns.addresses1.IP': '22.23.14.122',
      'metadata.http.dns.addresses1.Zone': '',
    });
  });
});
