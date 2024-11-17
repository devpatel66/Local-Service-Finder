import { Router } from "express";
import veriifyJwt from "../middleware/authMiddleware.js";
import { addReview,getReviewByUser,getReviewsForParticularService } from "../controller/reviewController.js";

const router =  Router()

router.route("/addReview").post(veriifyJwt,addReview)
router.route("/getReviewsOfUser").get(veriifyJwt,getReviewByUser)
router.route("/getReviewsForPaticularService/:service_id").get(veriifyJwt,getReviewsForParticularService)

export default router