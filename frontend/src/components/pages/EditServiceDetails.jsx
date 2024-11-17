
import { Button, Input } from '../index'
import Category from '../Category'
import { useState, useRef, useEffect } from 'react';
import ImageUpload from '../../components/pages/Regsiter_Service/ImageUpload';
import { serviceApi } from '../../api/serviceAPI';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router';
import { useNavigate } from 'react-router-dom';
import Popup from '../utils/Popup';
import { adminAPI } from '../../api/adminAPI';

function EditServiceDetails() {
    const navigate = useNavigate()
    const [displayCategory, setDisplayCategory] = useState(false)
    const [isDisabled, setIsDisabled] = useState(false);
    const [category, setCategory] = useState(null)
    const mainContainer = useRef(null)
    const formRef = useRef(null)
    const authStatus = useSelector(state => state.authReducer.authStatus)
    const adminAuthStatus = useSelector(state => state.authReducer.adminAuthStatus)
    const service_id = useParams().id
    const by = useParams().by

    const [popupMsg, setPopupMsg] = useState('')
    const [serviceTitle, setServiveTitle] = useState('')
    const [serviceDescription, setServiceDescription] = useState('')
    const [servicePrice, setServicePrice] = useState(0)
    const [servicePhoneNumber, setServicePhoneNumber] = useState('')
    const [serviceAddress, setServiceAddress] = useState('')
    const [serviceLocation, setServiceLocation] = useState('')
    const [serviceEmail, setServiceEmail] = useState('')
    const [serviceImages, setServiceImages] = useState(null)
    const [serv_id, setService_id] = useState(null)

    const [serviceTitleError, setServiveTitleError] = useState('')
    const [serviceDescriptionError, setServiceDescriptionError] = useState('')
    const [servicePriceError, setServicePriceError] = useState('')
    const [servicePhoneNumberError, setServicePhoneNumberError] = useState('')
    const [serviceAddressError, setServiceAddressError] = useState('')
    const [serviceLocationError, setServiceLocationError] = useState('')
    const [serviceEmailError, setServiceEmailError] = useState('')

    const [formImage, setFormImage] = useState("")
    const [previewImage, setPreviewImage] = useState("")

    const [desCount, setDesCharCount] = useState(0)

    const [stateName, setStateName] = useState(null)
    const [districtName, setDistrictName] = useState(null)
    const [code, setCode] = useState(null)

    const handleSelectCategoryClick = () => {
        console.log(mainContainer);

        // mainContainer.current.backgroundColor = 'blue'
        setIsDisabled(!isDisabled);
        setDisplayCategory(!displayCategory)
    }

    const mainContainerStyle = {
        backgroundColor: isDisabled ? '#F3F3F3' : 'white',
        pointerEvents: isDisabled ? 'none' : 'auto',
        // opacity: isDisabled ? 0.6 : 1                 
    };

    useEffect(() => {
        async function getServiceData() {
            console.log(by)
            let response
            if (by === "admin") {
                response = await adminAPI.getServiceById(service_id)
            }
            else {
                response = await serviceApi.getServiceById(service_id);
            }

            console.log(response);

            if (response.statusCode === 200) {
                const data = response.data[0]
                setServiveTitle(data.title)
                setServiceDescription(data.description)
                setServicePrice(data.price)
                setServiceLocation(data.location)
                setServiceImages(data.image)
                setServiceAddress(data.address)
                setService_id(data.service_id)
                setCategory({ category: data.category, subCategory: data.sub_category })
                setServicePhoneNumber(data.phone_number)
                setServiceEmail(data.email)
            } else {
                console.log(response.message)
            }
        }
        async function fetchStateName() {

            const response = await serviceApi.getState()

            // console.log(response.data);
            setStateName(response.data)


        }

        fetchStateName()

        if (authStatus === true || adminAuthStatus) {
            getServiceData()
        }
    }, [])

    const handleEditBtn = async (e) => {
        e.preventDefault()
        const formData = new FormData(formRef.current)
        console.log(e.target)
        if (!formData.get('title')) {
            console.log(formData.get('title'));

            setServiveTitleError('Title is required')
        }
        else {
            setServiveTitleError('')
        }
        if (!formData.get('description')) {
            setServiceDescriptionError('Description is required')
        }
        else {
            setServiceDescriptionError('')
        }
        if (!formData.get('price')) {
            setServicePriceError('Price is required')
        }
        else {
            setServicePriceError('')
        }

        if (!formData.get('location')) {
            setServiceLocationError('Location is required')
        }
        else {
            setServiceLocationError('')
        }
        if (!formData.get('address')) {
            setServiceAddressError('Address is required')
        }
        else {
            setServiceAddressError('')
        }
        if (
            !formData.get('title') ||
            !formData.get('description') ||
            !formData.get('price') ||
            !formData.get('address')) {

                return
            }
            console.log("response");

        console.log(category.category || category[0].name);
        console.log(category.subCategory || category[1].name);


        setServiveTitleError('')
        setServiceDescriptionError('')
        setServicePriceError('')
        setServiceLocationError('')
        setServiceAddressError('')

        formData.append('category', category.category || category[0].name)
        formData.append('sub_category', category.subCategory || category[1].name)
        formData.append('service_id', serv_id)
        console.log(formData.get("price"));

        console.log(by);

        let response
        if (by === "admin") {
            response = await adminAPI.updateService(formData, serv_id)
        }
        else {
            response = await serviceApi.updateService(formData, serv_id)
        }


        if (response.statusCode === 200) {
            window.scrollTo(0, 0)
            setPopupMsg(response.msg)
            setIsDisabled(!isDisabled);
            if (by === "admin") {
                navigate("/admin/serviceMangement")
            }
        }

    }

    const handleDesc = (e) => {
        setServiceDescription(e.target.value)
        setDesCharCount(e.target.value.length || 0)
        setTimeout(() => {
            if (e.target.value.length < 120 && e.target.value.length > 0) {
                setServiceDescriptionError("Your description is too short. It must be longer than 120 characters")
            } else if (e.target.value.length <= 0) {
                setServiceDescriptionError("Please enter the description of the service")
            }
            else {
                setServiceDescriptionError(null)
            }
        }, 1000)
    }



    const handleSelectState = async (e) => {
        if (e.target.value === code) { return }
        e.preventDefault()
        console.log(e.target.value);
        setCode(e.target.value)
        const response = await serviceApi.getDistrict(e.target.value)
        console.log(response);
        setDistrictName(response.data)

    }

    return (
        <>
            {
                popupMsg && <Popup msg={popupMsg} btnText='Ok' btnFunc={() => navigate('/dashboard')} btnCloseFunc={() => navigate('/dashboard')} />
            }
            <div ref={mainContainer} style={mainContainerStyle} className="min-h-screen py-2 px-4 sm:px-6 lg:px-8">
                <div style={mainContainerStyle} className="max-w-3xl mx-auto shadow-xl bg-white rounded-lg border">
                    <div className="text-center p-6">
                        <h2 className="text-3xl font-bold text-primary">Edit Service</h2>
                    </div>
                    <div className="p-6">
                        <form ref={formRef} className="space-y-8">
                            {/* Service Name */}
                            <div className="space-y-4">
                                <label htmlFor="service-name" className="text-lg font-medium">Service Name</label>
                                <Input
                                    id="service-name"
                                    type="text"
                                    name="title"
                                    onChange={(e) => setServiveTitle(e.target.value)}
                                    value={serviceTitle}
                                    placeholder="Enter service name"
                                    className="w-full p-2 border border-gray-300 rounded text-lg"
                                />
                                <p className="text-red-500">{serviceTitleError && serviceTitleError}</p>
                            </div>


                            <hr className="border-t border-gray-300" />

                            {/* Description */}
                            <div className="space-y-4">
                                <label htmlFor="description" className="text-lg font-medium">Description</label>
                                <textarea
                                    id="description"
                                    name='description'
                                    value={serviceDescription}
                                    onChange={handleDesc}
                                    placeholder="Enter service description"
                                    className="w-full h-60 p-2 border border-gray-300 rounded min-h-[100px] text-lg"
                                />
                                <div className='flex justify-between'>
                                    <p className="text-red-500">{serviceDescriptionError && serviceDescriptionError}</p>
                                    <p className="text-gray-500 text-right justify-end">{desCount}/1200</p>
                                </div>

                            </div>

                            {/* Category and Price */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4 flex flex-col">
                                    <label htmlFor="category" className="text-lg font-medium">Category</label>

                                    <Button id="category" onClick={handleSelectCategoryClick} textColor='text-[#185AFF]' className=' border font-medium border-[#185AFF]  w-full pl-10 p-2 hover:bg-gray-100'>Select Category</Button>

                                    <p>{category && `${category[0]?.name || category.category} > ${category[1]?.name || category.subCategory}`}</p>

                                    {/* <input type="hidden" name="category_id" value={category &&category?.category_id} id="" />
                                <input type="hidden" name="sub_category_id" value={category && category?.sub_category_id} id="" /> */}

                                </div>

                                <div className="space-y-4">
                                    <label htmlFor="price" className="text-lg font-medium">Price</label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">&#x20b9;</span>
                                        <Input
                                            id="price"
                                            type="text"
                                            name="price"
                                            onChange={(e) => setServicePrice(Number(e.target.value))}
                                            value={servicePrice}
                                            placeholder="Enter price"
                                            className="w-full pl-10 p-2 border border-gray-300 rounded text-lg"
                                        />
                                    </div>
                                    <p className="text-red-500">{servicePriceError && servicePriceError}</p>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4 flex flex-col">
                                    <label htmlFor="category" className="text-lg font-medium">Phone Number</label>
                                    <Input
                                        id="phoneNUmber"
                                        type="number"
                                        name="phone_number"
                                        onChange={(e) => setServicePhoneNumber(Number(e.target.value))}
                                        value={servicePhoneNumber}
                                        placeholder="Enter price"
                                        className="w-full p-2 border border-gray-300 rounded text-lg"
                                    />
                                    <p className="text-red-500">{servicePhoneNumberError && servicePhoneNumberError}</p>

                                </div>

                                <div className="space-y-4">
                                    <label htmlFor="price" className="text-lg font-medium">Email</label>

                                    <Input
                                        id="email"
                                        type="email"
                                        name="email"
                                        onChange={(e) => setServiceEmail(Number(e.target.value))}
                                        value={serviceEmail}
                                        disabled="true"
                                        placeholder="Enter email"
                                        className="w-full p-2 border border-gray-300 rounded text-lg"
                                    />
                                    <p className="text-red-500">{serviceEmailError && serviceEmailError}</p>
                                </div>
                            </div>

                            <hr className="border-t border-gray-300" />

                            {/* Address and Location */}
                            <div className="space-y-4">
                                <label htmlFor="address" className="text-lg font-medium">Address</label>
                                <textarea
                                    id="address"
                                    type="text"
                                    name='address'
                                    onChange={(e) => setServiceAddress(e.target.value)}
                                    value={serviceAddress}
                                    placeholder="Enter service address"
                                    className="w-full p-2 border border-gray-300 rounded text-lg"
                                />
                                <p className="text-red-500">{serviceAddressError && serviceAddressError}</p>
                            </div>

                            {/* <div className="space-y-4">
                                <label className="text-lg font-medium">Location</label>
                                <Input className="mr-2" onChange={(e) => setServiceLocation(e.target.value)} value={serviceLocation} placeholder="Enter location like City/Village Name located in...." />
                                <p className="text-red-500">{serviceLocationError && serviceLocationError}</p>


                            </div> */}
                            {/* <div className="space-y-2" >
                                <label htmlFor="location" className="text-lg font-semibold flex items-center gap-2">
                                    Location (Must Enter the district in which your providing the service)
                                </label>
                                <div className="flex flex-col gap-4 items-start">
                                    <div className='w-1/2 flex flex-col'>
                                        <label>Select Your State</label>
                                        <select onClick={handleSelectState} className='text-lg border border-gray-300 rounded-lg w-full p-2'>
                                            {
                                                Array.isArray(stateName) && stateName.map((item, index) => (
                                                    <option key={index} value={item.state_id}>{item.name}</option>
                                                ))
                                            }
                                        </select>
                                    </div>
                                    <div className='w-1/2 flex flex-col'>
                                        <label>Select Your District in which your serving your service</label>
                                        <select name='location' className='text-lg border border-gray-300 rounded-lg w-1/2 p-2'>
                                            {
                                                Array.isArray(districtName) && districtName.map((item, index) => (
                                                    <option key={index} value={item.name}>{item.name}</option>
                                                ))
                                            }
                                        </select>
                                    </div>
                                </div>

                                {
                                    serviceLocationError && <p className="text-red-500 text-sm">{serviceLocationError}</p>
                                }
                            </div> */}

                            <hr className="border-t border-gray-300" />

                            {/* Image Upload */}
                            <div className="space-y-4">
                                <label htmlFor="image" className="text-lg font-medium">Image</label>
                                <div className="flex items-center space-x-4">
                                    <div className="w-full relative">

                                        <ImageUpload setPreview={setPreviewImage} setImages={setFormImage} />
                                        <img src={previewImage || serviceImages} alt="Preview" className="max-w-full h-auto rounded-lg shadow-md" />
                                    </div>
                                </div>
                            </div>

                            {/* Submit Button */}
                            <Button
                                onClick={handleEditBtn}
                                type="submit"
                                className="w-full bg-[#185AFF] hover:bg-[#6B17FF] text-white py-6 text-lg rounded-lg"
                            >
                                Save Changes
                            </Button>
                        </form>
                    </div>
                </div>
            </div>

            {displayCategory && <Category setCategory={setCategory} setIsDisabled={setIsDisabled} setDisplayCategory={setDisplayCategory} />}
        </>

    )
}

export default EditServiceDetails