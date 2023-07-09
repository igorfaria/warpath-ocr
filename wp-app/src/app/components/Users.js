import sqlLite from "./sqlLite"
const Users = () => {
    const query = 'SELECT * FROM players ORDER BY round(power) DESC'
   /*  const db = sqlLite('sync')
     const rows = db.run(`SELECT * FROM players ORDER BY round(power) DESC`)
    db.close()
    */
    const db = sqlLite(true)
    db.pragma('journal_mode = WAL')
    const rows = db.prepare(query).all()

    return rows
}

export default Users