import sqlLite from "./sqlLite"
const Users = () => {
    // sqlLite()
    const db = sqlLite('sync')
    const rows = db.run(`SELECT * FROM players ORDER BY round(power) DESC`)
    db.close()
    return rows
}

export default Users