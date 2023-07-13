import { NextResponse } from 'next/server'
import Player from '@/app/components/Player'

export async function POST(req) {
  let response = []
  const formData = await req.formData()
  const formDataEntryValues = Array.from(formData.values())

  for (const formDataEntryValue of formDataEntryValues) {
    if (typeof formDataEntryValue === 'object' && 'arrayBuffer' in formDataEntryValue) {
      const image = new Image()
      response.image = image.save(formDataEntryValue)
      response.push(response.image)
      response.player = await image.processImage(response.image)
      console.log('Upload response', response.player)
    }
  }
  
  return NextResponse.json({ response: response })
}
