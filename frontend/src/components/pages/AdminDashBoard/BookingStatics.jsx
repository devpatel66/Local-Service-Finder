import React, { useEffect, useState } from 'react'
import { Pie } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
} from 'chart.js';
import { adminAPI } from '../../../api/adminAPI';

ChartJS.register(ArcElement, Tooltip, Legend);


function BookingStatics() {

    const status = {
        "accepted": "text-green-500",
        "canceled": "text-red-500",
        "pending": "text-yellow-500",
        "completed": "text-green-500"
    }

    const [bookingStatisticData,setBookingStatisticsData] = useState({})
    const [bookingsData,setBookingsData] = useState({})


    async function fetchBookingStatistics(){
        const response = await adminAPI.getBookingStatistics()

        if(response.statusCode === 200){
            console.log(response);
            
            setBookingStatisticsData(response.data)
        }
        else{
            console.log(response);
        }
    } 
    async function fetchBookingsData(){
        const response = await adminAPI.getBookings()

        if(response.statusCode === 200){
            console.log(response);
            
            setBookingsData(response.data)
        }
        else{
            console.log(response);
        }
    } 


    useEffect(()=>{
        fetchBookingStatistics()
        fetchBookingsData()
    },[])
    const data = {
        labels: ['Accepted', 'Cannceled', 'Completed', 'Pending'],
        datasets: [{
            data: [bookingStatisticData.accepted_bookings, bookingStatisticData.canceled_bookings, bookingStatisticData.completed_bookings, bookingStatisticData.pending_bookings],
            backgroundColor: ['blue', 'red', 'green', 'gold'],
        }],
    };

    const options = {
        responsive: true,
    };
    return (
        <>
            <div className='w-full h-full bg-slate-200 gap-5 flex p-5 flex-col'>
                <p className='text-5xl font-bold px-5'>Booking Statistics</p>
                <div className='h-1/3 w-full flex justify-center py-3 bg-white rounded-3xl'>
                    <Pie data={data} options={options} />
                </div>
                <div className='w-full  rounded-3xl bg-white gap-5 p-10 flex justify-between flex-col'>
                    <div>
                        <p className='text-4xl  w-full'>Booking</p>
                        <p className='text-sm text-slate-400  w-full'>Booking Overview</p>

                    </div>

                    <div className='grid grid-cols-5 w-full gap-5'>
                        <div className='border flex flex-col h-full gap-5  justify-evenly w-full items-start p-5 rounded-3xl'>
                            <p className='text-5xl h-1/2 font-bold'>{bookingStatisticData.total_bookings}</p>
                            <p className='text-xl text-wrap font-normal  h-1/2'>Total Booking</p>
                        </div>
                        <div className='border flex flex-col h-full gap-5  justify-evenly w-full items-start p-5 rounded-3xl'>
                            <p className='text-5xl h-1/2 font-bold'>{bookingStatisticData.accepted_bookings}</p>
                            <p className='text-xl text-wrap font-normal  h-1/2'>Accpeted</p>
                        </div>
                        <div className='border flex flex-col h-full gap-5  justify-evenly w-full items-start p-5 rounded-3xl'>
                            <p className='text-5xl h-1/2 font-bold'>{bookingStatisticData.canceled_bookings}</p>
                            <p className='text-xl text-wrap font-normal  h-1/2'>Cannceled</p>
                        </div>
                        <div className='border flex flex-col h-full gap-5  justify-evenly w-full items-start p-5 rounded-3xl'>
                            <p className='text-5xl h-1/2 font-bold'>{bookingStatisticData.pending_bookings }</p>
                            <p className='text-xl text-wrap font-normal  h-1/2'>Pending</p>
                        </div>
                        <div className='border flex flex-col h-full gap-5  justify-evenly w-full items-start p-5 rounded-3xl'>
                            <p className='text-5xl h-1/2 font-bold'>{bookingStatisticData.completed_bookings}</p>
                            <p className='text-xl text-wrap font-normal  h-1/2'>Completed</p>
                        </div>
                    </div>


                    {/* Booking List */}
                </div>
                <div className='w-full flex flex-col p-10 gap-5 bg-white rounded-3xl'>
                    <p className='text-4xl'>Booking List</p>

                    <div className='w-full flex  text-2xl text-center justify-between items-center border-b'>
                        <p className=' w-full'>Booking ID</p>
                        <p className=' w-full'>Booked By</p>
                        <p className=' w-full'>Service Name</p>
                        <p className=' w-full'>Provider Name</p>
                        <p className=' w-full'>Status</p>
                        <p className=' w-full'>Booked Date</p>
                    </div>

                    {
                                bookingsData && bookingsData.length > 0 && bookingsData.map((data, index) => (
                                    <div key={index} className='w-full flex px-2 justify-between items-center py-2 text-center border-b'>
                                        <p className='w-full' >{data.booking_id}</p>
                                        <p className='w-full'>{data.username}</p>
                                        <p className='w-full'>{data.service_name}</p>
                                        <p className='w-full'>{data.provider_name}</p>
                                        <p className={`w-full ${status[data.status]}`}>{data.status}</p>
                                        <p className='w-full'>{data.created_at?.slice(0, 10)}</p>

                                    </div>
                                ))
                            }


                    {/* <div className='w-full gap-2 flex justify-center items-center'>
                        <p>Next</p>
                        <p>Previous</p>
                    </div> */}
                </div>
            </div>
        </>
    )
}

export default BookingStatics