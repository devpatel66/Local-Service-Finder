import { log } from "console";
import ApiResponse from "../../utils/ApiResponse.js";
import prisma from "../../utils/PrismaClient.js";

const getAdminList = async (req, res) => {
    try {

        const adminList = await prisma.admin.findMany({
            where:{
                type:"sub"
            },
            select:{
                admin_id:true,
                name:true,
                username:true,
                email:true,
                createdAt:true
            }
        })
        
        return res.status(200).json(
            new ApiResponse(200,"Success",adminList)
        )        

    } catch (error) {
        return res.status(500).json(
            new ApiResponse(500, "Internal Server Error")
        )
    } finally {
        await prisma.$disconnect()
    }
}


export default getAdminList