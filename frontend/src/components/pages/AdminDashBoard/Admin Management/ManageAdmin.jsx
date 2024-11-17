import React, { useState, useEffect } from 'react'
import { Button, ToastMessage } from '../../../index'
import Popup from '../../../utils/Popup'
import AddAdmin from './AddAdmin'
import { adminAPI } from '../../../../api/adminAPI'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router'
import UpdateAminDetails from './UpdateAdminDetails'

function ManageAdmin() {
  const navigate = useNavigate()
  const [addAdminPopup, setAdminPopup] = useState(false)
  const adminData = useSelector(state => state.authReducer.adminData)
  const adminAuthStatus = useSelector(state => state.authReducer.adminAuthStatus)
  const [adminList, setAdminList] = useState([])
  const [isDeletePopup, setIsDeletePopup] = useState(false)
  const [deleteAdminId, setDeleteAdminId] = useState(null)
  const [isUpdatePopup, setIsUpdatePopup] = useState(false)
  const [updateAdminId, setUpdateAdminId] = useState(null)
  const [error,setError] = useState("")
  const [success,setSuccess] = useState("")

  const fetchAdminList = async () => {
    const response = await adminAPI.getAllAdminsList()
    setAdminList(response.data)
  }

  useEffect(() => {
    console.log(adminData)
      fetchAdminList()
  }, [adminAuthStatus])

  const handleDelete = async () => {
    const response = await adminAPI.deleteAdmin(deleteAdminId)
    if(response.statusCode === 200){
      setIsDeletePopup(false)
      setDeleteAdminId(null)
      fetchAdminList()
      setSuccess(response.msg)
    }
    else{
      setError(response.msg)
    }
  }

  const handleUpdate = async () => {
    const response = await adminAPI.updateAdmin(updateAdminId)
    if(response.statusCode === 200){
      setIsUpdatePopup(false)
      setUpdateAdminId(null)
      fetchAdminList()
      setSuccess(response.msg)
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
      {
        adminData.type === "main" && addAdminPopup && <Popup title="Add Admin"  btnText="" btnFunc={() => setAdminPopup(false)} btnCloseFunc={() => setAdminPopup(false)}><AddAdmin setAdminPopup={setAdminPopup}/></Popup>
      }


      {
        isDeletePopup && <Popup title="Delete Admin"  btnText="Yes" btnFunc={handleDelete} btnCloseFunc={() => {setIsDeletePopup(false); setDeleteAdminId(null)}}><p>Are you sure you want to delete this admin?</p></Popup>
      }
      {
        isUpdatePopup && <Popup title="Update Admin"  btnText=""  btnCloseFunc={() => {setIsUpdatePopup(false); setUpdateAdminId(null)}}>
          <UpdateAminDetails admin_id={updateAdminId} setIsEditMenu={setIsUpdatePopup}/>
        </Popup>
      }
      <div className='w-full h-full bg-slate-200 gap-5 flex p-5 flex-col'>
        <div className='w-full flex justify-between items-center'>
          <p className='text-5xl font-bold px-5'>Admin Management</p>
          { adminData.type === "main" && <Button onClick={() => setAdminPopup(true)} textColor="text-white" className='bg-[#6B17FF] px-2 py-1 hover:bg-[#6a39c0]'>Add Admin</Button>}
        </div>


        {/* Second Section User List */}

        <div className='w-full flex flex-col p-10 gap-5 bg-white rounded-3xl'>
          <p className='text-4xl'>Admin List</p>

          <div className='w-full grid grid-cols-6  text-2xl text-center justify-between items-center border-b'>
            <p className=' w-full'>Admin ID</p>
            <p className=' w-full'>Username</p>
            <p className=' w-full'>Name</p>
            <p className=' w-full'>Email</p>
            <p className=' w-full'>Registered Date</p>
            <p className=' w-full'>Actions</p>
          </div>

          {
            adminList && adminList.length > 0 && adminList.map((data, index) => (
              <div key={index} className='w-full grid grid-cols-6 px-2 justify-between items-center py-2 text-center border-b'>
                <p className='w-full' >{data.admin_id}</p>
                <p className='w-full'>{data.username}</p>
                <p className='w-full'>{data.name}</p>
                <p className='w-full'>{data.email}</p>
                <p className='w-full'>{data.createdAt?.slice(0, data.createdAt.indexOf("T"))}</p>
                <div className='flex flex-col gap-2 items-center'>
                  {
                    adminData.type === "main" ? 
                    <>
                    <Button onClick={() => {setIsUpdatePopup(true); setUpdateAdminId(data.admin_id)}} textColor="text-white" className='w-1/2 bg-[#6B17FF]'>Edit</Button> 
                    <Button onClick={() => {setIsDeletePopup(true); setDeleteAdminId(data.admin_id)}} textColor="text-white" className='w-1/2 bg-black'>Delete</Button> 
                    </>
                    : <p>No Actions</p>
                  }
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

export default ManageAdmin