import prisma from "../../../utils/PrismaClient.js";
import ApiResponse from "../../../utils/ApiResponse.js";

const getServiceByLocation = async (req, res) => {
    try {
        let {state,district,category} = req.params 

		if(state === "all") state = null
		if(district === "all") district = null
		if(category === "all") category = null

		// console.log(category);
		
		
        let response = await prisma.$queryRaw`Select 
													u.username,
													service.provider_id,
													service.title,
													service.location,
													service.service_id,
													service.category,
													service.sub_category,
													service.created_at,
													service.status,
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
												WHERE COALESCE(NULLIF(${state}, ''), service.state) = service.state
												and COALESCE(NULLIF(${district}, ''), service.district) = service.district
												and COALESCE(NULLIF(${category}, ''), service.category) = service.category
												Group by 
													u.username,
													service.created_at,
													service.status,
													service.provider_id,
													service.title,
													service.service_id,
													service.address,
													service.category,
													service.sub_category,
													serImg.image
												`

        if (Array.isArray(response) && response.length <= 0) {
            return res.status(200).json(new ApiResponse(200, "No Service Found For This Location", response))

        }

		// console.log(response);
		

        response = response.map((item,index)=>{
			return {
				...item,
				review_count: parseInt(item.review_count),
				total_rating: parseInt(item.total_rating)
			}
		})

        return res.status(200).json(
            new ApiResponse(200, "Success", response)
        )
        
    }
    catch(error) {
		console.log(error.message);
		
        return res.status(500).json(
            new ApiResponse(500, "Internal Server Error")
        )
    }
    finally {
        await prisma.$disconnect()
    }
}

export default getServiceByLocation