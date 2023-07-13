import moment from 'moment'
import { sql } from '@vercel/postgres'

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