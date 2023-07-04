import { NextResponse } from 'next/server'
import sqlLite from '@/app/components/sqlLite'

export async function GET(req) {

    const db = sqlLite(true)
    const response = []

   
    response.push(db.prepare(`SELECT * FROM players`).all())
    
    return NextResponse.json(response)

}