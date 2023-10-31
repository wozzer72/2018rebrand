import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { contactForm, getCorsHeaders } from './contactForm';
import { expect, describe, it, jest, beforeAll, afterAll } from '@jest/globals';

import { mockClient } from 'aws-sdk-client-mock';

const backupGlobalConsole = global.console;

describe('Unit test for CORS', () => {
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

describe.skip('Unit test for contactForm', function () {
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

  it('validates bad input', async () => {
    const fromEmailAddress = 'info@bob.com';
    process.env.CORS_ORIGIN = 'bob.com';

    const result: APIGatewayProxyResult = await contactForm(fromEmailAddress, event);
  });

  it('verifies successful response', async () => {
    const fromEmailAddress = 'info@bob.com';
    process.env.CORS_ORIGIN = 'bob.com';

    const result: APIGatewayProxyResult = await contactForm(fromEmailAddress, event);

    expect(result.statusCode).toEqual(200);
    expect(result.body).toEqual(
      JSON.stringify({
        message: 'contact us',
      }),
    );
  });
});
