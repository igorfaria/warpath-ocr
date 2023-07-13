'use client'
import Navbar from '../components/Navbar'
import HomeIcon from '../components/icons/HomeIcon'
import UploadIcon from '../components/icons/UploadIcon'
import NextIcon from '../components/icons/NextIcon'

export default function Review() {

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
            icon: NextIcon()
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

            <section className='mt-15'>
                <p className='page-title'><code>Nothing here yet :P</code></p>
            </section>
           
            <Navbar items={navItems}/>
        </main>
    )
}