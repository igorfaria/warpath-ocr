import { NextResponse } from 'next/server'
import Users from '@/app/components/Users'

export async function GET(req) {
    const users = Users()
    return NextResponse.json(users)
}