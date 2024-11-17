import ApiResponse from "../../utils/ApiResponse.js";
import prisma from "../../utils/PrismaClient.js";

const getSearchedUser = async (req, res) => {
    try {

        let { role,searchQuery } = req.params

        
        if (role === "all") role = null
        if (!searchQuery) searchQuery = null
        console.log(role,searchQuery)
        let users = await prisma.user.findMany({
            where:searchQuery ? {
                        OR: [
                            { username: { contains: searchQuery, mode: 'insensitive' } },
                            { email: { contains: searchQuery, mode: 'insensitive' } },
                            { name: { contains: searchQuery, mode: 'insensitive' } }
                        ]
                    } : {},
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
        console.log(users);




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

export default getSearchedUser