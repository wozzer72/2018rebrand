'use strict';

export const handler = async (event, context) => {
  var arnList = (context.invokedFunctionArn).split(":");
  var lambdaRegion = arnList[3];

  const message = event.Records && event.Records[0] ? JSON.parse(event.Records[0].Sns.Message) : null;
  
  try {

  } catch (err) {
    // unable to get establishments
    throw new Error('Feedback API - error');
  }

  return true;
};
