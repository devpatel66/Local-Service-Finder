import { Router } from "express";
import { login, logout, register, changeRole,jwtLogin,userDetails,updateUserDeatils,updatePasswowrd} from "../controller/userController.js";
import {sendOTP,veriifyOTP} from "../controller/otpController.js";
import veriifyJwt from "../middleware/authMiddleware.js";

const router = Router()
router.route("/register").post(register)
router.route("/login").post(login)
router.route("/logout").post(veriifyJwt,logout)
router.route("/sendOTP").post(veriifyJwt,sendOTP)
router.route("/verifyOTP").post(veriifyJwt,veriifyOTP)
router.route("/changeRole").post(veriifyJwt,changeRole)
router.route("/jwtLogin").get(veriifyJwt,jwtLogin)
router.route("/userDetails").get(veriifyJwt,userDetails)
router.route("/updateUserDetails").post(veriifyJwt,updateUserDeatils)
router.route("/updatePassword").post(veriifyJwt,updatePasswowrd)

export default router