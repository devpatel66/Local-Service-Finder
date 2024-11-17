import React, { useState, useRef, useEffect } from 'react'
import { Input, Button, ToastMessage } from '../../index'
import Category from '../../Category'
import { useNavigate } from 'react-router'
import { useSelector } from 'react-redux'
import { serviceApi } from '../../../api/serviceAPI'
import ImageUpload from './ImageUpload'
import Popup from '../../utils/Popup'
import { IndianRupee } from 'lucide-react';
import OtpPopup from '../../OTPPopup'
import otpApi from '../../../api/otpApi'
import { BeatLoader } from 'react-spinners'

function Overview() {
  const formRef = useRef(null)
  const navigate = useNavigate();
  const mainContainer = useRef(null)
  const [displayCategory, setDisplayCategory] = useState(false)
  const [isDisabled, setIsDisabled] = useState(false);
  const [category, setCategory] = useState(null)
  const [desCharCount, setDesCharCount] = useState(0)
  const [descError, setDesError] = useState(null)
  const [serviceNameError, setSeriveNameError] = useState(null)
  const [categoryError, setCategoryError] = useState(null)
  const [addressError, setAddressError] = useState(null)
  const [priceError, setPriceError] = useState(null)
  const [locationError, setLocationError] = useState(null)
  const [emailError,setEmailError] = useState("")
  const [phoneNumError,setPhoneNumError] = useState("")
  const [popupMsg, setPopupMsg] = useState(null)
  const [toastMsg, setToastMsg] = useState(null)
  const [stateName, setStateName] = useState(null)
  const [districtName, setDistrictName] = useState(null)
  const [code, setCode] = useState(null)
  const [isOtpVerifyed,setIsOtpVerifyed] = useState(false)


  const [displayOtpPopup,setDisplayOtpPopup] = useState(false)
  const [email,setEmail] = useState("")
  const userData = useSelector(state => state.authReducer.userData)

  const handleSelectCategoryClick = () => {
    console.log(mainContainer);
    window.scrollTo(0, 0)
    // mainContainer.current.backgroundColor = 'blue'
    setIsDisabled(!isDisabled);
    setDisplayCategory(!displayCategory)
  }

  const mainContainerStyle = {
    backgroundColor: isDisabled ? '#F3F3F3' : 'white',
    pointerEvents: isDisabled ? 'none' : 'auto',
    // opacity: isDisabled ? 0.6 : 1                 
  };

  const handleDesc = (e) => {
    setDesCharCount(e.target.value.length || 0)
    setTimeout(() => {
      if (e.target.value.length < 120 && e.target.value.length > 0) {
        setDesError("Your description is too short. It must be longer than 120 characters")
      } else if (e.target.value.length <= 0) {
        setDesError("Please enter the description of the service")
      } else if (e.target.value.length > 1200) {
        setDesError("Description is too long")
      }
      else {
        setDesError(null)
      }
    }, 1000)
  }

  const handleFormSubmit = async (e) => {
    e.preventDefault()
    setDesError(null)
    setSeriveNameError(null)
    setCategoryError(null)
    setAddressError(null)
    const formData = new FormData(formRef.current)
    const servName = formData.get('title')
    const servDesc = formData.get('description')
    const servAddress = formData.get('address')
    const image = formData.get('image')
    const state = formData.get("state").split("-")[1]
    const district = formData.get("district")
    const price = formData.get("price")
    const phone_number = formData.get("phone_number")
    // console.log(image);

    if (image.name === "") {
      alert("Please upload image")
    }


    if (!servName) {
      setSeriveNameError("Service Name is Required")
    } else {
      setSeriveNameError(null)
    }

    if (!servAddress) {
      setAddressError("Address is Required")
    } else[
      setAddressError(null)
    ]
    if (!servDesc) {
      setDesError("Description is Required")
    }
    else {
      setDesError(null)
    }
    if (!category || !category.length) {
      setCategoryError("Category is Required")
    }
    else {
      setCategoryError(null)
    }

    if (!state || !district) {
      setLocationError("Location is Required")
    } else {
      setLocationError(null)
    }

    if (!price) {
      setPriceError("Price is Required")
    } else {
      setPriceError(null)
    }

    if(!isOtpVerifyed){
      setEmailError("Email is not Verified")
    }else{
      setEmailError(null)
    }

    if(!phone_number){
      setPhoneNumError("Phone Number is required")
    }else{
      setPhoneNumError(null)
    }

    if (!servName || !servDesc || !servAddress || !category || !price || !state || !district || image.name === "" || !email || !phone_number || !isOtpVerifyed) {
      console.log(email);
      
      return
    }

    // for(let ent of formData.entries()){
    //   console.log(ent);
    // }
    formData.append("category", category[0].name)
    formData.append("subCategory", category[1].name)
    formData.set("state",state)
    const response = await serviceApi.addService(formData)
    console.log(response);

    if (response.statusCode === 200) {
      window.scrollTo(0, 0)
      setPopupMsg(response.msg)
      setIsDisabled(!isDisabled);
    }
    else {
      window.scrollTo(0, 0)
      setToastMsg(response.msg)
    }

  }
  const handleReset = () => {
    console.log("reset");
    setDesCharCount(0)
    setDesError(null)
    setSeriveNameError(null)
    setCategoryError(null)
    setAddressError(null)
    setCategory(null)
  }
  const handleSelectState = async (e) => {
    e.preventDefault()
    const stateDate = e.target.value.split("-")
    console.log(stateDate);
    if (stateDate[0] === code) { return }
    setCode(stateDate[0])
    const response = await serviceApi.getDistrict(stateDate[0])
    console.log(response);
    setDistrictName(response.data)

  }
  useEffect(() => {
    async function fetchStateName() {

      const response = await serviceApi.getState()

      // console.log(response.data);
      setStateName(response.data)


    }

    fetchStateName()
    if (userData.role !== "provider") {
      navigate("/")
    }

  }, [])

  const [verifyLoading,setVerifyLoading] = useState(false)
  const handleOtpPopup = async (e)=>{
    setVerifyLoading(true)
    e.preventDefault();
    if(!email){
      setVerifyLoading(false)
      setEmailError("Email is Required")
      return 
    }
    const response = await otpApi.sendOtp(email)
    console.log(response,email);
    
    if(response.statusCode === 200){
      window.scrollTo(0, 0)
      setIsDisabled(true);
      setDisplayOtpPopup(true)
      setVerifyLoading(false)
      return
    }
    setVerifyLoading(false)
    setToastMsg("Try Again Later")
  }
  return (
    <>{
      displayOtpPopup && <OtpPopup setIsOtpVerifyed={setIsOtpVerifyed} email={email} setEmailError={setEmailError} setDisplayOtpPopup={setDisplayOtpPopup} setIsDisabled={setIsDisabled}/>
    }
      {
        popupMsg && <Popup msg={popupMsg} btnText='Ok' btnFunc={() => navigate('/dashboard')} btnCloseFunc={() => navigate('/dashboard')} />
      }
      {
        toastMsg && <ToastMessage type="error" msg={toastMsg} />
      }
      <div ref={mainContainer} style={mainContainerStyle} className=" w-[80vw]  py-12 px-4 sm:px-6 lg:px-8">

        <div className="max-w-4xl mx-auto shadow-lg">
          <div className="bg-gradient-to-r flex justify-center from-[#185AFF] to-[#6B17FF] text-white rounded-t-lg p-6">
            <h1 className='text-left text-6xl font-bold text-white '>Service Registration</h1>
          </div>
          <div className="p-6">

            <form ref={formRef} className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="title" className="text-lg font-semibold flex items-center gap-2">
                  Service Title
                </label>
                <Input id="title" name="title" placeholder="Enter service title" required className="text-lg border border-gray-300 rounded-lg w-full p-2" />

                {
                  serviceNameError && <p className="text-red-500 text-sm">{serviceNameError}</p>
                }
              </div>

              <div className="space-y-2">
                <label htmlFor="description" className="text-lg font-semibold flex items-center gap-2">
                  Description
                </label>
                <textarea onChange={handleDesc} name='description' id="description" placeholder="Describe your service" required className="min-h-[100px] h-36 text-lg border border-gray-300 rounded-lg w-full p-2" />

                <div className='flex justify-between'>
                  <p className="text-red-500 text-sm">{descError && descError}</p>
                  <p className="text-sm text-gray-500">{desCharCount}/1200</p>
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="address" className="text-lg font-semibold flex items-center gap-2">
                  Address
                </label>
                <textarea id="address" name="address" placeholder="Service location" required className="text-lg border h-36 border-gray-300 rounded-lg w-full p-2" ></textarea>
                {
                  addressError && <p className="text-red-500 text-sm">{addressError}</p>
                }
              </div>

              <div className="space-y-2">
                <label htmlFor="category" className="text-lg font-semibold flex items-center gap-2">
                  Category
                </label>
                <Button  textColor="text-[#185AFF]" onClick={handleSelectCategoryClick} className="text-lg border border-[#185AFF] font-medium px-4 rounded-2xl py-2 hover:text-[#6B17FF] hover:border-[#6B17FF]">Select Category</Button>
                {
                  displayCategory &&
                  <Category setIsDisabled={setIsDisabled} setCategory={setCategory} setDisplayCategory={setDisplayCategory} />
                }

                {
                  Array.isArray(category) && category.length > 0 &&
                  <p>{`${category[0].name} > ${category[1].name}`}</p>

                }
                <p className='text-red-500 text-sm'>{categoryError && categoryError}</p>
              </div>
              <div className="my-2 gap-2 flex  flex-wrap w-full">
                <div className=' '>
                  <label htmlFor="phoneNumber" className="text-lg font-semibold flex items-center gap-2">
                    Phone Number
                  </label>
                  <Input type="tel" id="phoneNumber" placeholder="Enter Your Mobile Number" name="phone_number" className="text-lg border  border-gray-300 rounded-lg p-2" />
                  <p className='text-red-500 text-sm'>{phoneNumError && phoneNumError}</p>
                </div>
                <div className=''>
                  <label htmlFor="email" className="text-lg font-semibold flex items-center gap-2">
                    Email ID {isOtpVerifyed  ? <p className='text-green-500 text-sm'>Verified</p>  : <p className='text-red-500 text-sm'>Not Verified</p>}

                  
                  </label>
                  <Input disabled={isOtpVerifyed} type="email" onChange={(e)=>setEmail(e.target.value)} id="email" placeholder="Enter Your Email" className="text-lg border border-gray-300 rounded-lg  p-2" />
                  <p className='text-red-500 text-sm'>{emailError && emailError}</p>
                  {isOtpVerifyed && <input type='hidden' name='email' value={email}/>}
                </div>
                <div className=''>
                <label className="text-lg font-semibold flex items-center gap-2">
                    Verify Your Email
                  </label>
                  <Button disabled={verifyLoading || isOtpVerifyed} onClick={handleOtpPopup} textColor="text-white" className="bg-green-500 hover:bg-green-600 flex items-center">{verifyLoading ? <BeatLoader color='white' size={16}/> : "Verify Email"}</Button>
                  
                </div>

              </div>

              <div className="space-y-2" >
                <label htmlFor="price" className="text-lg font-semibold flex items-center gap-2">
                  Price
                </label>
                <div className="flex items-center">
                  <span className="text-xl text-gray-500 mr-2"><IndianRupee /></span>
                  <Input id="price" name="price" type="number" placeholder="0.00" min="0" step="0.01" required className="text-lg border border-gray-300 rounded-lg w-full p-2" />
                </div>

                {
                  priceError && <p className="text-red-500 text-sm">{priceError}</p>
                }
              </div>


              <div className="space-y-2" >
                <label htmlFor="location" className="text-lg font-semibold flex items-center gap-2">
                  Location (Must Enter the district in which your providing the service)
                </label>
                <div className="flex flex-col gap-4 items-start">
                  <div className='w-1/2 flex flex-col'>
                    <label>Select Your State</label>
                    <select name='state' onClick={handleSelectState} className='text-lg border border-gray-300 rounded-lg w-full p-2'>
                      {
                        Array.isArray(stateName) && stateName.map((item, index) => (
                          <option key={index} value={`${item.state_id}-${item.name}`}>{item.name}</option>
                        ))
                      }
                    </select>
                  </div>
                  <div className='w-1/2 flex flex-col'>
                    <label>Select Your District in which your serving your service</label>
                    <select name='district' className='text-lg border border-gray-300 rounded-lg w-1/2 p-2'>
                      {
                        Array.isArray(districtName) && districtName.map((item, index) => (
                          <option key={index} value={item.name}>{item.name}</option>
                        ))
                      }
                    </select>
                  </div>
                </div>

                {
                  locationError && <p className="text-red-500 text-sm">{locationError}</p>
                }
              </div>

              <div className="space-y-2" >
                <ImageUpload />
              </div>
            </form>
          </div>

          <div className="bg-gray-50 p-6 rounded-b-lg">
            <Button type="submit" onClick={handleFormSubmit} className="w-full text-lg h-12 bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] hover:from-purple-600 hover:to-indigo-600 text-white font-bold py-2 px-4 rounded-lg transition-all duration-200 ease-in-out transform hover:scale-105">
              Add Service
            </Button>
          </div>
        </div>
      </div>

      {displayCategory && <Category setCategory={setCategory} setIsDisabled={setIsDisabled} setDisplayCategory={setDisplayCategory} />}
    </>
  )
}

export default Overview