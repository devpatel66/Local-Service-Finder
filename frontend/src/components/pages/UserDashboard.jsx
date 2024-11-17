import React, { useEffect,useState } from 'react'
import UserProfile from './UserDashboard/UserProfile'
import { Outlet } from 'react-router'
import { Link } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import userAuth from '../../api/auth'
import { login } from '../../store/authSlice'
import { useNavigate } from 'react-router'

function UserDashboard() {

    const authStatus = useSelector(state => state.authReducer.authStatus)
    const userData = useSelector(state => state.authReducer.userData)
    const dispatch = useDispatch()
    const navigate = useNavigate()
    useEffect(() => {
        async function jwtLogin() {
            const response = await userAuth.jwtLogin();
            // console.log(response);

            if (response.statusCode === 200) {
                dispatch(login(response.data))
            }
            else{
                navigate('/')
            }
        }

        if(authStatus===false){  
            jwtLogin()     
        }
    }, [])

    const options = [
        {
            name:"profile",
            link:"",
            active:true
        },
        {
            name:"Change/Rest Password",
            link:"passwordRest",
            active:false
        },
        {
            name:"Update Profile",
            link:"editProfile",
            active:false
        },
        {
            name:"Service Dashboard",
            link:"/serviceDashboard",
            active:false,
            role:"provider"
        },
        {
            name:"Booked Service",
            link:"bookedService",
            active:false
        },
        // {
        //     name:"Delete Account",
        //     link:"/userdashboard/",
        //     active:false
        // }
    ]
  return (
    <div className='w-[80vw] mx-10 flex'>
        <div className='w-1/4 border-r capitalize  flex flex-col p-5 gap-8'>
            <p className='text-4xl font-medium'>Account Setting</p>
            {options.map((option,index)=>(
                userData.role === "provider" ?  
                <Link key={index} to={option.link} className={`text-xl cursor-pointer hover:font-medium hover:text-[#185AFF] ${option.active && "font-medium text-[#185AFF]" }`}>{option.name}</Link>
                :option?.role !== "provider" &&
                <Link key={index} to={option.link} className={`text-xl cursor-pointer hover:font-medium hover:text-[#185AFF] ${option.active && "font-medium text-[#185AFF]" }`}>{ option.name}</Link>

            ))}
        </div>
        <div className='w-3/4 m-1'>
                {authStatus && <Outlet/>}
        </div>
    </div>
  )
}

export default UserDashboard