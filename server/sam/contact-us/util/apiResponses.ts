import { APIGatewayProxyResult } from 'aws-lambda';
export const badResponse = (error: string): APIGatewayProxyResult => ({
  statusCode: 400,
  body: JSON.stringify({ success: false, error }),
  isBase64Encoded: false,
});

export const unexpectedResponse: APIGatewayProxyResult = {
  statusCode: 500,
  body: JSON.stringify({ success: false }),
  isBase64Encoded: false,
};
