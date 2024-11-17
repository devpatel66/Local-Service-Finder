import { PrismaClient } from "@prisma/client";
import ApiResponse from "../../utils/ApiResponse.js";
import prisma from "../../utils/PrismaClient.js";

const deleteUser = async (req, res) => {
    // const {service_id} = req.params

    try {
        const {user_id} = req.params
        // const {user_id,email} = req.user

        
        console.log(user_id)
        // if(confirmMsg !== "I am seriously sure"){
        //     return res.status(400).json(
        //         new ApiResponse(400, "Invalid")
        //     )
        // }
    
        const user = await prisma.user.findUnique({
            where:{
                user_id:parseInt(user_id)
            }
        })
    
        if(!user){
            return res.status(400).json(
                new ApiResponse(400, "Invalid")
            )
        }
    
        // if(service.provider_id !== user_id){
        //     return res.status(400).json(
        //         new ApiResponse(400, "Invalid")
        //     )
        // }

        await prisma.booking.deleteMany({
            where:{
                 user_id:parseInt(user_id)
            }
       })
        await prisma.booking.deleteMany({
            where:{
                 provider_id:parseInt(user_id)
            }
       })

        await prisma.review.deleteMany({
            where:{
                user_id:parseInt(user_id)
            }
        })

        await prisma.favorite.deleteMany({
            where:{
                user_id:parseInt(user_id)
            }
        })

        const service = await prisma.service.findMany({
            where:{
                provider_id:parseInt(user_id)
            }
        })

        service.map(async (service) => {
            await prisma.serviceImage.deleteMany({
                where:{
                    service_id:parseInt(service.service_id)
                }
            })

            await prisma.review.deleteMany({
                where:{
                    service_id:parseInt(service.service_id)
                }
            })

            await prisma.favorite.deleteMany({
                where:{
                    service_id:parseInt(service.service_id)
                }
            })

            await prisma.booking.deleteMany({
                where:{
                    service_id:parseInt(service.service_id)
                }
            })

            await prisma.serviceImage.deleteMany({
                where:{
                    service_id:parseInt(service.service_id)
                }
            })
        })

        // await prisma.serviceImage.deleteMany({
        //     where:{
        //         service_id:parseInt(service_id)
        //     }
        // })
    
        await prisma.service.deleteMany({
            where:{
                provider_id:parseInt(user_id)
            }
        })

        await prisma.user.delete({
            where:{
                user_id:parseInt(user_id)
            }
        })
    
        return res.status(200).json(
            new ApiResponse(200, "Success")
        )
    } catch (error) {
        console.log(error)
        return res.status(500).json(
            new ApiResponse(500, "Internal Server Error")
        )
    }
    finally {
        await prisma.$disconnect();
    }
}

export default deleteUser