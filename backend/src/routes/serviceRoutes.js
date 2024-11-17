import {Router} from 'express'
import veriifyJwt from '../middleware/authMiddleware.js'
import { upload } from '../middleware/multer.js'
import { addService, deleteService,getServiceByUserId, getAllService, getServiceById, updateService,getAllCategoryList,getAllSubCategoryList,getServiceByLocation, } from '../controller/serviceColltroller.js'
import { getState, getDistrict } from '../controller/ServiceController/user access/getStateAndDistrict.js'
import veriifyAdminJwt from '../middleware/adminAuthMiddleware.js'
import getSearchedService from '../controller/ServiceController/user access/getSearchService.js'
const router = Router()

router.route("/getAllServcieList").get(getAllService)
router.route("/getServiceByLocation/:state/:district/:category").get(getServiceByLocation)
router.route("/getServiceByID/:id").get(veriifyJwt,getServiceById)
router.route("/addService").post(veriifyJwt,upload.single("image"),addService)
router.route("/updateService/:id").put(veriifyJwt,upload.single("image"),updateService)
router.route("/deleteService").delete(veriifyJwt,deleteService)

router.route("/getAllCategoryList").get(getAllCategoryList)
router.route("/getAllSubCategoryList/:id").get(getAllSubCategoryList)
router.route("/getServiceByUserId/:id").get(veriifyJwt,getServiceByUserId)
router.route("/getSerachService/:searchQuery").get(getSearchedService)

// for fetching state and district
router.route("/getAllState").get(getState)
router.route("/getAllDistrict/:id").get(getDistrict)
// TODO : other routes are remaining to be added


export default router