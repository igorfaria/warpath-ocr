'use client' 

import React, { useState } from 'react'
import CustomFileSelector from './CustomFileSelector'
import ImagePreview from './ImagePreview'
import axios from 'axios'
import classNames from 'classnames'
import UploadIcon from './icons/UploadIcon'
import NextIcon from './icons/NextIcon'
import './styles/FileUploadForm.css'

const FileUploadForm = () => {
    const [images, setImages] = useState([])
    const [uploading, setUploading] = useState(false)
    const handleFileSelected = (e) => {
      if (e.target.files) {
        const _files = Array.from(e.target.files)
        setImages(_files)
      }
    };

    const handleSubmit = async (e) => {
        e.preventDefault()
        const formData = new FormData()
        images.forEach((image, i) => {
          formData.append(image.name, image)
        });
        setUploading(true);
        await axios.post('/api/upload', formData)
        setUploading(2)
    }
    
    const onRemove = (idx) => {
      if(confirm('Are you sure? :P')){
        const removed = images.filter( (v,i) => {
          if(i == idx) return false
          return true
        })
        setImages(removed)
      }
    }

    if(uploading == 2) {
      return (<div>
          <div className='page-title'><code>Completed \o/</code></div>
          <br></br>
          <div className='page-title'><code>Go to <a href='/review/' class='click-here primary'>review <NextIcon /></a></code></div>
          <br /><br /><br />
          <a href='/upload/' class='click-here primary'>Do you want to upload more?</a>
      </div>)
    }

    return (
      <form id='uploadForm' className="w-full" onSubmit={handleSubmit}>
        {uploading ? "Uploadiando :P" : ''}
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
        <ImagePreview images={images} onRemove={onRemove} />
      </form>
    );
  };
  
  export default FileUploadForm;
