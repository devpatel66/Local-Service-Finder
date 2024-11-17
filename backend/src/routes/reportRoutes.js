import { Router } from "express";
import {createReport,getReports} from "../controller/reportController.js"
import veriifyJwt from "../middleware/authMiddleware.js";
import veriifyAdminJwt from "../middleware/adminAuthMiddleware.js";

const router = Router();
router.route("/createReport").post(veriifyJwt,createReport)
router.route("/getReport").get(veriifyAdminJwt,getReports)

export default router