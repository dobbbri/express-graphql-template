'use strict'

const humps = require('humps')
const _ = require('lodash')

const { errorName } = require('../constants')

/*
* We need to convert the result to a list, that's why we migth set ANY on the query
* The otput might have the same length of the input array
*/
const orderedFor = (rows, collection, fields, singleObject) => {
  // return the rows ordered for the collection
  const data = humps.camelizeKeys(rows)
  const inGroupsOfFields = _.groupBy(data, fields)
  return collection.map(element => {
    const elementArray = inGroupsOfFields[element]
    if (elementArray) {
      return singleObject ? elementArray[0] : elementArray
    }
    return singleObject ? {} : []
  })
}

const slug = str => {
  return str.toLowerCase().replace(/ /g, '')
}

const validateIfUserExist = async (email, username, loaders) => {
  if (!(email && username)) {
    throw new Error(errorName.ARGUMENT_IS_MISSING)
  }

  const userByEmail = await loaders.usersByEmail.load(email)
  if (!_.isEmpty(userByEmail)) {
    throw new Error(errorName.EMAIL_EXISTS)
  }

  const userByUsername = await loaders.usersByUsername.load(username)
  if (!_.isEmpty(userByUsername)) {
    throw new Error(errorName.USERNAME_EXISTS)
  }
}

module.exports = {
  orderedFor,
  slug,
  validateIfUserExist
}
