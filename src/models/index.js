'use strict'

exports.userdb = (pgdb) => require('./userdb')(pgdb)
exports.dataloadersdb = (pgdb) => require('./dataloadersdb')(pgdb)
