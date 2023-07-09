import { NextResponse } from 'next/server'
import Users from '../../components/Users'

export async function GET( req ) {
    const { searchParams } = new URL(req.url)
    const list = searchParams.get('list')
    if(list == null) return NextResponse.json([{'nothing': 'here'}])
    return NextResponse.json(Users())
}

