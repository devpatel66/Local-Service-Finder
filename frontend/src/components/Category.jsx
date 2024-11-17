import React, { useEffect, useState } from 'react';
import {Button } from './index';
import {serviceApi} from '../api/serviceAPI'

function Category({ setIsDisabled, setDisplayCategory, setCategory }) {
    const [subCategory, setSubCategory] = useState(-1);
    const [categoryData, setCategoryData] = useState("");
    const [subCategoryData, setSubCategoryData] = useState(null);
    const [categories,setCategories] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function getCategories() {
            const responseData = await serviceApi.getAllCategoryList();
            // console.log(responseData);
            
            if(responseData.statusCode === 200){
                setCategories(responseData.data)
            }
        }

        getCategories()

    }, [])

    // onst categories = [
    //     {
    //         name: "Home Services",
    //         subCategory: [
    //             { name: "Cleaning" },
    //             { name: "Plumbing" },
    //             { name: "Electrical" },
    //             { name: "Landscaping" },
    //             { name: "Pest Control" },
    //             { name: "Painting" }
    //         ]
    //     },
    //     {
    //         name: "Health & Wellness",
    //         subCategory: [
    //             { name: "Personal Training" },
    //             { name: "Massage Therapy" },
    //             { name: "Nutrition Counseling" },
    //             { name: "Yoga Instruction" },
    //             { name: "Physical Therapy" }
    //         ]
    //     },
    //     {
    //         name: "Automotive Services",
    //         subCategory: [
    //             { name: "Car Repair" },
    //             { name: "Car Wash" },
    //             { name: "Tire Services" },
    //             { name: "Auto Detailing" },
    //             { name: "Oil Change" }
    //         ]
    //     },
    //     {
    //         name: "Beauty & Personal Care",
    //         subCategory: [
    //             { name: "Hair Styling" },
    //             { name: "Makeup Artistry" },
    //             { name: "Manicure & Pedicure" },
    //             { name: "Skincare" },
    //             { name: "Barber Services" }
    //         ]
    //     },
    //     {
    //         name: "Education & Tutoring",
    //         subCategory: [
    //             { name: "Math Tutoring" },
    //             { name: "Science Tutoring" },
    //             { name: "Language Learning" },
    //             { name: "Test Preparation" },
    //             { name: "Music Lessons" }
    //         ]
    //     },
    //     {
    //         name: "Event Planning & Services",
    //         subCategory: [
    //             { name: "Wedding Planning" },
    //             { name: "Catering" },
    //             { name: "Photography" },
    //             { name: "DJ Services" },
    //             { name: "Event Decorating" }
    //         ]
    //     },
    //     {
    //         name: "Fitness & Sports",
    //         subCategory: [
    //             { name: "Personal Training" },
    //             { name: "Yoga Instruction" },
    //             { name: "Martial Arts" },
    //             { name: "Dance Classes" },
    //             { name: "Sports Coaching" }
    //         ]
    //     },
    //     {
    //         name: "Home Improvement",
    //         subCategory: [
    //             { name: "Roofing" },
    //             { name: "Flooring" },
    //             { name: "Kitchen Remodeling" },
    //             { name: "Bathroom Renovation" },
    //             { name: "Carpentry" }
    //         ]
    //     },
    //     {
    //         name: "Pet Services",
    //         subCategory: [
    //             { name: "Pet Grooming" },
    //             { name: "Pet Sitting" },
    //             { name: "Dog Walking" },
    //             { name: "Pet Training" },
    //             { name: "Veterinary Services" }
    //         ]
    //     },
    //     {
    //         name: "Technology Services",
    //         subCategory: [
    //             { name: "Computer Repair" },
    //             { name: "Home Networking" },
    //             { name: "Smart Home Installation" },
    //             { name: "Software Development" },
    //             { name: "Tech Support" }
    //         ]
    //     }
    // ];

    const handleCancelBtn = () => {
        setIsDisabled(false);
        setDisplayCategory(false);
    };

    const handleSaveBtn = () => {
        console.log(subCategoryData);
        
        if(!categoryData || !subCategoryData) {
            setError("Please select a category and sub-category");
            return
        }
        // console.log(categoryData, subCategoryData);
        setCategory([categoryData, subCategoryData]);
        setIsDisabled(false);
        setDisplayCategory(false);
    };

    const handleCategoryChange = async (e) => {
        setError("");
        const { category_id, name } = JSON.parse(e.target.value);
        
        if (category_id === "-1") {
            setSubCategory(-1);
            setError("Select a category");
            return;
        }
        const sub_categories = await serviceApi.getSubCategoryList(category_id);
        console.log(sub_categories);
        
        setCategoryData({name,category_id});
        setSubCategory(sub_categories.data);
    };

    const handleSubCategoryChange = (e) => {
        console.log(e.target);
        
        const {sub_category_id, name} = JSON.parse(e.target.value);
        console.log(e.target.value);
        
        setSubCategoryData({name, sub_category_id});
    };

    return (
        <div className='flex justify-center items-center absolute top-0 bottom-0 left-0 right-0'>
            <div className='absolute top-[20%] w-[40vw] rounded-xl p-10 flex flex-col bg-gray-200 border-2'>
                {error && <p className='text-red-500 text-sm'>{error}</p>}
                <p className='capitalize text-xl'>Select Category</p>
                <select
                    className='px-2 py-4 rounded-xl'
                    // value={JSON.stringify(categoryData)}
                    onChange={handleCategoryChange}
                >
                    <option value={JSON.stringify({category_id:-1,name:"Select Category"})}>Select Category</option>
                    {categories && categories.map((item, index) => (
                        <option key={index} value={JSON.stringify(item)}>
                            {item.name}
                        </option>
                    ))}
                </select>

                <div className='mt-6'>
                    <p className='capitalize text-xl'>Sub Category</p>
                    <select
                        className='px-2 py-4 rounded-xl w-full'
                        disabled={subCategory.length <= 0}
                        onClick={handleSubCategoryChange}
                    >
                        {subCategory && subCategory.length >= 0 && subCategory.map((item, index) => (
                            <option key={index} value={JSON.stringify(item)}>
                                {item.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className='flex justify-end mt-20'>
                    <Button
                        onClick={handleCancelBtn}
                        textColor='text-red-600'
                        className=' text-xl font-bold bg-transparent py-2 hover:text-red-500'
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSaveBtn}
                        className='border bg-green-500 font-medium px-4 w-1/4 rounded-2xl py-2 hover:bg-green-400 text-white'
                    >
                        Save
                    </Button>
                </div>
            </div>
        </div>
    );
}

export default Category;
