import React, { useEffect, useState } from 'react'
import { adminAPI } from '../../../../api/adminAPI'
function UserDetails({userId}) {
    const [user,setUser] = useState({})
    const fetchData = async () => {
        const response = await adminAPI.getUserId(userId)
        console.log(response)
        setUser(response.data)
    }
    useEffect(() => {
        fetchData()    
    },[])
  return (
    <div className='flex flex-col border gap-2'>
        <div className='grid grid-cols-2 border-b p-2'>
            <p>Name</p>
            <p>{user.name && user.name}</p>
        </div>
        <div className='grid grid-cols-2 border-b p-2'>
            <p>Username</p>
            <p>{user.username && user.username}</p>
        </div>
        <div className='grid grid-cols-2 border-b p-2'>
            <p>Address</p>
            <p>{user.address && user.address}</p>
        </div>
        <div className='grid grid-cols-2 border-b p-2'>
            <p>Email</p>
            <p>{user.email && user.email}</p>
        </div>
        <div className='grid grid-cols-2 border-b p-2'>
            <p>PhoneNumber</p>
            <p>{user.phone && user.phone}</p>
        </div>
    </div>
  )
}

export default UserDetails