import { sql } from '@vercel/postgres'

const CreateDB = async () => {
    const response = {}
    const drop_players = await sql`DROP TABLE players`
    response.drop_players = drop_players
    response.table_players = await sql`CREATE TABLE players (
        uid INTEGER PRIMARY KEY,
        name TEXT NOT NULL,
        power TEXT,
        atp TEXT,
        kills TEXT,
        modern_kills TEXT,
        lost TEXT,
        collected TEXT,
        contributed TEXT,
        assisted TEXT,
        image TEXT,
        additional TEXT,
        reviewed INTEGER DEFAULT 0,
        created TEXT NOT NULL,
        updated TEXT)`

    const drop_images = await sql`DROP TABLE images`
    response.drop_images = drop_images
    response.create_images = await sql`CREATE TABLE images (
        id SERIAL,
        filepath TEXT NOT NULL,
        processed TEXT,
        data TEXT,
        raw TEXT,
        created TEXT,
        updated TEXT);`
    
    console.log('CreateDB:', response)
}

export default CreateDB