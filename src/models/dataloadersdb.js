'use strict'

const { orderedFor } = require('../utils/util')

module.exports = pgPool => {
  return {
    async getUserByApiKey (apiKeys) {
      const res = await pgPool.query('select * from users where api_key = ANY($1)', [apiKeys])

      return orderedFor(res.rows, apiKeys, 'apiKey', true)
    },
    async getUserByEmail (emails) {
      const res = await pgPool.query('select * from users where email = ANY($1)', [emails])

      return orderedFor(res.rows, emails, 'email', true)
    },
    async getUserByUsername (usernames) {
      const res = await pgPool.query('select * from users where username = ANY($1)', [usernames])

      return orderedFor(res.rows, usernames, 'username', true)
    }
  }
}
