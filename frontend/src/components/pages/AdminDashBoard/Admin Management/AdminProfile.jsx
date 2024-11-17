import React, { useEffect, useState } from 'react'
import { Input, ToastMessage } from '../../../index'
import { useSelector } from 'react-redux'
import { adminAPI } from '../../../../api/adminAPI'

function AdminProfile() {
    const [nameError, setNameError] = useState("")
    const [emailError, setEmailError] = useState("")
    const [usernameError, setUsernameError] = useState("")

    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [username, setUsername] = useState("")
    const [error, setError] = useState("")
    const [success, setSuccess] = useState("")

    const adminData = useSelector(state => state.authReducer.adminData)
    const adminAuthStatus = useSelector(state => state.authReducer.adminAuthStatus)

    useEffect(() => {
        setName(adminData.name)
        setEmail(adminData.email)
        setUsername(adminData.username)
    }, [adminAuthStatus])

    const handleSaveChange = async (e) => {
        e.preventDefault()
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
        if (!name || !email || !username) {
            return
        }
        console.log(adminData)
        const response = await adminAPI.update({ name, email, username, admin_id: adminData.admin_id })
        if (response.statusCode === 200) {
            setSuccess(response.msg)
        } else {
            setError(response.msg)
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
            <div className="w-full h-full bg-slate-200 gap-5 flex p-5 flex-col">

                <div className="w-full flex flex-col p-10 gap-5 bg-white rounded-3xl">
                    <div className="p-6">
                        <h2 className="text-2xl font-bold text-center">Edit Your Profile</h2>
                        <p className="text-center text-gray-600">Update your personal information</p>
                    </div>

                    <div className="p-6">
                        <form className="space-y-6">

                            <div className="grid gap-4">
                                <div className="grid gap-2">
                                    <label htmlFor="name" className="flex items-center gap-2 text-gray-700">
                                        {/* <User size={16} /> */}
                                        Name
                                    </label>
                                    <Input
                                        id="name"
                                        name="name"
                                        value={name || ""}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="Enter your full name"
                                        className="border border-gray-300 rounded px-4 py-2"
                                    />
                                    {
                                        nameError && <p className="text-red-500">{nameError}</p>
                                    }
                                </div>

                                <div className="grid gap-2">
                                    <label htmlFor="username" className="flex items-center gap-2 text-gray-700">
                                        {/* <User size={16} /> */}
                                        Username
                                    </label>
                                    <Input
                                        id="username"
                                        name="username"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        placeholder="Choose a username"
                                        className="border border-gray-300 rounded px-4 py-2"
                                    />
                                    {
                                        usernameError && <p className="text-red-500">{usernameError}</p>
                                    }
                                </div>


                                <div className="grid gap-2">
                                    <label htmlFor="email" className="flex items-center gap-2 text-gray-700">
                                        {/* <Phone size={16} /> */}
                                        Email
                                    </label>
                                    <Input
                                        id="email"
                                        name="email"
                                        value={email || ""}
                                        type="email"
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="Enter your phone number"
                                        className="border border-gray-300 rounded px-4 py-2"
                                    />
                                    {
                                        emailError && <p className="text-red-500">{emailError}</p>
                                    }
                                </div>
                            </div>

                            <button onClick={handleSaveChange} type="submit" className="w-full bg-indigo-500 text-white rounded py-2 hover:bg-indigo-600 transition">
                                Save Changes
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </>
    )
}

export default AdminProfile