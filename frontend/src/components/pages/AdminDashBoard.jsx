import React,{useEffect} from 'react'
import { Outlet,useNavigate } from 'react-router'
import AdminSidePannel from './AdminDashBoard/AdminSidePannel'
import AdminMain from './AdminDashBoard/OverviewAdmin'
import { useSelector,useDispatch } from 'react-redux'
import { adminAPI } from '../../api/adminAPI'
import { adminLogin } from '../../store/authSlice'

function AdminDashBoard() {
  const adminAuthStatus = useSelector(state=>state.authReducer.adminAuthStatus)
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const jwtLogin = async()=>{
    const response = await adminAPI.jwtLogin()
    console.log(response)
    if(response.statusCode === 200){
      dispatch(adminLogin(response.data))
    }
    else{
      navigate("/admin-login")
    }
  }
  useEffect(()=>{
    if(!adminAuthStatus){
      jwtLogin()
    }

  },[])

  return (
    <>
    <header className='flex h-[5vh] w-full bg-slate-100 border-b border-slate-200'>
            <div className='w-[20vw]  flex p-2   border-slate-400 justify-center '>
            
            <p className='text-3xl font-bold text-[#185AFF]'>Admin Pannel</p>
            </div>
            <div className='flex w-[80vw] justify-center items-center'>
            <span className="self-center text-4xl font-semibold whitespace-nowrap text-transparent bg-clip-text bg-gradient-to-r from-[#185AFF] to-[#6B17FF]">Servico</span>
            </div>
    </header>
    <div className='flex h-full bg-black'>
        <AdminSidePannel/>
        <div  className='w-[80vw]'>
            <Outlet/>
        </div>
    </div>
    </>
  )
}

export default AdminDashBoard