import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { Button } from '../index'
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { CiMenuBurger } from "react-icons/ci";
import userAuth from '../../api/auth';
import { logout as authLogout } from '../../store/authSlice';
import { Menu, User, LogOut, UserCircle, PlusCircle, LayoutDashboard } from "lucide-react"

function Header() {
  const userData = useSelector(state => state.authReducer.userData)
  const authStatus = useSelector(state => state.authReducer.authStatus)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [isProfileMenu, setIsProfileMenu] = useState(false)



  const navItems = [
    {
      name: "Home",
      path: "/",
      active: true,
    },
    {
      name: "About",
      path: "/aboutus",
      active: false,
    },
    {
      name: "Favroite",
      path: "favorite",
      active: false,
    },
    {
      name: "Service Dashboard",
      path: "/serviceDashboard",
      active: false,
      role: "provider"
    },
    // active is depend on the authStatus
    {
      name: "Add Services",
      path: "/addService",
      role: "provider",
      active: false
    }
    // TODO : Add more nav items.... 
  ]

  const handleMenu = () => {
    setIsProfileMenu(prev => !prev)
  }

  const logoutBtn = async () => {
    const response = await userAuth.logout();
    if (response.statusCode === 200) {
      dispatch(authLogout())
      navigate('/')
    }
    else {
      console.log(response);
    }
  }
  return (
    // TODO : LogoutBTN sperated component is need to be made.


    <nav className="h-max w-full bg-white flex justify-between ">

      <div className="max-w-screen-xl flex flex-wrap items-center gap-20 justify-strat ml-24 p-4">
        <Link to="/" className="flex items-center space-x-3 rtl:space-x-reverse self-center text-4xl font-semibold whitespace-nowrap text-transparent bg-clip-text bg-gradient-to-r from-[#185AFF] to-[#6B17FF]">
          {/* <img src="https://flowbite.com/docs/images/logo.svg" className="h-8" alt="Flowbite Logo" /> */}
          Servico
        </Link>
        <button data-collapse-toggle="navbar-default" type="button" className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden " aria-controls="navbar-default" aria-expanded="false">
          <span className="sr-only">Open main menu</span>
          <CiMenuBurger size={20} />
        </button>
        <div className="hidden w-full md:block md:w-auto" id="navbar-default">
          <ul className="font-medium flex flex-col justify-center items-center  md:p-0  border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0 md:bg-white ">

            {navItems.map((item, index) => (
              item?.role == "provider" && userData.role == "provider" ?
                <li key={index}>
                  <Link to={item.path} className="block py-2 px-3 text-xl text-gray-900 rounded  hover:text-[#6B17FF] md:p-0 ">{item.name}</Link>
                </li>
                :
                <li key={index}>
                  <Link to={item.path} className="block py-2 px-3 text-xl text-gray-900 rounded  hover:text-[#6B17FF] md:p-0 ">{item?.role != "provider" && item.name}</Link>
                </li>

            ))}

          </ul>
        </div>
      </div>
      {/* Right Side */}
      <div className='flex justify-end  items-center mr-24 w-1/3'>
        {authStatus ? <div className='relative flex flex-col justify-center border px-2 py-1 rounded-3xl gap-4 items-center'>
          <div className='cursor-pointer w-full flex gap-4' onClick={handleMenu}>
            <div className='w-10 rounded-full uppercase flex justify-center items-center h-10  bg-slate-300'>
              {userData.username[0]}
            </div>
            <div className='flex justify-center items-center'>
              <p className='font-medium'>{userData?.name || "Username"}</p>
              <button className='pl-1'>{
                isProfileMenu ? <IoIosArrowUp size={22} /> : <IoIosArrowDown size={22} />
              }</button>
            </div>
          </div>
          <div className={`w-52 flex flex-col px-1 h-0 transition-all duration-500 items-center justify-center border bg-white top-14 rounded-lg absolute ${isProfileMenu ? "h-max" : "hidden"}`}>
            <div className="flex flex-col space-y-1 w-full border-b px-2 py-2">
              <p className="text-sm text-black  font-medium leading-none">{userData.name}</p>
              <p className="text-xs leading-none text-muted-foreground">
                {userData.email}
              </p>
            </div>
            <div className='w-full flex flex-col py-1 px-1'>
              <div className='w-full text-sm font-medium rounded-md  cursor-pointer hover:bg-gray-200 py-2 px-1  text-black flex items-center'>
                <UserCircle className="mr-2 h-4 w-4" />
                <Link onClick={handleMenu} to={"/dashboard"}>Profile</Link>
              </div>
              {
                userData.role === "provider" &&
                <>
                  <div className='w-full text-sm font-medium rounded-md  cursor-pointer hover:bg-gray-200 py-2 px-1 text-black flex items-center'>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    <Link onClick={handleMenu} to={"/addService"}>Add Service</Link>
                  </div>
                  <div className='w-full text-sm font-medium rounded-md  cursor-pointer hover:bg-gray-200 py-2 px-1 text-black flex items-center'>
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    <Link onClick={handleMenu} to={"/serviceDashboard"}>Service Dashbaord</Link>
                  </div>


                </>
              }
            </div>
            <hr className='w-full' />
            <div className='w-full my-1 rounded-md cursor-pointer py-2 text-sm font-medium hover:bg-gray-200  px-2 text-black flex items-center'>
              <LogOut className="mr-2 h-4 w-4" />
              <p onClick={logoutBtn} className='cursor-pointer font-medium text-red-400'>Logout</p>
            </div>

          </div>
        </div> : <Button textColor='text-gray-900 ' className='rounded-3xl text-xl font-medium border px-14 py-1 hover:text-white
         hover:bg-[#6B17FF]' ><Link to='/signin'>Login</Link></Button>}
      </div>
    </nav>
  )
}

export default Header