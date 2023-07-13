'use client' 

import React, { useState } from 'react'
import CustomFileSelector from './CustomFileSelector'
import ImagePreview from './ImagePreview'
import classNames from 'classnames'
import UploadIcon from './icons/UploadIcon'
import NextIcon from './icons/NextIcon'
import './styles/FileUploadForm.css'

import axiosQueue from '@/app/axiosQueue'
import ArrayChunks from './ArrayChunks'

const FileUploadForm = () => {
    const [images, setImages] = useState([])
    const [uploading, setUploading] = useState(false)
    const handleFileSelected = (e) => {
      if (e.target.files) {
        const _files = Array.from(e.target.files)
        setImages(_files)
      }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
      
        const chunks = ArrayChunks(images, 2)
        let counter = 0;
        
        chunks.forEach( chunk => {
          chunk.forEach( async image => {
            const formData = new FormData()
            formData.append(image.name, image)

            if(counter == 0) {
              setUploading(
                {
                  'count': counter + 1, 
                  'total': images.length, 
                  'response': 'starting'
                }
              )
            }
         
            const { data } = await axiosQueue.post('/api/upload', formData)
            
            //axios.then( ({data}) => {
              setUploading(
                  {
                    'count': counter + 1, 
                    'total': images.length, 
                    'response': data.response
                  }
                )
            //})
            counter++
        
        })
      })
        
    }
    
    const onRemove = (idx) => {
      if(confirm('Are you sure? :P')){
        const removed = images.filter( (v,i) => {
          return (i != idx)
        })
        setImages(removed)
      }
    }

    if( typeof uploading == 'object' && 'count' in uploading) {
      if(uploading.count > images.length){
        return (<div>
            <div className='page-title'>Completed \o/</div>
            <br /><br /><br />
            <div className='page-title'><code>Go to <a href='/review/' className='click-here primary'>review <NextIcon /></a></code></div>
            <br /><br /><br />
            <a href='/upload/' className='click-here primary'>Do you want to upload more?</a>
        </div>)
      } else {
        return (<div>
           <div className='page-title'><code>Working on it \o/</code></div>
           <br /><br /><br />
           <div className='page-title'><code>Progress {uploading.count}/{uploading.total}</code></div>
           <br /><br />
           <p>There is no magic here, so you need to patiently wait :D</p>
          </div>
          )
      }
    }

    const submitForm = () => {
      const button = document.querySelector("#uploadForm button[type='submit']")
      if(button) button?.click()
    }
  
    // <ImagePreview images={images} onRemove={onRemove} />
    return (
      <form id='uploadForm' className="w-full" onSubmit={handleSubmit}>
        <div className="flex justify-between columns-2 mb-10 file-shadow">
            <CustomFileSelector
            accept="image/jpg, image/jpeg"
            onChange={handleFileSelected} />
            <button
                type='submit'
                className={classNames({
                    'file-button':
                    true,
                    'disabled pointer-events-none opacity-60': uploading,
                })}
                id='uploadButton'
                disabled={uploading}
                >
            {UploadIcon()} Upload
            </button>
        </div>
        <div className='mt-10 flex flex-col'>
            {(typeof images == 'object' && images.length) ? (<><h1 className="page-title">UHUUUL \o/</h1><p className="page-title"><code>{images.length} selected files :D</code></p><p>Continue the upload by clicking on the <span className='primary-color bolder_font cursor-pointer' onClick={submitForm}>Upload</span> button (:</p></>) : ''}
            </div>
      </form>
    );
  };
  
  export default FileUploadForm;
