import React, { useState } from "react";

const UploadAndDisplayImage = ({handleChange}) => {
  const [selectedImage, setSelectedImage] = useState(null);

  return (
    <div>
        <label>Logo</label>
      {selectedImage && (
        <div className="flex flex-row items-center">
        <img alt="not found" width={"100px"} height={'100px'} src={URL.createObjectURL(selectedImage)} />
        <br />
        <button className="button" onClick={()=>setSelectedImage(null)}>Remove</button>
        </div>
      )}
      {!selectedImage &&
      <input
        type="file"
        name="DX co Logo"
        className="form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
        onChange={(e) => {
          setSelectedImage(e.target.files[0]);
          handleChange(e)
        }}
      />
    }
    </div>
  );
};

export default UploadAndDisplayImage;