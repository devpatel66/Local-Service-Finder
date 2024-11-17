import { useEffect, useState, useRef } from 'react'
import { Button } from '../index'
import { useSelector } from 'react-redux'
import { serviceApi } from '../../api/serviceAPI'
import { useParams, useNavigate } from 'react-router'
import bookingApi from '../../api/bookingAPI'
import Popup from '../utils/Popup'
import { SkewLoader } from 'react-spinners'

export default function BookingPage() {
    const mainContainer = useRef(null)
    const authStatus = useSelector(state => state.authReducer.authStatus)
    const userData = useSelector(state => state.authReducer.userData)
    const navigate = useNavigate();
    const todayDate = new Date().toISOString().split("T")[0]
    const { id } = useParams()
    const [serviceData, setServiceData] = useState({})
    const [date, setDate] = useState('')
    const [message, setMessage] = useState('')
    const [time, setTime] = useState('')
    const [popupMsg, setPopupMsg] = useState("")
    const [isDisabled, setIsDisabled] = useState()
    const [loading, setLoading] = useState(false)

    const [timeError, setTimeError] = useState("")
    const [messageError, setMessageError] = useState("")
    const [dateError, setDateError] = useState("")

    const handleDateChange = (e) => {
        if(e.target.value.length <= 0) {
            setDateError("Date is required")
        }
        else {
            setDateError("")
        }
        setDate(e.target.value)
    }

    useEffect(() => {
        console.log(authStatus);

        if (!authStatus) {
            navigate("/")
        }

        async function serviceData() {

            const response = await serviceApi.getServiceById(id)
            console.log(response);

            if (response.statusCode == 200) {
                setServiceData(response.data[0])
            }

            if (userData.user_id == response.data[0].provider_id) {
                navigate("/")
            }
        }

        if (authStatus) {
            serviceData()
        }
    }, [id])


    const [responseError, setResponseError] = useState("");
    const handleSubmit = async (e) => {
        e.preventDefault()
        
        if(!date || !message) {
            if(!date) {
                setDateError("Date is required")
            }
            else{
                setDateError("")
            }
            if(!message) {
                setMessageError("Message is required")
            }
            else{
                setMessageError("")
            }
            return
        }
        setLoading(true)
        console.log('Booking submitted:', {
            date, message, time, user_id: userData.user_id, service_id: serviceData.service_id, provider_id: serviceData.provider_id
        })

        const bookingData = {
            date: date,
            message: message,
            time: time,
            user_id: userData.user_id,
            service_id: serviceData.service_id,
            provider_id: serviceData.provider_id,
            amount: serviceData.price
        }

        const response = await bookingApi.addBooking(bookingData)
        console.log(response);

        if (response.statusCode === 200) {
            setPopupMsg("Booking of Service Done Successfully")
        }
        if (response.statusCode === 400) {
            setResponseError(response.msg)
        }
        setLoading(false)
    }

    const handleMessage = (e) => {
        setMessage(e.target.value)
        if (e.target.value.length <= 0) {
            setMessageError("Messge must be filled")
        }
        else {
            setMessageError("")
        }
    }

    const handleTimeChange = (e) => {
        const time = e.target.value
        if (Number(time.slice(0, 2)) < 9 || Number(time.slice(0, 2)) > 17) {
            setTimeError("Time must be betweent 9:00 to 17:00 only")
            // console.log("Time must be betweent 9:00 to 17:00 only");
            return

        }
        else {
            setTimeError("")
        }

        setTime(time)
        // console.log(time.slice(0,2));
        // console.log(time.slice(3));

    }
    const mainContainerStyle = {
        backgroundColor: isDisabled ? '#F3F3F3' : 'white',
        pointerEvents: isDisabled ? 'none' : 'auto',
        // opacity: isDisabled ? 0.6 : 1                 
    };

    return (
        <>

            {!loading ? popupMsg && <Popup msg={popupMsg} btnCloseFunc={() => navigate("/")} btnText='Go to Dashboard' btnFunc={() => navigate("/dashboard/bookedService")} /> 
                : <div className='text-3xl absolute bg-[#f3f3f353] w-full h-full border flex justify-center items-center'>
                <SkewLoader color='#185AFF' />
            </div>
                }
            {responseError && <Popup msg={responseError} btnCloseFunc={() => setResponseError("")} btnText='Go to Home' btnFunc={() => navigate("/")} />}
            <div ref={mainContainer} style={mainContainerStyle} className="container mx-auto p-4 max-w-6xl">
                <h1 className="text-4xl font-bold mb-6 text-center">Book Your Service</h1>
                <div className="grid gap-8 lg:grid-cols-2">
                    {
                        serviceData &&
                        <div className="bg-white shadow-lg rounded-lg p-6 lg:order-2">
                            <h2 className="text-2xl font-bold mb-2">{serviceData.title}</h2>
                            <p className="text-gray-600 mb-4">{serviceData.description}</p>
                            <div className="flex justify-between items-center mb-4">
                                <span className="text-3xl font-bold">&#8377;{serviceData.price}</span>
                                <span className="text-gray-500">{serviceData.duration}</span>
                            </div>
                            <div className="flex items-center gap-2 mb-2">
                                <span className="font-bold">Provider:</span>
                                <span>{serviceData.name}</span>
                            </div>
                            {/* <div className="flex items-center gap-2 mb-4">
                        <span className="font-bold">Phone:</span>
                        <span>{userData.phone}</span>
                    </div> */}
                        </div>
                    }

                    <div className="bg-white shadow-lg rounded-lg p-6 lg:order-1">
                        <h2 className="text-2xl font-bold mb-2">Schedule Your Cleaning</h2>
                        <p className="text-gray-600 mb-4">Choose a date and add any special requests</p>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label htmlFor="date" className="block font-semibold mb-2">Select Date</label>
                                <input
                                    type="date"
                                    value={date}
                                    onChange={handleDateChange}
                                    min={todayDate}
                                    className="w-full p-2 border rounded-md"
                                />
                                <p className='text-red-500 text-sm'>{dateError && dateError}</p>
                            </div>
                            {/* <div>
                                <label htmlFor="date" className="block font-semibold mb-2">Select Time</label>
                                <input
                                    type="time"
                                    min="08:00"
                                    max="20:00"
                                    onChange={handleTimeChange}
                                    required
                                    className="w-full p-2 border rounded-md"
                                />
                                <p className='text-red-500'>{timeError && timeError}</p>
                            </div> */}
                            <div>
                                <label htmlFor="message" className="block font-semibold mb-2">Special Requests or Instructions</label>
                                <textarea
                                    id="message"
                                    placeholder="Any areas that need extra attention? Let us know!"
                                    value={message}
                                    onChange={handleMessage}
                                    className="w-full p-2 border rounded-md min-h-[100px]"
                                />
                                <p className='text-red-500 text-sm'>{messageError && messageError}</p>
                            </div>
                            <Button type="submit" className="w-full bg-[#185AFF] text-white font-bold py-2 rounded-md hover:bg-[#6B17FF]">
                                Book Now
                            </Button>
                        </form>
                    </div>
                </div>
            </div>
        </>
    )
}
