'use strict';

const validator = require('../util/validator');

export const handler = async (event, context) => {
  var arnList = (context.invokedFunctionArn).split(":");
  var lambdaRegion = arnList[3];

  const message = event.Records && event.Records[0] ? JSON.parse(event.Records[0].Sns.Message) : null;
  
  try {
    const response = {
      statusCode: 200,
      body: JSON.stringify({success:true}),
      headers: {},
      isBase64Encoded: false
    };
    
    const body = JSON.parse(event.input.body);
    console.log(`WA DEBUG: input body: `, body);

    if (!validator.validate(body.name, body.email, body.message)) {
      response.statusCode = 400;
      response.body = JSON.stringify({
        success: false,
        error: 'Failed validation'
      });

      return response;
    }

    return response;

  } catch (err) {
    // unable to get establishments
    console.error(err);
    throw new Error('Contact Form Send Email - error');
  }

  return true;
};
