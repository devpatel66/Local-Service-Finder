import ApiResponse from "../../../utils/ApiResponse.js";
import prisma from "../../../utils/PrismaClient.js";
// for admin to get list of service in pending and in review
const getPenndingInReviewServiceListPrivate = async (req, res) => {
    try {
        // if(role !== "admin"){
        //     return res.status(400).json(
        //         new ApiResponse(400, "Only Admin Can Access")
        //     )
        // }

        let service = await prisma.$queryRaw`select 
                                                u.username,
                                                service.service_id,
                                                service.title,
                                                service.status,
                                                service.price,
                                                service.created_at,
                                                service.category, 
                                                service.sub_category
                                            from public."Service" as service
                                            Inner join public."User" as u
                                                on service.provider_id = u.user_id
                                            where status = ${"pending"} or status = ${"in review"}
                                            `
        // console.log(service);


        if (!service || service.length == 0) {
            return res.status(400).json(
                new ApiResponse(400, "Service not found")
            )
        }

        return res.status(200).json(
            new ApiResponse(200, "Success", service)
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

export default getPenndingInReviewServiceListPrivate