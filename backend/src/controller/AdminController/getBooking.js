import ApiResponse from "../../utils/ApiResponse.js";
import prisma from "../../utils/PrismaClient.js";

const getBookings = async (req, res) => {
    try {

        let bookings = await prisma.$queryRaw`
                                            SELECT 
                                                booking.booking_id,
                                            	booking.status,
                                            	booking.created_at,
                                            	u.username,
                                            	serU.name as provider_name,
                                            	service.title as service_name
                                            FROM 
                                                public."Booking" as booking
                                            inner join public."User" as u
                                            	on u.user_id = booking.user_id
                                            inner join public."User" as serU
                                            	on serU.user_id = booking.provider_id
                                            inner join public."Service" as service
                                            	on service.service_id = booking.service_id
                                            `
        // console.log(bookings);
        return res.status(200).json(
            new ApiResponse(200, "Success", bookings)
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

export default getBookings