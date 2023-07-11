import React from 'react'

export default class Image extends React.Component {
    constructor(props = {}) {
      this.state = {
        id: null,
        path: '',
        processed: '',
        data: {},
        raw: '',
        created: null,
        updated: null
      }
      this.state = {...this.state, ...props}
    }
  

    render() {
      console.log('Render', 'Image')
      return (<></>)
    }
}