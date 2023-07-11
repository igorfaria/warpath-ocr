'use client'
import FileUploadForm from '../components/FileUploadForm'
import Navbar from '../components/Navbar'
import HomeIcon from '../components/icons/HomeIcon'
import UploadIcon from '../components/icons/UploadIcon'
import NextIcon from '../components/icons/NextIcon'

export default function Upload() {
    const uploadButton = () => {
        let frm = document.querySelector('#uploadForm:valid')
        if(frm) {
            frm.querySelector('#uploadButton')?.click()
        } else {
            try {
                frm = document.querySelector('#uploadForm')
                frm.querySelector('input[type=file]')?.click()
            } catch (err) {
                window.location = '/upload'
            }
        }
    }

    const goHome = () => {
        window.location = '/'
    }

    const goReview = () => {
        alert('Go review')
    }

    const navItems = [
        { 
            label: 'Home',
            onClick: goHome,
            icon: HomeIcon()
        },
        {
            label: 'Upload',
            onClick: uploadButton,
            icon: UploadIcon()
        },
        {
            label: 'Review',
            onClick: goReview,
            icon: NextIcon()
        }
    ]

    return (
        <main className="min-h-screen p-6 font-brother1816">
            <section key='title' className='container mb-10'>
                <h1 className='page-title'>UPLOAD</h1>
            </section>
            <section key="upload-form" className='container mt-5'>
                <FileUploadForm />
            </section>

            <Navbar items={navItems}/>
        </main>
    )
}