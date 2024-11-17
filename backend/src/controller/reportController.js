import ApiResponse from "../utils/ApiResponse.js";
import prisma from "../utils/PrismaClient.js";

const createReport = async (req, res) => {
    try {
        const { description, category } = req.body;
        const {user_id} = req.user

        if(!description || !category) {
            return res.status(400).json(
                new ApiResponse(400, "Description and category are required")
            );
        }

        const newReport = await prisma.report.create({
            data: {
                description,
                category,
                user_id: parseInt(user_id),
            },
        });

        return res.status(200).json(new ApiResponse(200, "Report created successfully"));
    } catch (error) {
        return res.status(500).json(new ApiResponse(500, error.message));
    }
};

const getReports = async (req, res) => {
    try {
        const reports = await prisma.report.findMany();
        return res.status(200).json(
            new ApiResponse(200, "Reports fetched successfully", reports)
        );
    } catch (error) {
        return res.status(500).json(new ApiResponse(500, error.message));
    }
};

export { 
    createReport,
    getReports
 }

 