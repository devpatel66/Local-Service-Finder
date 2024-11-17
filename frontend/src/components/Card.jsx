import React, { useEffect, useState } from 'react'
import { Button } from '../components/index'
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ToastMessage } from '../components/index'
import { Search, MapPin, Star, Heart } from 'lucide-react'
import Popup from './utils/Popup';
import favoriteApi from '../api/favoriteAPI'; 

function Card({ service_id, service_provider_name, title, category, sub_category, image,ServiceImage, total_rating, location, review_count, description, provider_id,favorite_id }) {
  const authStatus = useSelector(state => state.authReducer.authStatus)
  const userData = useSelector(state => state.authReducer.userData)
  const [error, seterror] = useState("")
  const navigate = useNavigate();
  const [popupMsg, setPopupMsg] = useState("")

  console.log(favorite_id)

  const handleViewDetailBtn = (e) => {
    e.preventDefault();
    seterror(null)
    if (!authStatus) {
      seterror("Please Login First")

      setTimeout(() => {
        seterror(null)
      }, 6000)
      return
    }
    navigate(`/detailServicePage/${service_id}`)

  }

  const handleBooknowBtn = (e) => {
    e.preventDefault();
    seterror(null)
    if (!authStatus) {
      seterror("Please Login First")
      setTimeout(() => {
        seterror(null)
      }, 6000)
      return
    }
    // console.log(userData.user_id,provider_id);

    if (userData.user_id == provider_id) {
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
    navigate(`/booking/${service_id}`)
  }



  const [favoriteSuccess,setFavoriteSuccess] = useState("")
  const addToFavorite = async (e)=>{
    e.preventDefault();
    seterror(null)
    if (!authStatus) {
      seterror("Please Login First")
      setTimeout(() => {
        seterror(null)
      }, 6000)
      return
    }

    const response = await favoriteApi.addToFavorite(service_id)
    // console.log(response)
    if (response.statusCode === 200) {
      setFavoriteSuccess("Added To Favorite")
      setTimeout(() => {
        setFavoriteSuccess(null)
      }, 6000)
    }else if (response.statusCode === 400) {
      seterror(response.msg)
      setTimeout(() => {
        seterror(null)
      }, 6000)
    }else {
      seterror(response.msg)
      setTimeout(() => {
        seterror(null)
      }, 6000)

    }






  }
  // console.log("card is loaded");
  // description = description.length > 400 ? description.slice(0, 400) + " ..." : description
  return (
    //     <div className=' hover:bg-[#F3F3F3] cursor-pointer border   rounded-md w-full flex gap-2 py-2 px-1 items-center group'>
    //       <div className='p-2 w-1/3 bg-cover'>
    //         <img src={image} className='h-[100px] ' />
    //       </div>
    //       <div  className='grid h-full py-4 gap-2  w-2/3 text-sm content-between'>
    //         <div>
    //         <div className='flex justify-between '>
    //           <p className='text-2xl font-medium'>{title}</p>
    //           <p className='mr-2 text-red-400'><svg xmlns="http://www.w3.org/2000/svg" className='fill-white stroke-[#185AFF] h-7 w-7' viewBox="0 0 24 24" fill="currentColor" width="" height="">
    //   <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
    // </svg>
    // </p>
    //         </div>
    //         <p className='text-left text-xs font-light'>Provided By : {service_provider_name}</p>
    //         </div>

    //         <div className='flex gap-2 text-xs'>
    //           <p className='bg-gray-200 px-2 py-0.5 text-black rounded-md'>{category}</p>
    //           <p className='bg-gray-200 px-2 py-0.5 text-black rounded-md'>{subcategory}</p>
    //         </div>
    //         <div className='flex flex-col gap-2 w-full'>
    //           <p className='w-full  flex  text-base px-1'>⭐{total_rating}/5  {`(${review_count} reviews)`}</p>
    //           <p className='w-full text-left text-base px-1'>Location : {location}</p>
    //         </div>
    //         <div className="flex gap-2 w-full justify-end px-3">
    //         <Button  textColor='text-[#185AFF]' onClick={handleViewDetailBtn}  className='hover:bg-[#6B17FF] hover:text-white  w-1/2 border border-[#185AFF] text-base  flex justify-center items-center py-2 rounded-md font-medium text-center'>View Details</Button>
    //           <Button textColor='text-[#185AFF]' onClick={handleBooknowBtn}  className='hover:bg-[#6B17FF] hover:text-white  w-1/2 border border-[#185AFF] text-base  flex justify-center items-center py-2 rounded-md font-medium text-center'>Book Now</Button>
    //         </div>
    //       </div>
    //       {error &&error.length > 0 && <ToastMessage msg={error} type='error'/>}

    //     </div>

    <div key={service_id} className="bg-white flex flex-col group w-full shadow-md rounded-md overflow-hidden">
      <div className='h-max'>
        <img src={image || ServiceImage[0].image} className='w-full rounded-t-md h-48 object-cover' alt={title} />
        {popupMsg && <Popup msg={popupMsg} btnCloseFunc={() => setPopupMsg("")} btnFunc={() => navigate("/dashboard/editProfile")} />}
        {favoriteSuccess && <Popup msg={favoriteSuccess} btnCloseFunc={() => setFavoriteSuccess("")} btnFunc={() => navigate("/favorite")} />}
      </div>
      <div className="p-4">
        <div className='flex justify-between'>
          <h3 className="text-lg md:text-xl lg:text-2xl  group-hover:text-[#185AFF] font-semibold mb-2">{title}</h3>
          <div onClick={(e)=>addToFavorite(e,"add")} className="flex items-center cursor-pointer" >
            {favorite_id ? <Heart size={24} color='#185AFF' fill='#185AFF' className="cursor-pointer" /> : <Heart size={24} color='#185AFF' className="cursor-pointer" />}
          </div>
        </div>
        <p className="text-sm text-gray-600 mb-1">Category: {category}</p>
        <p className="text-sm text-gray-600 mb-1">Sub-categories: {sub_category}</p>
        <p className="text-sm text-gray-600 mb-1">Provider: {service_provider_name}</p>
        <p className="text-sm text-gray-600 mb-1 flex items-center">
          <MapPin className="w-4 h-4 mr-1" />
          {location}
        </p>
        <div className="flex items-center">
          <Star className="w-4 h-4 text-yellow-400 mr-1" />
          <span className="font-semibold mr-2">{(total_rating/review_count) || 0}</span>
          <span className="text-sm text-gray-600">({review_count} reviews)</span>
        </div>
      </div>
      <div className="p-4 pt-0 flex justify-between">
        <Button textColor='text-[#185AFF]' onClick={handleViewDetailBtn} className=' hover:bg-gray-50 border border-[#185AFF]  text-lg  flex justify-center items-center rounded-md font-medium text-center'>View Details</Button>
        <Button disabled={userData.user_id === provider_id} textColor='text-white' onClick={handleBooknowBtn} className='hover:bg-[#6c17ffe7] hover:text-white bg-[#6B17FF] text-lg  flex justify-center  items-center rounded-md font-medium text-center'>Book Now</Button>
      </div>
      {error && error.length > 0 && <ToastMessage msg={error} type='error' />}
    </div>

  )
}

export default Card