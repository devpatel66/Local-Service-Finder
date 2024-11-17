import { useEffect, useState,useRef } from 'react'
import bookingApi from '../../../api/bookingAPI';
import { Check, X, Clock,Eye     } from 'lucide-react';
import DeatilBookedService from './DeatilBookedService'
import Popup from '../../utils/Popup';
import {Input,ToastMessage} from '../../index'
import { SkewLoader } from 'react-spinners';
function RequestedService() {

  
  const [requestedBookingData, setRequestedBookingData] = useState([]);
  const [accpetedBookingData, setAcceptedBookingData] = useState([]);
  const [completedBookingData, setCompletedBookingData] = useState([]);
  const [canceledBookingData, setCanceledBookingData] = useState([]);
  const [detailBookedData,setDetailBookedData] = useState();
  const [loading,setLoading] = useState(false)

  const todayDate = new Date().toISOString().split("T")[0]  

  const getBookingData = async (status) => {
    const response = await bookingApi.getBookingByProviderId(status);
    console.log(response);

    if(status === "pending"){
      setRequestedBookingData(response.data);
    }

    if(status === "accepted"){
      setAcceptedBookingData(response.data)
    }

    if(status === "completed"){
      setCompletedBookingData(response.data)
    }

    if(status === "canceled"){
      setCanceledBookingData(response.data)
      
    }
  }
  useEffect(() => {
    getBookingData("pending");
    getBookingData("accepted");
    getBookingData("completed");
    getBookingData("canceled");
  }, [])


  const [reschedulePop,setReshedulePopup] = useState({
    open:false,
    serviceData:{}
  })
  const [resheduleErrorMsg,setResheduleErrorMsg] = useState(false)
  const [toastMsg,setToastMsg] = useState("")
  const [newDate,setNewDate] = useState();
  const showReschedulePopup = async (e,service)=>{
    e.preventDefault();
    setReshedulePopup({open:true,serviceData:service})
  }


  const handleReshedule = async (e)=>{

    e.preventDefault()
    if(reschedulePop.serviceData.booking_date === newDate || todayDate === newDate){
        setResheduleErrorMsg("Invalid Date")
        return
    }
    setLoading(true)

    const resheduleData = {
      booking_id : reschedulePop.serviceData.booking_id,
      date : newDate,
      updatedBy:"provider"
    }
    const response = await bookingApi.reschedule(resheduleData)

    // console.log(response);
    if(response.statusCode === 200){
      getBookingData("pending");
      setReshedulePopup({open:false,serviceData:{}})
      setToastMsg("Reshedule Successfully")
      setTimeout(()=>{
        setToastMsg("")
      },5500)
    }
    else{
      setResheduleErrorMsg(response.msg)
    }

    setLoading(false)
  }

  const [errorPopup,setErrorPopup] = useState("");
  const handleUpdateStatus = async (e,booking_id,status)=>{
    const updateStatusData = {
      status : status,
      booking_id : booking_id,
      updatedBy:"provider"
    }
    const response = await bookingApi.updateStatus(updateStatusData)
    console.log(response);
    
    if(response.statusCode === 200){
      setToastMsg(`Succesfull ${status}`)

      if(status === "accepted"){
        getBookingData("accepted");
        getBookingData("pending");
      }
      
      if(status === "canceled"){
        getBookingData("pending");
        getBookingData("canceled");
        getBookingData("accepted");

      }


      
      if(status === "completed"){
        getBookingData("accpeted");
        getBookingData("completed");
      }
      
      setTimeout(()=>{  
        setToastMsg("")
      },5500)
      
    }
    else if(response.statusCode === 460){
      setErrorPopup(response.msg)
    }
  }
  

  

  return (
    <>
    {
      loading && <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-10 z-50'><SkewLoader color="#fff" /></div>
    }
    {
      toastMsg && <ToastMessage msg={toastMsg} type='success'/>
    }
    {
      errorPopup && <Popup title='Error !' btnCloseFunc={()=>setErrorPopup("")} btnFunc={()=>setErrorPopup("")} btnText='Okk' msg={errorPopup}/>
    }
    {
      reschedulePop.open && <Popup errMsg={resheduleErrorMsg} title='Reschedule' btnText='Reshedule'  btnFunc={handleReshedule} btnCloseFunc={()=>{setReshedulePopup({open:false,currentDate:""}); setResheduleErrorMsg(null)}}><Input type="date" onChange={(e)=>setNewDate(e.target.value)} value={newDate} name="date" min={todayDate}/></Popup>
    }
      <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-8">
        <div className="px-4 py-5 sm:px-6">
          <h2 className="text-2xl font-semibold text-gray-900">Requested Services</h2>
        </div>
        <div className="border-t border-gray-200">
          <ul className="divide-y divide-gray-200">
            {Array.isArray(requestedBookingData) && requestedBookingData.length > 0 ? requestedBookingData.map((service,index) => (
              <li key={index} className="px-4 py-4 sm:px-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <div className="mb-4 sm:mb-0">
                    <p className="text-2xl font-medium text-indigo-600 truncate">{service.title}</p>
                    <p className="mt-1 text-base text-gray-500 capitalize">Client: {service.customer_name}</p>
                    <p className="mt-1 text-base text-center rounded-xl py-1 px-2 bg-blue-100  text-blue-600">Due Date: {service.booking_date}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button onClick={(e)=>handleUpdateStatus(e,service.booking_id,"accepted")} className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                      <Check color='white' className="h-4 w-4 mr-1" />
                      Accept
                    </button>
                    <button onClick={(e)=>handleUpdateStatus(e,service.booking_id,"canceled")} className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
                      <X color='white' className="h-4 w-4 mr-1" />
                      Reject
                    </button>
                    <button onClick={(e)=>showReschedulePopup(e,service)} className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500">
                      <Clock color='white' className="h-4 w-4 mr-1" />
                      Reschedule
                    </button>
                    <button onClick={()=>setDetailBookedData(service)} className="inline-flex items-center px-3 py-1 border  text-sm font-medium rounded-md text-black bg-white  hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500">
                      <Eye color='black' className="h-4 w-4 mr-1" />
                      View Detail
                    </button>
                  </div>
                </div>
              </li>
            )) : <p className='text-center p-2'>Currently There is no booked Service</p>}
          </ul>
        </div>
      </div>

            {
              detailBookedData && <DeatilBookedService setDetailBookedData={setDetailBookedData} serviceData = {detailBookedData}/>
            }


      {/* Accepted Services Section */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-8">
        <div className="px-4 py-5 sm:px-6">
          <h2 className="text-xl font-semibold text-gray-900">Accepted Services</h2>
        </div>
        <div className="border-t border-gray-200">
          <ul className="divide-y divide-gray-200">
            {Array.isArray(accpetedBookingData) && accpetedBookingData.length > 0 ? accpetedBookingData.map((service,index) => (
              <li key={index} className="px-4 py-4 sm:px-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div className="mb-4 sm:mb-0">
                    <p className="text-2xl font-medium text-indigo-600 truncate">{service.title}</p>
                    <p className="mt-1 text-base text-gray-500 capitalize">Client: {service.customer_name}</p>
                    <p className="mt-1 text-base text-center rounded-xl py-1 bg-blue-100  text-blue-600">Due Date: {service.booking_date}</p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <button onClick={(e)=>handleUpdateStatus(e,service.booking_id,"completed")} className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                      <Check color='white' className="h-4 w-4 mr-1" />
                      Completed
                    </button>
                    <button onClick={(e)=>handleUpdateStatus(e,service.booking_id,"canceled")} className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
                      <X color='white' className="h-4 w-4 mr-1" />
                      Canceled
                    </button>
                    <button onClick={()=>setDetailBookedData(service)} className="inline-flex items-center px-3 py-1 border  text-sm font-medium rounded-md text-black bg-white  hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500">
                      <Eye color='black' className="h-4 w-4 mr-1" />
                      View Detail
                    </button>
                  </div>
                </div>
              </li>
            )) : <p className='text-center p-2'>Currently There is no Accepted Service</p>}
          </ul>
        </div>
        </div>


        {/* Completed Services */}
      <div className="bg-white shadow mb-8 overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h2 className="text-xl font-semibold text-gray-900">Completed Services</h2>
        </div>
        <div className="border-t border-gray-200">
          <ul className="divide-y divide-gray-200">
            {Array.isArray(completedBookingData) && completedBookingData.length > 0 ? completedBookingData.map((service,index) => (
              <li key={index} className="px-4 py-4 sm:px-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm font-medium text-indigo-600 truncate">{service.title}</p>
                    <p className="mt-1 text-sm text-gray-500">Client: {service.customer_name}</p>
                    <p className="mt-1 text-sm text-gray-500">Status: <span className='text-green-600'>{service.status}</span></p>
                    <p className="mt-1 text-sm text-gray-500">Completion Date: {service.booking_date}</p>
                  </div>
                </div>
              </li>
            )) :  <p className='text-center p-2'>Currently There is no Completed Service</p>}
          </ul>
        </div>
        </div>


        {/* Cannceled/Rejected Services */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h2 className="text-xl font-semibold text-gray-900">Canceled/Rejected Services</h2>
        </div>
        <div className="border-t border-gray-200">
          <ul className="divide-y divide-gray-200">
            {Array.isArray(canceledBookingData) && canceledBookingData.length > 0 ? canceledBookingData.map((service,index) => (
              <li key={index} className="px-4 py-4 sm:px-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-xl font-medium text-indigo-600 truncate">{service.title}</p>
                    <p className="mt-1 text-sm text-gray-500">Client: {service.customer_name}</p>
                    <p className="mt-1 flex text-sm text-gray-500">Status: <p className='text-red-500'>{service.status}</p></p>
                    <p className="mt-1 text-sm text-gray-500">Cannceled Date: {service.updatedAt.split("T")[0]}</p>
                  </div>
                </div>
              </li>
            )) :  <p className='text-center p-2'>Currently There is no Cannceled Service</p>}
          </ul>
        </div>
        </div>
      </>

      )
}


      export default RequestedService