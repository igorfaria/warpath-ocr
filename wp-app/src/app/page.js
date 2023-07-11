'use client'
import { useState, useEffect} from 'react'
import axios from 'axios'
import TableUsers from './components/TableUsers'
import Navbar from './components/Navbar'
import HomeIcon from './components/icons/HomeIcon'
import UploadIcon from './components/icons/UploadIcon'
import NextIcon from './components/icons/NextIcon'

export default function Home() {
  const [users, setUsers] = useState([])

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect( () => {
    try {
      axios.get('/api/users?list=1').then( v => {
        setUsers(v.data)
      })
    } catch (err) {
      console.log('err', err)
    }
  })
  

  const uploadButton = () => {
     window.location = '/upload'
  }

  const goHome = () => {
      return false
  }

  const goReview = () => {
      window.location = '/review'
  }

  const navItems = [
      {
          label: 'Review',
          onClick: goReview,
          icon: NextIcon()
      },
      { 
          label: 'Home',
          onClick: goHome,
          icon: HomeIcon()
      },
      {
          label: 'Upload',
          onClick: uploadButton,
          icon: UploadIcon()
      }
      
  ]
  
  return (
    <main className="min-h-screen p-6 font-brother1816">
      <Navbar items={navItems} />
      <section key='title' className='container mb-10'>
      <h1><span className='page-title'>WARPATH</span> <span className='page-title'>LOL</span></h1>
      </section>
      {typeof users == 'object' && 'nothing' in users 
      ? (
        <div>
        <h1><code className='page-title'>Oh nooo :(</code></h1>
        <p className='mt-5'>Daaang, there are no players to present at the moment</p>
        </div>
        )
      : (
        <div className='container-scroll'>
          <TableUsers users={users} />
        </div>
      )
    }
      
    </main>
  )
}
