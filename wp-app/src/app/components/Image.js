import moment from 'moment'
import { sql, createClient } from '@vercel/postgres'

export default class Image  {

    constructor(props = {}) {
      this.state = {
        id: null,
        filepath: '',
        processed: '',
        data: {},
        raw: '',
        created: moment().format('YYYY-MM-DD HH:mm:ss'),
        updated: null
      }
      this.state = {...this.state, ...props}
    }


    insert = async (data) => {
      data = {
        ...this.state,
        ...data,
      }
      
      if(data.filepath.length == 0) return false

      try {
        const query = await sql`INSERT INTO images 
        (filepath, processed, data, raw, created, type) 
        VALUES (${data.filepath},${data.processed},${JSON.stringify(data.data)},${data.raw},${data.created}, ${data.data.type})`
        return query
      } catch ( err ) {
          console.log(err)
      }
      return false
    }
  
    getInfo = async (filepath='', limit=1) => {
      if(typeof limit != 'number') return -1
      let client = null
      try {
          client = createClient()
          await client.connect()
          const WHERE = (typeof filepath == 'string' && filepath.length > 0) 
          ? 'WHERE filepath="' + filepath + '"'
          : ''
          const query = 'SELECT DISTINCT filepath, * FROM images '+WHERE+' ORDER BY created DESC LIMIT ' + limit
        
          const { rows } = await client.query(query)
          // console.log('getInfo', rows)
          if(typeof rows == 'object' && rows.length ) {
              return WHERE.length == 0 ? rows : rows[0]
          } else {
            return -2 
          }
      } catch ( err ) {
          console.log('Error getting image:', filepath, err)
      } finally {
        client.end()
      }
      return -3
    }

    getData = ( text = '', profileOrStats = 'profile' ) => {

        if(typeof text !="string" || text.length == 0) return false
        const lines = text.split('\n')
        const data = {}
        switch(profileOrStats){
          case 'stats':
              data.atp = this.matchATP(text)
              data.lost = this.matchLost(text)
              data.collected = this.matchColleted(text)
              data.contributed = this.matchContributed(text)
              data.assisted = this.matchAssisted(text)
            break
          default: 
            data.uid = this.matchUID(text)
            data.name = (lines.length > 0) ? this.matchName(lines[1]) : null
            data.power = this.matchPower(text)
            data.kills = this.matchKills(text)
            data.modern_kills = this.matchModernKills(lines)
        }
        return data
    }

    matchUID = ( text = '' ) => {
      const uid = text.match(/.+[i1]d.+?\s?(?<uid>[0-9]+)/i)
			return (uid && 'groups' in uid) ? uid.groups.uid.replace(/[^\d]/gi, '') : null
    }

    matchName = ( text = '' ) => {
      return text.split(' ').filter(l => {
				return l.length > 3
			}).join(' ')
			.trim()
    }
    
    matchPower = ( text = '' ) => { 
      const power = text.match(/p.wer.+?\s?(?<power>[\.\d+]+)(?<unit>[km]{1})/i)
      if(power && 'groups' in power && 'power' in power.groups) {
        return power.groups.power + ('unit' in power.groups ? power.groups.unit.toUpperCase() : 'M')
      }
      return 0
    }

    matchKills = ( text = '' ) => {
      const kills = text.match(/[kills|kilis].+?\s?(?<kills>[\.\d+]+)(?<unit>[km]+)/i)
			if(kills && 'groups' in kills && 'kills' in kills.groups) {
				return kills.groups.kills + ('unit' in kills.groups ? kills.groups.unit.toLowerCase() : 'k')
			} 
      return 0
    } 

    matchModernKills = ( lines = [] ) => {
      if(typeof lines != 'object' && lines.length == 0) return 0
      let text = lines.slice(-2).join('');
      if(text.replace(/[^\dk\.]/gi, '') == ''){
        return 0
      }
      //let modern_kills = text.match(/.+?\s?(?<m1>[\.\d]+).+?\s?(?<m2>[\.\d]+)/ig)
      let modern_kills = text.match(/(?<mk1>[\d{2,5}?\.\w{1}]).+(?<mk2>[\d{2,5}?\.\w{1}])/i)[0].split(' ')
      if(modern_kills.length) {
        modern_kills = modern_kills.filter( value => {
            let match = value.match(/\d{2,5}/gi)
            return (match != null)
          })
          let add = 0
          modern_kills.map( value => {
            value = value.match(/\d{2,10}?\.\w{1}/gi, '0')
            if(value != null){ 
              value = value[0]
              try {
                value = parseFloat(value)
                if(value) add += value
              } catch ( err ) {  }
            } 
            return value
          })
          modern_kills = add
			} 
			if (!modern_kills) modern_kills = 0 
      return modern_kills
    }
   
    matchATP = ( text = '' ) => {
      const atp = text.match(/time.+power.+?\s?(?<atp>[\.\d{2,10}]+)/i)
			if(atp && 'groups' in atp && 'atp' in atp.groups) {
				return atp.groups.atp + 'M'
			} 
      return 0
    } 

    matchLost = ( text = '' ) => {
      const lost = text.match( /lost.+?\s?(?<lost>[\.\d+]+)/i)
			if(lost && 'groups' in lost && 'lost' in lost.groups) {
				return lost.groups.lost + 'k'
			} 
      return 0
    } 

    matchColleted = ( text = '' ) => {
      const collected = text.match(/collected.+?\s?(?<collected>[\.\d+]+)(?<unit>[kmb]+)/i)
			if(collected && 'groups' in collected && 'collected' in collected.groups) {
				return collected.groups.collected + ('unit' in collected.groups ? collected.groups.unit : 'M')
			}
      return 0
    } 

    matchContributed = ( text = '' ) => {
      const contributed = text.match(/contributions.+?\s?(?<contributed>[\.\d+]+)(?<unit>[kmb]+)/i)
			if(contributed && 'groups' in contributed && 'contributed' in contributed.groups) {
				return contributed.groups.contributed + ('unit' in contributed.groups ? contributed.groups.unit.toUpperCase() : 'B')
      } 
      return 0
    }

    matchAssisted = ( text = '' ) => {
      const assisted = text.match(/[assists|'I:{sﬂil?;].+?\s?(?<assisted>[\.\d+]+)(?<unit>[kmb]+)/i)
			if(assisted && 'groups' in assisted && 'assisted' in assisted.groups) {
				return assisted.groups.assisted +  ('unit' in assisted.groups ? assisted.groups.unit : 'B')
			} 
      return 0
    } 

    render() {
      console.log('Render', 'Image')
      return (<></>)
    }
}