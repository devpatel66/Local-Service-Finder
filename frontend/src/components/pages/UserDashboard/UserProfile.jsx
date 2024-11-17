import React, { useEffect, useState } from 'react'
import { Button,ToastMessage } from '../../index'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router'
import { login,logout } from '../../../store/authSlice'
import { serviceApi } from '../../../api/serviceAPI'
import userAuth from '../../../api/auth'
import Popup from '../../utils/Popup'

function UserProfile() {
    const [userInfo, setUserInfo] = useState(false)
    const userData = useSelector(state => state.authReducer.userData)
    const authStatus = useSelector(state => state.authReducer.authStatus)
    const [serviceData, setServiceData] = useState([])
    const [popupDisplay, setPopupDisplay] = useState(false)
    const [error,setError] = useState(null)
    const navigate = useNavigate();
    const dispatch = useDispatch()
    
    async function jwtLogin() {
        const response = await userAuth.jwtLogin();

        if (response.statusCode === 200) {
            dispatch(login(response.data))
            setUserInfo(response.data)
        }
        else{
            dispatch(logout())
            navigate('/')
        }
    }
    useEffect(() => {

        async function getSerivceData() {
            // console.log(userData);
            
            const response = await serviceApi.getServiceByUserId(userData.user_id);
            // console.log(response);
            if (response.statusCode === 200) {
                setServiceData(response.data)
            }
            else{
                setServiceData([])
            }
        }

        
        
        // if (Object.keys(userData).length <= 0) {
        //     // console.log('true:');
        //     navigate('/signin')
        // }
        if(authStatus===true){
            setUserInfo(userData)
            getSerivceData()
        }
        // console.log(userData);

    }, [])


    const handleRoleChange = async () => {
        setPopupDisplay(false)
        const response = await userAuth.changeRole({userRole:"provider"});
        console.log(response);
        
        if (response.statusCode === 200) {
            alert("Role changed successfully")
            await jwtLogin()
        }
        else{
            console.log("response");
            
            setError("Something went wrong. Please try again later")
        }
    }

    return (
        <>

            {error && <ToastMessage type={"error"} msg={error}/>}
            <div className={`w-full flex flex-col p-5 gap-4 ${popupDisplay && "pointer-events-none opacity-50"}`}>
                <div className='w-full flex justify-between'>
                    <p className='text-4xl font-medium'>Profile</p>
                    {userData.role === "provider" && <Button onClick={() => navigate('/addService')} className='bg-[#185AFF] text-white'>Add Service</Button>}
                </div>
                <div className='w-full border-2 rounded-2xl flex flex-col gap-6 p-5'>
                    <p className='text-2xl font-medium'>Basic Information</p>
                    <div>
                        <p className='font-medium text-xl'>Name</p>
                        <p>{userInfo.name || "----"}</p>
                    </div>
                    <div>
                        <p className='font-medium text-xl'>User Name</p>
                        <p>{userInfo.username}</p>
                    </div>
                    <div>
                        <p className='font-medium text-xl'>Email</p>
                        <p>{userInfo.email}</p>
                    </div>
                    <div>
                        <p className='font-medium text-xl'>Phone Number</p>
                        <p>{userInfo.phone}</p>
                    </div>
                    <div>
                        <p className='font-medium text-xl'>Role</p>
                        <p>{userInfo.role}</p>
                    </div>
                </div>
                <div className='w-full border-2 rounded-2xl flex flex-col gap-6 p-5'>
                    <div>
                        <p className='text-2xl font-medium'>View Service</p>
                        <p className='text-sm text-gray-400 font-medium'>Manage your added services.</p>
                    </div>
                    <div className='grid grid-cols-5 justify-items-center border-b'>
                        <p className='font-normal text-xl text-gray-400'>Service ID</p>
                        <p className='font-normal text-xl text-gray-400 '>Name</p>
                        <p className='font-normal text-xl text-gray-400'>Description</p>
                        <p className='font-normal text-xl text-gray-400'>Pricing</p>
                        <p className='font-normal text-xl text-gray-400'>Actions</p>
                    </div>


                    {
                        serviceData.length > 0 ? serviceData.map((service, index) => (
                            <div key={index} className='grid grid-cols-5 font-medium justify-items-center'>
                                <p className=''>{service.service_id}</p>
                                <p className=''>{service.title}</p>
                                <p>{service.description.slice(0, 20) + "..."}</p>
                                <p>{service.price}</p>
                                <div className='flex w-full justify-center'>
                                    <Button onClick={() => navigate(`editService/${service.service_id}`)} className='bg-green-300 hover:bg-green-400'>Edit</Button>
                                    {/* <Button className='bg-red-300 hover:bg-red-400 ml-2'>Delete</Button> */}
                                </div>
                            </div>
                        )) :
                            userInfo.role === "provider" ? <div className='w-full flex flex-col p-5 justify-center items-center'>
                                <p>You don't have any service</p>
                                <Button onClick={() => navigate('/addService')} textColor='text-white' className='bg-[#185AFF] hover:bg-[#6B17FF]'>Add Service</Button>
                            </div> : <div className='w-full flex flex-col p-5 justify-center items-center'>
                                <p className='text-xl'>You don't have any service</p>
                                <p>To Add an service first change the role to provider</p>
                                <Button onClick={() => setPopupDisplay(true)} textColor='text-white' className='bg-[#185AFF] hover:bg-[#6B17FF]'>Change Role</Button>
                            </div>

                    }
                </div>

                <div>

                </div>
            </div>
            {popupDisplay && <Popup msg="Are you Sure want to change Role to provider?" btnFunc={handleRoleChange} btnText="Yes" btnCloseFunc={() => setPopupDisplay(false)} />}
        </>
    )
}

export default UserProfile