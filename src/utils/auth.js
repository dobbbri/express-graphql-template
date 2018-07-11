'use strict'

const _ = require('lodash')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

const { constants, errorName } = require('../constants')

const signToken = str => {
  return new Promise(resolve => {
    resolve(jwt.sign({ apiKey: str }, process.env.JWT_KEY))
  })
}

const verifyJwt = req => {
  let token

  if (req.query && req.query.hasOwnProperty('access_token')) {
    token = req.query.access_token
  } else if (req.headers.authorization && req.headers.authorization.includes('Bearer')) {
    token = req.headers.authorization.split(' ')[1]
  }

  if (!token) {
    return false
  }

  return new Promise((resolve, reject) => {
    jwt.verify(token, process.env.JWT_KEY, (err, data) => {
      if (err) reject(errorName.UNAUTHORIZED)
      resolve(data)
    })
  })
}

const validateToken = async (req, usersByApiKeys) => {
  try {
    const userApiKey = (await verifyJwt(req)).apiKey

    const user = await usersByApiKeys.load(userApiKey)

    if (_.isEmpty(user)) {
      throw new Error(errorName.UNAUTHORIZED)
    }

    return user
  } catch (err) {
    throw new Error(errorName.UNAUTHORIZED)
  }
}

const createHashedPassword = pwd => {
  return bcrypt.hash(pwd, constants.saltRounds)
}

const validatePassword = async (userPassword, hash) => {
  if (!userPassword) {
    throw new Error(errorName.ARGUMENT_IS_MISSING)
  }

  if (await bcrypt.compare(userPassword, hash)) {
    return
  }

  throw new Error(errorName.INVALID_INFO)
}

module.exports = {
  signToken,
  verifyJwt,
  validateToken,
  createHashedPassword,
  validatePassword
}
