import { sql } from '@vercel/postgres'

const Users = async (limit=200, orderBy='power DESC, atp DESC, kills DESC, modern_kills DESC') => {
    try {
        const { rows } = await sql`SELECT * FROM players ORDER BY ${orderBy} LIMIT ${limit} `
        return typeof rows == 'object' ? rows : []
    } catch (error) {
        console.error('Error retrieving users:', error)
    }
    return []
}
export default Users