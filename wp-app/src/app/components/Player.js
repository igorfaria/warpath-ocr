import { sql, createClient } from '@vercel/postgres'
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

    getUsers = async (limit = 200, orderBy = 'uid DESC', where = 1) => {
      
      const query = `SELECT a.*, b.raw AS profile, c.raw AS stats 
        FROM players a
        LEFT JOIN
          images b
          ON b.filepath = a.image
        LEFT JOIN 
          images c
          ON c.filepath = a.additional
        WHERE $3 
        ORDER BY $2 DESC 
        LIMIT $1`
      const client = createClient()
      await client.connect()
      
      try {
         const image = new Image()
         let {rows} = await client.query(query, [limit, orderBy, where])
         const data = []

         rows.forEach(  async row => {
            row.info_profile = image.getData(row.profile, 'profile')
            row.info_stats =  image.getData(row.stats, 'stats')
            data.push(row)
         })

          //console.log('Player.getData', data)
         return data
      } catch ( err ) {
         console.log('Error searching for getUsers():', err)
      } finally {
         await client.end()
      }
      return []     
    }

    getDataByUID = async (uid = 0) => {
      if(!uid) return []
      let query = 'SELECT *  FROM players WHERE uid=$1 ORDER BY uid DESC LIMIT 1'
      
      const client = createClient()
      await client.connect()
      
      let row = null
      let found = false
      try {
         row = await client.query(query, [uid])
         row = row.rows
         found = (row && row [0] && 'uid' in row[0]) 
         if(found) row = row[0]
         console.log(found  ? 'Found' : 'Not found', 'getDataByUID', uid) 
         return row
      } catch ( err ) {
         console.log('Error searching for info by UID:', err)
      } finally {
         await client.end()
      }
      return false     
  }

  update = async ( data ) => {
      if(!'uid' in data || !data.uid) return -1

      const db_info = await this.getDataByUID(data.uid)
      const query = `UPDATE players SET name=$2,power=$3,atp=$4,kills=$5,modern_kills=$6,lost=$7,collected=$8,contributed=$9,assisted=$10,reviewed=$11,updated=$12 WHERE uid=$1`
      
      const values = [
         data.uid,
        'name' in data ? data.name : db_info.name,
        'power' in data ? data.power : db_info.power,
        'atp' in data ? data.atp : db_info.atp,
        'kills' in data ? data.kills : db_info.kills,
        'mkills' in data ? data.mkills : db_info.modern_kills,
        'lost' in data ? data.lost : db_info.lost,
        'resources' in data ? data.resources : db_info.collected,
        'tech' in data ? data.tech : db_info.contributed,
        'assists' in data ? data.assists : db_info.assisted,
        1, // reviewed
        moment().format('YYYY-MM-DD HH:mm:ss') //12
      ]
      //console.log(values)
      const client = createClient()
      await client.connect()
      try {
        const result = await client.query(query, values)// await sql`${query}`
        console.log('Updating user:', data.name)
        return result
      } catch (err) {
        console.log('Error updating user:', query, err)
      } finally {
          await client.end()
      }
      return false
    }
    
    processImage = async (filepath) => {
      console.log('Image processing:', filepath)
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
        
        if(true || insertImage) {
            if ('image' in data) {
              let result = await this.insertOrUpdate(data) 
              console.log('insertOrUpdate:', data.name, result ? 'Ok' : result)
            } else {
                let result = await this.insertOrUpdateData(data)
                console.log('insertOrUpdateData:', data.name, result ? 'Ok' : result)
            }
        }
        return true // :D ?
      }
      return false
    }

    insertOrUpdate = async (data) => {
      if (! 'uid' in data) return -1
      
      //data.uid = parseInt(data.uid)
      //console.log('data.uid', data)

      // Search if exists by uid
      const client = createClient()
      await client.connect()
      const { rows } = await sql`SELECT * FROM players WHERE uid=${data.uid} LIMIT 1`
      client.end()

      //console.log('rows', rows) 
      if(typeof rows == 'object' && rows.length){ 
        rows.map( async row => {
          if (typeof row != 'undefined' && 'uid' in row) {
              const data_power = data.power ? data.power : row.power
              const data_kills = data.kills ? data.kills : row.kills
              const data_modern_kills = data.modern_kills ? data.modern_kills : row.modern_kills
              const data_image = data.image ? data.image : row.image
              //const query = `UPDATE players SET power=${data.power},kills=${data_kills},modern_kills=${data_modern_kills},image=${data_image},updated=${moment().format('YYYY-MM-DD HH:mm:ss')} WHERE uid=${row.uid}`

              const query = `UPDATE players SET power=$1,kills=$2,modern_kills=$3,image=$4,updated=$5 WHERE uid=$6`
              const values = [
                data_power,
                data_kills,
                data_modern_kills,
                data_image,
                moment().format('YYYY-MM-DD HH:mm:ss'),
                row.uid
              ]
            
              const client = createClient()
              await client.connect()
              try {
                const result = await client.query(query, values)// await sql`${query}`
                console.log('Updating user:', row.name)
                return result
              } catch (err) {
                console.log('Error updating user:', query, err)
              } finally {
                  await client.end()
              }
          }
        })
      } else {
        const client = createClient()
        await client.connect()
          try {
            if(!data.uid) return -4
            // const query = `INSERT INTO players (uid, name, power, kills, modern_kills, image, created) 
            // VALUES(${data.uid},${data.name},${data.power},${data.kills},${data.modern_kills},${data.image},${this.state.created}) ON CONFLICT (uid) DO NOTHING`
            const query = 'INSERT INTO players (uid, name, power, kills, modern_kills, image, created) VALUES($1,$2,$3,$4,$5,$6,$7) ON CONFLICT (uid) DO NOTHING'
            const values = [
                data.uid, 
                data.name,
                data.power,
                data.kills,
                data.modern_kills,
                data.image,
                this.state.created
            ]
           
            const result = await client.query(query, values)
            console.log('Player.inserting:', result ? 'Ok' : 'NotOk')
            //const result = await sql `${query}`
            return result
          } catch (err) {
            console.log('Error inserting user:', query, err)
          } finally {
            await client.end()
          }
      }
      return -2
    }

    insertOrUpdateData = async (data) => {
      if (typeof data == 'undefined' || !'name' in data ) return false
      
      // TRRRRY to search if exists by name
      let name = data.name
      let first = name.length > 10 ? 3 : 2
      let second = (name.length > 10 ? 3 : 2) * -1
  
      const sliced_name = data.name.slice(first, second).trim()
      const ZeroToO = name.replace(/[0]+/gi, 'O').slice(1,-1)
      const OToZero = name.replace(/[O]+/gi, '0').slice(2,-2)
      const OneToI = name.replace(/[1]+/gi, 'I').slice(2, -3)
      const OneToL = name.replace(/[1]+/gi, 'l').slice(3, -1)
      const LneTo1 = name.replace(/[l]+/gi, '1').slice(4, -1)
      const wild = '%' + name.replace(/([\.\~\-\=\_\(\)\{\}\/]+)/g, '%').trim() + '%'
      const remove_begin = '%' + data.name.slice(3).trim()
      const remove_end = data.name.slice(0, -3).trim() + '%'
      
      //console.log('Searching for the name:', name)
      let query = 'SELECT uid, name, LENGTH(name) as letters, SIMILARITY(name,$12) as similarity  FROM players WHERE (name LIKE $1 OR SIMILARITY(name,$2) > 0.3 OR name LIKE $3 OR name LIKE $4 OR name LIKE $5 OR name LIKE $6 OR name LIKE  $7 OR name LIKE  $8 OR name LIKE  $9 OR name LIKE $10 OR name LIKE $11) ORDER BY similarity DESC LIMIT 1'
       let values = [
          name,
          name,
          ZeroToO,
          OToZero,
          OneToI, 
          OneToL,
          LneTo1,
          remove_begin,
          remove_end,
          sliced_name,
          wild,
          name
       ]
       const client = createClient()
       await client.connect()
       
       let rows = null
       let found = false
       try {
          rows = await client.query(query, values)
          rows = rows.rows
          found = (rows && rows[0] && 'uid' in rows[0]) 
          console.log(found  ? 'Found' : 'Not found', 'UID by name', name, !found ? values : '', !found ? rows : '') 
       } catch ( err ) {
          console.log('Error searching for name', err)
       } finally {
          await client.end()
       }
        query = ''
        if (found) {
            const row = rows[0]
            const data_atp = data.atp ? data.atp : row.atp
            const data_collected = data.collected ? data.collected : row.collected
            const data_assisted = data.assisted  ? data.assisted : row.assisted
            const data_additional = data.additional ? data.additional : row.additional
            const data_contributed = data.contributed ? data.contributed : row.contributed
           
            query = 'UPDATE players SET atp=$1,collected=$2,contributed=$3,assisted=$4,additional=$5,updated=$6 WHERE uid = $7'
            values = [
              data_atp,
              data_collected,
              data_contributed,
              data_assisted,
              data_additional,
              moment().format('YYYY-MM-DD H:i:s'),
              row.uid
            ]
            const client = createClient()
            client.connect()
            try {
              const result = await client.query(query, values)
              console.log('Updating infoData:', data.name, (result ? 'OK' : 'NOTOK'))

              
              return result
            } catch ( err) {
              console.log('Search query', query, err)
            } finally {
              await client.end()
            }
            } 
            
          return data
  }
  

  
    render() {
      return (<></>)
    }
}