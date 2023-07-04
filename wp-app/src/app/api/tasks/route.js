import { NextResponse } from 'next/server'
import sqlLite from '@/app/components/sqlLite'
import Images from '@/app/components/Images'
import ImageOCR from '@/app/components/ImageOCR'

export async function GET(req) {
  
  let url = req?.url.split('?')
      url = url.length? url[0] : url.join('?')
  let current_index = req?.url?.match(/\?i=(\d+)/gi)[0].replace(/\D+/, '')
  current_index = !current_index ? 1 : current_index 
  const next_index = parseInt(current_index) + 1
  const quantity = 10

  const images_list = await Images(current_index, quantity)

  if(images_list.length == 0) 
    return NextResponse.json({ 'files': 'The are no images to proccess', success: true })

  
  const response = {}
  const db = sqlLite()
  
  const insertOrUpdate = async (data) => {
    if(! 'uid' in data) return false

    // Search if exists by uid
    db.get('SELECT uid FROM players WHERE uid = ?', [data.uid], (err, row) => {
      if (err) {
        console.error(err.message)
      }
      if( typeof row == 'undefined' || ! 'uid' in row ) { 
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
        console.log('INSERT PLAYER', data.name)
      } else {
        if(typeof row != 'undefined' && 'uid' in row){
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
        console.log("UPDATE BASIC INFO PLAYER", data.name)
      }
    })

  }

  const insertOrUpdateData = (data) => {
    if(typeof data == 'undefined' || !'name' in data) return false
      // Search if exists by name
      let name = data.name
      const half_name = Math.floor(name.length / 2)
      const first = name.slice(0, half_name)
      const second = name.slice(half_name)
      const sliced = data.name.slice(0,-3)
      db.get(`SELECT uid FROM players WHERE (name LIKE '%${first}%${second}%')`, [], (err, row) => {
        if (err) {
          console.error(err.message)
        }
        if( row && 'uid' in row ) { 
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
          console.log("UPDATE ADDITIONAL INFO PLAYER", data.name)
        } else {
          console.log('ADITIONAL FALSE: ', data.name)
        }
      })
  }

  const asyncProccess = data => {
    if(typeof data != 'object') { 
      console.error('data variable its not a object', typeof data, data)
      return false
    } 
    const value = data
    if('uid' in value) {
      insertOrUpdate(value)
    } else {
      insertOrUpdateData(value)
    }

  }    

  images_list.map ( async (image)  => {
      asyncProccess( await ImageOCR(image))
  })
  

  return NextResponse.json({'next_url' : `${url}/?i=${next_index}`})
  return NextResponse.redirect(`${url}/?i=${next_index}`)
}
