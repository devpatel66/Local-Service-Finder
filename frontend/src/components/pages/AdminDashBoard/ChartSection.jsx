import React from 'react'
import DoughnutChart from './Chart'
function ChartSection({data}) {
  return (
    <>
      <div className='w-full border flex-col rounded-3xl gap-5 p-10 flex justify-center '>
      <p className='text-4xl  w-full'>User Chart</p>
        <div className='w-full h-full'>
          <DoughnutChart userData={data}/>
        </div>

        {/* <div className='w-1/2 flex flex-col gap-5 items-start justify-center'>
          <div className='flex justify-between px-5  py-2 w-full font-medium items-center gap-10 text-sm border-b'>
            <p>Total Users</p>
            <p>100</p>
          </div>
          <div className='flex justify-between px-5 py-2 w-full font-medium items-center gap-10 text-sm border-b'>
            <p>Users Registered as Customer</p>
            <p>60</p>
          </div>
          <div className='flex justify-between px-5 py-2 w-full font-medium items-center gap-10 text-sm border-b'>
            <p>Users Registered as Service Provide</p>
            <p>40</p>
          </div>
          <div className='flex justify-between px-5 py-2 w-full font-medium items-center gap-10 text-sm border-b'>
            <p>Users Registered as Service Provide but does not add Service : </p>
            <p>10</p>
          </div>
          <div className='flex justify-between px-5 py-2 w-full font-medium items-center gap-10 text-sm border-b'>
            <p>Users Registered as Service Provide but added Service : </p>
            <p>30</p>
          </div>
        </div> */}
      </div>
    </>
  )
}

export default ChartSection