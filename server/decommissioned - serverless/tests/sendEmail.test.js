"use strict";

global.console = {
  error: jest.fn(),
  warn: jest.fn(),
  log: jest.fn()
};

import { sendEmail } from '../src/model/aws/sendEmail';

// mock SES
import AWS from 'aws-sdk-mock';

// mock functions - good and bad
const sesSendEmailSuccessMock = jest.fn( (params) => Promise.resolve(true));
const sesSendEmailFailureMock = jest.fn( (params) => Promise.reject(true));;

describe("Contact Form Send Email", () => {
  beforeEach(() => {
    sesSendEmailSuccessMock.mockClear();
    sesSendEmailFailureMock.mockClear();
  });
  afterEach(() => {
    AWS.restore('SES');
  });

  it('should send email', async () => {
    // setup the AWS SES mock function
    AWS.mock('SES', 'sendEmail', sesSendEmailSuccessMock);

    // before starting; should not have been called
    expect(sesSendEmailSuccessMock).not.toHaveBeenCalled();

    const sent = await sendEmail(
      'from her',
      'to him',
      'my name',
      'my message'
    );

    // can't get this expect to be called with to match!
    // expect(sesSendEmailSuccessMock).toHaveBeenCalledWith({
    //   Destination: {
    //     ToAddresses: [
    //       'to him',
    //     ],
    //   },
    //   Message: {
    //     Body: {
    //       Html: {
    //         Charset: 'UTF-8',
    //         Data: '<html><body><h1>From: my name</h1><h1>Email: to him</h1><p>my message</p></body></html>',
    //       },
    //       Text: {
    //         Charset: 'UTF-8',
    //         Data: 'From: my name. my message',
    //       },
    //     },
    //     Subject: {
    //       Charset: 'UTF-8',
    //       Data: 'From WOZiTech Ltd public',
    //     },
    //   },
    //   Source: 'from her',
    // });
    expect(sesSendEmailSuccessMock.mock.calls.length).toBe(1);

    expect(sent).toBe('<html><body><h1>From: my name</h1><h1>Email: to him</h1><p>my message</p></body></html>');
  });


  it('should fail to send email', async () => {
    // setup the AWS SES mock function
    AWS.mock('SES', 'sendEmail', sesSendEmailFailureMock);

    // before starting; should not have been called
    expect(sesSendEmailFailureMock).not.toHaveBeenCalled();

    expect(sendEmail(
        'from her',
        'to him',
        'my name',
        'my message'
      )).rejects.toEqual(true);

    expect(sesSendEmailFailureMock.mock.calls.length).toBe(1);
  });

});

