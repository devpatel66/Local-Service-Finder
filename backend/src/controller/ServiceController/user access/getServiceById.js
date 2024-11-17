import { PrismaClient } from "@prisma/client";
import ApiResponse from "../../../utils/ApiResponse.js";
const prisma = new PrismaClient();

const getServiceByIdFunc = async (req, res) => {
    try {
        const id = req.params.id
        if (!id) {
            return res.status(400).json(
                new ApiResponse(400, "Service Id is required")
            )
        }

        console.log(id);


        let service = await prisma.$queryRaw`select 
                                                u.username,
                                                u.name,
                                                service.service_id,
                                                service.provider_id,
                                                service.title,
                                                service.description,
                                                service.address,
                                                service.price,
                                                service.email,
                                                service.phone_number,
                                                service.provider_id,
                                                service.location,
                                                service.category,
                                                service.sub_category,
                                                serImg.image,
                                                count(review_id) as review_count,
												coalesce(sum(review.rating),0) as total_rating
                                            from public."Service" as service
                                            left join public."ServiceImage" as serImg
												on service.service_id = serImg.service_id 
                                            left join public."Review" as review
													on service.service_id = review.service_id
                                            Inner join public."User" as u
                                                on service.provider_id = u.user_id
                                            where service.service_id = ${parseInt(id)}
                                            group by
                                            u.username,
                                                u.name,
                                                service.service_id,
                                                service.provider_id,
                                                service.title,
                                                service.description,
                                                service.address,
                                                service.price,
                                                service.email,
                                                service.phone_number,
                                                service.provider_id,
                                                service.location,
                                                service.category,
                                                service.sub_category,
                                                serImg.image
                                            `
        // console.log(service);
        service = service.map((item,index)=>{
			return {
				...item,
				review_count: parseInt(item.review_count),
				total_rating: parseInt(item.total_rating)
			}
		})

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

export default getServiceByIdFunc