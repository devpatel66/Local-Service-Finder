import React, { useState, useRef, useEffect } from 'react'
import {Button}from './index'
import otpApi from '../api/otpApi'

export default function OtpPopup({email,setIsDisabled,setDisplayOtpPopup,setEmailError,setIsOtpVerifyed}) {
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const inputRefs = useRef([])
  const [otpError,setOtpError] = useState("")
    if(!email){
        setEmailError("Email is Required !!!")
        setDisplayOtpPopup(false)
        setIsDisabled(false)
    }else{
        setEmailError("")
    }
  useEffect(() => {
    inputRefs.current[0]?.focus()
  }, [])

  const handleChange = (index, value) => {
    if (isNaN(Number(value))) return
    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)

    if (value !== '' && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && index > 0 && otp[index] === '') {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handleSubmit = async () => {
    setOtpError("")
    const otpString = otp.join('')
    // console.log('Submitted OTP:', otpString)
    const response = await otpApi.verifyOtp(otpString)
    console.log(response);
    if(response.statusCode === 200){
        setIsOtpVerifyed(true)
        setDisplayOtpPopup(false)
        setIsDisabled(false)
        return
    }
    setOtpError(true)
    // Here you would typically send the OTP to your server for verification
  }

  const isOtpComplete = otp.every(digit => digit !== '')


  const handleCancel = ()=>{
    setDisplayOtpPopup(false)
    setIsDisabled(false)
  }
  return (
    <div className="flex items-center absolute top-5 left-[40%] justify-center min-h-screen">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-2xl">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Enter OTP</h2>
          <p className="mt-2 text-sm text-gray-600">
            We've sent a 6-digit code to your Email {email}
          </p>
        </div>
        <div className="mt-8 space-y-6">
          <div className="flex justify-center space-x-2">
            {otp.map((digit, index) => (
              <input
                key={index}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                ref={(el) => (inputRefs.current[index] = el)}
                className="w-12 h-12 text-center text-2xl font-semibold text-gray-800 border-2 border-gray-300 rounded-md focus:border-blue-500 focus:ring focus:ring-blue-200 focus:outline-none transition-all"
                aria-label={`Digit ${index + 1}`}
              />
            ))}
          </div>
          <Button
            onClick={handleSubmit}
            textColor = "text-white"
            disabled={!isOtpComplete}
            className={`w-full py-3 px-4 text-white font-semibold rounded-md transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
              isOtpComplete
                ? 'bg-blue-600 hover:bg-blue-700'
                : 'bg-gray-400 cursor-not-allowed'
            }`}
          >
            Verify OTP
          </Button>
          {
            otpError && <p className='text-red-500'>Invalid OTP</p>
          }
          <Button onClick={handleCancel} textColor="text-red-500" className="underline">Cancel</Button>
        </div>
      </div>
    </div>
  )
}