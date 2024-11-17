import React, { useState,useEffect } from 'react'
import { Button, Input,ToastMessage } from '../../index'
import { KeyRound } from 'lucide-react'
import { adminAPI } from '../../../api/adminAPI'
import { useNavigate } from 'react-router'
import { adminLogin } from '../../../store/authSlice'
import { useSelector,useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'


function AdminLogin() {
  const navigate = useNavigate();
  const dispatch = useDispatch()
  const adminAuthStatus = useSelector(state=>state.authReducer.adminAuthStatus)
  const [password, setPassword] = useState("")
  const [username, setUsername] = useState("")
  const [passwordError, setPasswordError] = useState("")
  const [usernameError, setUsernameError] = useState("")
  const [error, setError] = useState("")

  useEffect(()=>{
    if(adminAuthStatus){
      navigate("/admin")
    }
  },[])
  const handleChange = (e) => {

    let value = e.target.value
    if (e.target.name === "username") {
      setUsername(value)
      if (!value) {
        setUsernameError("username is required")
      }
      else {
        setUsernameError(null)
      }
    }
    else if (e.target.name === "password") {
      setPassword(value)
      if (!value) {
        setPasswordError("Password is required")
      }
      else {
        setPasswordError(null)
      }

    }
  }

  const handleLogin = async (e) => {
    if (!username) {
      setUsernameError("username is required")
    }
    else {
      setUsernameError(null)
    }

    if (!password) {
      setPasswordError("Password is required")
    }
    else {
      setPasswordError(null)
    }
    if (!username || !password) return

    const response = await adminAPI.login({username,password})

    if (response.statusCode === 200) {
      dispatch(adminLogin(response.data))
      navigate("/admin")
    }
    else if (response.statusCode === 420) {
      setUsernameError(response.msg)
    }
    else if (response.statusCode === 423) {
      setPasswordError(response.msg)
    }
    else {
      setError(response.msg)
    }

  }
  return (
   <>
    {
      error && <ToastMessage msg={error}/>
    }

    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-gray-100">
      <div className="w-full max-w-sm">
        <form className="bg-white shadow-2xl rounded-lg px-8 pt-6 pb-8 mb-4">
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-extrabold text-gray-900">Admin Login</h2>
            <p className="text-gray-600 text-sm mt-2">Enter your credentials to access the admin panel</p>
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
              username
            </label>
            <div className="relative">
              <Input onChange={handleChange} type="text" name="username" required placeholder="username" />
            </div>
            {usernameError && <p className='text-red-500 text-sm'>{usernameError}</p>}
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
              Password
            </label>
            <div className="relative">
              <Input onChange={handleChange} required name="password" type="password" placeholder="*******" />
            </div>
          {passwordError && <p className='text-red-500 text-sm'>{passwordError}</p>}
          </div>

          {/* {error && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6" role="alert">
            <p className="font-bold">Error</p>
            <p>{error}</p>
            </div>
            )} */}
          
          <div className="flex items-center justify-between mb-6">
            <Button onClick={handleLogin} textColor="text-white" className="w-full flex justify-center gap-3  font-bold bg-black"><span><KeyRound color='white' /></span>Login</Button>
          </div>
          <div className="text-center">
            <Link to={"/forgotPassword/admin"} className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800">
              Forgot Password?
            </Link>
          </div>
        </form>
        <p className="text-center text-gray-600 text-xs">
          Protected area. Authorized personnel only.
        </p>
      </div>
    </div>
  </>
  )
}

export default AdminLogin