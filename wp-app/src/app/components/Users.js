import { sql } from '@vercel/postgres'
const Users = async () => {
    try {
        const { rows } = await sql`SELECT * FROM players ORDER BY name ASC`
        return typeof rows == 'object' ? rows : []
    } catch (error) {
        console.error('Error retrieving users:', error)
    }
}

export default Users