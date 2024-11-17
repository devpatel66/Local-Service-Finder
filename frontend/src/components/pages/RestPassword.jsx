import React, { useRef, useState } from 'react'
import { useParams } from 'react-router'
import passwordApi from '../../api/passwordAPI'

function RestPassword() {
  const token = useParams().token
  const email = useParams().email
  const user = useParams().user
  const [newPasswordError, setNewPasswordError] = useState("")
  const [confirmPasswordError, setConfirmPasswordError] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const newPasswordRef = useRef(null)
  const handleSubmit = async (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)

    const newPassword = formData.get('newPassword')
    const confirmPassword = formData.get('confirmPassword')
    if (!newPassword) {
      setNewPasswordError("Password is required")
    }
    if (!confirmPassword) {
      setConfirmPasswordError("Confirm Password is required")
    }

    if (!newPassword || !confirmPassword) {
      return
    }

    if (newPassword !== confirmPassword) {
      setConfirmPasswordError("Password does not match")
      return
    }

    let response 
    if(user === 'admin'){
      response = await passwordApi.adminChangePassword({ token, email, newPassword, confirmPassword })
    }
    else{
      response = await passwordApi.resetPassword({ token, email, newPassword, confirmPassword })

    }
    console.log(response)
    if (response.statusCode === 200) {
      setIsLoading(true)
      setSuccess("Password Reset Successful. You can now login with your new password")
    }
    else {
      setError(response.msg)
    }

  }


  const handleChange = (e) => {
    e.preventDefault()

    if (e.target.name === 'newPassword') {
      if (e.target.value === '') {
        setNewPasswordError("Password is required")
        return
      } else if (e.target.value.length < 7) {
        setNewPasswordError("Password Required at least 7 characters")
      } else {
        setNewPasswordError("")
      }
    } else if (e.target.name === 'confirmPassword') {
      if (e.target.value === '') {
        setConfirmPasswordError("Password is required")
      } else if (e.target.value !== newPasswordRef.current.value) {
        setConfirmPasswordError("Password does not match")
      } else {
        setConfirmPasswordError("")
      }
    }
  }

  return (
    <div className="flex h-full w-[80vw] items-center justify-center p-4">

      <div className="w-1/2  bg-white  rounded-lg p-6">
        <div className="mb-6 text-center">
          <h2 className="text-2xl font-bold">Change Your Password</h2>
          <p className="text-gray-600">Ensure your account stays secure</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">


            {/* New Password */}
            <div className="space-y-2">
              <label htmlFor="newPassword" className="flex items-center gap-2 text-gray-700">
                New Password
              </label>
              <div className="relative">
                <input
                  ref={newPasswordRef}
                  id="newPassword"
                  name="newPassword"
                  placeholder="Enter your new password"
                  type='password'
                  className="w-full p-2 border rounded pr-10"
                  onChange={handleChange}
                />

              </div>
              {newPasswordError && <p className='text-red-500'>{newPasswordError}</p>}
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <label htmlFor="confirmPassword" className="flex items-center gap-2 text-gray-700">
                Confirm New Password
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  placeholder="Confirm your new password"
                  className="w-full p-2 border rounded pr-10"
                  type="password"
                  onChange={handleChange}
                />
              </div>
              {confirmPasswordError && <p className='text-red-500'>{confirmPasswordError}</p>}
            </div>
          </div>

          <button
            disabled={isLoading}
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Please wait
              </>
            ) : (
              'Rest Password'
            )}
          </button>

          {error && (
            <div className="rounded-md bg-red-50 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">
                    {error}
                  </h3>
                </div>
              </div>
            </div>
          )}


          {
            success && <div className="rounded-md bg-green-50 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-green-800">
                   {success}
                  </p>
                </div>
              </div>
            </div>
          }
        </form>
      </div>
    </div>
  )
}

export default RestPassword