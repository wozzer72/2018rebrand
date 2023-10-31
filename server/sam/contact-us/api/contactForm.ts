import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { validate } from '../util/validator';
import { sendEmail } from '../model/aws/sendEmail';
import { badResponse, unexpectedResponse } from '../util/apiResponses';

type CorsHeadersType = {
  'Access-Control-Allow-Origin'?: string;
  'Access-Control-Allow-Credentials'?: boolean;
};

export const getCorsHeaders = (event: APIGatewayProxyEvent): CorsHeadersType => {
  const CORS_ORIGIN: string | undefined = process.env.CORS_ORIGIN;
  const webOrigin = event.headers?.origin ? event.headers.origin : '';

  let corsHeaders: CorsHeadersType = {};
  if (CORS_ORIGIN) {
    if (webOrigin.match(CORS_ORIGIN)) {
      corsHeaders = {
        'Access-Control-Allow-Origin': `${webOrigin}`,
        'Access-Control-Allow-Credentials': true,
      };
    }
  } else {
    corsHeaders = {
      'Access-Control-Allow-Origin': '*', // Required for CORS support to work
      'Access-Control-Allow-Credentials': false,
    };
  }

  return corsHeaders;
};

export const contactForm = async (
  fromEmailAddress: string,
  event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> => {
  const corsHeaders = getCorsHeaders(event);
  try {
    const goodResponse = {
      statusCode: 200,
      body: JSON.stringify({ success: true }),
      headers: corsHeaders,
      isBase64Encoded: false,
    };

    if (event.body) {
      const body = JSON.parse(event.body);
      if (!validate(body.name, body.email, body.message)) {
        return badResponse('Failed validation: incorrect body');
      }
      // passes validation
      await sendEmail(fromEmailAddress, body.email, body.name, body.message);
      return goodResponse;
    }

    return badResponse('Failed validation: No body');
  } catch (err) {
    return unexpectedResponse;
  }
};
