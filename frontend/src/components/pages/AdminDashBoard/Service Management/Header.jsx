import React, { useState, useEffect } from 'react'
import { Input, Button } from '../../../index'
import { IoFilter } from "react-icons/io5";
import { serviceApi } from '../../../../api/serviceAPI';

function Header({mainContainer,setServiceData}) {
    // const [isFilterMenu, setIsFilterMenu] = useState(false)
    // const [displayCategory, setDisplayCategory] = useState(false)
    // const [isDisabled, setIsDisabled] = useState(false);
    // const [category, setCategory] = useState(null)
    const [stateName, setStateName] = useState(null)
    const [districtName, setDistrictName] = useState(null)
    const [code, setCode] = useState(null)
    const [filterState,setFilterState] = useState("all")
    const [filterDistrict,setFilterDistrict] = useState("all")
    const [filterCategory,setFilterCategory] = useState("all")
    const [categoryData, setCategoryData] = useState([])
    const [error,setError] = useState("")
    useEffect(() => {
        
        async function serviceData() {
            try {
                const resonseData = await serviceApi.getAllServiceList()
                console.log("from filter header")
                console.log(resonseData.data);

                if (resonseData.statusCode === 200) {
                    setServiceData(resonseData.data)
                }
                else if (resonseData.statusCode === 400) {
                    setServiceData([])
                }
                else {
                    setError("Internal Server Error")

                }
            } catch (error) {
                setError(error.message)
                console.log(error)
            }
        }

        async function categoryData() {
            try {
                const resonseData = await serviceApi.getAllCategoryList()
                // console.log(resonseData.data);

                if (resonseData.statusCode === 200) {
                    setCategoryData(resonseData.data)
                }
                else if (resonseData.statusCode === 400) {
                    setCategoryData([])
                }
                else {
                    setError("Internal Server Error")
                }
            }

            catch (error) {
                setError(error.message)
                console.log(error)
            }
        }

        async function fetchStateName() {

            const response = await serviceApi.getState()

            // console.log(response.data);
            setStateName(response.data)


        }

        fetchStateName()

        categoryData()
        // serviceData()
    }, [])


    const handleSelectState = async (e) => {
        const state = e.target.value.split("-")
        if (state[0] === code) { return }
        e.preventDefault()
        setFilterState(state[1])
        setCode(state[0])
        const response = await serviceApi.getDistrict(state[0])
        // console.log(response);
        setDistrictName(response.data)

    }

    const handleCategorySelect = (e)=>{
        console.log(e.target.value);
        
        setFilterCategory(e.target.value)
    }

    const handleFilter = async (e) => {
        e.preventDefault()        
        // console.log(location);
        
        const response = await serviceApi.getServiceByLocation(filterState || "all",filterDistrict,filterCategory)
        console.log(response);
        setServiceData(response.data)
    }
    return (
        <div className='w-full rounded-3xl bg-white p-10 gap-5 justify-center flex-col  flex px-5'>

            {/* <Input placeholder='Search by serive name, proivder or category..' /> */}
            <p className='text-xl'>Filter by Categroy</p>
            {/* <div onClick={handleFilterClick} className='flex gap-1 border hover:bg-slate-50 cursor-pointer border-slate-300 w-max p-2 rounded-full items-center text-base'>
                <IoFilter size={20} />
                <span>Filter</span>
            </div> */}

            {/* Filter Menu */}
            <aside className="w-full border rounded-xl">
                        <div className="bg-white shadow-md rounded-md p-4">
                            <div className="space-y-4">
                                <div>
                                    <label htmlFor="category" className="block text-lg font-medium text-gray-700 mb-1">
                                        Category
                                    </label>
                                    <select
                                        id="category"
                                        className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        onChange={handleCategorySelect}
                                    >
                                        <option value="all">All Categories</option>
                                        {categoryData && categoryData.length > 0 && categoryData.map((category,index) => (
                                            <option key={index} value={category.name}>{category.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className='flex flex-col gap-3'>
                                    <label htmlFor='states' className="block text-lg font-medium text-gray-700 mb-1">
                                        Location
                                    </label>
                                    <div className='flex flex-col gap-2'>
                                        <label htmlFor="states" className="block text-sm font-medium text-gray-700 mb-1">
                                            States
                                        </label>
                                        <select
                                            id="states"
                                            className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            onChange={handleSelectState}
                                        >
                                            <option value="all">All Locations</option>
                                            {
                                                Array.isArray(stateName) && stateName.length > 0 && stateName.map((state, index) => (
                                                    <option key={index} value={`${state.state_id}-${state.name}`}>{state.name}</option>
                                                ))
                                            }
                                        </select>
                                    </div>
                                    {
                                        Array.isArray(districtName) && districtName.length > 0
                                        &&

                                        <div className='flex flex-col gap-2'>
                                            <label htmlFor="districts" className="block text-sm font-medium text-gray-700 mb-1">
                                                Districts
                                            </label>
                                            <select
                                                id="districts"
                                                className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                onClick={(e)=>setFilterDistrict(e.target.value)}
                                            >
                                                <option value="all">All Locations</option>
                                                {
                                                    districtName.map((item, index) => (
                                                        <option key={index} value={item.name}>{item.name}</option>
                                                    ))
                                                }
                                            </select>
                                        </div>

                                    }
                                </div>
                            </div>
                            <Button onClick={handleFilter} textColor="text-white" className='bg-[#185AFF] hover:bg-[#6B17FF] mt-4'>Apply Filter</Button>
                        </div>
                    </aside>
            
            {/* End Filter Menu */}
        </div>
    )
}

export default Header