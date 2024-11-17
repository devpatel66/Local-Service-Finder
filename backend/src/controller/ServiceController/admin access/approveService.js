import ApiResponse from "../../../utils/ApiResponse.js";
import prisma from "../../../utils/PrismaClient.js";

const approveServiceFunc = async (req, res) => {
    try {
        const {role} = req.user

        if(role !== "admin"){
            return res.status(400).json(    
                new ApiResponse(400, "Only Admin Can Approve Service")
            )
        }

        // TODO : add approve logic and create database of admin and update the status of service


    } catch (error) {
        return res.status(500).json(
            new ApiResponse(500, error.message)
        )
    }
    finally {
        await prisma.$disconnect();
    }
}

export default approveServiceFunc