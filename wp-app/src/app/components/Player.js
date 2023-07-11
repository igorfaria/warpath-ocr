import sqlLite from './sqlLite'
import ImageOCR from './ImageOCR'
import moment from 'moment'

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
        created: null,
        updated: null
      }
      this.state = {...this.state, ...props}
    }
    
    processImage = async (filepath) => {
      const data = await ImageOCR(filepath)
      if(typeof data == 'object'){
        if ('uid' in data) {
          this.insertOrUpdate(data)
        } else {
          this.insertOrUpdateData(data)
        }
      }
      return false
    }

    insertOrUpdate = (data) => {
      if (! 'uid' in data) return false
      const db = sqlLite()
      // Search if exists by uid
      db.get('SELECT uid FROM players WHERE uid = ?', [data.uid], (err, row) => {
        if (typeof row == 'undefined' || ! 'uid' in row) {
          db.run(`
          INSERT INTO players 
            (uid, name, power, kills, modern_kills, image, created)
          VALUES( 
            '${data.uid}',
            '${data.name}',
            '${data.power}',
            '${data.kills}',
            '${data.modern_kills}',
            '${data.image}',
            '${moment().format('YYYY-MM-DD HH:mm:ss')}'
          )
          `)
            
        } else {
          if (typeof row != 'undefined' && 'uid' in row) {
            const sets = []
            if(data.power) sets.push(`power = '${data.power}'`)
            if(data.kills) sets.push(`kills = '${data.kills}'`)
            if(data.modern_kills) sets.push(`modern_kills = '${data.modern_kills}'`)
            if(data.image) sets.push(`image = '${data.image}'`)
            let s_sets = sets.length ? sets.join(',') : false
            if(s_sets){
              s_sets = `${s_sets}, updated = '${moment().format('YYYY-MM-DD H:i:s')}'`
              db.run(` UPDATE players SET ${s_sets} WHERE uid = '${row.uid}'`)
            }
          }
        }
      })
      db.close()
    }

    insertOrUpdateData = (data) => {
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
      const wild = name.replace(/([\.\~\-\=\_\(\)\{\}\/]+)/g, '%').trim()
      const remove_begin = data.name.slice(4, -2).trim()
      const remove_end = data.name.slice(0, -4).trim()
  
      const db = sqlLite()
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
          if(data.contributed) sets.push(`contributed = '${data.contributed}'`)
          if(data.assisted) sets.push(`assisted = '${data.assisted}'`)
          if(data.additional) sets.push(`additional = '${data.additional}'`)

          let s_sets = sets.length ? sets.join(',') : false
          if(s_sets) {
            s_sets = `${s_sets}, updated = '${moment().format('YYYY-MM-DD H:i:s')}'`
            db.run(`UPDATE players SET ${s_sets} WHERE uid = '${row.uid}'`)
          }
        }
      })
      db.close()
    }
  
    render() {
      console.log('Render', 'Player')
      return (<></>)
    }
}