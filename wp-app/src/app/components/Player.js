import sqlLite from './sqlLite'
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
        created: null,
        updated: null
      }
      this.state = {...this.state, ...props}
      this.db = sqlLite()
    }
    
    destructor() {
        this.db.close()
    }
    
    processImage = async (filepath) => {
      const data = await ImageOCR(filepath)
      if(typeof data == 'object'){
        // stores image's info
        const insertImage = (new Image()).insert({
          filepath: filepath,
          processed: data.processed,
          data: data,
          raw: data.text
        })
        // proceed with player things
        if(insertImage) {
            if ('uid' in data) {
                this.insertOrUpdate(data)
            } else {
                this.insertOrUpdateData(data)
            }
        }
        return true // :D ?
      }
      return false
    }

    insertOrUpdate = (data) => {
      if (! 'uid' in data) return false
      // Search if exists by uid
      this.db.serialize( () => {
      this.db.get('SELECT uid FROM players WHERE uid = ' + data.uid, (err, row) => {
        if (typeof row == 'undefined' || ! 'uid' in row) {
          this.db.serialize( () => {
            this.db.run(`
            INSERT INTO players 
              (uid, name, power, kills, modern_kills, image, created)
            VALUES(?,?,?,?,?,?,?)
            `, [
                data.uid,
                data.name,
                data.power,
                data.kills,
                data.modern_kills,
                data.image,
                moment().format('YYYY-MM-DD HH:mm:ss')
              ])
          })
        } else {
          if (typeof row != 'undefined' && 'uid' in row) {
            this.db.serialize( () => {
              this.db.run(`
                UPDATE players 
                  SET power=?, kills=?, modern_kills=?, image=?, updated=? 
                  WHERE uid = ?`, 
                  [
                    data.power,
                    data.kills,
                    data.modern_kills,
                    data.image,
                    moment().format('YYYY-MM-DD HH:mm:ss'),
                    row.uid
                  ])
            })
          }
        }      
      })
      })
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
      
      this.db.serialize( () => {
        this.db.get(`SELECT uid FROM players WHERE 
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
              this.db.serialize( () => {
                  this.db.run(`UPDATE players 
                    SET 
                      atp = ?, collected = ?, contributed = ?, assisted = ?, additional = ?, updated = ?
                    WHERE uid = ?`, 
                    [
                      data.atp,
                      data.collected,
                      data.contributed,
                      data.assisted,
                      data.additional,
                      moment().format('YYYY-MM-DD H:i:s'),
                      row.uid,
                    ])
                  })
            }
        })
      })
    }
  
    render() {
      console.log('Render', 'Player')
      return (<></>)
    }
}