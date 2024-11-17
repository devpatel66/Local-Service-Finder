import { log } from "console";
import ApiResponse from "../../utils/ApiResponse.js";
import prisma from "../../utils/PrismaClient.js";

const updateUser = async (req, res) => {
    try{
    const { id,username, name, email, address, phone } = req.body

        const user = await prisma.user.findFirst({
            where: {
                user_id: parseInt(id)
            }
        })

        if(!user){
            return res.status(400).json(
                new ApiResponse(400, "User not found")
            )
        }

        // console.log(phone);
        

        if (username !== user.username) {
            {
                const userExist = await prisma.user.findFirst({
                    where: {
                        username: username
                    }
                })

                if (userExist) {
                    return res.status(400).json(
                        new ApiResponse(420, "Username already exists")
                    )
                }
            }
        }

        if (user.email !== email) {


            const existingEmail = await prisma.user.findFirst({
                where: {
                    email: email
                }
            })

            if (existingEmail) {
                return res.status(400).json(
                    new ApiResponse(401, "Email already Exists")
                )
            }
        }
        if (user.phone != phone) {
            const existingPhone = await prisma.user.findFirst({
                where: {
                    phone: phone
                }
            })

            if (existingPhone) {
                return res.status(400).json(
                    new ApiResponse(452, "Phone number already Exists")
                )
            }
        }

        const updatedUser = await prisma.user.update({
            where: {
                user_id: parseInt(id)
            },
            data: {
                username: username || user.username,
                name:name || user.name,
                email: email || user.email,
                address: address || user.address,
                phone : phone || user.phone
            }
        })

        if (!updatedUser) {
            return res.status(500).json(
                new ApiResponse(500, "Internal Server Error")
            )
        }

        return res.status(200).json(
            new ApiResponse(200, "User details updated successfully")
        )



    } catch (error) {
        console.log(error.message);

        return res.status(500).json(
            new ApiResponse(500, `Internal Server Error`)
        )
    }
    finally {
        await prisma.$disconnect();
    }
}


export default updateUser