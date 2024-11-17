import prisma from "../utils/PrismaClient.js";
import ApiResponse from "../utils/ApiResponse.js";

const addReview = async (req,res)=>{
    try {
        const {service_id,rating,comment} = req.body
        const {user_id} = req.user

        // console.log(req.body)
        if(!rating || Number(rating) <= 0){
            return res.status(400).json(
                new ApiResponse(400,"Rating is Required")
            )
        }
        if(!comment){
            return res.status(400).json(
                new ApiResponse(400,"Comment is Required")
            )
        }

        const reviewExits = await prisma.review.findFirst({
            where:{
                user_id:parseInt(user_id),
                service_id:parseInt(service_id),
            }
        })

        if(reviewExits){
            return res.status(400).json(
                new ApiResponse(400,"Review already done")
            )
        }

        const serviceExists = await prisma.service.findFirst({
            where:{
                service_id:parseInt(service_id)
            }
        })

        if(!serviceExists){
            return res.status(400).json(
                new ApiResponse(400,"Service does not exists")
            )
        }


        if(user_id === serviceExists.provider_id){
            return res.status(400).json(
                new ApiResponse(400,"You cannot add review to your own service")
            )
        }

        const review = await prisma.review.create({
            data:{
                user_id:parseInt(user_id),
                service_id:parseInt(service_id),
                rating:parseInt(rating),
                service_provider_id:parseInt(serviceExists.provider_id),
                comment
            }
        })

        if(!review){
            throw new Error("Internal Server Error")
        }

        return res.status(200).json(
            new ApiResponse(200,"Success")
        )

    } catch (error) {
        // console.log(error.message)
        return res.status(500).json(
            new ApiResponse(500,"Internal Server Error")
        )
    }
    finally{
        await prisma.$disconnect()
    }
}


const getReviewByUser = async (req,res)=>{
    try {
        const {user_id} = req.user

        const reviews = await prisma.review.findMany({
            where :{
                user_id:parseInt(user_id)
            }
        })

        return res.status(200).json(
            new ApiResponse(200,"Success",reviews)
        )
    } catch (error) {
        return res.status(500).json(
            new ApiResponse(500,"Internal Server Error")
        )
    }
    finally{
        await prisma.$disconnect()
    }
}
const getReviewsForParticularService = async (req,res)=>{
    try {
        const {service_id} = req.params
        const {user_id} = req.user
        // console.log(service_id)
        if(!service_id){
            return res.status(400).json(
                new ApiResponse(400,"Id not found")
            )
        }

        const service = await prisma.service.findFirst({
            where:{
                service_id:parseInt(service_id)
            }
        })

        const reviews = await prisma.$queryRaw`select 
                                                review.rating,
                                                review.comment,
                                                u.name,
                                                review.created_at
                                               from public."Review" as review
                                               Inner join public."User" as u
                                                on review.user_id = u.user_id
                                               where review.service_id = ${parseInt(service_id)}  `
        // console.log(reviews)
        return res.status(200).json(
            new ApiResponse(200,"Success",reviews)
        )
    } catch (error) {
        console.log(error)
        return res.status(500).json(
            new ApiResponse(500,"Internal Server Error")
        )
    }
    finally{
        await prisma.$disconnect()
    }
}


export {
    addReview,
    getReviewByUser,
    getReviewsForParticularService
}