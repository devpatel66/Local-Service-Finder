import React, { useEffect, useState,lazy, Suspense } from 'react';
import { FaRegLightbulb } from "react-icons/fa";
import {Button} from '../../index'


function PreviewPage() {
    const [data, setData] = useState({});
    const [rating, setRating] = useState(0);
    const reviews = [
        {
            userName: "John Doe",
            rating: 4.5,
            comment: "The service was excellent! The staff was friendly and the work was completed on time. Highly recommend!",
            date: "2024-08-01"
        },
        {
            userName: "Jane Smith",
            rating: 3.0,
            comment: "The service was okay, but it took longer than expected. The quality was decent, but could be better.",
            date: "2024-07-25"
        },
        {
            userName: "Sam Wilson",
            rating: 5.0,
            comment: "Amazing experience! The team went above and beyond to ensure everything was perfect. Will definitely use again.",
            date: "2024-07-20"
        },
        {
            userName: "Emily Johnson",
            rating: 4.0,
            comment: "Great service, but there was a slight delay in getting started. Overall, very satisfied.",
            date: "2024-07-18"
        },
        {
            userName: "Michael Brown",
            rating: 2.5,
            comment: "Not very happy with the service. There were several issues that needed to be fixed afterward.",
            date: "2024-07-10"
        },
        {
            userName: "Sophia Lee",
            rating: 4.8,
            comment: "Fantastic service! The team was professional and did an excellent job. Will recommend to others.",
            date: "2024-07-05"
        },
        {
            userName: "Chris Evans",
            rating: 3.5,
            comment: "The service was good, but the cost was a bit high for what was provided. Still, satisfied with the results.",
            date: "2024-06-30"
        },
        {
            userName: "Olivia Green",
            rating: 4.2,
            comment: "Very good service! The staff was knowledgeable and courteous. Would use again.",
            date: "2024-06-25"
        },
        {
            userName: "Liam Martin",
            rating: 5.0,
            comment: "Exceptional service! Everything was done to perfection. Couldn’t be happier with the outcome.",
            date: "2024-06-15"
        },
        {
            userName: "Emma Davis",
            rating: 3.8,
            comment: "Good service overall, but there was a minor issue that needed follow-up. Otherwise, quite satisfied.",
            date: "2024-06-10"
        }
    ];

    const DetailPagePreview = lazy(() => import('../../DetailService.jsx'));

    useEffect(() => {
        const data = JSON.parse(localStorage.getItem('serviceFormData'));
        
        console.log(data);

        let rating = 0;
        reviews.forEach((review) => {
            rating += review.rating;
        });
        setRating(rating / reviews.length);

        
        setData({...data,reviews, rating});
    },[])
    return (
        <>

            <div className=' w-[80vw] flex flex-col gap-6 p-10'>

                <div className='w-full rounded-xl bg-slate-100 flex gap-5  justify-start items-center p-4'>
                    <span className='text-base text-slate-400'><FaRegLightbulb size={20}/></span>
                    <p className='text-base text-slate-400'> These page shows how your service page will look like</p>
                </div>
                <Suspense fallback={<div>Loading...</div>}>
                    <DetailPagePreview data={data} />
                    
                </Suspense>
            </div>
        </>
    );
}

export default PreviewPage;
