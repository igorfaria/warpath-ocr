import { NextResponse } from 'next/server'
import Player from '@/app/components/Player'

export async function POST(req) {
  const formData = await req.formData()
  const formDataEntries = formData.entries()
  const data = {}
  for (const field of formDataEntries) { 
    data[field[0]] = field[1]
  } 
  const player_update = await (new Player()).update(data)
  if(player_update) {
    console.log('Player info updated with success', player_update)
    return NextResponse.json({ response: true })
  }
  console.log('Player info updated failed', player_update)
  return NextResponse.json({ response: false })
}