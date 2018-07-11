'use strict'

const { errorType } = require('../constants')

const getErrorCode = errorName => {
  return errorType[errorName]
}

module.exports = err => {
  console.log(err)
  const error = getErrorCode(err.message)
  return ({
    message: error.message,
    statusCode: error.statusCode
  })
}
