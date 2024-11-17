import React, { useState, useRef } from 'react'
import { Input, Button } from './index'
import { NavLink, useNavigate } from 'react-router-dom'
import userAuth from '../api/auth'
import { BeatLoader } from 'react-spinners'
function Register() {
    const navigate = useNavigate()
    const [userNameError, setUserNameError] = useState(false)
    const [passwordError, setPasswordError] = useState(false)
    const [confirmPasswordError,setConfirmPasswordError] = useState(false)
    const [emailError, setEmailError] = useState(false)
    const [error, setError] = useState(false)
    const [loading, setLoading] = useState(false)

    const passwordInputRef = useRef()
    const confirmPasswordInputRef = useRef()
    const showPasswordInputRef = useRef()
    const showConfirmPasswordInputRef = useRef()

    const handleFormSubmit = async (e) => {
        e.preventDefault()
        setPasswordError("")
        setEmailError("")
        setEmailError("")
        const formData = new FormData(e.target)
        const username = formData.get('username')
        const name = formData.get('name')
        const password = formData.get('password')
        const email = formData.get('email')
        const role = formData.get('role')
        const confirmPassword = formData.get('confirmPassword')

        if (!username) {
            setUserNameError("Username is Required")
        }
        else {
            setUserNameError("")
        }

        if (!password) {
            setPasswordError("Password is Required")
        }
        else {
            setPasswordError("")
        }

        if (!email) {
            setEmailError("Email is Required")
        }
        else {
            setEmailError("")
        }

        if(password !== confirmPassword){
            setConfirmPasswordError("Password does not match")
        }
        else{
            setConfirmPasswordError("")
        }

        if (!username || !password || !email || !confirmPassword) {
            return
        }

        const userData = {
            username,
            name,
            email,
            password,
            role,
            confirmPassword
        }

        // console.log(userData)
        setLoading(true)
        const response = await userAuth.register(userData)

        // console.log(response);

        if (response.statusCode === 420) {
            setUserNameError(response.msg)
        }
        else if (response.statusCode === 423) {
            setPasswordError(response.msg)
        }
        else if (response.statusCode === 421) {
            setEmailError(response.msg)
        }
        else if (response.statusCode === 500) {
            setError(response.msg + ", Try Again Later")
        }
        else if (response.statusCode === 200) {
            console.log("Registered successfully");
            navigate("/signin")
        }

        setLoading(false)
    }

    const onChangeInput = (e) => {
        setPasswordError("")
        if (e.target.name === 'password') {
          let value = passwordInputRef.current.value
          if (e.target.value === '') {
            setPasswordError("Password is required")
    
          }
          else if (value.length < 7) {
            setPasswordError("Password Required at least 7 characters")
    
          }
          else {
            setPasswordError("")
          }
        }

        if (e.target.name === 'confirmPassword') {
          let value = showConfirmPasswordInputRef.current.value
          console.log(value)
          if (value != passwordInputRef.current.value) {
            setConfirmPasswordError("Password does not match")
    
          }
          else {
            setConfirmPasswordError("")
          }
        }
      }
      const handleShowPassword = () => {
        passwordInputRef.current.type === "password" ? passwordInputRef.current.type = "text" : passwordInputRef.current.type = "password"
    
      }
      const handleShowConfirmPassword = () => {
        showConfirmPasswordInputRef.current.type === "password" ? showConfirmPasswordInputRef.current.type = "text" : showConfirmPasswordInputRef.current.type = "password"
    
      }
    return (
        <div className='w-max  rounded-none md:rounded-2xl p-4 md:p-8 shadow-input bg-white'>
            {/* <h1>Welcome to Servico</h1> */}
            <p className='text-2xl font-bold mt-3 text-[#185AFF]'>SignUp to Servico</p>

            <form className="my-8" onSubmit={handleFormSubmit}>

                <div className="mb-4 flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2">
                    <div className='w-full'>
                        < Input label="Username" name="username" placeholder="User name or Email" type="text" />
                        <div className='h-2'>
                            {userNameError && <p className='text-sm text-red-500'>{userNameError}</p>}
                        </div>
                    </div>
                    < Input label="Name" name="name" placeholder="Name" type="text" />
                </div>
                <div className="mb-4">
                    < Input label="Email" name="email" placeholder="example@ex.com" type="email" />
                    <p className='text-xs text-gray-400'>We trust you, that's why we are not verfying your email</p>
                    <div className='h-2'>
                        {emailError && <p className='text-red-500 text-sm'>{emailError}</p>}

                    </div>
                </div>
                <div className="mb-4">
                    < Input label="Password" onChange={onChangeInput} ref={passwordInputRef} name="password" placeholder="••••••••" type="password" />
                    <div className='h-2'>
                        {passwordError && <p className='text-red-500 text-sm'>{passwordError}</p>}
                    </div>
                    <div className='h-2 mt-2'>
                        
                    <input type="checkbox" onClick={handleShowPassword} name="showPassword" id="showPwdCB" ref={showPasswordInputRef} /> <label htmlFor='showPwdCB'>Show Password</label>
                    </div>
                </div>
                <div className="mb-4 mt-10">
                    < Input label="Confirm Password" onChange={onChangeInput} ref={showConfirmPasswordInputRef} name="confirmPassword" placeholder="••••••••" type="password" />
                    <div className='h-2'>
                        {confirmPasswordError && <p className='text-red-500 text-sm'>{confirmPasswordError}</p>}
                    </div>
                    <div className='h-2 mt-2'>
                        
                    <input type="checkbox" onClick={handleShowConfirmPassword} name="showPassword" id="showConfPwd" /> <label htmlFor='showConfPwd'>Show Confirm Password</label>
                    </div>
                </div>

                <div className="mb-4 mt-6">
                    <label>Role</label>
                    <select className='flex h-10 border-none bg-gray-200 w-1/2 text-black shadow-input rounded-md px-1 py-2 text-sm' name='role'>
                        <option value="customer" className='capitalize'>Customer</option>
                        <option value="provider" className='capitalize'>Provider</option>
                    </select>
                </div>


                <div className='flex justify-center mt-5'>

                    <Button type='submit' textColor='text-[#6B17FF]' className='hover:bg-[#185AFF] hover:text-white  w-1/2 border border-[#6B17FF]  flex justify-center items-center py-2 rounded-2xl font-medium text-center' >{loading ? <BeatLoader color='#6B17FF' size={16} /> : "Create Account"}</Button>
                </div>

            </form>
            {error && <p className='text-red-500 text-center capitalize'>{error}</p>}
            <p className="text-neutral-600 text-sm max-w-sm mt-2 dark:text-neutral-300">
                Already Have Account ? <NavLink to="/signin" className='underline underline-offset-2 text-blue-300'>Login Here!</NavLink>
            </p>
        </div>
    )
}

export default Register