'use client'

import FileUploadForm from '../components/FileUploadForm'
import Navbar from '../components/Navbar'

export default function Upload() {
    const onClick = () => {
        let frm = document.querySelector('#uploadForm:valid')
        if(frm) {
            frm.querySelector('#uploadButton')?.click()
        } else {
            frm = document.querySelector('#uploadForm')
            frm.querySelector('input[type=file]')?.click()
        }
        
    }
    const navItems = [
        {
            label: 'Home',
            onClick: onClick,
            icon: ':D'
        },
        {
            label: 'Upload',
            onClick: onClick,
            icon: '\\o/'
        },
        {
            label: 'Lorem',
            onClick: onClick,
            icon: ':('
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