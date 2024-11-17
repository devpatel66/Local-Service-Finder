import React, { useEffect, useState } from 'react'
import { Input, Button, ToastMessage } from '../../../index'
import {adminAPI} from '../../../../api/adminAPI'
function UpdateAminDetails({admin_id,setIsEditMenu}) {
    const [nameError, setNameError] = useState("")
    const [emailError, setEmailError] = useState("")
    const [usernameError, setUsernameError] = useState("")
    const [error,setError] = useState("")
    const [success,setSuccess] = useState("")

    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [username, setUsername] = useState("")
    const [adminId, setAdminId] = useState("")

    const fetchData = async () => {
        const response = await adminAPI.getAdminById(admin_id)
        console.log(response)
        setName(response.data.name)
        setEmail(response.data.email)
        setUsername(response.data.username)
        setAdminId(response.data.admin_id)
    }
    useEffect(() => {
        fetchData()    
    },[])
    const handleAddAdmin = async (e) => {
        e.preventDefault()
        const formData = new FormData(e.target)
        const name = formData.get('name')
        const email = formData.get('email')
        const username = formData.get('username')
        const response = await adminAPI.updateAdmin({admin_id:adminId, name, email, username})
        console.log(response)

        if(response.statusCode === 200){
            // setIsEditMenu(false)
            setSuccess("Admin Details Updated Successfully")
            setTimeout(()=>{
                setSuccess("")
            },4500)
        }
        else if(response.statusCode === 401){
            setEmailError(response.msg)
        }
        else if(response.statusCode === 420){
            setUsernameError(response.msg)
        }
        else{
            setError(response.msg)
        }
    }
    return (
        <>
        {
            error && <ToastMessage msg={error} type="error" />
        }
        {
            success && <ToastMessage msg={success} type="success" />
        }
        <div>
            <form onSubmit={handleAddAdmin} className='w-full h-full grid grid-cols-2 gap-5 p-5'>
                <div>
                    <Input onChange={(e) => setUsername(e.target.value)} label="Username" value={username} name="username"/>
                    <p className='text-red-500 text-sm'>{usernameError && usernameError}</p>
                </div>
                <div>
                    <Input onChange={(e) => setName(e.target.value)} label="Name" value={name} name="name"/>
                    <p className='text-red-500 text-sm'>{nameError && nameError}</p>

                </div>
                <div className='col-span-2'>
                    <Input onChange={(e) => setEmail(e.target.value)} label="Email" value={email} name="email"/>
                    <p className='text-red-500 text-sm'>{emailError && emailError}</p>

                </div>
                <Button type="submit" textColor="text-white" className='bg-[#6B17FF] col-span-2 px-2 py-1 hover:bg-[#6a39c0]'>Update</Button>
            </form>
        </div>
        </>
    )
}

export default UpdateAminDetails