import { NextResponse } from 'next/server'
//import sqlLite from '@/app/components/sqlLite'
//import Images from '@/app/components/Images'
//import ImageOCR from '@/app/components/ImageOCR'
import Player from '@/app/components/Player'

export async function GET( req ) {
    const { searchParams } = new URL(req.url)
    const list = searchParams.get('list')
    if(list == null || list.length == 0) return NextResponse.json([{'nothing': 'here'}])

    const images = list.split(',')
    images.forEach( async i =>  { 
      await (new Player).processImage(i) 
    })

  return NextResponse.json(list)
}
