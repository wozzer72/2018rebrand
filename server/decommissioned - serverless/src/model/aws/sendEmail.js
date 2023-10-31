"use strict;"

// sends email using AWS SES
import AWS from 'aws-sdk';

const AWS_REGION = process.env.REGION || 'eu-west-1';

// send email to/from just one recipient
export const sendEmail = async (from, to, name, message) => {
  const htmlBody = `<html><body><h1>From: ${name}</h1><h1>Email: ${to}</h1><p>${message}</p></body></html>`;
  const plainBody = `From: ${name}/${to}. ${message}`;

  const params = {
    Destination: { /* required */
      // CcAddresses: [
      //   'EMAIL_ADDRESS',
      //   /* more items */
      // ],
      ToAddresses: [
        from,
      ]
    },
    Message: { /* required */
      Body: { /* required */
        Html: {
         Charset: 'UTF-8',
         Data: htmlBody
        },
        Text: {
         Charset: 'UTF-8',
         Data: plainBody
        }
       },
       Subject: {
        Charset: 'UTF-8',
        Data: 'From WOZiTech Ltd public'
       }
      },
    Source: from, /* required */
    // ReplyToAddresses: [
    //    'EMAIL_ADDRESS',
    //   /* more items */
    // ],
  };

  try {
    const ses = await new AWS.SES({apiVersion: '2010-12-01', region: AWS_REGION}).sendEmail(params).promise();

    return htmlBody;

  } catch (err) {
    console.error("sendEmail util: ", err);

    throw err;
  }  
};