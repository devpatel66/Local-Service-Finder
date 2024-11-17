import { parse } from "path";
import ApiResponse from "../../utils/ApiResponse.js";
import prisma from "../../utils/PrismaClient.js";

const getUserById = async (req, res) => {
    try {

        const {user_id} = req.params
        if(!user_id){
            return res.status(400).json(
                new ApiResponse(400, "Bad Request")
            )
        }
        const user = await prisma.user.findFirst({
            where: {
                user_id:parseInt(user_id)
            }
        })
        // console.log(users);


        delete user.password

        return res.status(200).json(
            new ApiResponse(200, "Success", user)
        )
    } catch (error) {
        console.log(error);

        return res.status(500).json(
            new ApiResponse(500, "Internal Server Error", error.message)
        )
    }
    finally {
        await prisma.$disconnect();
    }

}

export default getUserById