import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { mockClient } from 'aws-sdk-client-mock';
import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';
import { expect, describe, it, jest, beforeAll, afterAll } from '@jest/globals';
import { contactForm, getCorsHeaders } from './contactForm';

const backupGlobalConsole = global.console;

describe.skip('Unit test for CORS', () => {
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

  const event: APIGatewayProxyEvent = {
    httpMethod: 'get',
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

  it('returns default CORS when env var undefined', async () => {
    const theHeaders = getCorsHeaders(event);
    expect(theHeaders).toEqual({
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': false,
    });
  });

  it('returns expected CORS when env var is defined and matches "origin" header', async () => {
    process.env.CORS_ORIGIN = 'bob.com';
    const theHeaders = getCorsHeaders(event);
    expect(theHeaders).toEqual({
      'Access-Control-Allow-Origin': 'bob.com',
      'Access-Control-Allow-Credentials': true,
    });
  });

  it('returns expected CORS when env var is defined and does not match "origin" header', async () => {
    process.env.CORS_ORIGIN = 'unexpected.com';
    const theHeaders = getCorsHeaders(event);
    expect(theHeaders).toEqual({});
  });
});

describe('Unit test for contactForm', function () {
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

  it('validates bad input - no body', async () => {
    const fromEmailAddress = 'info@bob.com';
    process.env.CORS_ORIGIN = 'bob.com';

    const results: APIGatewayProxyResult = await contactForm(fromEmailAddress, event);
    expect(results).toEqual({
      statusCode: 400,
      body: JSON.stringify({ success: false, error: 'Failed validation: No body' }),
      isBase64Encoded: false,
    });
  });

  it('validates bad input - no body', async () => {
    const fromEmailAddress = 'info@bob.com';
    process.env.CORS_ORIGIN = 'bob.com';

    event.body = JSON.stringify({
      name: 'Warren Ayling',
    });
    const results: APIGatewayProxyResult = await contactForm(fromEmailAddress, event);
    expect(results).toEqual({
      statusCode: 400,
      body: JSON.stringify({ success: false, error: 'Failed validation: incorrect body' }),
      isBase64Encoded: false,
    });
  });

  describe('mock SES', () => {
    const sesMock = mockClient(SESClient);
    sesMock.onAnyCommand().resolves({});
    // beforeAll(() => {});

    it('successful SES response', async () => {
      const fromEmailAddress = 'info@bob.com';
      process.env.CORS_ORIGIN = 'bob.com';
      event.body = JSON.stringify({
        name: 'Warren Ayling',
        email: 'warren.ayling@wozitech-ltd.co.uk',
        message: 'test message',
      });

      // sesMock.on(SendEmailCommand).resolves({
      //   $metadata: {
      //     httpStatusCode: 200,
      //     requestId: '7eb3b553-a710-4cd3-aedf-de2921c9400b',
      //     extendedRequestId: undefined,
      //     cfId: undefined,
      //     attempts: 1,
      //     totalRetryDelay: 0,
      //   },
      //   MessageId: '0102018b852048bc-f39b7f60-5f69-4e04-a198-c2977d814b7c-000000',
      // });
      const result: APIGatewayProxyResult = await contactForm(fromEmailAddress, event);

      expect(result.statusCode).toEqual(200);
      expect(result.body).toEqual(
        JSON.stringify({
          success: true,
        }),
      );
    });

    it('unsuccessful SES response', async () => {
      const fromEmailAddress = 'info@bob.com';
      process.env.CORS_ORIGIN = 'bob.com';
      event.body = JSON.stringify({
        name: 'Warren Ayling',
        email: 'warren.ayling@wozitech-ltd.co.uk',
        message: 'test message',
      });

      // should be able to reject just the once, but the following is not working
      // const rejectError = new Error('AccessDenied: ....');
      // sesMock.on(SendEmailCommand).rejectsOnce(rejectError);
      sesMock.on(SendEmailCommand).rejects();
      const result: APIGatewayProxyResult = await contactForm(fromEmailAddress, event);

      expect(result.statusCode).toEqual(500);
      expect(result.body).toEqual(JSON.stringify({ success: false }));
      expect(global.console.error).toBeCalledTimes(1);
    });
  });
});
