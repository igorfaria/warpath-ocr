const moment = require('moment')
const Database = require('better-sqlite3')
const db = new Database('./202307_wpapp.db')
module.exports = db