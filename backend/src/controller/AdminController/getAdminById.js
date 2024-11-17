import { parse } from "path";
import ApiResponse from "../../utils/ApiResponse.js";
import prisma from "../../utils/PrismaClient.js";

const getAdminById = async (req, res) => {
    try {

        const {admin_id} = req.params
        if(!admin_id){
            return res.status(400).json(
                new ApiResponse(400, "Bad Request")
            )
        }

        const admin = await prisma.admin.findFirst({
            where: {
                admin_id:parseInt(admin_id)
            }
        })
        // console.log(users);


        delete admin.password

        return res.status(200).json(
            new ApiResponse(200, "Success", admin)
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

export default getAdminById