'use client'
import React from "react";

const CustomFileSelector = (props) => {
  return (
    <div className='file-container'>
      <input
        {...props}
        type="file"
        multiple
        required
        className='file-input'
      />
    </div>
  );
};

export default CustomFileSelector;
