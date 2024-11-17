import { Router } from "express";

import { resetPassword,forgotPassword,adminForgotPassword,adminResetPassword } from "../controller/forgotPasswordController.js";

const router = Router();

router.route("/forgotPassword").post(forgotPassword)
router.route("/changePassword").post(resetPassword)
router.route("/adminForgotPassword").post(adminForgotPassword)
router.route("/adminChangePassword").post(adminResetPassword)


export default router