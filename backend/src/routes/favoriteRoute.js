import {Router} from 'express'
import verifyJwt from '../middleware/authMiddleware.js'
import { addFavorite, getFavorite, deleteFavorite } from '../controller/favoriteController.js'
const router = Router()

router.route("/addFavorite/:id").post(verifyJwt,addFavorite)
router.route("/getFavorite").get(verifyJwt,getFavorite)
router.route("/deleteFavorite/:id").delete(verifyJwt,deleteFavorite)

export default router