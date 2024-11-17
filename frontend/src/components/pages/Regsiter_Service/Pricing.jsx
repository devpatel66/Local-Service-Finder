import React, { useState, useEffect } from 'react'
import { Button, Input } from '../../index'
import ImageUpload from './ImageUpload'
import { useNavigate } from 'react-router'
import { serviceApi } from '../../../api/serviceAPI'

function Pricing() {
  const navigate = useNavigate()
  const [phoneNumberError, setPhoneNumberError] = useState(null)
  const [servicePriceError, setServicePriceError] = useState(null)
  const [btnDisable, setBtnDisable] = useState(true)
  const [phoneNumber, setPhoneNumber] = useState('')
  const [servicePrice, setServicePrice] = useState('')
  const [email,setEmail] = useState('')
  const [images, setImages] = useState('')
  const [previewImage,setPreviewImage] = useState('')
  useEffect(() => {

    let data = JSON.parse(localStorage.getItem('serviceFormData'));
    
    if(data == "null"){
      navigate(-1)
    } 
    else{
      setPhoneNumber(data.phoneNumber || "")
      setServicePrice(data.servicePrice|| "")
      setEmail(data.email || "")
      
    }
  },[])


  const handleServicePriceChange = (e) => {
      let value = e.target.value
      setServicePrice(value)
      if(value < 100){
        setBtnDisable(true)
        setServicePriceError("Price must be greater than or equal to 100")
      }
      else{
        setBtnDisable(false)
        setServicePriceError(null)
      }
  }
  const handlePhoneNumChange = (e) => {
      let value = e.target.value
      setPhoneNumber(value)
      if(value.length < 10 || value.length > 10){
        setBtnDisable(true)
        setPhoneNumberError("Invalid Phone Number")
      }
      else{
        setBtnDisable(false)
        setPhoneNumberError(null)
      }
  }


  const handleSaveBtn = () => {
    setBtnDisable(true)
    const data = JSON.parse(localStorage.getItem('serviceFormData'));
    if(!phoneNumber){
      setPhoneNumberError("Phone Number is Required")
     
    }
    if(!servicePrice){
      setServicePriceError("Service Price is Required")
     
    }

    if(!servicePrice || !data){
      return
    }
    
    
    const newData = {...data,phone_number: phoneNumber, price:servicePrice,email,location:"anand",previewImage}
    localStorage.setItem('serviceFormData', JSON.stringify(newData));
    navigate('/addService/preview')
    setBtnDisable(false)
  }

  const handleSubmit = async()=>{
    
    const data = JSON.parse(localStorage.getItem('serviceFormData'));

    if(!phoneNumber){
      setPhoneNumberError("Phone Number is Required")
    }
    if(!servicePrice){
      setServicePriceError("Service Price is Required")
     
    }

    if(!phoneNumber || !servicePrice){
      return
    }

    const formData = {...data, phone_number:phoneNumber, price:servicePrice,email,images,location:"anand"}
    console.log(images.name);
    const response = await serviceApi.addService(formData)
    localStorage.setItem('serviceFormData', null)
    console.log(response)
  }

  return (
    <div className='mt-10 w-[80vw] p-10'>
      <div className='flex justify-start'>
        <p className='text-6xl font-semibold'>Other Informations</p>
      </div>

      <div className='w-full flex gap-14 mt-10'>
        <div className='w-1/2'>
          <label htmlFor='serviceName' className='text-4xl font-bold'>Service Charge/Visiting Charges <span className='text-red-500 text-xl'>*</span></label>
          <p className='text-sm font-light'>Set a Competitive Price for Your Service.</p>
          <div className='flex gap-2 justify-start items-center'>
            <label className='flex w-1/2 justify-centter items-center  border border-gray-300 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent rounded-md overflow-hidden'>
              <span className='h-10 text-xl px-3 py-2 bg-gray-100 text-gray-700'>&#x20b9;</span>
              <input
              value={servicePrice}
                id="serviceName"
                className='flex-1 py-2 px-3 border-0 focus:ring-0 focus:outline-none'
                type="number"
                placeholder='Enter the price (e.g., 500)'
                onChange={handleServicePriceChange}
              />
            </label>
          </div>
            <p className='text-red-500'>{servicePriceError && servicePriceError}</p>
        </div>

        <div className='w-1/2  gap-14 flex'>
              <div className='w-1/2'>
                <label htmlFor='phoneNumber' className='text-4xl font-bold'>Phone Number <span className='text-red-500 text-xl'>*</span></label>
                <p className='text-sm font-light'>Kindly enter your business number to allow customers to contact you directly.</p>
                <div className='w-full'>
                  <Input value={phoneNumber} onChange={handlePhoneNumChange} id='phoneNumber' className='w-1/4 py-2' type='number' placeholder='9876543210' />
                  <p className='text-red-500'>{phoneNumberError && phoneNumberError}</p>
                </div>
              </div>
              <div className='w-1/2'>
                <label htmlFor='email' className='text-4xl font-bold'>Email Address</label>
                <p className='text-sm font-light'>Optionally provide your business email address for internal updates or communication.</p>
                <div className='w-full'>
                  <Input id='email'onChange={(e) => setEmail(e.target.value)} className='w-full py-2' type='email' placeholder='exaple@example.com' />
                </div>
              </div>
            </div>
      </div>

      <div className='mt-10 flex flex-col gap-2'>
          <div>
          <p className='text-4xl font-semibold'>Upload Images </p>
          <p className='text-sm font-light'>Enhance Your Listing with Visuals </p>
          </div>
          <ImageUpload setPreview={setPreviewImage} setImages={setImages} />
          <img src={previewImage} alt="preview image"/>
      </div>

      <div className='w-full mt-10 flex justify-end gap-5'>
              <Button type='button' onClick={() => navigate(-1)}  textColor='text-red-600' className='w-1/12 font-medium text-2xl hover:text-red-500'>Back</Button>
              <Button onClick={handleSubmit} disabled={btnDisable} type='submit' textColor='text-white' className={`w-1/6 border bg-[#185AFF] z-10   font-medium text-2xl hover:bg-[#6B17FF] ${btnDisable ? 'cursor-not-allowed bg-gray-600 hover:bg-gray-600' : null}`}>Verify and Submit</Button>
              {/* <Button onClick={handleSaveBtn} disabled={btnDisable} type='submit' textColor='text-white' className={`w-1/6 border bg-[#185AFF] z-10   font-medium text-2xl hover:bg-[#6B17FF] ${btnDisable ? 'cursor-not-allowed bg-gray-600 hover:bg-gray-600' : null}`}>Save & Preview</Button> */}
            </div>
    </div>
  )
}

export default Pricing