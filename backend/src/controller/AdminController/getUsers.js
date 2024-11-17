import ApiResponse from "../../utils/ApiResponse.js";
import prisma from "../../utils/PrismaClient.js";

const getUsers = async (req, res) => {
    try {

        let { role } = req.params

        
        if (role === "all") role = null
        let users = await prisma.user.findMany({
            where: role ? { role: role } : {},
            select: {
                username: true,
                role: true,
                email: true,
                createdAt: true,
                user_id: true,
                name: true
            },

            orderBy: {
                user_id: "asc"
            }
        })
        // console.log(users);




        return res.status(200).json(
            new ApiResponse(200, "Success", users)
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

export default getUsers