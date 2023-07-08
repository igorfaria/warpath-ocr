import React from 'react'

export default class Image extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        id: null,
        path: '',
        proccessed: '',
        data: {},
        raw: '',
        created: null,
        updated: null
      }
    }
  

    render() {
      console.log('Render', 'Image')
      return (<></>)
    }
}