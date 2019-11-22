"use strict";

/* eslint-disable import/no-extraneous-dependencies */
const myContacForm = require('../../lib/contactForm');

const eventData = {
    httpMethod: 'GET',
    input: {
      body: JSON.stringify({
        email: 'bob@bob.com',
        name: 'My Name',
        message: 'Hello from me'
      })
    },
    isBase64Encoded: false
  };

const sendContactForm = async () => {
    try {
        console.log("About to call registrations handler");

        const returnVal = await myContacForm.handler(
            eventData,
            { invokedFunctionArn : 'arn:aws:lambda:eu-west-1:accountid:function:sendEmail' }
        );
        console.log("Handler returned: ", returnVal);
    } catch (err) {
        console.error("Caught local error: ", err);
    }
}

process.env.LOG_LEVEL = 5;
process.env.TO_EMAIL_ADDRESS = 'warren.ayling@wozitech-ltd.co.uk';
process.env.FROM_EMAIL_ADDRESS = 'warren.ayling@wozitech-ltd.co.uk';
process.env.REGION='eu-west-1';
sendContactForm();