import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { lambdaHandler } from './app';
import { expect, describe, it, jest, beforeAll, afterAll } from '@jest/globals';

import { mockClient } from 'aws-sdk-client-mock';

const backupGlobalConsole = global.console;

describe('Unit test for app handler', () => {
  const event: APIGatewayProxyEvent = {
    httpMethod: 'post',
    body: '',
    headers: {
      origin: 'bob.com',
    },
    isBase64Encoded: false,
    multiValueHeaders: {},
    multiValueQueryStringParameters: {},
    path: '/contact-us',
    pathParameters: {},
    queryStringParameters: {},
    requestContext: {
      accountId: '123456789012',
      apiId: '1234',
      authorizer: {},
      httpMethod: 'get',
      identity: {
        accessKey: '',
        accountId: '',
        apiKey: '',
        apiKeyId: '',
        caller: '',
        clientCert: {
          clientCertPem: '',
          issuerDN: '',
          serialNumber: '',
          subjectDN: '',
          validity: { notAfter: '', notBefore: '' },
        },
        cognitoAuthenticationProvider: '',
        cognitoAuthenticationType: '',
        cognitoIdentityId: '',
        cognitoIdentityPoolId: '',
        principalOrgId: '',
        sourceIp: '',
        user: '',
        userAgent: '',
        userArn: '',
      },
      path: '/contact-us',
      protocol: 'HTTP/1.1',
      requestId: 'c6af9ac6-7b61-11e6-9a41-93e8deadbeef',
      requestTimeEpoch: 1428582896000,
      resourceId: '123456',
      resourcePath: '/contact-us',
      stage: 'dev',
    },
    resource: '',
    stageVariables: {},
  };

  beforeAll(() => {
    // mock console methods
    global.console.error = jest.fn();
    // global.console.warn = jest.fn();
    // global.console.log = jest.fn();
    // global.console.info = jest.fn();
  });
  afterAll(() => {
    // restore console mocks
    global.console = backupGlobalConsole;
  });

  it('returns unexpected if FROM_EMAIL_ADDRESS is not defined', async () => {
    const result = await lambdaHandler(event);
    expect(result).toEqual({
      statusCode: 500,
      body: JSON.stringify({ success: false }),
      isBase64Encoded: false,
    });
    expect(global.console.error).toBeCalledTimes(1);
    expect(global.console.error).toBeCalledWith(new Error('FROM_EMAIL_ADDRESS is env var is not defined'));
  });

  it('returns unexpected if not using POST', async () => {
    process.env.FROM_EMAIL_ADDRESS = 'from@wozitech-ltd.co.uk';
    const originalHttpmethod = event.httpMethod;
    event.httpMethod = 'get';
    const result = await lambdaHandler(event);
    expect(result).toEqual({
      statusCode: 500,
      body: JSON.stringify({ success: false }),
      isBase64Encoded: false,
    });
    expect(global.console.error).toBeCalledTimes(1);
    expect(global.console.error).toBeCalledWith(new Error('FROM_EMAIL_ADDRESS is env var is not defined'));
    event.httpMethod = originalHttpmethod;
  });

  it.skip('verifies successful response', async () => {
    process.env.FROM_EMAIL_ADDRESS = 'from@wozitech-ltd.co.uk';
    process.env.CORS_ORIGIN = 'bob.com';

    const result: APIGatewayProxyResult = await lambdaHandler(event);

    expect(result.statusCode).toEqual(200);
    expect(result.body).toEqual(
      JSON.stringify({
        message: 'contact us',
      }),
    );
  });
});
