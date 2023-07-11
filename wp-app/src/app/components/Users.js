import sqlLite from './sqlLite'
const Users = () => {
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