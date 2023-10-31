import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { mockClient } from 'aws-sdk-client-mock';
import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';
import { expect, describe, it, jest, beforeAll, afterAll } from '@jest/globals';
import { lambdaHandler } from './app';

const backupGlobalConsole = global.console;

describe('Unit test for app handler', () => {
  const event: APIGatewayProxyEvent = {
    httpMethod: 'POST',
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
      httpMethod: 'POST',
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
  const sesMock = mockClient(SESClient);

  beforeAll(() => {
    // mock console methods
    global.console.error = jest.fn();
    global.console.warn = jest.fn();
    global.console.log = jest.fn();
    global.console.info = jest.fn();
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
    event.httpMethod = 'GET';
    const result = await lambdaHandler(event);
    expect(result).toEqual({
      statusCode: 500,
      body: JSON.stringify({ success: false }),
      isBase64Encoded: false,
    });
    expect(global.console.error).toBeCalledTimes(1);
    expect(global.console.error).toBeCalledWith(new Error('POST only supported'));
    event.httpMethod = originalHttpmethod;
  });

  it('verifies successful response', async () => {
    process.env.FROM_EMAIL_ADDRESS = 'from@wozitech-ltd.co.uk';
    process.env.CORS_ORIGIN = 'bob.com';

    event.body = JSON.stringify({
      name: 'Warren Ayling',
      email: 'warren.ayling@wozitech-ltd.co.uk',
      message: 'test message',
    });

    sesMock.onAnyCommand().resolves({});
    const result: APIGatewayProxyResult = await lambdaHandler(event);

    expect(result.statusCode).toEqual(200);
    expect(result.body).toEqual(
      JSON.stringify({
        success: true,
      }),
    );
  });
});
