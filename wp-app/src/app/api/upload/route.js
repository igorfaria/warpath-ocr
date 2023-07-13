import { NextResponse } from 'next/server'
import Image from '@/app/components/Image'

export async function POST(req) {
  const formData = await req.formData()
  const formDataEntryValues = Array.from(formData.values())
  if(formDataEntryValues.length) {
    let image = new Image()
    for (const formDataEntryValue of formDataEntryValues) {
        if (typeof formDataEntryValue === 'object' && 'arrayBuffer' in formDataEntryValue) {
          image = await image.save(formDataEntryValue)
          if('filepath' in image){
            response.push(image.filepath)
            response.player = image.player
            window.image = image
          }
        console.log('Upload response', response)
      }
    }
  }
  return NextResponse.json({})
}

export async function GET( req ) {
  return NextResponse.json({'nothing': 'here'})
}