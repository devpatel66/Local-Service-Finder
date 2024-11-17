import React, { useState, useRef, useEffect } from 'react'
import { Input, Button } from '../../../index'
import { adminAPI } from '../../../../api/adminAPI';
import { useNavigate } from 'react-router';
import Header from './Header';


function ViewServices() {
  const navigate = useNavigate()
  const mainContainer = useRef(null)
  const [serviceData, setServiceData] = useState([])
  useEffect(() => {
    async function serviceData() {
      try {
        const resonseData = await adminAPI.getServiceList()
        // console.log(resonseData.data);
        setServiceData(resonseData.data)
      }

      catch (error) {
        console.log(error)
      }
    }

    serviceData()
  }, [])
  return (
    <>
      <div ref={mainContainer} className='w-full h-full bg-slate-200 gap-5 flex p-5 flex-col'>

        <p className='text-5xl font-bold px-5'>Service Management</p>
        {/* First Section */}
        <Header mainContainer={mainContainer} setServiceData={setServiceData}/>
        {/* End First Section */}


        {/* Second Section Service List */}

        <div className='w-full flex flex-col p-10 gap-5 bg-white rounded-3xl'>
          <p className='text-4xl'>Services List</p>

          {/* <div className='w-full flex  text-2xl text-center justify-between items-center border-b'>
            <p className=' w-max'>Sr. No.</p>
            <p className=' w-full'>Service Name</p>
            <p className=' w-full'>Category</p>
            <p className=' w-full'>Provided By</p>
            <p className=' w-full'>Status</p>
            <p className=' w-full'>Registered Date</p>
            <p className=' w-full'>Actions</p>
          </div>


          <div className='w-full flex px-2 justify-between items-center py-2 text-center border-b'>
          <p className='w-max'>1</p>
            <p className='w-full text-wrap'>Home Cleaning</p>
            <p className='w-full'>Home</p>
            <p className='w-full'>Dev Patel</p>
            <p className='w-full'>Pennding</p>
            <p className='w-full'>22-04-2022</p>
            <div className='w-max flex justify-evenly gap-2'>
              <Button textColor='text-white' className='border w-1/3 text-xs px bg-red-500'>Delete</Button>
              <Button textColor='text-white' className='border w-1/3 text-xs bg-blue-500'>Edit</Button>
              <Button textColor='text-white' className='border w-1/3 text-xs bg-green-500'>View</Button>
            </div>
          </div> */}

          <table className="w-full text-2xl text-center border-b">
            <thead>
              <tr className="border-b">
                <th className="">Sr. No.</th>
                <th className="">Service Name</th>
                <th className="">Category</th>
                <th className="">Provided By</th>
                {/* <th className="">Status</th> */}
                <th className="">Registered Date</th>
                <th className="">Actions</th>
              </tr>
            </thead>
            {serviceData.length > 0 && serviceData.map((data, index) => (
              <tbody key={index} className='mt-5'>
                <tr className="border-b py-10">
                  <td className="py-4 text-lg ">{index + 1}</td>
                  <td className="py-4 text-lg text-wrap w-1/6">{data.title}</td>
                  <td className="py-4 text-lg ">{data.category}</td>
                  <td className="py-4 text-lg ">{data.username || data.service_provider_name}</td>
                  {/* <td className="py-4 text-lg text-red-500">{data.status}</td> */}
                  <td className="py-4 text-lg ">{data.created_at.slice(0,10)}</td>
                  <td className="py-4 text-lg flex justify-evenly gap-2">
                    <Button textColor="text-white" onClick={()=>navigate(`detailServicePage/${data.service_id}/admin`)} className="border w-max text-lg py-2 bg-green-500">View</Button>
                    <Button textColor="text-white" onClick={()=>navigate(`editService/${data.service_id}/admin`)} className="border w-max text-lg py-2 bg-red-500">Edit</Button>
                    {/* <Button textColor="text-white" className="border w-full text-lg py-2 bg-green-500"></Button> */}
                  </td>
                </tr>
              </tbody>
            ))}
          </table>


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

export default ViewServices