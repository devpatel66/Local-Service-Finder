import React, { useState, useEffect } from 'react'
import { Card, SidePannel, Button, Input, ToastMessage } from '../index'
import { serviceApi } from '../../api/serviceAPI'
import { useSelector } from 'react-redux'
import { SkewLoader } from 'react-spinners'
function ServicePage() {
    const [serviceData, setServiceData] = useState([])
    const [categoryData, setCategoryData] = useState([])
    const [error, setError] = useState(null)
    const [stateName, setStateName] = useState(null)
    const [districtName, setDistrictName] = useState(null)
    const [code, setCode] = useState(null)
    const [filterState, setFilterState] = useState("all")
    const [filterDistrict, setFilterDistrict] = useState("all")
    const [filterCategory, setFilterCategory] = useState("all")
    const [loading, setLoading] = useState(false)
    // const userData = useSelector((state) => state.authReducer.userData)

    useEffect(() => {

        async function serviceData() {
            try {
                setLoading(true)
                const resonseData = await serviceApi.getAllServiceList()
                console.log(resonseData);

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
            } finally {
                setLoading(false)
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
        serviceData()
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

    const handleCategorySelect = (e) => {
        console.log(e.target.value);

        setFilterCategory(e.target.value)
    }

    const handleFilter = async (e) => {
        e.preventDefault()
        // console.log(location);
        setLoading(true)
        const response = await serviceApi.getServiceByLocation(filterState || "all", filterDistrict, filterCategory)
        // console.log(response);
        setServiceData(response.data)
        setLoading(false)
    }

    const [search, setSearch] = useState("")
    const handleSearch = async (e) => {
        e.preventDefault()
        // console.log(location);
        setLoading(true)
        const response = await serviceApi.getSearchedService(search || "all")
        // console.log(response);
        setServiceData(response.data)
        setLoading(false)
    }

    return (
        <>
            <div className='flex items-center  flex-col w-full mt-5'>
                <div className='rounded-xl flex flex-col  p-6 justify-center items-center gap-5 bg-[#000000] text-white w-[80vw] '>
                    <div className='text-center'>
                        <p className='text-4xl text-white font-extrabold'>Discover Trusted Local Service Providers Right at Your Fingertips</p>
                        <p className='text-xl text-white font-light'>Browse a Diverse Range of Services and Find the Perfect Match for Your Needs.</p>
                    </div>
                    <div className='flex gap-5 w-full items-center'>
                        <label htmlFor='search' className='capitalize text-2xl text-white'>search</label>
                        <Input className='text-black' onChange={(e) => setSearch(e.target.value)} id="search" placeholder='Enter Service to Search' />
                        <Button onClick={handleSearch} textColor='text-white' className='bg-[#6B17FF]'>Search</Button>
                    </div>
                </div>


                {/*

                <div className='w-[80vw] rounded-xl mx-10 my-3 px-5  py-10 flex flex-col gap-5 bg-[#6B17FF]'>
                    <p className='text-4xl text-white font-bold'>Category</p>
                    <div className='flex gap-5'>
                        {Array.isArray(categoryData) && categoryData.length > 0 && categoryData ? categoryData.map((value, index) => (
                            <Button className='capitalize bg-white' key={index}>{value.name}</Button>
                        )) : <label className='text-white'>No Category found</label>
                        }
                    </div>
                </div>
                <div className='flex flex-1 mx-10'>
                    <SidePannel />
                    <div className="grid grid-cols-2 h-max gap-5 ml-5  w-full">
                        {Array.isArray(serviceData) && serviceData.length > 0 ? serviceData.map((data, index) => (
                            <Card key={index} {...data} />
                        )) : <label className='text-3xl col-span-2  h-full flex justify-center items-center'>No Service found</label>
                        }
                    </div>
                </div>
            </div> */}
                <div className="container mx-auto py-8">


                    <div className="flex flex-col md:flex-row gap-8">
                        {/* Filters sidebar */}
                        <aside className="w-full md:w-1/4">
                            <div className="bg-white shadow-md rounded-md p-4">
                                <h2 className="text-xl font-semibold mb-4">Filters</h2>
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
                                            {categoryData && categoryData.length > 0 && categoryData.map((category, index) => (
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
                                                    onClick={(e) => setFilterDistrict(e.target.value)}
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

                        {/* Services listing */}
                        <main className="w-full p-2 md:w-3/4">
                            {!loading ? Array.isArray(serviceData) && serviceData.length > 0 ? <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-2">
                                {serviceData?.map((service, index) => (
                                    // eslint-disable-next-line react/jsx-key
                                    <Card key={index} {...service} />
                                ))}
                            </div>
                                : <label className='text-3xl col-span-2  h-full flex justify-center items-center'>No Service found</label> : <div className='text-3xl col-span-2  h-full flex justify-center items-center'>
                                <SkewLoader  color='#185AFF' />
                            </div>

                            }
                        </main>
                    </div>
                </div>
            </div>
            {
                error && <ToastMessage msg={error} type={"error"} />
            }
        </>
    )
}

export default ServicePage