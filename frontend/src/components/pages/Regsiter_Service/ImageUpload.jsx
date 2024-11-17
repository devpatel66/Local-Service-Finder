import React, { useState,useRef } from 'react';
import { MdOutlineFileUpload } from "react-icons/md";
import Button from '../../Button';

function ImageUpload({setPreview,setImages}) {
    const [selectedImages, setSelectedImages] = useState(null);
    const imageRef = useRef(null)

    const handleImageChange = (e) => {
        const file = e.target.files;
        // console.log(file[0])
        // const files = Array.from(e.target.files);
        const imageUrls = URL.createObjectURL(file[0]);
        console.log(imageUrls);
        setSelectedImages(imageUrls);
    };

    const removeImage = () => {
        setSelectedImages(null);
    };

    // const handleForm = (e) => { 
    //     e.preventDefault();
    //     // const formData = new FormData(formRef.current);
    //     const image = imageRef.current.files[0] 
    //     // const files = Array.from(formData.getAll('image'));
    //     console.log(imageRef.current.files[0]);
        
    //     setImages(image)
    //     setPreview(URL.createObjectURL(image))
    //     setSelectedImages(null)
    //     alert("Image uploaded successfully")
    // }

    return (
        <div className="w-full flex flex-col items-center justify-center p-4 border border-dashed border-gray-400 rounded-lg w-80 bg-gray-50">
            <input
            ref={imageRef}
                type="file"
                id="file-upload"
                className="hidden"
                accept="image/*"
                name='image'
                onChange={handleImageChange}
            />
            <label
                htmlFor="file-upload"
                className="flex flex-col items-center cursor-pointer"
            >
                <MdOutlineFileUpload size={40}/>
                <p className="text-gray-500">Click to upload images</p>
            </label>

       
                {selectedImages && <div className="flex mt-4">
                    
                        <div  className="relative">
                            <img
                                src={selectedImages}
                                className="w-30 h-30 object-cover rounded-lg"
                            />
                            {/* <button
                                onClick={removeImage}
                                className="absolute m-1 w-5 flex justify-center items-center h-5 top-0 right-0 bg-red-500 text-white rounded-full p-1"
                            >
                                &times;
                            </button> */}
                        </div>
                
                </div>}
        </div>
    );
}

export default ImageUpload;
