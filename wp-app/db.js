const Database = require('better-sqlite3')
const db = new Database('wpapp.db')
module.exports = db