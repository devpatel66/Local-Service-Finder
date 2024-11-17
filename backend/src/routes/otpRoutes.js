import { Router } from "express";
import { sendOTP,veriifyOTP } from "../controller/otpController.js";
import veriifyJwt from "../middleware/authMiddleware.js";

const router = Router();

router.route("/sendOtp").post(veriifyJwt,sendOTP)
router.route("/verifyOtp").post(veriifyJwt,veriifyOTP)


export default router