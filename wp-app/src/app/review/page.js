'use client'
import { useEffect, useState } from 'react'
import axios from 'axios'
import EditForm from '../components/EditForm'
import Navbar from '../components/Navbar'
import HomeIcon from '../components/icons/HomeIcon'
import UploadIcon from '../components/icons/UploadIcon'
import EditIcon from '../components/icons/EditIcon'

export default function Review() {

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
    }, [])
    
    const navItems = [
        { 
            label: 'Home',
            onClick: () => {
                window.location = '/'
            },
            icon: HomeIcon()
        },
        {
            label: 'Review',
            onClick: () => {},
            icon: EditIcon()
        },
        {
            label: 'Upload',
            onClick: () => { 
                window.location = '/upload' 
            },
            icon: UploadIcon()
        }
    ]
    return (
        <main className="min-h-screen p-6 font-brother1816">
            <section key='title' className='container mb-10'>
                <h1 className='page-title'>REVIEW</h1>
            </section>

            <div>
                <EditForm users={users} />
            </div>
           
            <Navbar items={navItems} />
        </main>
    )
}