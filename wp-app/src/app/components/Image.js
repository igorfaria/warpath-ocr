import moment from 'moment'
import { sql } from '@vercel/postgres'
import fs from 'fs'
import Player from './Player'

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

    save = async (file) => {
      const buffer = Buffer.from(await file.arrayBuffer())    
      const image_path = path.resolve('./public', 'images', `${file.name}`);
      fs.writeFileSync(image_path, buffer)
      const player = await (new Player()).processImage(image_path)
      return {'filepath' :image_path, 'player': player}
    }

    insert = async (data) => {
      data = {
        ...this.state,
        ...data,
      }
      
      if(data.filepath.length == 0) return false

      try {
        const query = await sql`INSERT INTO images 
        (filepath, processed, data, raw, created) 
        VALUES (${data.filepath},${data.processed},${JSON.stringify(data.data)},${data.raw},${data.created})`
        return query
      } catch (err) {
          console.log(err)
      }
      return false
    }
  

    render() {
      console.log('Render', 'Image')
      return (<></>)
    }
}