import { NextResponse } from 'next/server'
import Users from '../../components/Users'
//import sqlLite from '../../components/sqlLite'

export async function GET( req ) {
    const { searchParams } = new URL(req.url)
    const list = searchParams.get('list')
    const nothing_here = {'nothing': 'here'}
    if(list == null) return NextResponse.json(nothing_here)
    const users = Users()
    return NextResponse.json(users && users.length ? users : nothing_here)
}