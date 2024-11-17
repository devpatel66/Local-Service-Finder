import React, { useEffect, useState } from 'react'
import { Button, Input, ToastMessage } from './index'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router'
import reviewApi from '../api/reviewAPI'
import { Star, MapPin, Mail, Phone, Calendar, Clock, IndianRupee, ChevronDown, ChevronUp } from 'lucide-react'
import Popup from './utils/Popup'

function DetailService({ type, data, id,by }) {
    const navigate = useNavigate();
    console.log(data)
    const fetchReview = async (service_id) => {
        const response = await reviewApi.getReviewsForPaticularService(service_id)
        console.log(response)
        setReviews(response.data)
    }
    const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false)
    const userData = useSelector(state => state.authReducer.userData)
    const [reviews, setReviews] = useState([])
    const [popupMsg, setPopupMsg] = useState("")
    const [error, seterror] = useState("")

    const handleBooknowBtn = (e) => {
        e.preventDefault();
        seterror(null)

        if (userData.user_id == data.provider_id) {
            window.scrollTo(0, 0)
            seterror("You can not book your own service")
            setTimeout(() => {
                seterror(null)
            }, 6000)
            return
        }
        if (userData.address === "" || userData.phone === null) {
            setPopupMsg("Please Update your contact details")
            return
        }
        navigate(`/booking/${data.service_id}`)
    }

    useEffect(() => {
        fetchReview(id);
    }, [])

    const [successMsg, setSuccessMsg] = useState("")
    const submitReview = async (e) => {
        e.preventDefault()
        const formData = new FormData(e.target)
        const rating = formData.get("rating")
        const comment = formData.get("comment")

        const reviewData = {
            rating,
            comment,
            user_id: userData.user_id,
            service_id: data.service_id,
            provider_id: data.provider_id

        }

        const response = await reviewApi.addReview(reviewData)

        if (response.statusCode === 200) {
            console.log(response)
            setSuccessMsg("Your review submitted Successful")
            fetchReview()
        }
        else {
            seterror(response.msg)
            setTimeout(() => {
                seterror(null)
            }, 6000)
        }

        console.log(reviewData);
    }
    return (
        <>
            {popupMsg && <Popup msg={popupMsg} btnCloseFunc={() => setPopupMsg("")} btnFunc={() => navigate("/dashboard/editProfile")} />}
            {error && error.length > 0 && <ToastMessage msg={error} type='error' />}
            {successMsg && <ToastMessage msg={successMsg} type='success' />}
            <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-8">
                <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                        <h1 className="text-3xl font-bold text-gray-900">{data.title}</h1>
                        <div className="flex flex-wrap items-center gap-2">
                            <span className="px-3 py-1 bg-gray-200 text-gray-800 rounded-full text-sm font-medium">{data.category}</span>
                            <span className="px-3 py-1 bg-gray-200 text-gray-800 rounded-full text-sm font-medium">{data.sub_category}</span>
                        </div>
                        <p className="text-lg text-gray-600">by {data.name}</p>
                        <div className="flex items-center space-x-1">
                            {[1, 2, 3, 4, 5].map((star, i) => (
                                i < Math.floor(data.total_rating/data.review_count) ? <Star size={16} color='#6B17FF' fill='#6B17FF' key={i} /> : <Star size={16} color="#6B17FF" key={i} />
                            ))}
                            <span className="text-sm text-gray-600 ml-2">{data.total_rating/data.review_count} ({data.review_count} reviwes)</span>
                        </div>
                        <div className="flex items-center space-x-2 text-gray-600">
                            <IndianRupee className="w-5 h-5 text-blue-600" />
                            <span className="font-semibold text-gray-900">{data.price}</span>
                        </div>
                    </div>
                    <div>
                        <img
                            src={data.image}
                            alt={data.title}
                            className="w-full h-64 object-cover rounded-lg shadow-md transition-transform duration-300 hover:scale-105"
                        />
                    </div>
                </div>

                {/* <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Service Details</h2>
                    <div className="grid md:grid-cols-3 gap-4 text-sm">
                        <div className="flex items-center space-x-2 text-gray-600">
                            <Calendar className="w-5 h-5 text-blue-600" />
                            <span>Available 7 days a week</span>
                        </div>
                        <div className="flex items-center space-x-2 text-gray-600">
                            <Clock className="w-5 h-5 text-blue-600" />
                            <span>3-4 hours per session</span>
                        </div>
                        <div className="flex items-center space-x-2 text-gray-600">
                            <IndianRupee className="w-5 h-5 text-blue-600" />
                            <span className="font-semibold text-gray-900">{data.price}</span>
                        </div>
                    </div>
                </div> */}

                <div className="space-y-4">
                    <h2 className="text-xl font-semibold text-gray-900">About This Service</h2>
                    <p className={`text-gray-700 leading-relaxed ${isDescriptionExpanded ? '' : 'line-clamp-3'}`}>
                        {data.description}
                    </p>
                    <button
                        className="text-blue-600 hover:text-blue-800 transition-colors duration-200 flex items-center"
                        onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
                    >
                        {isDescriptionExpanded ? (
                            <>
                                Show Less <ChevronUp className="ml-2 h-4 w-4" />
                            </>
                        ) : (
                            <>
                                Read More <ChevronDown className="ml-2 h-4 w-4" />
                            </>
                        )}
                    </button>
                </div>

                <hr className="border-gray-200" />

                <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                        <h2 className="text-xl font-semibold text-gray-900">Contact Information</h2>
                        <div className="space-y-2">
                            <div className="flex items-center space-x-2 text-gray-600">
                                <MapPin className="w-5 h-5 text-blue-600" />
                                <span>{data.location}</span>
                            </div>
                            <div className="flex items-center space-x-2 text-gray-600">
                                <Mail className="w-5 h-5 text-blue-600" />
                                <a href="mailto:contact@johndoephotography.com" className="hover:text-blue-600 transition-colors">
                                    {data.email}
                                </a>
                            </div>
                            <div className="flex items-center space-x-2 text-gray-600">
                                <Phone className="w-5 h-5 text-blue-600" />
                                <a href="tel:+15551234567" className="hover:text-blue-600 transition-colors">+91 {data.phone_number}</a>
                            </div>
                        </div>
                    </div>
                    <div className="space-y-4">
                        <h2 className="text-xl font-semibold text-gray-900">Book Your Service</h2>
                        <p className="text-gray-700">
                            Choose Your Date and Time for a Seamless Experience
                        </p>
                        <button onClick={handleBooknowBtn} className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-200">
                            Book Now
                        </button>
                    </div>
                </div>

                {by !== "admin" &&
                    <React.Fragment>
                        <hr className="border-gray-200" />
                        <form onSubmit={submitReview} className="bg-white p-6 rounded-lg shadow-md space-y-4">
                            <h3 className="text-xl font-semibold text-gray-900">Add Your Review</h3>
                            <div>
                                <label htmlFor="name" className="block text-base  text-gray-700">Hey <span className='capitalize font-bold'>{userData.name}</span>, your opinion is essential for the service provider and future customers alike!</label>

                            </div>
                            <div>
                                <label htmlFor="rating" className="block text-sm font-medium text-gray-700">Rating</label>
                                <select
                                    id="rating"
                                    name='rating'
                                    //   value={newReview.rating}
                                    //   onChange={(e) => setNewReview({...newReview, rating: parseInt(e.target.value)})}
                                    className="mt-1 block w-full rounded-md border p-2 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                                >
                                    {[1, 2, 3, 4, 5].map((rating) => (
                                        <option key={rating} value={rating}>{rating} Star{rating !== 1 ? 's' : ''}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label htmlFor="comment" className="block text-sm font-medium text-gray-700">Comment</label>
                                <textarea
                                    id="comment"
                                    name='comment'
                                    //   value={newReview.comment}
                                    //   onChange={(e) => setNewReview({...newReview, comment: e.target.value})}
                                    rows={3}
                                    className="mt-1 p-2 block w-full rounded-md border shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                                    required
                                ></textarea>
                            </div>
                            <button type="submit" className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-200">
                                Submit Review
                            </button>
                        </form>

                        <div className="space-y-6">
                            <h2 className="text-2xl font-semibold text-gray-900">Customer Reviews</h2>
                            <div className="space-y-4">
                                {Array.isArray(reviews) && reviews.length > 0 ? reviews.map((review) => (
                                    <div key={review.id} className="bg-white p-4 rounded-lg shadow-md">
                                        <div className="flex items-start space-x-4">
                                            <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-xl font-semibold text-gray-600">
                                                {review.name.split(' ').map(n => n[0]).join('')}
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center justify-between">
                                                    <h3 className="font-semibold text-gray-900">{review.name}</h3>
                                                    <div className="flex items-center">
                                                        {[...Array(5)].map((_, i) => (
                                                            i < review.rating ? <Star size={16} color='#6B17FF' fill='#6B17FF' key={i} /> : <Star size={16} color="#6B17FF" key={i} />
                                                        ))}
                                                    </div>
                                                </div>
                                                <p className="mt-1 text-sm text-gray-600">{review.comment}</p>
                                            </div>
                                        </div>
                                    </div>
                                )) : <p>Currently There are no reviews</p>}
                            </div>

                        </div>
                    </React.Fragment>
                }
            </div>
        </>
    )
}

export default DetailService