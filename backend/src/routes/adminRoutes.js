import { Router } from "express";
import { privateGetServiceById, approveService, getPenndingInReviewServiceList, addCategory, addSubCategory } from "../controller/serviceColltroller.js";
import { register, login, logout, update, deleteAdmin, jwtAdminLogin, updatePassword, registerMainAdmin } from "../controller/adminController.js";
import {
    getRecentUsers,
    updateService,
    getUsersData,
    getUsers,
    getSearchedUser,
    getBookingStatistics,
    getBookings,
    getAdminList,
    getUserById,
    updateUser,
    deleteUser,
    getAdminById,
    updateAdmin
} from '../controller/AdminController/index.js'
import veriifyAdminJwt from "../middleware/adminAuthMiddleware.js";
import { getServiceById } from "../controller/serviceColltroller.js";
import { upload } from "../middleware/multer.js";
import { get } from "http";
const router = Router();

router.route("/addAdmin").post(veriifyAdminJwt, register)
router.route("/login").post(login)
router.route("/addMainAdmin").post(registerMainAdmin)
router.route("/logout").get(veriifyAdminJwt, logout)
router.route("/update").put(veriifyAdminJwt, update)
router.route("/deleteAdmin/:admin_id").delete(veriifyAdminJwt,deleteAdmin)
router.route("/jwtLogin").get(veriifyAdminJwt, jwtAdminLogin)
router.route("/getAdminList").get(veriifyAdminJwt, getAdminList)
router.route("/getAdminById/:admin_id").get(veriifyAdminJwt, getAdminById)
router.route("/updateAdmin").put(veriifyAdminJwt, updateAdmin)
router.route("/updatePassword").put(veriifyAdminJwt,updatePassword)



// service routes
router.route("/privateGetServiceById").get(veriifyAdminJwt, privateGetServiceById)
router.route("/approveService").put(veriifyAdminJwt, approveService)
router.route("/getPenndingInReviewServiceList").get(veriifyAdminJwt, getPenndingInReviewServiceList)
router.route("/addCategory/:category_name").post(veriifyAdminJwt, addCategory)
router.route("/addSubCategory").post(veriifyAdminJwt, addSubCategory)
router.route("/getServiceByID/:id").get(veriifyAdminJwt, getServiceById)
router.route("/updateService/:id").put(veriifyAdminJwt, upload.single("image"), updateService)

// users routes
router.route("/getUserData").get(veriifyAdminJwt, getUsersData)
router.route("/getUsers/:role").get(veriifyAdminJwt, getUsers)
router.route("/getSearchedUsers/:searchQuery").get(veriifyAdminJwt, getSearchedUser)
router.route("/getRecentUser").get(veriifyAdminJwt, getRecentUsers)
router.route("/getUserId/:user_id").get(veriifyAdminJwt,getUserById)
router.route("/updateUser").post(veriifyAdminJwt,updateUser)
router.route("/deleteUser/:user_id").delete(veriifyAdminJwt,deleteUser)

// booking routes
router.route("/getBookings").get(veriifyAdminJwt, getBookings)
router.route("/getBookingStatistics").get(veriifyAdminJwt, getBookingStatistics)


export default router