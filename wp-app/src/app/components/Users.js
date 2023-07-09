//import sqlLite from "./sqlLite"
const Users = () => {
    /*const db = sqlLite('sync')
    const rows = db.run(`SELECT * FROM players ORDER BY round(power) DESC`)
    db.close()
    return rows
    */
   const db = require('/db')
    try {
        const statement = db.prepare('SELECT * FROM players')
        const users = statement.all()
        return users
    } catch (error) {
        console.error('Error retrieving users:', error)
        return []
    }
}

export default Users