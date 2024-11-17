import React, { useEffect, useState } from 'react'
import ChartSection from './ChartSection'
import { adminAPI } from '../../../api/adminAPI'
import { useNavigate } from 'react-router'
import { useSelector } from 'react-redux'
function OverviewAdmin() {
  const adminAuthStatus = useSelector(state=>state.authReducer.adminAuthStatus)
  const navigate = useNavigate()
  const [usersData,setUserData] = useState([])
  const [recentUsers,setRecentUers] = useState([])
  useEffect(()=>{
    const fetchUserData = async ()=>{
      const response = await adminAPI.getUserData()
      console.log(response)
      setUserData(response.data)
    }
    const fetchRecentUsers = async ()=>{
      const response = await adminAPI.getRecentUser()
      console.log(response)
      setRecentUers(response.data)
    }

    if(adminAuthStatus){
      fetchRecentUsers()
      fetchUserData()
    }

  },[adminAuthStatus])
  return (
    <>
      <div className='w-full bg-slate-200 gap-5 flex p-5 flex-col'>

        <p className='text-5xl font-bold px-5'>Overview/Statics</p>
        {/* <div className='w-full justify-start'>
          <p className='text-4xl font-medium justify-start px-5 w-full'>Users Overview</p>
        </div> */}
        {/* First Section */}
        <div className='w-full gap-10 justify-center   flex px-5'>
          <div className='w-1/2 flex rounded-3xl bg-white'>  
          <ChartSection data={usersData}/>
          </div>

          {/* Recent USer Section */}
          <div className='w-1/2 border bg-white rounded-3xl p-10 flex flex-col gap-5'>
            <p className='text-4xl  w-full'>Recents Registered Users</p>
            <div className='border-b w-full p-2 flex justify-evenly '>
              <div className='text-center w-1/3 text-2xl font-normal'>
                <p>UserName</p>
              </div>
              <div className='text-center w-1/3 text-2xl font-normal '>
                <p>Role</p>
              </div>
              <div className='text-center w-1/3 text-2xl font-normal '>
                <p>Registered Date</p>
              </div>
            </div>
            {
              recentUsers.map((data,index)=>(
                <div key={index} className='border-b w-full p-2 border text-xl rounded-lg flex justify-evenly '>
              <div className='text-center w-1/3  font-light'>
                <p className='capitalize'>{data.username}</p>
              </div>
              <div className='text-center w-1/3  font-light '>
                <p className='capitalize'>{data.role}</p>
              </div>
              <div className='text-center w-1/3  font-light '>
                <p className='capitalize'>{data.created_at.slice(0,data.created_at.indexOf("T"))}</ p>
              </div>
            </div>
              ))
            }
          </div>

          {/*End Recent USer Section */}


        </div>
        {/* End First Section */}

        {/* Second Section */}
        <div className=' w-full px-5'>
          <div className='w-full  rounded-3xl bg-white gap-5 p-10 flex justify-between flex-col'>
          <div>
          <p className='text-4xl  w-full'>Users</p>
          <p className='text-sm text-slate-400  w-full'>Users Overview</p>

          </div>
          
          <div className='grid grid-cols-5 w-full gap-5'>
            <div className='border flex flex-col h-full gap-5  justify-evenly w-full items-start p-5 rounded-3xl'>
              <p className='text-5xl h-1/2 font-bold'>{usersData.total_users}</p>
              <p className='text-xl text-wrap font-normal  h-1/2'>Total Users</p>
            </div>
            <div className='border flex flex-col h-full gap-5  justify-evenly w-full items-start p-5 rounded-3xl'>
              <p className='text-5xl h-1/2 font-bold'>{usersData.customers}</p>
              <p className='text-xl text-wrap font-normal  h-1/2'>As Customer</p>
            </div>
            <div className='border flex flex-col h-full gap-5  justify-evenly w-full items-start p-5 rounded-3xl'>
              <p className='text-5xl h-1/2 font-bold'>{usersData.providers}</p>
              <p className='text-xl text-wrap font-normal  h-1/2'>As Service Provider</p>
            </div>
            <div className='border flex flex-col h-full gap-5  justify-evenly w-full items-start p-5 rounded-3xl'>
              <p className='text-5xl h-1/2 font-bold'>{usersData.providers_no_service}</p>
              <p className='text-xl text-wrap font-normal  h-1/2'> As Service Provider but does not add Service</p>
            </div>
            <div className='border flex flex-col h-full gap-5  justify-evenly w-full items-start p-5 rounded-3xl'>
              <p className='text-5xl h-1/2 font-bold'>{usersData.providers_with_service}</p>
              <p className='text-xl text-wrap font-normal  h-1/2'>As Service Provider but added Service</p>
            </div>
          </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default OverviewAdmin