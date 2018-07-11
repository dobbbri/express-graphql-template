'use strict'

const errorName = {
  UNAUTHORIZED: 'UNAUTHORIZED',
  INVALID_INFO: 'INVALID_INFO',
  INVALID_EMAIL: 'INVALID_EMAIL',
  INVALID_PASSWORD: 'INVALID_PASSWORD',
  INVALID_HASH: 'INVALID_HASH',
  EMAIL_EXISTS: 'EMAIL_EXISTS',
  USERNAME_EXISTS: 'USERNAME_EXISTS',
  ARGUMENT_IS_MISSING: 'ARGUMENT_IS_MISSING',
  CANT_DELETE: 'CANT_DELETE'
}

const errorType = {
  UNAUTHORIZED: {
    message: 'Authentication is needed.',
    statusCode: 401
  },
  INVALID_INFO: {
    message: 'Email or password are invalid.',
    statusCode: 401
  },
  INVALID_EMAIL: {
    message: 'Email is invalid.',
    statusCode: 401
  },
  INVALID_HASH: {
    message: 'The link is invalid.',
    statusCode: 401
  },
  INVALID_PASSWORD: {
    message: 'Invalid password.',
    statusCode: 401
  },
  EMAIL_EXISTS: {
    message: 'There is an user with this email',
    statusCode: 409
  },
  USERNAME_EXISTS: {
    message: 'There is an user with this username',
    statusCode: 409
  },
  ARGUMENT_IS_MISSING: {
    message: 'An argument is missing',
    statusCode: 400
  },
  CANT_DELETE: {
    message: 'Only the owner of the poll can delete it',
    statusCode: 401
  }
}

module.exports = { errorName, errorType }
