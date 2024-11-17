import React, { useRef, useState } from 'react'
import { Input, Button, ToastMessage } from './index'
import { NavLink } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { login as authLogin } from '../store/authSlice'
import userAuth from '../api/auth'
import { BeatLoader,PacmanLoader } from 'react-spinners'
import { useNavigate } from 'react-router-dom'

function Login() {
  const navigate = useNavigate();
  const authStatus = useSelector(state => state.authReducer.authStatus)
  const dispatch = useDispatch()
  const usernameInputRef = useRef()
  const passwordInputRef = useRef()
  const loginBtnRef = useRef()
  const showPasswordInputRef = useRef()
  const [userNameError, setUserNameError] = useState(false)
  const [passwordError, setPasswordError] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)

  const handleFormSubmit = async (e) => {
    
    e.preventDefault()
    setPasswordError("")
    setUserNameError("")
    setError("")
    const formData = new FormData(e.target)
    const username = formData.get('username')
    const password = formData.get('password')

    if (!username) {
      setUserNameError("Username or Email is Required")
      setLoading(false)
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

    if (!username || !password) {
      return
    }
    const userData = {
      cred: username,
      password
    }

    // console.log(userData)
    setLoading(true)
    const response = await userAuth.login(userData)

    // console.log(response)
    if (response.statusCode === 420) {
      setUserNameError(response.msg)
    }
    else if (response.statusCode === 423) {
      setPasswordError(response.msg)
    }
    else if (response.statusCode === 400) {
      setError(response.msg)
    }
    else if (response.statusCode === 500) {
      console.log(response.msg);

    }
    else if (response.statusCode === 200) {
      // console.log(response.data);
      dispatch(authLogin(response.data))
      setLoading(false)
      navigate('/')
    }
    setLoading(false)
  }

  const onChangeInput = (e) => {
    setUserNameError("")
    setPasswordError("")
    setError("")
    if (e.target.name === 'username') {
      if (e.target.value === '') {
        setUserNameError("Username or Email is Required")
      }
      else {
        setUserNameError("")
        // console.log(usernameInputRef.current.value);
      }
    }
    if (e.target.name === 'password') {
      let value = passwordInputRef.current.value
      passwordInputRef.current.type = "password"
      showPasswordInputRef.current.checked = false
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
  }

  const handleShowPassword = () => {
    passwordInputRef.current.type === "password" ? passwordInputRef.current.type = "text" : passwordInputRef.current.type = "password"

  }

  return (
    <div className='rounded-none md:rounded-2xl p-4 md:p-8 shadow-input bg-white'>
      {/* <h1 className='text-2xl font-bold'>Welcome to Servico</h1> */}
      <p className='text-2xl font-bold mt-3 text-[#185AFF]'>SignIn to Servico</p>

      <form className="my-4" onSubmit={handleFormSubmit} >

        <div className="mb-4">
          < Input label="Username or Email" name='username' id="username" ref={usernameInputRef} onChange={onChangeInput} placeholder="User name or Email" type="text" />
          <div className='h-2'>
            {userNameError && <p className='text-[#FF0000] text-sm'>{userNameError}</p>}

          </div>
        </div>
        <div className="mb-4">
          < Input ref={passwordInputRef} onChange={onChangeInput} className='' label="Password" name='password' id="password" placeholder="••••••••" type="password" />
          <div className='h-2'>
            {passwordError && <p className='text-[#FF0000] text-wrap text-sm'>{passwordError}</p>}
          </div>
        </div>
        <input type="checkbox" onClick={handleShowPassword} name="showPassword" id="showPwdCB" ref={showPasswordInputRef} /> <label htmlFor='showPwdCB'>Show Password</label>
        <br/>
        <NavLink to="/forgotPassword/user" className='text-sm text-blue-500 underline cursor-pointer'>Fortgot Password ?</NavLink>
        <div className='flex justify-center mt-5'>

        <Button type='submit' disabled={loading} textColor='text-[#6B17FF]' ref={loginBtnRef} className={`
          ${loading ? " cursor-not-allowed" :"hover:bg-[#185AFF]" } hover:text-white  w-1/2 border border-[#6B17FF] text-base  flex justify-center items-center py-2 rounded-2xl font-bold text-center
          `} >{loading ? <BeatLoader color='#6B17FF' size={16}/>: "Sign In"}</Button>
        </div>

      </form>
      {error && <ToastMessage type='error' msg={error} heigth='50px'/>}
      <p className="text-neutral-600 text-sm max-w-sm mt-2 dark:text-neutral-300">
        Don&apos;t Have Account ? <NavLink to="/signup" className='underline underline-offset-2 text-blue-300'>Register Here!</NavLink>
      </p>
    </div>
  )
}

export default Login