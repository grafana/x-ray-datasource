import { flatten } from './flatten';

describe('flatten function', () => {
  it('should flatten nested object', () => {
    const awsResponse = {
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
    };

    expect(flatten(awsResponse)).toEqual({
      'http.request.client_ip': '80.98.253.126',
      'http.request.method': 'POST',
      'http.request.url': 'http://3.23.148.72/signup',
      'http.request.user_agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.97 Safari/537.36',
      'http.response.content_length': 0,
      'http.response.status': 409,
    });
  });
});
