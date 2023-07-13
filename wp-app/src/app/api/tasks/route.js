import { NextResponse } from 'next/server'
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
  const db = null

  const insertOrUpdate = async (data) => {
    if (! 'uid' in data) return false

    // Search if exists by uid
    db.get('SELECT uid FROM players WHERE uid = ?', [data.uid], (err, row) => {
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
      } else {
        if (typeof row != 'undefined' && 'uid' in row) {
          const sets = []
          if(data.power) sets.push(`power = '${data.power}'`)
          if(data.kills) sets.push(`kills = '${data.kills}'`)
          if(data.modern_kills) sets.push(`mkills = '${data.modern_kills}'`)
          if(data.image) sets.push(`image = '${data.image}'`)
          const s_sets = sets.length ? sets.join(',') : false
          if(s_sets){
            db.run(` UPDATE players SET ${s_sets} WHERE uid = '${row.uid}'`)
          }
        }
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
      if (row && 'uid' in row) {
        const sets = []
        if(data.atp) sets.push(`atp = '${data.atp}'`)
        if(data.collected) sets.push(`collected = '${data.collected}'`)
        if(data.contributions) sets.push(`contributions = '${data.contributions}'`)
        if(data.assists) sets.push(`assists = '${data.assists}'`)
        if(data.aditional) sets.push(`aditional = '${data.aditional}'`)
        const s_sets = sets.length ? sets.join(',') : false
        if(s_sets) {
          db.run(`UPDATE players SET ${s_sets} WHERE uid = '${row.uid}'`)
        }
      }
    })
  }

  const asyncProccess = data => {
    if (typeof data != 'object') return false
    
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
