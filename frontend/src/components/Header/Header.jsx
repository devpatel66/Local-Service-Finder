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
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)


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


    <header className="sticky top-0 z-40 w-full border-b bg-white text-black shadow-lg">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2 ">
              <span className="sm:inline-block text-4xl font-semibold whitespace-nowrap text-transparent bg-clip-text bg-gradient-to-r from-[#185AFF] to-[#6B17FF]">Servico</span>
            </Link>
            <nav className="hidden md:ml-6 md:flex md:space-x-6">
              {navItems.map((item, index) => (
                item?.role == "provider" && userData.role == "provider" ?
                  <Link key={index} to={item.path} className="text-gray-900 rounded   hover:text-[#6B17FF] px-3 py-2 text-lg font-medium transition-colors">{item.name}</Link>
                  :
                  <Link key={index} to={item.path} className="text-gray-900 rounded   hover:text-[#6B17FF] px-3 py-2 text-lg font-medium transition-colors">{item?.role != "provider" && item.name}</Link>

              ))}
            </nav>
          </div>
          {
            authStatus ?
              <div className="flex items-center">
                <span className="hidden md:block text-sm font-medium mr-4">Welcome, {userData.name}</span>
                <div className="relative">
                  <button
                    onClick={() => setIsProfileMenu(!isProfileMenu)}
                    className="relative flex rounded-full bg-white/10 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-indigo-600"
                    id="user-menu-button"
                    aria-expanded="false"
                    aria-haspopup="true"
                  >
                    <span className="sr-only">Open user menu</span>
                    <User className="h-8 w-8 rounded-full p-1" />
                  </button>
                  {isProfileMenu && (
                    <div
                      className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
                      role="menu"
                      aria-orientation="vertical"
                      aria-labelledby="user-menu-button"
                      tabIndex={-1}
                      onClick={()=>setIsProfileMenu(false)}
                    >

                      <div className="flex flex-col space-y-1 w-full border-b px-2 py-2">
                        <p className="text-sm text-black  font-medium leading-none">{userData.name}</p>
                        <p className="text-xs leading-none text-muted-foreground">
                          {userData.email}
                        </p>
                      </div>
                      <Link
                        to={"/dashboard"}
                        className="flex px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        role="menuitem"
                        tabIndex={-1}
                        id="user-menu-item-0"
                      >
                        <UserCircle className="mr-3 h-5 w-5 text-gray-400" aria-hidden="true" />
                        Profile
                      </Link>
                      {userData.role === "provider" && <Link
                        to={"/addService"}
                        className="flex px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        role="menuitem"
                        tabIndex={-1}
                        id="user-menu-item-1"
                      >
                        <PlusCircle className="mr-3 h-5 w-5 text-gray-400" aria-hidden="true" />
                        Add Service
                      </Link>
                      }
                      {userData.role === "provider" && <Link
                        to={"/serviceDashboard"}
                        className="flex px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        role="menuitem"
                        tabIndex={-1}
                        id="user-menu-item-2"
                      >
                        <LayoutDashboard className="mr-3 h-5 w-5 text-gray-400" aria-hidden="true" />
                        Service Dashboard
                      </Link>}
                      <Link
                        to={"/dashboard"}
                        className="flex px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        role="menuitem"
                        tabIndex={-1}
                        id="user-menu-item-3"
                        onClick={logoutBtn}
                      >
                        <LogOut className="mr-3 h-5 w-5 text-gray-400" aria-hidden="true" />
                        Log out
                      </Link>
                    </div>
                  )}
                </div>
                <div className="ml-4 flex md:hidden">
                  <button
                    type="button"
                    className="inline-flex items-center justify-center rounded-md p-2 text-white hover:bg-indigo-500 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                    aria-controls="mobile-menu"
                    aria-expanded="false"
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  >
                    <span className="sr-only">Open main menu</span>
                    <Menu className="block h-6 w-6" aria-hidden="true" />
                  </button>
                </div>
              </div>
              : <Button textColor='text-gray-900 ' className='rounded-3xl text-xl font-medium border px-14 py-1 hover:text-white
           hover:bg-[#6B17FF]' ><Link to='/signin'>Login</Link></Button>}
        </div>
      </div>
      {isDropdownOpen && (
        <div className="md:hidden" id="mobile-menu">
          <div className="space-y-1 px-2 pb-3 pt-2 sm:px-3">
            {navItems.map((item, index) => (
              item?.role == "provider" && userData.role == "provider" ?
                <Link key={index} to={item.path} onClick={()=>setIsDropdownOpen(false)} className="text-gray-900 rounded block  hover:text-[#6B17FF] px-3 py-2 text-sm font-medium transition-colors">{item.name}</Link>
                :
                <Link key={index} to={item.path} onClick={()=>setIsDropdownOpen(false)} className="text-gray-900 rounded block hover:text-[#6B17FF] px-3 py-2 text-sm font-medium transition-colors">{item?.role != "provider" && item.name}</Link>
            ))}
          </div>
        </div>
      )}
    </header>
  )
}

export default Header