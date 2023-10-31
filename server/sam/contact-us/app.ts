import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { unexpectedResponse } from './util/apiResponses';
import { contactForm } from './api/contactForm';

/**
 *
 * Event doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html#api-gateway-simple-proxy-for-lambda-input-format
 * @param {Object} event - API Gateway Lambda Proxy Input Format
 *
 * Return doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html
 * @returns {Object} object - API Gateway Lambda Proxy Output Format
 *
 */

export const lambdaHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const FROM_EMAIL_ADDRESS: string | undefined = process.env.FROM_EMAIL_ADDRESS;
    if (FROM_EMAIL_ADDRESS === undefined) {
      throw new Error('FROM_EMAIL_ADDRESS is env var is not defined');
    }

    if (event.httpMethod !== 'post') {
      throw new Error('POST only supported');
    }

    return contactForm(FROM_EMAIL_ADDRESS, event);
  } catch (err) {
    console.error(err);
    return unexpectedResponse;
  }
};
