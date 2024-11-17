import { log } from "console";
import ApiResponse from "../../utils/ApiResponse.js";
import prisma from "../../utils/PrismaClient.js";

const getBookingStatistics = async (req, res) => {
    try {

        let bookingData = await prisma.$queryRaw`
                                    SELECT 
                                        COUNT(*) AS total_bookings,
                                        SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) AS completed_bookings,
                                        SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) AS pending_bookings,
                                        SUM(CASE WHEN status = 'accepted' THEN 1 ELSE 0 END) AS accepted_bookings,
                                        SUM(CASE WHEN status = 'canceled' THEN 1 ELSE 0 END) AS canceled_bookings
                                    FROM public."Booking";
                                    `


        bookingData = {
            total_bookings:parseInt(bookingData[0].total_bookings),
            completed_bookings:parseInt(bookingData[0].completed_bookings) || 0,
            pending_bookings:parseInt(bookingData[0].pending_bookings) || 0,
            accepted_bookings:parseInt(bookingData[0].accepted_bookings) || 0,
            canceled_bookings:parseInt(bookingData[0].canceled_bookings) || 0,
        }
        return res.status(200).json(
            new ApiResponse(200, "Success", bookingData)
        )

    } catch (error) {
        console.log(error);
        
        return res.status(500).json(
            new ApiResponse(500, "Internal Server Error")
        )
    } finally {
        await prisma.$disconnect()
    }
}


export default getBookingStatistics