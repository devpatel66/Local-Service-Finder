import { PrismaClient } from "@prisma/client";
import ApiResponse from "../../../utils/ApiResponse.js";
import  prisma from '../../../utils/PrismaClient.js'

const deletServiceFunc = async (req, res) => {
    // const {service_id} = req.params

    try {
        const {service_id,confirmMsg} = req.body
        const {user_id,email} = req.user

        
        console.log(req.body)
        if(confirmMsg !== "I am seriously sure"){
            return res.status(400).json(
                new ApiResponse(400, "Invalid")
            )
        }
    
        const service = await prisma.service.findUnique({
            where:{
                service_id:parseInt(service_id)
            }
        })
    
        if(!service){
            return res.status(400).json(
                new ApiResponse(400, "Invalid")
            )
        }
    
        if(service.provider_id !== user_id){
            return res.status(400).json(
                new ApiResponse(400, "Invalid")
            )
        }

        await prisma.booking.deleteMany({
            where:{
                service_id:parseInt(service_id)
            }
        })

        await prisma.review.deleteMany({
            where:{
                service_id:parseInt(service_id)
            }
        })

        await prisma.favorite.deleteMany({
            where:{
                service_id:parseInt(service_id)
            }
        })

        await prisma.serviceImage.deleteMany({
            where:{
                service_id:parseInt(service_id)
            }
        })
    
        await prisma.service.delete({
            where:{
                service_id:parseInt(service_id)
            }
        })
    
        return res.status(200).json(
            new ApiResponse(200, "Success")
        )
    } catch (error) {
        return res.status(500).json(
            new ApiResponse(500, "Internal Server Error")
        )
    }
    finally {
        await prisma.$disconnect();
    }
}

export default deletServiceFunc