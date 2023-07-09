import { NextResponse } from 'next/server'
import sqlLite from '@/app/components/sqlLite'
import Images from '@/app/components/Images'
import ImageOCR from '@/app/components/ImageOCR'

export async function GET(req) {

  let url = req?.url.split('?')
  url = url.length ? url[0] : url.join('?')
  let current_index = req?.url?.match(/\?i=(\d+)/gi)[0].replace(/\D+/, '')
  current_index = !current_index ? 1 : current_index
  const next_index = parseInt(current_index) + 1
  const quantity = 3

  const images_list = await Images(current_index, quantity)

  if (images_list.length == 0)
    return NextResponse.json({ 'files': 'The are no images to proccess', success: true })

  const response = {}
  const db = sqlLite()

  const insertOrUpdate = async (data) => {
    if (! 'uid' in data) return false

    // Search if exists by uid
    db.get('SELECT uid FROM players WHERE uid = ?', [data.uid], (err, row) => {
      if (err) {
        // console.error(err.message)
      }
      if (typeof row == 'undefined' || ! 'uid' in row) {
        db.run(`
        INSERT INTO players 
          (uid, name, power, kills, mkills, image)
        VALUES( 
          '${data.uid}',
          '${data.name}',
          '${data.power}',
          '${data.kills}',
          '${data.modern_kills}',
          '${data.image}'
        )
        `)
        // console.log('INSERT PLAYER', data.name)
      } else {
        if (typeof row != 'undefined' && 'uid' in row) {
          db.run(`
          UPDATE players 
          SET
            name = '${data.name}',
            power = '${data.power}',
            kills = '${data.kills}',
            mkills = '${data.modern_kills}',
            image = '${data.image}'
          WHERE uid = '${row.uid}'
          `)
        }
        // console.log("UPDATE BASIC INFO PLAYER", data.name)
      }
    })

  }

  const insertOrUpdateData = (data) => {
    if (typeof data == 'undefined' || !'name' in data) return false
    // Search if exists by name
    let name = data.name
    let first = name.length > 10 ? 3 : 1
    let second = (name.length > 10 ? 3 : 1) * -1

    const sliced_name = data.name.slice(first, second).trim()
    const ZeroToO = name.replace(/[0]+/gi, 'O')
    const OToZero = name.replace(/[O]+/gi, '0')
    const OneToI = name.replace(/[1]+/gi, 'I')
    const OneToL = name.replace(/[1]+/gi, 'l')
    const LneTo1 = name.replace(/[l]+/gi, '1')
    const wild = name.replace(/([\.\~\-\=\_\(\)\{\}\/]+)/g, '%').trim()
    const remove_begin = data.name.slice(4, -2).trim()
    const remove_end = data.name.slice(0, -4).trim()

    db.get(`SELECT uid FROM players WHERE 
    ( 
      name LIKE '${name}'
      OR
      name LIKE '${ZeroToO}~'
      OR
      name LIKE '${OToZero}~'
      OR
      name LIKE '%${OneToI}%'
      OR
      name LIKE '%${OneToL}%'
      OR
      name LIKE '%${LneTo1}%'
      OR
      name LIKE '%${remove_begin}%'
      
      OR
      name LIKE '%${remove_end}%'
      OR
      name LIKE '%${sliced_name}%'
      OR
      name LIKE '~${sliced_name}~'
      OR
      name LIKE '%${wild}%'
    )
    LIMIT 1
    `, [], (err, row) => {
      if (err) {
        // console.error(err.message)
      }
      if (row && 'uid' in row) {
        db.run(`
            UPDATE players 
            SET
             atp = '${data.atp}',
             lost = '${data.lost}',
             collected = '${data.collected}',
             contributions = '${data.contributions}',
             assists = '${data.assists}',
             aditional = '${data.aditional}'
          WHERE uid = '${row.uid}'
          `)
        // console.log("UPDATE ADDITIONAL INFO PLAYER", data.name)
      } else {
        // console.log('ADITIONAL FALSE: ', data.name, data)
      }
    })
  }

  const asyncProccess = data => {
    if (typeof data != 'object') {
      // console.error('data variable its not a object', typeof data, data)
      return false
    }
    const value = data
    if ('uid' in value) {
      insertOrUpdate(value)
    } else {
      insertOrUpdateData(value)
    }

  }

  images_list.map(async (image) => {
    asyncProccess(await ImageOCR(image))
  })

  return NextResponse.json({ 'next_url': `${url}/?i=${next_index}` })
  return NextResponse.redirect(`${url}/?i=${next_index}`)
}
