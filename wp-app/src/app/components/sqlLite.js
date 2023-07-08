const DATABASE_FILE = '../../../wpapp.db'

const sqlite3 = require('sqlite3').verbose()
    
const sqlLite = (better = false) => {

    if(better === true) return require('better-sqlite3')(DATABASE_FILE)
    if(better == 'sync') return require('sqlite-sync-itf').connect(DATABASE_FILE)

    const db = new sqlite3.Database(DATABASE_FILE, (err) => {
        if (err) {
          return console.error(err.message);
        }
    })


    db.run(`CREATE TABLE IF NOT EXISTS players 
        (   
            uid INTEGER PRIMARY KEY, 
            name TEXT NOT NULL, 
            power TEXT, 
            kills TEXT, 
            mkills TEXT,
            atp TEXT, 
            lost TEXT, 
            collected TEXT, 
            contributions TEXT, 
            assists TEXT,
            image TEXT,
            aditional TEXT
        ) 
    `)
    db.run(`
        CREATE TABLE IF NOT EXISTS players_alliances 
        (
            uid INTEGER NOT NULL, 
            name TEXT NOT NULL,
            FOREIGN KEY (uid)
                REFERENCES players (uid) 
        )
    `)
    db.run(`
        CREATE TABLE IF NOT EXISTS tasks 
        (
            filename TEXT NOT NULL,
            state TEXT NOT NULL,
            date    
        )`
    )

    return db
}
 
export default sqlLite