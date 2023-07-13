import { NextResponse } from 'next/server'
import Image from '@/app/components/Image'

export async function POST(req) {
  let response = []
  const formData = await req.formData()
  const formDataEntryValues = Array.from(formData.values())

  for (const formDataEntryValue of formDataEntryValues) {
      if (typeof formDataEntryValue === 'object' && 'arrayBuffer' in formDataEntryValue) {
        const image = new Image()
        if('filepath' in image){
          response.image = image.save(formDataEntryValue)
          response.push(response.image)
          response.player = image.player
      }
      console.log('Upload response', response.player)
    }
  }
  return NextResponse.json({ response: response })
}