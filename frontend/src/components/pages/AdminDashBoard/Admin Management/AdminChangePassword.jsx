
import { useState, useRef } from 'react'
import { Eye, EyeOff, Lock, AlertTriangle } from 'lucide-react'
import { Input,ToastMessage } from '../../../index'
import { adminAPI } from '../../../../api/adminAPI'

export default function AdminPasswordResetPage() {
  const [newPasswordError, setNewPasswordError] = useState("")
  const [confirmPasswordError, setConfirmPasswordError] = useState("")
  const [currentPasswordError, setCurrentPasswordError] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const currentPasswordInputRef = useRef(null)
  const confirmPasswordInputRef = useRef(null)
  const newPasswordInputRef = useRef(null)


  const onChangeInput = (e) => {
    setNewPasswordError("")
    if (e.target.name === 'currentPassword') {
      let value = e.target.value
      if (value === '') {
        setCurrentPasswordError("Password is required")

      }
      else if (value.length < 7) {
        setCurrentPasswordError("Password Required at least 7 characters")

      }
      else {
        setCurrentPasswordError("")
      }
    }
    if (e.target.name === 'newPassword') {
      let oldPwd = currentPasswordInputRef.current.value
      if (oldPwd === e.target.value) {
        setNewPasswordError("New password cannot be same as old password")
      }
      let value = e.target.value
      if (value === '') {
        setNewPasswordError("Password is required")

      }
      else if (value.length < 7) {
        setNewPasswordError("Password Required at least 7 characters")

      }
      else {
        setNewPasswordError("")
      }
    }

    if (e.target.name === 'confirmPassword') {
      let value = newPasswordInputRef.current.value
      // console.log(value)
      if (value != e.target.value) {
        setConfirmPasswordError("Password does not match")

      }
      else {
        setConfirmPasswordError("")
      }
    }
  }


  const handleSubmit = async (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)

    const newPassword = formData.get('newPassword')
    const confirmPassword = formData.get('confirmPassword')
    const currentPassword = formData.get('currentPassword')

    if (!newPassword) {
      setNewPasswordError("Password is required")
    }
    if (!confirmPassword) {
      setConfirmPasswordError("Confirm Password is required")
    }
    if (!currentPassword) {
      setCurrentPasswordError("Current Password is required")
    }


    if (!newPassword || !confirmPassword || !currentPassword) {
      return
    }


    if (newPassword !== confirmPassword) {
      setConfirmPasswordError("Password does not match")
      return
    }

    if (newPassword === currentPassword) {
      setNewPasswordError("New password cannot be same as old password")
      return
    }

    const response = await adminAPI.updatePassword({ newPassword, confirmPassword, currentPassword })
    console.log(response)
    if (response.statusCode === 200) {
      setSuccess(response.msg)
      newPasswordInputRef.current.value = ""
      currentPasswordInputRef.current.value = ""
      confirmPasswordInputRef.current.value = ""
      setTimeout(() => {
        setSuccess(null)
      },4500)
    }
    else if (response.statusCode === 452) {
      setConfirmPasswordError(response.msg)
    }
    else if (response.statusCode === 453) {
      setNewPasswordError(response.msg)
    }
    else if(response.statusCode === 454) {
        setCurrentPasswordError(response.msg)
    }
    else {
      setError(response.msg)
      setTimeout(() => {
        setError(null)
      }, 4500)
    }
  }

  return (
    <>

      {
        error && <ToastMessage type="error" msg={error} />
      }
      {
        success && <ToastMessage type="success" msg={success} />
      }
      <div className="flex h-full w-full items-center justify-center p-4">

        <div className="w-1/2  bg-white  rounded-lg p-6">
          <div className="mb-6 text-center">
            <h2 className="text-2xl font-bold">Change Your Password</h2>
            <p className="text-gray-600">Ensure your account stays secure</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              {/* Current Password */}
              <div className="space-y-2">
                <div className="relative">
                  <Input label="Current Password" ref={currentPasswordInputRef} onChange={onChangeInput} name="currentPassword" type="password" placeholder="Enter your current password" />
                  {currentPasswordError && <p className="text-red-500 text-sm">{currentPasswordError}</p>}
                </div>
              </div>

              {/* New Password */}
              <div className="space-y-2">

                <div className="relative">
                  <Input label="New Password" ref={newPasswordInputRef} onChange={onChangeInput} name="newPassword" type="password" placeholder="Enter your new password" />
                  {newPasswordError && <p className="text-red-500 text-sm">{newPasswordError}</p>}
                </div>
              </div>

              {/* Confirm Password */}
              <div className="space-y-2">

                <div className="relative">
                  <Input label="Confirm Password" ref={confirmPasswordInputRef} onChange={onChangeInput} name="confirmPassword" type="password" placeholder="Confirm your new password" />
                  {confirmPasswordError && <p className="text-red-500 text-sm">{confirmPasswordError}</p>}
                </div>
              </div>
            </div>

            {/* Alert for password mismatch
            {passwordData.newPassword !== passwordData.confirmPassword && (
              <div className="flex items-center gap-2 p-3 bg-red-100 text-red-700 rounded">
              <AlertTriangle className="h-4 w-4" />
              <p>New password and confirmation do not match.</p>
              </div>
              )} */}

            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
            >
              Change Password
            </button>
          </form>
        </div>
      </div>
    </>
  )
}
