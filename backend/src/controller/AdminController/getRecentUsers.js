import { log } from "console";
import ApiResponse from "../../utils/ApiResponse.js";
import prisma from "../../utils/PrismaClient.js";

const getRecentUsers = async (req, res) => {
    try {

        let usersData = await prisma.$queryRaw`
                                    SELECT u.username,u.role,u.created_at 
                                    FROM public."User" AS u
                                    ORDER BY u.created_at DESC
                `
        
        return res.status(200).json(
            new ApiResponse(200,"Success",usersData)
        )        

    } catch (error) {
        return res.status(500).json(
            new ApiResponse(500, "Internal Server Error")
        )
    } finally {
        await prisma.$disconnect()
    }
}


export default getRecentUsers