import moment from 'moment'
import sqlLite from './sqlLite'

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
      this.db = sqlLite()
    }

    destructor(){
        try {
          this.db.close()
        } catch (e) {
          console.log(e)
        }
    }

    insert = async (data) => {
      data = {
        ...this.state,
        ...data,
      }
      
      if(data.filepath.length == 0) return false

      const values = [
          data.filepath,
          data.processed,
          JSON.stringify(data.data),
          data.raw,
          data.created
      ]   
      
      try {
        const query = `
          INSERT INTO images (filepath, processed, data, raw, created)
          VALUES (?,?,?,?,?)
        `
        this.db.serialize( () => {
          this.db.run(query, values)
        })
        this.db.close()
        return true
      } catch (err) {
          console.log(err, values)
      }
      this.db.close()
      return false
    }
  

    render() {
      console.log('Render', 'Image')
      return (<></>)
    }
}