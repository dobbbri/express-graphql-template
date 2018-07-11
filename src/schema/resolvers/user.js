'use strict'

const _ = require('lodash')
const uuidv1 = require('uuid/v1')
const { userdb } = require('../../models')
const { validateToken, createHashedPassword, validatePassword, signToken } = require('../../utils/auth')
const { validateIfUserExist, slug } = require('../../utils/util')
const { errorName } = require('../../constants')

const user = {
  createUser: async ({ input }, { pgPool, loaders, req }) => {
    let { email, username, fullName, password } = input

    await validateIfUserExist(email, username, loaders)

    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress

    email = email.toLowerCase().trim()
    username = slug(username.toLowerCase())
    fullName = fullName.toLowerCase()
    password = await createHashedPassword(password)

    const userData = {
      email,
      username,
      fullName,
      password,
      apiKey: uuidv1(),
      ip
    }

    return userdb(pgPool).addUser(userData)
  },

  login: async ({ input }, { loaders }) => {
    const email = input.email.toLowerCase()
    const user = await loaders.usersByEmail.load(email)

    if (_.isEmpty(user)) {
      throw new Error(errorName.INVALID_INFO)
    }

    await validatePassword(input.password, user.password)

    user.apiKey = await signToken(user.apiKey)
    delete user.password
    delete user.resetPasswordHash
    delete user.resetPasswordDate
    delete user.createdAt

    return user
  },

  updatePassword: async ({ input }, { pgPool, loaders, req }) => {
    const { oldPassword, newPassword } = input

    const user = await validateToken(req, loaders.usersByApiKeys)

    await validatePassword(oldPassword, user.password)
    const password = await createHashedPassword(newPassword)

    const updateInfo = {
      password,
      apiKey: uuidv1(),
      uuid: null,
      date: null,
      userId: user.id
    }

    return userdb(pgPool).updatePassword(updateInfo)
  },

  getMe: async (args, { loaders, req }) => {
    return validateToken(req, loaders.usersByApiKeys)
  },

  getUserByUsername: async (args, { loaders }) => {
    const { username } = args

    return loaders.usersByUsername.load(username)
  }
}

module.exports = user
