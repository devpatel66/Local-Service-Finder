import { addBooking, getBookingByUserId,getBookingByProviderId,getBookingByServiceId,reschedule,updateStatus } from "../controller/bookingController.js";
import { Router } from "express";
import veriifyJwt from "../middleware/authMiddleware.js";

const router = Router();
router.route("/addBooking").post(veriifyJwt,addBooking)
router.route("/getBookingByUserId").get(veriifyJwt,getBookingByUserId)
router.route("/getBookingByProviderId/:status").get(veriifyJwt,getBookingByProviderId)
router.route("/getBookingByServiceId").post(veriifyJwt,getBookingByServiceId)
router.route("/reschedule").post(veriifyJwt,reschedule)
router.route("/updateStatus").post(veriifyJwt,updateStatus)
export default router