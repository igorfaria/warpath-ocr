import fs from 'fs'
import { NextResponse } from 'next/server'
import Player from '@/app/components/Player'

export async function POST(req) {
  let response = []
  const formData = await req.formData()
  const formDataEntryValues = Array.from(formData.values())
  for (const formDataEntryValue of formDataEntryValues) {
    if (typeof formDataEntryValue === 'object' && 'arrayBuffer' in formDataEntryValue) {
      try {
        const file = formDataEntryValue
        const buffer = Buffer.from(await file.arrayBuffer())
        const image_path = `public/images/${file.name}`
        fs.writeFileSync(image_path, buffer)
        response.push(image_path)
        response.player = await (new Player).processImage(image_path)
        //console.log('Upload response api-upload:', response.player.name) 
      } catch(err) {
        console.log('Error on api-upload:', response, err)
      }
    }
  }
  
  return NextResponse.json({ response: response })
}