'use client'
import React from "react";

const CustomFileSelector = (props) => {
  return (
    <div class='file-container'>
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
