// sends email using AWS SES
import { SESClient, SendEmailCommand, SendEmailCommandOutput, SendEmailCommandInput } from '@aws-sdk/client-ses';

const AWS_REGION = process.env.REGION || 'eu-west-1';

const client = new SESClient({ region: AWS_REGION });

// send email to/from just one recipient
export const sendEmail = async (from: string, to: string, name: string, message: string): Promise<string> => {
  const htmlBody = `<html><body><h1>From: ${name}</h1><h1>Email: ${to}</h1><p>${message}</p></body></html>`;
  const plainBody = `From: ${name}/${to}. ${message}`;

  from = 'something-supid@mail.com';

  try {
    const sendEmailCommandInput: SendEmailCommandInput = {
      Destination: {
        /* required */
        // CcAddresses: [
        //   'EMAIL_ADDRESS',
        //   /* more items */
        // ],
        ToAddresses: [from],
      },
      Message: {
        /* required */
        Body: {
          /* required */
          Html: {
            Charset: 'UTF-8',
            Data: htmlBody,
          },
          Text: {
            Charset: 'UTF-8',
            Data: plainBody,
          },
        },
        Subject: {
          Charset: 'UTF-8',
          Data: 'From WOZiTech Ltd website',
        },
      },
      Source: from /* required */,
      // ReplyToAddresses: [
      //    'EMAIL_ADDRESS',
      //   /* more items */
      // ],
    };
    const sendEmailCommand: SendEmailCommand = new SendEmailCommand(sendEmailCommandInput);
    // const ses = await new AWS.SES({ apiVersion: '2010-12-01', region: AWS_REGION }).sendEmail(params).promise();

    await client.send(sendEmailCommand);

    return htmlBody;
  } catch (err) {
    console.error('sendEmail util: ', err);
    throw err;
  }
};
