import { NextResponse } from 'next/server'
import Player from '../../components/Player'
import Image from '@/app/components/Image'

export async function GET( req ) {
    const { searchParams } = new URL(req.url)
    const list = searchParams.get('list')
    const nothing_here = {'nothing': 'here'}
    if(list == null) return NextResponse.json(nothing_here)
    try {
        const player = new Player()
        let users = await player.getUsers(3)
        return NextResponse.json(users && users.length > 0 ? users : 'nothing_here') 
    } catch ( err ) {
        console.log('Retrying getting users after re/create the tables', err)
    }
    
    return NextResponse.json(nothing_here)
}
