import React from 'react'

export default class Player extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        uid: null,
        name: '',
        power: 0,
        atp: 0,
        kills: 0,
        mkills: 0,
        lost: 0,
        collected: 0,
        contributions: 0,
        assists: 0,
        iprofile: 0,
        istats: 0,
        
        created: null,
        updated: null
      }
    }
  
    render() {
      console.log('Render', 'Player')
      return (<></>)
    }
}