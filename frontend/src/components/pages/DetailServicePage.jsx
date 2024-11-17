import React, { useEffect, useState,lazy, Suspense } from 'react';
import { serviceApi } from '../../api/serviceAPI';
import { useParams,useNavigate } from 'react-router';
import DetailService from '../DetailService';
import { adminAPI } from '../../api/adminAPI';

function DetailServicePage() {
    const [data, setData] = useState({});
    const navigate = useNavigate();
    const {id,by} = useParams();

    // const DetailPagePreview = lazy(() => import('../DetailService'));

    useEffect(() => {
        // const data = JSON.parse(localStorage.getItem('serviceFormData'));

       async function serviceData() {
        let responseData
        console.log(by)
        if(by === "admin"){
            responseData = await adminAPI.getServiceById(id);
        }else{
            responseData = await serviceApi.getServiceById(id);
        }
        // console.log(responseData)

        if(responseData.statusCode === 200){
            setData(responseData.data[0]);
        }
        else{
            navigate('/')
        }
        return
       }

       serviceData()
    },[id])
    return (
        <>

            <div className=''>
                    {
                        data && <DetailService data={data} id={id} by={by}/>
                    }
                    
               
            </div>
        </>
    );
}

export default DetailServicePage;
