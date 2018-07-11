'use strict'

const express = require('express')
const { buildSchema } = require('graphql')
const graphqlHTTP = require('express-graphql')
const bodyParser = require('body-parser')
const DataLoader = require('dataloader')
const fs = require('fs')
const path = require('path')
const pg = require('pg')
const root = require('./schema/resolvers')
const errorHandler = require('./utils/errors')

if (process.env.NODE_ENV === 'development') {
  require('dotenv').config({ path: 'development.env' })
}

const pgPool = new pg.Pool({ connectionString: process.env.DATABASE_URL })
const { dataloadersdb } = require('./models')

const app = express()

app.set('port', process.env.PORT || 7000)
app.use(bodyParser.json({limit: '10mb'}))
app.use(bodyParser.urlencoded({ extended: true }))

const schemaCode = fs.readFileSync(path.join(__dirname, 'schema', 'schema.gql'), 'utf8')
const schema = buildSchema(schemaCode)

app.use('/graphql', (req, res) => {
  const loaders = {
    usersByApiKeys: new DataLoader(dataloadersdb(pgPool).getUserByApiKey),
    usersByEmail: new DataLoader(dataloadersdb(pgPool).getUserByEmail),
    usersByUsername: new DataLoader(dataloadersdb(pgPool).getUserByUsername)
  }
  graphqlHTTP({
    schema,
    rootValue: root,
    graphiql: process.env.NODE_ENV === 'development',
    context: { pgPool, loaders, req },
    formatError: errorHandler
  })(req, res)
})

const server = app.listen(app.get('port'), () => {
  console.log(`Server running -> PORT ${server.address().port}`)
})

module.exports = app
