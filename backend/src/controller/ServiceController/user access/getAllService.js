import { PrismaClient } from "@prisma/client";
import ApiResponse from "../../../utils/ApiResponse.js";

const prisma = new PrismaClient();

const getAllServiceFunc = async (req, res) => {
	try {
		let response = await prisma.$queryRaw`Select 
													u.name as service_provider_name,
													service.provider_id,
													service.title,
													service.location,
													service.service_id,
													service.category,
													service.sub_category,
													service.created_at,
													serImg.image,
													count(review_id) as review_count,
													coalesce(sum(review.rating),0) as total_rating
												from public."Service" as service
												inner join public."User" as u
													on service.provider_id = u.user_id
												left join public."ServiceImage" as serImg
													on service.service_id = serImg.service_id
												left join public."Review" as review
													on service.service_id = review.service_id
												Group by 
													u.name,
													service.provider_id,
													service.title,
													service.service_id,
													service.address,
													service.created_at,
													service.category,
													service.sub_category,
													serImg.image
												`

		// console.log(response);
		response = response.map((item, index) => {
			return {
				...item,
				review_count: parseInt(item.review_count),
				total_rating: parseInt(item.total_rating)
			}
		})
		if (!Array.isArray(response) && response.length <= 0) {
			return res.status(400).json(new ApiResponse(400, "Service List is Empty", response))
		}

		return res.status(200).json(
			new ApiResponse(200, "Success", response)
		)
	} catch (error) {
		console.log(error.message);

		return res.status(500).json(new ApiResponse(500, "Internal Server Error"))
	}
	finally {
		await prisma.$disconnect();
	}

}

export default getAllServiceFunc