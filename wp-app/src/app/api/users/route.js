import { NextResponse } from 'next/server'
import Users from '../../components/Users'

export async function GET( req ) {
   
    const { searchParams } = new URL(req.url)
    const list = searchParams.get('list')
    const nothing_here = {'nothing': 'here'}
    if(list == null) return NextResponse.json(nothing_here)
    let users = false
    try {
        users = await Users()
    } catch ( e ) {
        console.log('Retrying getting users after re/create the tables', err)
     }
    
    return NextResponse.json(users && users.length ? users : nothing_here)
}