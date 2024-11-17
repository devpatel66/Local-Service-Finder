import React, { useState, useEffect } from 'react'
import { Button, Input, ToastMessage } from '../../index'
import { useNavigate } from 'react-router'
import { Check, X, Clock, Ellipsis } from 'lucide-react';
import bookingApi from '../../../api/bookingAPI';
import Popup from '../../utils/Popup';

function BookedServicesList() {
    const navigate = useNavigate()

    const status = {
        "accepted": "text-green-500",
        "canceled": "text-red-500",
        "pending": "text-yellow-500",
        "completed": "text-green-500"
    }

    const [bookedServiceData, setBookedServiceData] = useState([])
    const [menuOpen, setMenuOpen] = useState(-1)
    const [popupOpen, setPopupOpen] = useState({})
    const [dateError, setDateError] = useState("")
    const [resheduleDate, setRescheduleDate] = useState("")

    async function getBookedServiceData() {
        const response = await bookingApi.getBookingByUserId()
        if (response.statusCode === 200) {
            setBookedServiceData(response.data)
        }
    }
    useEffect(() => {
        getBookedServiceData()
    }, [])

    // const handleRescheduleClick = (e, date) => {
    //     e.preventDefault();
    //     setPopupOpen({
    //         open: true,
    //         title: 'Reschedule',
    //         description: 'Are you sure you want to reschedule this service?',
    //         btnText: 'Reschedule',
    //         minDate: date
    //     })

    // }

    // const handleReschedule = async (e) => {
    //     if (resheduleDate === popupOpen.minDate) {
    //         setDateError("You can't reschedule to the same date")
    //         return
    //     }
    //     else {
    //         setDateError("")
    //     }

    //     if (resheduleDate === "") {
    //         setDateError("Please select date")
    //         return
    //     }
    // }

    const [resheduleError, setResheduleError] = useState("")
    const [reschedulePop, setReshedulePopup] = useState({
        open: false,
        serviceData: {}
    })
    const [resheduleErrorMsg, setResheduleErrorMsg] = useState(false)
    const [toastMsg, setToastMsg] = useState("")
    const [newDate, setNewDate] = useState();
    const todayDate = new Date().toISOString().split("T")[0]


    const showReschedulePopup = async (e, service) => {
        e.preventDefault();
        if (service.status === "rejected" || service.status === "canceled") {
            setResheduleError("The service is rejected/canceled, Book new one !!!")
            return
        }
        setReshedulePopup({ open: true, serviceData: service })
    }





    const handleReshedule = async (e) => {

        e.preventDefault()
        if (reschedulePop.serviceData.booking_date === newDate || todayDate === newDate) {
            setResheduleErrorMsg("Invalid Date")
            return
        }

        const resheduleData = {
            booking_id: reschedulePop.serviceData.booking_id,
            date: newDate,
            updatedBy: "customer"
        }
        const response = await bookingApi.reschedule(resheduleData)

        // console.log(response);
        if (response.statusCode === 200) {
            getBookedServiceData();
            setReshedulePopup({ open: false, serviceData: {} })
            setToastMsg("Reshedule Successfully")
            setTimeout(() => {
                setToastMsg("")
            }, 5500)
        }
        else if (response.statusCode === 450) {
            setResheduleError(response.msg)
        }
        else {
            setResheduleErrorMsg(response.msg)
        }
    }


    const [error, setError] = useState("");
    const handleCanncel = async (e, booking_id) => {
        e.preventDefault();
        const updateStatusData = {
            status: "canceled",
            booking_id: booking_id,
            updatedBy: "customer"
        }

        console.log(updateStatusData)
        const response = await bookingApi.updateStatus(updateStatusData)
        console.log(response);

        if (response.statusCode === 200) {
            setToastMsg(`Succesfull ${updateStatusData.status}`)
            setTimeout(() => {
                setToastMsg("")
            }, 5500)

        }
        else {
            setError(response.msg)
            setTimeout(() => {
                setError("")
            }, 5500)
        }
    }
    return (
        <>
            {
                error && <ToastMessage msg={error} type='error' />
            }
            {
                toastMsg && <ToastMessage msg={toastMsg} type='success' />
            }

            {
                resheduleError && <Popup title='Unable to cancel' msg={resheduleError} btnFunc={() => navigate("/")} btnCloseFunc={() => setResheduleError("")} btnText={"Book New"}></Popup>
            }

            {
                reschedulePop.open && <Popup errMsg={resheduleErrorMsg} title='Reschedule' btnText='Reshedule' btnFunc={handleReshedule} btnCloseFunc={() => { setReshedulePopup({ open: false, currentDate: "" }); setResheduleErrorMsg(null) }}><Input type="date" onChange={(e) => setNewDate(e.target.value)} value={newDate} name="date" min={todayDate} /></Popup>
            }
            <div className='w-full flex flex-col p-5 gap-4 '>
                <div className='w-full border-2 rounded-2xl flex flex-col gap-6 p-5'>
                    <div>
                        <p className='text-2xl font-medium'>Booked Service</p>
                        <p className='text-sm text-gray-400 font-medium'>Manage your booked services.</p>
                    </div>
                    <div className='grid grid-cols-5 justify-items-center border-b'>
                        <p className='font-normal text-xl text-gray-400 '>Service Name</p>
                        <p className='font-normal text-xl text-gray-400'>Provided By</p>
                        <p className='font-normal text-xl text-gray-400'>Due Date</p>
                        <p className='font-normal text-xl text-gray-400'>Status</p>
                        <p className='font-normal text-xl text-gray-400'>Actions</p>
                    </div>


                    {
                        bookedServiceData.length > 0 ? bookedServiceData.map((data, index) => (
                            <div key={index} className='grid grid-cols-5 w-full font-medium justify-items-center'>
                                <p className=''>{data.title}</p>
                                <p>{data.provider_name}</p>
                                <p>{data.booking_date}</p>
                                <p className={`${status[data.status]}`}>{data.status}</p>
                                <div className='flex relative w-full justify-center'>
                                    <Button className="border" onClick={() => setMenuOpen(prev => prev === index ? -1 : index)}>
                                        <Ellipsis />
                                    </Button>
                                    {
                                        menuOpen === index ?
                                            <div className='flex top-11 rounded-sm border p-1 bg-white  z-10 absolute flex-col'>

                                                <p onClick={(e) => showReschedulePopup(e, data)} className=' gap-1 cursor-pointer items-center rounded-md text-base p-1 w-full flex hover:bg-gray-100'><Clock color='black' size={16} />Reschedule</p>
                                                <p onClick={(e) => handleCanncel(e, data.booking_id)} className=' flex gap-1 cursor-pointer rounded-md text-base items-center p-1 w-full hover:bg-gray-100'><X size={16} color='red' />Canncel</p>
                                                <p className='border-t my-1'></p>
                                                <p className=' flex gap-1 cursor-pointer rounded-md text-base items-center p-1 w-full hover:bg-gray-100' onClick={() => setMenuOpen(-1)}>Close</p>
                                            </div>

                                            : null
                                    }
                                </div>

                            </div>

                        )) : <div className='w-full flex flex-col p-5 justify-center items-center'>
                            <p className='text-xl'>You don't have any booked service</p>
                            <Button onClick={() => navigate("/")} textColor='text-white' className='bg-[#185AFF] hover:bg-[#6B17FF]'>Browse Services</Button>
                        </div>
                    }
                    {/* {

                        Object.keys(popupOpen).length > 0 && popupOpen
                            .open && <Popup btnFunc={handleReschedule} msg={popupOpen.description} btnText={popupOpen.btnText} btnCloseFunc={() => setPopupOpen({})}>
                            <Input type="date" value={resheduleDate} onChange={(e) => setRescheduleDate(e.target.value)} min={popupOpen.minDate} />
                            {dateError && <p className='text-red-400'>{dateError}</p>}
                        </Popup>
                    } */}
                </div>
            </div>
        </>
    )
}

export default BookedServicesList