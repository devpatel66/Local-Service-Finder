import React, { useState, useEffect } from 'react'
import { Input, Button, ToastMessage } from '../../../index'
import { IoFilter } from "react-icons/io5";
import { adminAPI } from '../../../../api/adminAPI';
import { SearchCheck } from 'lucide-react';
import Popup from '../../../utils/Popup';
import UpdateUserDetails from './UpdateUserDetails';
import UserDetails from './UserDetails';
function UsersOverview() {
  const [isFilterMenu, setIsFilterMenu] = useState(false)
  const [users, setUsers] = useState([])
  const [isEditMenu, setIsEditMenu] = useState(false)
  const [isDetailMenu, setIsDetailMenu] = useState(false)
  const [userId, setUserId] = useState("")
  const [isDeletePopup, setIsDeletePopup] = useState(false)
  const [deleteUserId, setDeleteUserId] = useState(null)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const getUsers = async (role) => {
    const response = await adminAPI.getUsers(role)

    if (response.statusCode === 200) {
      setUsers(response.data)
    }
  }
  const getSearchedUsers = async (searchUser) => {
    const response = await adminAPI.getSearchedUsers(searchUser)

    if (response.statusCode === 200) {
      setUsers(response.data)
    }
  }
  useEffect(() => {
    getUsers("all")
  }, [])

  const handleFilterClick = () => {
    setIsFilterMenu(prev => !prev)
  }



  const handleApplyFilter = (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    const role = formData.get("role")
    getUsers(role)
  }

  const [searchText, setSearchText] = useState("")
  const handleSearch = () => {
    let searchQuery = searchText
    if (!searchQuery) searchQuery = null
    getSearchedUsers(searchQuery)
  }


  const handleDelete = async () => {
    console.log(deleteUserId)
    const response = await adminAPI.deleteUser(deleteUserId)
    if (response.statusCode === 200) {
      setIsDeletePopup(false)
      setDeleteUserId(null)
      getUsers("all")
      setSuccess(response.msg)
      setTimeout(() => {
        setSuccess(null)
      },4500)
    }
    else {
      setError(response.msg)
      setTimeout(() => {
        setError(null)
      },4500)
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
      {
        isEditMenu && <Popup title="Update User Details"  btnText="" btnFunc={() => setIsEditMenu(false)} btnCloseFunc={() => setIsEditMenu(false)}><UpdateUserDetails userId={userId} setIsEditMenu={setIsEditMenu}/></Popup>
      }
      {
        isDetailMenu && <Popup title="User Details" btnText="" btnFunc={() => { setIsDetailMenu(false); setUserId(null) }} btnCloseFunc={() => setIsDetailMenu(false)}><UserDetails userId={userId} /></Popup>
      }
      {
        isDeletePopup && <Popup title="Delete User" btnText="Yes" btnFunc={handleDelete} btnCloseFunc={() => { setIsDeletePopup(false); setDeleteUserId(null) }}><p>Are you sure you want to delete this User?</p></Popup>
      }
      <div className='w-full h-full bg-slate-200 gap-5 flex p-5 flex-col'>

        <p className='text-5xl font-bold px-5'>User Management</p>
        {/* First Section */}
        <div className='w-full rounded-3xl bg-white p-10 gap-5 justify-center flex-col  flex px-5'>
          <div className='flex'>
            <Input onChange={(e) => setSearchText(e.target.value)} placeholder='Search by name, email, or username....' />
            <Button textColor="text-white" onClick={handleSearch} className="bg-[#185AFF] w-max" type="submit">Search</Button>

          </div>

          <div onClick={handleFilterClick} className='flex gap-1 border hover:bg-slate-50 cursor-pointer border-slate-300 w-max p-2 rounded-full items-center text-base'>
            <IoFilter size={20} />
            <span>Filter</span>
          </div>

          {/* Filter Menu */}
          {isFilterMenu &&
            <form onSubmit={handleApplyFilter} className='w-max rounded-3xl bg-white flex-col p-5 flex gap-5 border border-slate-300'>
              <div className='flex items-center w-max gap-2'>
                <div className=''>
                  <label>Role : </label>
                </div>
                <div className='flex gap-2'>
                  <label>All Roles</label>
                  <input type="radio" value={"all"} defaultChecked name="role" />
                </div>
                <div className='flex gap-2'>
                  <label>Customer</label>
                  <input type="radio" value={"customer"} name="role" />
                </div>
                <div className='flex gap-2'>
                  <label>Provider</label>
                  <input type="radio" value={"provider"} name="role" />
                </div>
              </div>
              {/* <div className='flex w-full  items-center gap-2'>
                <label className='w-max'>Date Range</label>
                <div className='flex gap-5 justify-start'>
                  <div className='w-1/2'>

                    <Input label="Start Date" type='date' />
                  </div>
                  <div className='w-1/2'>
                    <Input label="End Date" type='date' />

                  </div>
                </div>
              </div> */}
              <Button textColor="text-white" className="bg-[#185AFF] w-max" type="submit">Apply Filter</Button>
            </form>
          }
          {/* End Filter Menu */}
        </div>
        {/* End First Section */}


        {/* Second Section User List */}

        <div className='w-full flex flex-col p-10 gap-5  bg-white rounded-3xl'>
          <p className='text-4xl'>Users List</p>

          <div className='w-full grid grid-cols-7  text-2xl text-center justify-between items-center border-b'>
            <p className=' w-full'>User ID</p>
            <p className=' w-full'>Username</p>
            <p className=' w-full'>Name</p>
            <p className=' w-full'>Role</p>
            <p className=' w-full'>Email</p>
            <p className=' w-full'>Registered Date</p>
            <p className=' w-full'>Actions</p>
          </div>

          {
            users && users.length > 0 && users.map((data, index) => (
              <div key={index} className='w-full grid grid-cols-7 px-2 justify-between items-center py-2 text-center border-b'>
                <p className='w-full' >{data.user_id}</p>
                <p className='w-full'>{data.username}</p>
                <p className='w-full'>{data.name}</p>
                <p className='w-full'>{data.role}</p>
                <p className='w-full'>{data.email}</p>
                <p className='w-full'>{data.createdAt?.slice(0, data.createdAt.indexOf("T"))}</p>
                <div className='flex flex-col gap-2 items-center'>
                  <Button textColor="text-white" onClick={() => { setIsDeletePopup(true); setDeleteUserId(data.user_id) }} className='w-1/2 hover:bg-slate-800 bg-black'>Delete</Button>
                  <Button onClick={() => { setIsEditMenu(true); setUserId(data.user_id) }} textColor="text-white" className='w-1/2 hover:bg-[#4273f0] bg-[#185AFF]'>Edit</Button>
                  <Button onClick={() => { setIsDetailMenu(true); setUserId(data.user_id) }} textColor="text-white" className='w-1/2 hover:bg-[#8240f5] bg-[#6B17FF]'>View</Button>
                </div>

              </div>
            ))
          }


          <div className='w-full gap-2 flex justify-center items-center'>
            <p>Next</p>
            <p>Previous</p>
          </div>
        </div>
        {/* End Second Section User List */}



      </div>
    </>
  )
}

export default UsersOverview