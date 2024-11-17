import ApiResponse from "../utils/ApiResponse.js";
import prisma from "../utils/PrismaClient.js";

const addFavorite = async (req, res) => {
    try {
        const service_id = req.params.id
        const { user_id } = req.user

        if (!service_id) {
            return res.status(400).json(
                new ApiResponse(400, "Bad Request")
            )
        }

        const alreadyFavorite = await prisma.favorite.findFirst({
            where: {
                user_id: user_id,
                service_id: parseInt(service_id)
            }
        })
        if (alreadyFavorite) {
            return res.status(400).json(
                new ApiResponse(400, "Already Added")
            )
        }


        const favorite = await prisma.favorite.create({
            data: {
                user_id: user_id,
                service_id: parseInt(service_id)
            }
        })
        return res.status(200).json(
            new ApiResponse(200, "Success", favorite)
        )
    } catch (error) {
        return res.status(500).json(
            new ApiResponse(500, "Internal Server Error")
        )
    }
}

const getFavorite = async (req, res) => {
    try {
        const { user_id } = req.user
        const favorites = await prisma.$queryRaw`select 
                                                service.title,
                                                service.category,
                                                service.sub_category,
                                                service.price,
                                                fav.*,
                                                us.name as provider_name
                                                    from public."Favorite" as fav
                                                    left join public."Service" as service
                                                        on fav.service_id = service.service_id
                                                    left join public."User" as us
                                                        on us.user_id = service.provider_id
                                                    where fav.user_id = ${user_id}
                                                `
        return res.status(200).json(
            new ApiResponse(200, "Success", favorites)
        )
    } catch (error) {
        return res.status(500).json(
            new ApiResponse(500, "Internal Server Error")
        )
    }
}

const deleteFavorite = async (req, res) => {
    try {
        const favorite_id = req.params.id
        const { user_id } = req.user

        const favorite = await prisma.favorite.delete({
            where: {
                user_id: user_id,
                favorite_id: parseInt(favorite_id)
            }
        })

        return res.status(200).json(
            new ApiResponse(200, "Removed Successfully", favorite)
        )
    } catch (error) {
        return res.status(500).json(
            new ApiResponse(500, "Internal Server Error")
        )
    }
}


export {
    addFavorite,
    getFavorite,
    deleteFavorite
}