"use strict";

import { validate, validateEmail, validateMessage, validateName } from '../src/util/validator';
import randomstring from 'randomstring';

describe("Contact Form Send Email Validation", () => {
  it('should fail on empty email address', () => {
    expect(validateEmail('')).toBe(false);
    expect(validateEmail()).toBe(false);
  });

  it('should fail on bad email address', () => {

    expect(validateEmail('bob')).toBe(false);
    expect(validateEmail('bob@')).toBe(false);
    expect(validateEmail('bob@co')).toBe(false);
    expect(validateEmail('bob@co.u')).toBe(false);
    
  });
  it('should fail on empty name', () => {
    expect(validateName('')).toBe(false);
    expect(validateName()).toBe(false);
  });
  it('should fail on empty message', () => {
    expect(validateMessage('')).toBe(false);
    expect(validateMessage()).toBe(false);
  });
  it('should fail on message more than 500 characters', () => {
    const thisLargeMessage = randomstring.generate(500);
    expect(validateMessage(thisLargeMessage)).toBe(true);
    expect(validateMessage(thisLargeMessage+'A')).toBe(false);
  });
});

describe("Contact Form Send Email", () => {
  it('should send email', () => {
    expect(validate('Bob Hope', 'bob@co.uk', 'Hello from Bob')).toBe(true);

  });
});

