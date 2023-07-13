import fs from 'fs'
import { NextResponse } from 'next/server'
import Player from '@/app/components/Player'

export async function POST(req) {
  let response = []
  const formData = await req.formData()
  const formDataEntryValues = Array.from(formData.values())
  for (const formDataEntryValue of formDataEntryValues) {
    if (typeof formDataEntryValue === 'object' && 'arrayBuffer' in formDataEntryValue) {
      const file = formDataEntryValue
      const buffer = Buffer.from(await file.arrayBuffer())
      
      const image_path = path.resolve('./public', 'images', `images/${file.name}`);

      
      fs.writeFileSync(image_path, buffer)
      response.push(image_path)
      response.player = await (new Player).processImage(image_path)
      console.log('Upload response', response.player)
    }
  }
  
  return NextResponse.json({ response: response })
}
