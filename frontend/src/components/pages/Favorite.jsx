import React, { useEffect,useState } from 'react';
import { Trash2, Eye  } from 'lucide-react'
import favoriteApi from '../../api/favoriteAPI';
import { useNavigate } from 'react-router';
import {Button,ToastMessage} from '../index'


const Favorite = () => {
  const navigate = useNavigate();

  const [favoriteServices, setFavoriteServices] = useState([]);
  const fetchFavoriteServices = async () => {
    try {
      const response = await favoriteApi.getFavoriteList();
      if(response.statusCode === 200){
        setFavoriteServices(response.data);
      }
      console.log(response);
    } catch (error) {
      console.error('Error fetching favorite services:', error);
    }
  }
  useEffect(() => {

    

    fetchFavoriteServices();
  }, []);

  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)
  const handleRemove = async (e,fav_id)=>{
    e.preventDefault()

    console.log(fav_id);
    const response = await favoriteApi.removeFromFavorite(fav_id)
    console.log(response)
    if(response.statusCode === 200){
      setSuccess(response.msg)
      fetchFavoriteServices()
      setTimeout(()=>{
        setSuccess("")
      },5000)
    }else{
      setError(response.msg)
      setTimeout(()=>{
        setError("")
      },5000)
    }
  }

  return (
    <>
    <div className="max-w-7xl mx-auto p-4 sm:p-6 md:p-8 lg:p-12 xl:p-24">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">My Favorites</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {Array.isArray(favoriteServices) && favoriteServices.length > 0 ? favoriteServices.map((service, index) => (
          <div
          key={index}
          className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-2xl transition duration-300"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{service.title}</h2>
            <div className="flex flex-col mb-4">
              <span className="text-sm text-gray-600">Category:</span>
              <span className="text-lg text-gray-900">{service.category} - {service.sub_category}</span>
            </div>
            <div className="flex flex-col mb-4">
              <span className="text-sm text-gray-600">Price:</span>
              <span className="text-lg text-gray-900">&#8377; {service.price}</span>
            </div>
            <div className="flex flex-col mb-8">
              <span className="text-sm text-gray-600">Provider:</span>
              <span className="text-lg text-gray-900 capitalize">{service.provider_name}</span>
            </div>
            <div className='flex flex-col items-center w-full gap-4'>
                
            <Button
              className="bg-[#185AFF] hover:bg-[#6B17FF] w-full flex justify-center gap-2 text-white font-bold py-4 px-8 rounded-2xl"
              onClick={() => navigate(`/detailServicePage/${service.service_id}`)}
              >
              <Eye color='white'/>
              View Detail
            </Button> 
            <Button onClick={(e)=>handleRemove(e,service.favorite_id)} textColor="text-white" className="bg-red-500 w-full py-4 px-8 hover:bg-red-600 flex justify-center gap-2"><Trash2 color='white'/> Remove</Button>
            </div>
          </div>
        )) : <p className='text-center mt-5 col-span-3  w-full'>Your favorite services have been erased, 
                                                                as if they never existed, just like everything else one day will....</p>}
      </div>
    </div>
    {error && error.length > 0 && <ToastMessage msg={error} type='error' />}
      {success && success.length > 0 && <ToastMessage msg={success} type='success' />}
        </>
  );
};

export default Favorite;