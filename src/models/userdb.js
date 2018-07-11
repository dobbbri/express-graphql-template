'use strict'

const humps = require('humps')
const { signToken } = require('../utils/auth')

module.exports = pgPool => {
  return {
    async addUser ({ email, username, fullName, password, apiKey, ip }) {
      const res = await pgPool.query(`insert into users(email, username, 
        full_name, password, api_key, ip) values ($1, $2, $3, $4, $5, $6) 
        returning *`, [email, username, fullName, password, apiKey, ip])

      const user = humps.camelizeKeys(res.rows[0])
      user.apiKey = signToken(user.apiKey)
      delete user.password
      return user
    },

    async updatePassword ({ password, apiKey, uuid, date, userId }) {
      const res = await pgPool.query(`update users set password = $1, api_key = $2, 
        reset_password_hash = $3, reset_password_date = $4 where id = $5 returning *
        `, [password, apiKey, uuid, date, userId])

      const user = humps.camelizeKeys(res.rows[0])
      user.apiKey = signToken(user.apiKey)
      delete user.password
      return user
    },

    async getUserByEmail (email) {
      const res = await pgPool.query('select * from users where email = $1', [email])
      const user = humps.camelizeKeys(res.rows[0])
      delete user.password
      return user
    },

    async getUserByUsername (username) {
      const res = await pgPool.query('select * from users where username = $1', [username])
      const user = humps.camelizeKeys(res.rows[0])
      delete user.password
      return user
    }
  }
}
