import React from 'react'
import Image from 'next/image'

const ImagePreview = ({ images, onRemove }) => {

  return (
      <div className="w-full grid grid-cols-12 gap-2 my-2">
        {images.map((image, idx) => {
          return (
            <div className="relative col-span-3" key={idx}>
              <Image 
                width={420}
                height={420*2.5}
                src={typeof image == 'object' ? URL.createObjectURL(image) : image} alt={image} className="object-cover" />
                <div className='img-actions'>
                  <button 
                    onClick={() => onRemove(idx)}
                    type='button' 
                    className='img-remove'>Remove image</button>
                </div>
            </div>
          );
        })}
      </div>
  );
};

export default ImagePreview;
