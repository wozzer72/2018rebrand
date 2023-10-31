import { expect, describe, it, jest, beforeAll, afterAll } from '@jest/globals';

// rather than AWS SDK mock, integration tests should use nock (http server mocking)
// import { mockClient } from 'aws-sdk-client-mock';

const backupGlobalConsole = global.console;

describe('Integration tests contact-us api', () => {
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

  it.skip('integration test 1', async () => {
    expect(1).toEqual(1);
  });
});
