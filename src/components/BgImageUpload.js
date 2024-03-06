import React, { useState } from 'react';
import axios from 'axios';
import { endpoints } from '../utils/endpoints';
import storageComunicator from '../utils/storageComunication';

const BgImageUpload = ({ setBgImages }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [validPhoto, setValidPhoto] = useState(true);
  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };
  const checkImage= (selectedFile)=>{
    console.log(selectedFile.name.replaceAll(" ","_"))
    console.log(setBgImages[0]);
    for(const x of setBgImages[0]){
      let img_name = x.image.split("/").pop();
      console.log(img_name);
      if(selectedFile.name.replaceAll(" ","_") === img_name){
        // alert('Image already exists');
        setValidPhoto(false);
        return true;
      }
    }
    return false;
  }
  const handleUpload = async () => {
    if (!selectedFile) {
      alert('Please select an image');
      return;
    }
    if(checkImage(selectedFile)){
      return;
    }
    const formData = new FormData();
    formData.append('image', selectedFile);
    try {
      const response = await axios.post(endpoints.home_page.add_bg_image, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization':'Bearer ' + String(storageComunicator.authToken.get().access)
        }
      });
      console.log('Upload successful:', response.data);
      
      setBgImages[1](response.data)
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };
  return (
    <div className="flex flex-col">
      <input type="file" onChange={handleFileChange}/>
      <div className={`${validPhoto ? "text-green-500" : "text-red-500"} text-xl font-bold capitalize `}>
        {validPhoto ? '' : 'photo already added'}
      </div>
      <button onClick={handleUpload} className="p-2 border bg-green-300 hover:bg-green-400">Upload Image</button>
    </div>
  );
};
export default BgImageUpload;