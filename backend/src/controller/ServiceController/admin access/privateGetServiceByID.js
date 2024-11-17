import ApiResponse from "../../../utils/ApiResponse.js";
import prisma from "../../../utils/PrismaClient.js";
// for admin to get the service in review
const privateGetServiceByIdFunc = async (req, res) => {
    try {
        const { role } = req.user

        if (role !== "admin") {
            return res.status(400).json(
                new ApiResponse(400, "Only Admin Can Access")
            )
        }

        const { id, status } = req.body

        if (!id) {
            return res.status(400).json(
                new ApiResponse(400, "Service Id is required")
            )
        }

        // console.log( id);

        if (status != "completed" || status != "in review") {
            // when admin click for review button the status will be set to in review 
            // so that service provider know the status of service.
            const setInReview = await prisma.serviceImage.update({
                where: {
                    service_id: Number(id)
                },
                data: {
                    status: "in review"
                }
            })

            if (!setInReview) {
                return res.status(400).json(
                    new ApiResponse(400, "Service not found")
                )
            }
        }

        let service = await prisma.$queryRaw`select 
                                                u.username,
                                                service.service_id,
                                                service.title,
                                                service.description,
                                                service.address,
                                                service.price,
                                                service.status,
                                                cat.name as category_name, 
                                                subCat.name as sub_category_name
                                            from public."Service" as service
                                            Inner join public."Category" as cat
                                                on service.category_id = cat.category_id
                                            Inner join public."SubCategory" as subCat
                                                on service.sub_category_id = subCat.sub_category_id 
                                            Inner join public."User" as u
                                                on service.provider_id = u.user_id
                                            where service_id = ${Number(id)}
                                            `
        console.log(service);


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

export default privateGetServiceByIdFunc