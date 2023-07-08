import sqlLite from "./sqlLite"
const Users = () => {
    sqlLite()
    return sqlLite(true).prepare(`SELECT * FROM players ORDER BY round(power) DESC`).all()
}

export default Users