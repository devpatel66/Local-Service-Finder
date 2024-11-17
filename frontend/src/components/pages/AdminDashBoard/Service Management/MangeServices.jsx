import React, { useState, useRef } from 'react'
import { Input, Button } from '../../../index'
import { IoFilter } from "react-icons/io5";
import Header from './Header';

function MangeServices() {
  const mainContainer = useRef(null)

  return (
    <>
      <div ref={mainContainer} className='w-full h-full bg-slate-200 gap-5 flex p-5 flex-col'>

        <p className='text-5xl font-bold px-5'>Service Management</p>
        {/* First Section */}
        <Header mainContainer={mainContainer}/>
        {/* End First Section */}


        {/* Second Section Service List */}

        <div className='w-full flex flex-col p-10 gap-10 bg-white rounded-3xl'>
          <p className='text-4xl'>Approve/Reject Services</p>


          <table className="w-full text-2xl text-center border-b">
            <thead>
              <tr className="border-b">
                <th className="">Sr. No.</th>
                <th className="">Service Name</th>
                <th className="">Category</th>
                <th className="">Provided By</th>
                <th className="">Status</th>
                <th className="">Registered Date</th>
                <th className="">Actions</th>
              </tr>
            </thead>
            <tbody className='mt-5'>
              <tr className="border-b py-10">
                <td className="py-4 text-lg ">1</td>
                <td className="py-4 text-lg text-wrap w-1/6">Home Cleaning </td>
                <td className="py-4 text-lg ">Home</td>
                <td className="py-4 text-lg ">Dev Patel</td>
                <td className="py-4 text-lg text-red-500">Pending</td>
                <td className="py-4 text-lg ">22-04-2022</td>
                <td className="py-4 text-lg flex justify-evenly gap-2">
                  <Button textColor="text-white" className="border w-1/3 text-lg py-2 bg-red-500">Reject</Button>
                  <Button textColor="text-white" className="border w-1/3 text-lg py-2 bg-green-500">Approve</Button>
                  <Button textColor="text-white" className="border w-1/3 text-lg py-2 bg-blue-500">View</Button>
                </td>
              </tr>
            </tbody>
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

export default MangeServices