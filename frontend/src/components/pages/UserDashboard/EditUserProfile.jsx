import { useEffect, useState } from 'react'
import { FaRegUser } from "react-icons/fa";
import { useSelector, useDispatch } from 'react-redux';
import { Input } from '../../index'
import { login } from '../../../store/authSlice';
import {useNavigate} from 'react-router'
import userAuth from '../../../api/auth';


function EditUserProfile() {
    // const userData = useSelector(state => state.authReducer.userData)
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [phone, setPhone] = useState("")
    const [username, setUsername] = useState("")
    const [address, setAddress] = useState("")
    const dispatch = useDispatch();

    const [nameError, setNameError] = useState("")
    const [emailError, setEmailError] = useState("")
    const [phoneError, setPhoneError] = useState("")
    const [usernameError, setUsernameError] = useState("")
    const [addressError, setAddressError] = useState("")
    const [user_id, setUser_id] = useState(0)

    const navigate = useNavigate();
    useEffect(() => {
        async function getUserDetails() {
            const response = await userAuth.userDetails()
            // console.log(response);
            
            if(response.statusCode===200){
                setName(response.data.name)
                setEmail(response.data.email)
                setPhone(response.data.phone)
                setUsername(response.data.username)
                setAddress(response.data.address)
                setUser_id(response.data.user_id)
            }
            else{
                alert(response.msg)
            }
        }
        getUserDetails()
    },[])


    const updateProfile = async (e) => {
        e.preventDefault()
        if(!name){
            setNameError("Name is required")
        }else{
            setNameError("")
        }

        if(!email){
            setEmailError("Email is required")
        }else{
            setEmailError("")
        }

        if(!phone){
            setPhoneError("Phone is required")
        }else{
            setPhoneError("")
        }

        if(!username){
            setUsernameError("Username is required")
        }else{
            setUsernameError("")
        }

        if(!address){
            setAddressError("Address is required")
        }else{
            setAddressError("")
        }

        if(!name || !email || !phone || !username || !address){
            return
        }
        const userDetails = {
            id:user_id,
            name,
            new_email:email,
            user_name:username,
            new_phone:phone,
            address
        }
        const response = await userAuth.updateUserDetais(userDetails)
        // console.log(response);
        
        if(response.statusCode===200){
            alert("Profile updated successfully")
            const user = await userAuth.jwtLogin();
            dispatch(login(user.data))
            navigate('/dashboard')
        }
        else if(response.statusCode===420){
            setUsernameError(response.msg)
        }
        else if(response.statusCode === 401){
            setEmailError(response.msg)
        }
        else if(response.statusCode === 452){
            setPhoneError(response.msg)
        }
        else{
            alert(response.msg)
            console.log(response);
            
        }
        
    }
    return (
        <div className="flex justify-center p-4">

            <div className="w-full  max-w-2xl bg-white rounded-lg">
                <div className="p-6">
                    <h2 className="text-2xl font-bold text-center">Edit Your Profile</h2>
                    <p className="text-center text-gray-600">Update your personal information</p>
                </div>

                <div className="p-6">
                    <form className="space-y-6">
                        <div className="flex justify-center mb-6">
                            <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                                <FaRegUser size={40} />

                            </div>
                        </div>

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
                                    onChange={(e)=> setName(e.target.value)}
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
                                <label htmlFor="phone" className="flex items-center gap-2 text-gray-700">
                                    {/* <Phone size={16} /> */}
                                    Phone Number
                                </label>
                                <Input
                                    id="phone"
                                    name="phone"
                                    value={phone || ""}
                                    onChange={(e) => setPhone(e.target.value)}
                                    placeholder="Enter your phone number"
                                    className="border border-gray-300 rounded px-4 py-2"
                                />
                                {
                                    phoneError && <p className="text-red-500">{phoneError}</p>
                                }
                            </div>
                            <div className="grid gap-2">
                                <label htmlFor="phone" className="flex items-center gap-2 text-gray-700">
                                    {/* <Phone size={16} /> */}
                                    Email
                                </label>
                                <Input
                                    id="email"
                                    name="phone"
                                    value={email || ""}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Enter your phone number"
                                    className="border border-gray-300 rounded px-4 py-2"
                                />
                                {
                                    emailError && <p className="text-red-500">{emailError}</p>
                                }
                            </div>

                            <div className="grid gap-2">
                                <label htmlFor="address" className="flex items-center gap-2 text-gray-700">
                                    {/* <MapPin size={16} /> */}
                                    Address
                                </label>
                                <textarea
                                    id="address"
                                    name="address"
                                    value={address || ""}
                                    onChange={(e) => setAddress(e.target.value)}
                                    placeholder="Enter your full address"
                                    rows={3}
                                    className="border border-gray-300 rounded px-4 py-2"
                                ></textarea>

                                {
                                    addressError && <p className="text-red-500">{addressError}</p>
                                }
                            </div>
                        </div>

                        <button type="submit" onClick={updateProfile} className="w-full bg-indigo-500 text-white rounded py-2 hover:bg-indigo-600 transition">
                            Save Changes
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default EditUserProfile