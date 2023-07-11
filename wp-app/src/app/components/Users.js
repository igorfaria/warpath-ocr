const Users = () => {
    const db = require('/db')
    try {
        const statement = db.prepare('SELECT * FROM players ORDER BY name')
        const users = statement.all()
        return users
    } catch (error) {
        console.error('Error retrieving users:', error)
        return []
    }
}

export default Users