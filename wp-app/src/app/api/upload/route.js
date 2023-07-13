import { NextResponse } from 'next/server'
import Image from '@/app/components/Image'

export async function POST(req) {
  let response = []
  const formData = await req.formData()
  const formDataEntryValues = Array.from(formData.values())

  for (const formDataEntryValue of formDataEntryValues) {
      if (typeof formDataEntryValue === 'object' && 'arrayBuffer' in formDataEntryValue) {
        let image = new Image()
        response.image = await image.save(formDataEntryValue)
        console.log('Image on upload', response.image )
        if('filepath' in response.image){
          response.push(response.image)
          response.player = response.image.player
        }
      console.log('Upload response', response)
    }
  }
  return NextResponse.json({ response: response })
}