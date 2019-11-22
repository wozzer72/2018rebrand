export const validateEmail = (email) => {
  const emailRegex = /\S+@\S+\.\S\S+/;    // at least two characters for the domain

  if (email &&
      typeof email === "string" &&
      email.length > 0 &&
      emailRegex.test(email) ) {
    return true;
  }

  return false;
};

export const validateName = (name) => {
  if (name &&
      typeof name === "string" &&
      name.length > 0) {
    return true;
  }

  return false;
};

export const validateMessage = (message) => {
  const MAX_LENGTH = 500;
  if (message &&
      typeof message === "string" &&
      message.length > 0 &&
      message.length <= MAX_LENGTH) {
    return true;
  }

  return false;
};

export const validate = (name, email, message) => {
  if (validateEmail(email) && validateName(name) && validateMessage(message)) return true;
  return false;
};
