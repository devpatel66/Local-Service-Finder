import prisma from "../../../utils/PrismaClient.js";
import ApiResponse from "../../../utils/ApiResponse.js";

const getState  = async (req, res) => {
    try {

        const states = await prisma.$queryRaw`select * from public."State" ORDER BY name ASC`


        return res.status(200).json(
            new ApiResponse(200, "State fetched successfully", states)
        )
    } catch (error) {
        return res.status(500).json(
            new ApiResponse(500, "Internal Server Error")
        )
    }
}
const getDistrict  = async (req, res) => {
    try {

        const states = await prisma.$queryRaw`select * from public."District" where state_id=${req.params.id}`


        return res.status(200).json(
            new ApiResponse(200, "District fetched successfully", states)
        )
    } catch (error) {
        return res.status(500).json(
            new ApiResponse(500, "Internal Server Error")
        )
    }
}

export {
    getState,
    getDistrict
}

