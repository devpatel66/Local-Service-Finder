import prisma from "../utils/PrismaClient.js";
import ApiResponse from "../utils/ApiResponse.js";
import { sendBookingConfirmation,reshduleEmailToProvider,reshduleEmailToUser,cancelEmailToProvider,cancelEmailToUser, acceptEmailToUser } from "../utils/sendBookingEmail.js";

const addBooking = async (req, res) => {

    //provider_id  is of service provider user id
    // user_id is of user who is booking
    try {
        const { service_id, provider_id, message, date, amount } = req.body
        const { user_id } = req.user
        // console.log(req.body);
        
        if (provider_id === user_id) {
            return res.status(400).json(
                new ApiResponse(400, "You cannot book your own service")
            )
        }

        if (!service_id || !user_id) {
            return res.status(400).json(
                new ApiResponse(400, "Service Id and User Id is required")
            )
        }

        if (!provider_id) {
            return res.status(400).json(
                new ApiResponse(400, "Provider Id is required")
            )
        }

        if (!message) {
            return res.status(400).json(
                new ApiResponse(400, "Message is required")
            )
        }

        if (!date) {
            return res.status(400).json(
                new ApiResponse(400, "Date is required")
            )
        }
        // if (!time) {
        //     return res.status(400).json(
        //         new ApiResponse(400, "Time is required")
        //     )
        // }
        const todayDate = new Date();
        todayDate.setHours(0, 0, 0, 0)
        const bookingDate = new Date(date)
        bookingDate.setHours(0, 0, 0, 0)

        if(bookingDate < todayDate){
            return res.status(400).json(
                new ApiResponse(400, "Invalid Date")
            )
        }

        // if(String(time.slice(0, time.indexOf(":"))).length != 2 ||time.indexOf(":") === -1 || String(time.slice(time.indexOf(":")+1)).length != 2) {
        //     return res.status(400).json(
        //         new ApiResponse(400,"Invaild Time")
        //     )
        // }
        // if (Number(time.slice(0, 2)) < 9 || Number(time.slice(0, 2)) > 17) {
        //     return res.status(400).json(
        //         new ApiResponse(400,"Time must be betweent 9:00 to 17:00 only")
        //     )
        // }

        // const existsBooking = await prisma.booking.findFirst({
        //     where: {
        //         service_id: Number(service_id),
        //         provider_id: Number(provider_id),
        //         booking_date: date,
        //         status : {
        //             in:["pending","accepted"]
        //         }
        //     }
        // })

        // console.log(existsBooking);

        // if (existsBooking) {
        //     return res.status(400).json(
        //         new ApiResponse(400, "Booking already exists for this service, book for different date")
        //     )
        // }



        const existingBookingForSameUser = await prisma.booking.findFirst({
            where:{
                service_id: Number(service_id),
                user_id: Number(user_id),
                status : {
                    in:["pending","accepted"]
                }
            }
        })
        if (existingBookingForSameUser) {
            return res.status(400).json(
                new ApiResponse(400, `Service is already booked`)
            )
        }
        const existingBookingForSameUserForSameDate = await prisma.booking.findFirst({
            where:{
                user_id: Number(user_id),
                booking_date:date,
                status : {
                    in:["pending","accepted"]
                }
            }
        })

        if (existingBookingForSameUserForSameDate) {
            return res.status(400).json(
                new ApiResponse(400, `You have booked some other service for same date, Try any other date`)
            )
        }

        const booking = await prisma.booking.create({
            data: {
                service_id,
                provider_id,
                user_id,
                message,
                status: "pending",
                booking_date: date,
                amount: String(amount)
            }
        })

        await sendBookingConfirmation(service_id, booking,req.user)


        // console.log(booking);


        if (!booking) {
            return res.status(500).json(
                new ApiResponse(500, "Booking not created")
            )
        }

        return res.status(200).json(
            new ApiResponse(200, "Booking created successfully", booking)
        )


    } catch (error) {
        console.log(error.message);

        return res.status(500).json(
            new ApiResponse(500, "Internal Server Error")
        )
    } finally {
        await prisma.$disconnect();
    }
}


// for getting all service booking data of user
const getBookingByUserId = async (req, res) => {

    try {
        const { user_id } = req.user
        console.log(user_id);
        

        const bookingData = await prisma.$queryRaw`select 
                                                    service.title,
                                                    u.name as provider_name,
                                                    booking.*
                                                    from public."Booking" as booking
                                                    inner join public."Service" as service
                                                        on booking.service_id = service.service_id
                                                    inner join public."User" as u
                                                        on booking.provider_id = u.user_id
                                                    where booking.user_id = ${user_id}`


        // console.log(bookingData);
        
        if (!bookingData) {
            return res.status(200).json(
                new ApiResponse(200, "Booking not found")
            )
        }


        return res.status(200).json(
            new ApiResponse(200, "Successfully fetch the data", bookingData)
        )

    } catch (error) {
        console.log(error.message);
        
        return res.status(500).json(
            new ApiResponse(500, "Internal Server Error")
        )
    } finally {
        await prisma.$disconnect();
    }
}

