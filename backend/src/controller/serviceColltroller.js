import addFuncService from "./ServiceController/user access/addService.js"
import updateServiceFunc from "./ServiceController/user access/updateService.js"
import deletServiceFunc from "./ServiceController/user access/deleteService.js"
import getAllServiceFunc from "./ServiceController/user access/getAllService.js"
import getServiceByIdFunc from "./ServiceController/user access/getServiceById.js"
import getServiceByUserIdFunc from "./ServiceController/user access/getServiceByUserId.js"
import { getAllSubCategoryListFunc, getAllCategoryListFunc } from "./ServiceController/user access/getAllCategoryLsit.js"
import getServiceByLocationFunc from "./ServiceController/user access/getServiceByLocation.js"

// private access
import { addCategoryFunc, addSubCategoryFunc } from "./ServiceController/admin access/addCategory.js"
import approveServiceFunc from "./ServiceController/admin access/approveService.js"
import getPenndingInReviewServiceListPrivate from "./ServiceController/admin access/getPenndingInReviewServiceList.js"
import privateGetServiceByIdFunc from "./ServiceController/admin access/privateGetServiceByID.js"


// for user 
const addService = async (req, res) => {
    return await addFuncService(req, res)
}
const updateService = async (req, res) => {
    return await updateServiceFunc(req, res)
}
const deleteService = async (req, res) => {
    return await deletServiceFunc(req, res)
}
const getAllService = async (req, res) => {
    return await getAllServiceFunc(req, res)
}
const getServiceById = async (req, res) => {
    return await getServiceByIdFunc(req, res)
}


const getAllCategoryList = async (req, res) => {
    return await getAllCategoryListFunc(req, res)
}

const getAllSubCategoryList = async (req, res) => {
    return await getAllSubCategoryListFunc(req, res)
}

const getServiceByUserId = async (req, res) => {
    return await getServiceByUserIdFunc(req, res)
}

const getServiceByLocation = async (req, res) => {
    return await getServiceByLocationFunc(req, res)
}




// for admin    
const addCategory = async (req, res) => {
    return await addCategoryFunc(req, res)
}

const addSubCategory = async (req, res) => {
    return await addSubCategoryFunc(req, res)
}


const approveService = async (req, res) => {
    return await approveServiceFunc(req, res)
}

const getPenndingInReviewServiceList = async (req, res) => {
    return await getPenndingInReviewServiceListPrivate(req, res)
}

const privateGetServiceById = async (req, res) => {
    return await privateGetServiceByIdFunc(req, res)
}


export {
    addService,
    updateService,
    deleteService,
    getAllService,
    getServiceById,
    addCategory,
    addSubCategory,
    approveService,
    getPenndingInReviewServiceList,
    privateGetServiceById,
    getAllCategoryList,
    getAllSubCategoryList,
    getServiceByUserId,
    getServiceByLocation
}

