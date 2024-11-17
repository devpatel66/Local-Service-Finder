import ApiResponse from "../../../utils/ApiResponse.js";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();


const getServiceByUserIdFunc=async (req,res)=>{
    try {
        const {role,user_id} = req.user
        const {id} = req.params
        // console.log(req.params);
        
        if(role !== "provider"){
            return res.status(400).json(
                new ApiResponse(400, "User is not a provider")
            )
        }
        if(!id){
            return res.status(400).json(
                new ApiResponse(400, "User Id is Required")
            )
        }
    
        const  service = await prisma.service.findMany({
            where:{
                provider_id:parseInt(id)
            },
            select:{
                service_id:true,
                description:true,
                price:true,
                status:true,
                title:true
    
            }
        })
        // console.log(service);
        
        return res.status(200).json(
            new ApiResponse(200, "Success", service)
        )
    } catch (error) {
        return res.status(500).json(new ApiResponse(500, "Internal Server Error"))
    }
    finally {
        await prisma.$disconnect();
    }
}

export default getServiceByUserIdFunc