// for getting specific service booking data of service provider
const getBookingByServiceId = async (req, res) => {
    try {
        const { service_id } = req.body
        const { user_id, role } = req.user

        if (role !== "provider") {
            return res.status(400).json(
                new ApiResponse(400, "Only Provider Can Access")
            )
        }
        if (!service_id) {
            return res.status(400).json(
                new ApiResponse(400, "Service Id is required")
            )
        }


        const bookingData = await prisma.booking.findMany({
            where: {
                service_id
            }
        })

        if (!bookingData) {
            return res.status(200).json(
                new ApiResponse(200, "Booking not found")
            )
        }


        return res.status(200).json(
            new ApiResponse(200, "Successfully fetch the data", bookingData)
        )
    } catch (error) {
        return res.status(500).json(
            new ApiResponse(500, "Internal Server Error")
        )
    } finally {
        await prisma.$disconnect();
    }
}

const reschedule = async (req, res) => {
    try {
        const { booking_id,date,updatedBy } = req.body
        const { user_id,role } = req.user

        // console.log(req.body);
        const todayDate = new Date();
        todayDate.setHours(0, 0, 0, 0)

        const bookingDate = new Date();
        bookingDate.setHours(0, 0, 0, 0)
        if (!booking_id) {
            return res.status(400).json(
                new ApiResponse(400, "Booking Id is required")
            )
        }

        if(bookingDate < todayDate){
            return res.status(400).json(
                new ApiResponse(400, "Invalid Date")
            )
        }
        const booking = await prisma.booking.findUnique({
            where: {
                booking_id:Number(booking_id),
                
            }
        })

        if(booking.status === "rejected"){
            return res.status(450).json(
                new ApiResponse(450,"The service is rejected/canceled, Booked new one")
            )
        }
        
        // const existingBooking = await prisma.booking.findFirst({
        //     where:{
        //         provider_id:booking.provider_id,                
        //         booking_date:date,
        //         status : "pending"
        //     }
        // })
        
        // if(existingBooking){
        //     return res.status(400).json(
        //         new ApiResponse(400,"Booking already exists for that day")
        //     )
        // }

        if (!booking) {
            return res.status(400).json(
                new ApiResponse(400, "Booking not found")
            )
        }


        if (updatedBy === "provider") {

            const service = await prisma.service.findUnique({
                where: {
                    service_id: booking.service_id
                }
            })

            if (!service) {
                return res.status(400).json(
                    new ApiResponse(400, "Service not found")
                )
            }

            if (user_id != service.provider_id) {
                return res.status(400).json(
                    new ApiResponse(400, "You are not authorized to update this booking")
                )
            }


            const updatedBooking = await prisma.booking.update({
                where: {
                    booking_id: booking.booking_id
                },
                data: {
                    booking_date:date
                }
            })

            if (!updatedBooking) {
                return res.status(400).json(
                    new ApiResponse(400, "Booking not found")
                )
            }
            
            const user = await prisma.user.findUnique({
                where: {
                    user_id: updatedBooking.user_id
                }
            })

            reshduleEmailToUser(service.service_id,updatedBooking,user)



            return res.status(200).json(
                new ApiResponse(200, "Booking updated successfully")
            )

        }

        if (updatedBy === "customer") {
            console.log(req.body);
            
            if (user_id !== booking.user_id) {
                return res.status(400).json(
                    new ApiResponse(400, "You are not authorized to update this booking")
                )
            }

            const service = await prisma.service.findUnique({
                where: {
                    service_id: booking.service_id
                }
            })


            if (!service) {
                return res.status(400).json(
                    new ApiResponse(400, "Service not found")
                )
            }

            const updatedBooking = await prisma.booking.update({
                where: {
                    booking_id: booking.booking_id
                },
                data: {
                    booking_date:date,
                    status:"pending"
                }
            })

            if (!updatedBooking) {
                return res.status(500).json(
                    new ApiResponse(500, "Internal Server Error")
                )
            }
            reshduleEmailToProvider(service.service_id,updatedBooking,req.user)

            return res.status(200).json(
                new ApiResponse(200, "Booking updated successfully")
            )
        }

        return res.status(400).json(
            new ApiResponse(400, "Invalid")
        )
    } catch (error) {
        console.log(error.message);
        
        return res.status(500).json(
            new ApiResponse(500, "Internal Server Error")
        )
    } finally {
        await prisma.$disconnect();
    }



}

