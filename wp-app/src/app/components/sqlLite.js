const moment = require('moment/moment')

const DATABASE_FILE = moment().format('YYYYMM') + '_wpapp.db'

const sqlite3 = require('sqlite3').verbose()

const startDB = (db = null) => {
    if(db === null) return false
    const players = [
        'uid INTEGER PRIMARY KEY',
        'name TEXT NOT NULL',
        'power TEXT',
        'kills TEXT',
        'modern_kills TEXT',
        'atp TEXT',
        'lost TEXT',
        'collected TEXT',
        'assisted TEXT',
        'image TEXT',
        'additional TEXT',
        'reviewed INTEGER DEFAULT 0',
        'created TEXT NOT NULL',
        'updated TEXT'
    ]
    
    db.run(`
        CREATE TABLE IF NOT EXISTS players 
        (  ${players.join(',')} ) 
    `)

    const images = [ 
        'id INTEGER PRIMARY KEY',
        'filepath TEXT NOT NULL',
        'processed TEXT',
        'data TEXT', // json data
        'raw TEXT', // string data
        'created TEXT NOT NULL',
        'updated TEXT'
    ]

    db.run(`
        CREATE TABLE IF NOT EXISTS images
        ( ${images.join(',')} )
    `)
}
    
const sqlLite = (mod = false) => {
    let db = null
    switch(mod) {
        case true: 
            db = require('/db') // better sqlite module
            break
        case 'sync': 
            db = require('sqlite-sync-itf').connect(DATABASE_FILE) 
            break
        default: 
            db = new sqlite3.Database(DATABASE_FILE, (err) => {
                if (err) return console.error(err.message)
            })
            startDB(db)
    }
    return db
}

export default sqlLite