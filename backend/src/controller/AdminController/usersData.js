import { log } from "console";
import ApiResponse from "../../utils/ApiResponse.js";
import prisma from "../../utils/PrismaClient.js";

const getUsersData = async (req, res) => {
    try {

        let usersData = await prisma.$queryRaw`
            SELECT 
                COUNT(DISTINCT u.user_id) AS total_users,
                COUNT(DISTINCT CASE WHEN u.role = 'customer' THEN u.user_id END) AS customers,
                COUNT(DISTINCT CASE WHEN u.role = 'provider' THEN u.user_id END) AS providers,
                COUNT(DISTINCT CASE WHEN u.role = 'provider' AND s.service_id IS NULL THEN u.user_id END) AS providers_no_service,
                COUNT(DISTINCT CASE WHEN u.role = 'provider' AND s.service_id IS NOT NULL THEN u.user_id END) AS providers_with_service
                FROM 
                    public."User" as u
                LEFT JOIN 
                    public."Service" as s ON u.user_id = s.provider_id;
                `
        usersData = {
            total_users : Number(usersData[0].total_users),
            customers : Number(usersData[0].customers),
            providers : Number(usersData[0].providers),
            providers_no_service : Number(usersData[0].providers_no_service),
            providers_with_service : Number(usersData[0].providers_with_service),
        }

        // console.log(usersData);
        
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


export default getUsersData