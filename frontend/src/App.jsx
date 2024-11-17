import { useEffect, useState } from 'react'
import { Outlet } from 'react-router'
import { Header, Footer } from './components/index'
import { useSelector, useDispatch } from 'react-redux'
import { login } from './store/authSlice'
import 'leaflet/dist/leaflet.css';

import { useNavigate } from 'react-router'
import userAuth from './api/auth'


function App() {
  const authStatus = useSelector(state => state.authReducer.authStatus)
  const navigate = useNavigate()
  const dispatch = useDispatch()
  useEffect(() => {
    const cookie = document.cookies

    async function jwtLogin(){
      try {
        const response = await userAuth.jwtLogin();
        console.log(response);
        if (response.statusCode === 200) {
          dispatch(login(response.data))
        }
        
      } catch (error) {
        navigate('/')
      }
    }
    // console.log(cookie);
    
    if(authStatus===false){
      jwtLogin()
    }
  },[])
  return (
    <>
      <div className='h-screen flex flex-col items-center'>
        <Header />
        <div className="flex-grow  flex justify-center">
          <Outlet />
        </div>
        <Footer />
      </div>
    </>
  )
}

export default App
