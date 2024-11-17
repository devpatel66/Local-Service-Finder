import React, { useState, useEffect } from 'react'
import ServiceCard from './Service Dashboard/ServiceCard';
import RequestedService from './Service Dashboard/RequestedService';
import { useSelector, useDispatch } from 'react-redux';
import { login } from '../../store/authSlice';
import { useNavigate } from 'react-router';
import userAuth from '../../api/auth';


export default function ServiceDashbard() {
  const authStatus = useSelector(state => state.authReducer.authStatus)
  const userData = useSelector(state => state.authReducer.userData)
  const [activeTab, setActiveTab] = useState(true);
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const handleTab = (e) => {

    if (e.target.innerText === "Your Services") {
      setActiveTab(true);
    } else {
      setActiveTab(false);
    }
  }

  useEffect(() => {
    async function jwtLogin(){
      try {
        const response = await userAuth.jwtLogin();
        // console.log(response);
        if (response.statusCode === 200) {
          dispatch(login(response.data))
          if(response.data.role !== "provider"){
            navigate("/")
          }
        }
        else{
          // console.log("hgshgdhsgd");
          
          navigate('/')
        }
      } catch (error) {
        navigate('/')
      }
    }
    if(authStatus === false){
      jwtLogin()
    }
  }, [])


  return (
    <div className="min-h-screen ">
      <header className="flex flex-col  justify-between  py-4 bg-white ">
        <h1 className="text-4xl font-bold"> Service Dashboard</h1>
        <nav className='flex gap-4 bg-gray-200 w-max p-2 rounded-3xl'>
          <p onClick={handleTab} className={`font-bold px-3 py-2 rounded-3xl cursor-pointer ${activeTab ? 'bg-white' : ''}`}>Your Services</p>
          <p onClick={handleTab} className={`font-bold px-3 py-2 rounded-3xl cursor-pointer ${!activeTab ? 'bg-white' : ''}`}>Requested Services</p>
        </nav>
      </header>
      <main className="max-w-7xl bg-gray-100 rounded-xl w-[80vw] mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0 ">

          {
            activeTab ? <ServiceCard /> : <RequestedService />
          }
        </div>
      </main>
    </div>
  );
}
