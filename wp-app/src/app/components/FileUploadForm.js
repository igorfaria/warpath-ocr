'use client' // Make this component a client component

import React, { useState } from 'react'
import CustomFileSelector from './CustomFileSelector'
import ImagePreview from './ImagePreview'
import axios from 'axios'
import classNames from 'classnames'
import './styles/FileUploadForm.css'

const FileUploadForm = () => {
    const [images, setImages] = useState([]);
    const [uploading, setUploading] = useState(false);
    const handleFileSelected = (e) => {
      if (e.target.files) {
        //convert `FileList` to `File[]`
        const _files = Array.from(e.target.files);
        setImages(_files);
      }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        alert('VALIDATE');
        const formData = new FormData();
        images.forEach((image, i) => {
          formData.append(image.name, image);
        });
        setUploading(true);
        await axios.post('/api/upload', formData);
        setUploading(false);
    };

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
            Upload
            </button>
        </div>
        <ImagePreview images={images} />
      </form>
    );
  };
  
  export default FileUploadForm;
