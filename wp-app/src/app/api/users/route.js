import { NextResponse } from 'next/server'
import CreateDB from '../../components/CreateDB'
import Users from '../../components/Users'

export async function GET( req ) {
   
    const { searchParams } = new URL(req.url)
    const list = searchParams.get('list')
    const nothing_here = {'nothing': 'here'}
    if(list == null) return NextResponse.json(nothing_here)
    let users = false
    try {
        users = Users()
    } catch ( e ) {
        if(CreateDB()){ 
            users = false
            try {
                users = Users()
            } catch (err) {
                console.log('Retrying getting users after re/create the tables', err)
            }
        }
    }
    return NextResponse.json(users && users.length ? users : nothing_here)
}