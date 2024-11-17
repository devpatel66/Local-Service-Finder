import React, { useState } from 'react'
import { Input, Button, ToastMessage } from '../../../index'
import {adminAPI} from '../../../../api/adminAPI'
function AddAdmin({setAdminPopup}) {
    const [nameError, setNameError] = useState("")
    const [emailError, setEmailError] = useState("")
    const [usernameError, setUsernameError] = useState("")
    const [passwordError, setPasswordError] = useState("")
    const [error,setError] = useState("")
    const [success,setSuccess] = useState("")
    const handleAddAdmin = async (e) => {
        e.preventDefault()
        const formData = new FormData(e.target)
        const name = formData.get('name')
        const email = formData.get('email')
        const username = formData.get('username')
        const password = formData.get('password')


        if (!name) {
            setNameError("Name is Required")
        } else {
            setNameError("")
        }
        if (!email) {
            setEmailError("Email is Required")
        } else {
            setEmailError("")
        }
        if (!username) {
            setUsernameError("Username is Required")
        } else {
            setUsernameError("")
        }
        if (!password) {
            setPasswordError("Password is Required")
        } else {
            setPasswordError("")
        }
        

        if (!name || !email || !username || !password) {
            return
        }
        const response = await adminAPI.addAdmin({ name, email, username, password })
        console.log(response)


        if(response.statusCode === 200){
            // setAdminPopup(false)
            setSuccess("Admin Added Successfully")
            setTimeout(()=>{
                setSuccess("")
            },4500)
        }
        else if(response.statusCode === 452){
            setUsernameError(response.msg)
        }
        else if(response.statusCode === 420){
            setEmailError(response.msg)
        }
        else{
            setError(response.msg)
        }
    }
    return (
        <>
        {
            success && <ToastMessage msg={success} type="success" />
        }
        {
            error && <ToastMessage msg={error} type="error" />
        }
        
        <div>
            <form onSubmit={handleAddAdmin} className='w-full h-full  gap-5 flex p-5 flex-col'>
                <div>
                    <Input label="Username" name="username"/>
                    <p className='text-red-500 text-sm'>{usernameError && usernameError}</p>
                </div>
                <div>
                    <Input label="Name" name="name"/>
                    <p className='text-red-500 text-sm'>{nameError && nameError}</p>

                </div>
                <div>
                    <Input label="Email" type="email" name="email"/>
                    <p className='text-red-500 text-sm'>{emailError && emailError}</p>

                </div>
                <div>
                    <Input label="Password" name="password"/>
                    <p className='text-red-500 text-sm'>{passwordError && passwordError}</p>

                </div>
                <Button type="submit" textColor="text-white" className='bg-[#6B17FF] px-2 py-1 hover:bg-[#6a39c0]'>Add Admin</Button>
            </form>
        </div>
        </>
    )
}

export default AddAdmin