// for getting all service booking data of service provider
const getBookingByProviderId = async (req, res) => {
    try {

        const {status} = req.params
        const { user_id, role } = req.user
        // console.log(status);
        


        if(!status){
            return res.status(400).json(
                new ApiResponse(400, "Status is required",[])
            )
            
        }
        if (role !== "provider") {
            return res.status(400).json(
                new ApiResponse(400, "Only Provider Can Access")
            )
        }

        const bookingData = await prisma.$queryRaw`select 
                                                    u.name as customer_name,
                                                    u.address as customer_address,
                                                    u.phone as customer_phone,
                                                    u.email as customer_email,
                                                    service.title,
                                                    booking.*
                                                    from public."Booking" as booking
                                                    inner join public."User" as u
                                                    on booking.user_id = u.user_id
                                                    inner join public."Service" as service
                                                    on booking.service_id = service.service_id
                                                    where booking.provider_id = ${user_id} and booking.status = ${status}
                                                    `

        // console.log(bookingData);
        

        if (!bookingData) {
            return res.status(200).json(
                new ApiResponse(200, "Booking not found")
            )
        }


        return res.status(200).json(
            new ApiResponse(200, "Successfully fetch the data", bookingData)
        )

    } catch (error) {

        return res.status(500).json(
            new ApiResponse(500, "Internal Server Error")
        )
    } finally {
        await prisma.$disconnect();
    }
}

const updateStatus = async (req, res) => {
    try {
        const { booking_id, status,updatedBy } = req.body
        const { user_id, role } = req.user

        // console.log(req.body);
        


        const booking = await prisma.booking.findUnique({
            where: {
                booking_id : parseInt(booking_id)
            }
        })

        if(booking.status === "completed"){
            return res.status(401).json(
                new ApiResponse(401,"The Booking for the service is already completed")
            )
        }

        if(booking.status === "canceled"){
            return res.status(401).json(
                new ApiResponse(401,"The Service is already rejected/canceled")
            )
        }

        if (!booking) {
            return res.status(400).json(
                new ApiResponse(400, "Booking not found")
            )
        }

        if (updatedBy === "provider") {

            if (booking.provider_id !== user_id) {
                return res.status(400).json(
                    new ApiResponse(400, "Unauthorized user")
                )
            }

            if(status === "completed"){
                const booking_date = new Date(booking.booking_date)
                const todayDate = new Date()

                if(booking_date > todayDate){
                   return  res.status(460).json(
                    new ApiResponse(460,`You cannot mark status as completed as of now, You can do it on or after ${booking.booking_date}`)
                   )
                }
            }

            const updatedBooking = await prisma.booking.update({
                where: {
                    booking_id : parseInt(booking_id)
                },
                data: {
                    status
                }
            })


            if (!updatedBooking) {
                return res.status(400).json(
                    new ApiResponse(400, "Booking not found")
                )
            }

            if(status === "canceled"){
                cancelEmailToUser(booking.service_id,updatedBooking,updatedBooking.user_id)
            }
            if(status === "accepted"){
                acceptEmailToUser(booking.service_id,updatedBooking,updatedBooking.user_id)
            }


            return res.status(200).json(
                new ApiResponse(200, "Booking updated successfully")
            )
        }

        if (updatedBy === "customer") {
            
            if (status !== "canceled") {
                return res.status(400).json(
                    new ApiResponse(400, "Invalid status")
                )
            }

            if (booking.user_id !== user_id) {
                return res.status(400).json(
                    new ApiResponse(400, "Unauthorized user")
                )
            }

            const updatedBooking = await prisma.booking.update({
                where: {
                    booking_id : parseInt(booking_id)
                },
                data: {
                    status : "canceled"
                }
            })


            if (!updatedBooking) {
                return res.status(400).json(
                    new ApiResponse(400, "Booking not found")
                )
            }

            cancelEmailToProvider(booking.service_id,updatedBooking,req.user)


            return res.status(200).json(
                new ApiResponse(200, "Booking updated successfully")
            )
        }



        return res.status(400).json(
            new ApiResponse(400, "Unauthorized user", bookingData)
        )

    }
    catch (error){
        // console.log(error.message);
        
        return res.status(500).json(
            new ApiResponse(500, "Internal Server Error")
        )
    }
    finally {
        await prisma.$disconnect();
    }
}

export {
    addBooking,
    getBookingByUserId,
    getBookingByServiceId,
    reschedule,
    updateStatus,
    getBookingByProviderId
}