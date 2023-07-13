import { sql, VercelPool } from '@vercel/postgres'
import ImageOCR from './ImageOCR'
import moment from 'moment'
import Image from './Image'

export default class Player  {
    constructor(props = {}) {
      this.state = {
        uid: null,
        name: '',
        power: 0,
        atp: 0,
        kills: 0,
        modern_kills: 0,
        lost: 0,
        collected: 0,
        contributed: 0,
        assisted: 0,
        iprofile: 0,
        istats: 0,
        created: moment().format('YYYY-MM-DD HH:mm:ss'),
        updated: null
      }
      this.state = {...this.state, ...props}
    }
    
    processImage = async (filepath) => {
      const data = await ImageOCR(filepath)
      if(typeof data == 'object'){
        // stores image's info
        const insertImage = await (new Image()).insert({
          filepath: filepath,
          processed: data.processed,
          data: data,
          raw: data.text
        })
        // proceed with player things
       // console.log('Image', insertImage)     
        if(true || insertImage) {  

           // console.log('Image inserted on DB:',filepath)
          //  console.log('Image data:', data)
            if ('uid' in data) {
                let result = await this.insertOrUpdate(data) 
                console.log('Entered INSERT', data.name, result)
                if(result) {
                  console.log('Player inserted on DB', data)
                }
            } else {
                let result = await this.insertOrUpdateData(data)
                console.log('Entered on UPDATE', data.name, result)
                if(result) {
                  console.log('Player updated on DB', data) 
                }
            }
        }
        return true // :D ?
      }
      return false
    }

    insertOrUpdate = async (data) => {
      if (! 'uid' in data) return -1
      // Search if exists by uid
      const { rows } = await sql`SELECT * FROM players WHERE uid=${data.uid} LIMIT 1`
      //console.log('rows', rows) 
      if(typeof rows == 'object' && rows.length){ 
        rows.map( async row => {
          if (typeof row != 'undefined' && 'uid' in row) {
              const data_power = parseFloat(data.power) > 0 ? parseFloat(data.power) : row.power
              const data_kills = parseFloat(data.kills) > 0 ? parseFloat(data.kills) : row.kills
              const data_modern_kills = parseFloat(data.modern_kills) > 0 ? parseFloat(data.modern_kills) : row.modern_kills
              const data_image = parseFloat(data.image) > 0 ? parseFloat(data.image) : row.image
              return await sql`UPDATE players 
                  SET power=${data_power},kills=${data_kills},
                  modern_kills=${data_modern_kills}, 
                  image=${data_image},
                  updated=${moment().format('YYYY-MM-DD HH:mm:ss')} 
                  WHERE uid=${row.uid}`
          }
        })
      } else {
          let result = await sql `
          INSERT INTO players 
            (uid, name, power, kills, modern_kills, image, created)
          VALUES(${data.uid},${data.name},${data.power},${data.kills},${data.modern_kills},${data.image},${this.state.created}) 
          ON CONFLICT (uid) DO NOTHING`
          //console.log('Insert player info', result)
          return result
      }
      return -2
    }

    insertOrUpdateData = async (data) => {
      if (typeof data == 'undefined' || !'name' in data) return false
      
      // TRRRRY to search if exists by name
      let name = data.name
      let first = name.length > 10 ? 3 : 1
      let second = (name.length > 10 ? 3 : 1) * -1
  
      const sliced_name = data.name.slice(first, second).trim()
      const ZeroToO = name.replace(/[0]+/gi, 'O')
      const OToZero = name.replace(/[O]+/gi, '0')
      const OneToI = name.replace(/[1]+/gi, 'I')
      const OneToL = name.replace(/[1]+/gi, 'l')
      const LneTo1 = name.replace(/[l]+/gi, '1')
      const wild = '%' + name.replace(/([\.\~\-\=\_\(\)\{\}\/]+)/g, '%').trim() + '%'
      const remove_begin = '%' + data.name.slice(4, -2).trim()
      const remove_end = data.name.slice(0, -4).trim() + '%'
      
      console.log('Starting to search for the name')
      const {rows} = await sql`SELECT uid, name FROM players 
      WHERE 
          name ILIKE  ${name}
          OR
          SIMILARITY(name,${name}) > 0.5 
          OR
          name ILIKE  ${ZeroToO}
          OR
          name ILIKE  ${OToZero}
          OR
          name ILIKE  ${OneToI}
          OR
          name ILIKE  ${OneToL}
          OR
          name ILIKE  ${LneTo1}
          OR
          name ILIKE  ${remove_begin}
          OR
          name ILIKE  ${remove_end}
          OR
          name ILIKE  ${sliced_name}
          OR
          name ILIKE  ${wild}
        LIMIT 1`
        
      console.log('Search UID by name', rows)
      if (rows && rows[0] && 'uid' in rows[0]) {
          
          return await sql`UPDATE players 
            SET 
              atp=${data.atp}, collected=${data.collected}, 
              contributed=${data.contributed}, assisted=${data.assisted}, 
              additional=${data.additional},updated=${moment().format('YYYY-MM-DD H:i:s')}
            WHERE uid = ${rows[0].uid}`
          }
    }
  
    render() {
      console.log('Render', 'Player')
      return (<></>)
    }
}