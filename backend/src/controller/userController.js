import ApiResponse from "../utils/ApiResponse.js";
import { hashPassword, comparPassword } from "../utils/hashPassword.js";
import { compareSync } from "bcrypt";
import { generatesAccessToken } from "../utils/generateTokens.js";
import prisma from "../utils/PrismaClient.js";
import { use } from "bcrypt/promises.js";

const cookieOptions = {
    httpOnly: true,
    secure: false,
}

const register = async (req, res) => {
    try {
        if (!req.body) {
            return res.status(400).json(
                new ApiResponse(400, "Request Body is Empty")
            )
        }
        const { username, name, password, email, role, phone, address, confirmPassword } = req.body;

        // console.log(req.body)
        if (username === "") {
            return res.status(400).json(
                new ApiResponse(420, "Username is required")
            )
        }

        if (email === "") {
            return res.status(400).json(
                new ApiResponse(421, "Email is requiired")
            )
        }
        if (password === "") {
            return res.status(400).json(
                new ApiResponse(423, "Password is requiired")
            )
        }
        if (password.length < 7) {
            return res.status(400).json(
                new ApiResponse(423, "Password is too short, length must be greater than 7 ")
            )
        }
        console.log(password, confirmPassword);
        
        if (password !== confirmPassword) {
            return res.status(400).json(
                new ApiResponse(423, "Password and Confirm password does not match ")
            )
        }

        if (role === "") {
            return res.status(400).json(
                new ApiResponse(424, "Role is requiired")
            )
        }
        if (role != "customer" && role != "provider") {
            return res.status(406).json(
                new ApiResponse(423, "Role feild is inappropaite")
            )
        }

        const alreadyUsername = await prisma.user.findFirst({
            where: {
                username
            }
        })

        if (alreadyUsername) {
            return res.status(400).json(
                new ApiResponse(420, "Username is already taken")
            )
        }
        const alreadyEmail = await prisma.user.findFirst({
            where: {
                email
            }
        })

        if (alreadyEmail) {
            return res.status(400).json(
                new ApiResponse(421, "Email is already present")
            )
        }

        const encrytedPassword = await hashPassword(password)

        if (!encrytedPassword) {
            return res.status(500).json(
                new ApiResponse(500, "Internal Server Error")
            )
        }

        const user = await prisma.user.create({
            data: {
                username,
                email,
                name: name || null,
                password: encrytedPassword,
                role,
                phone: phone || null,
                address: address || null,
            },
            select: {
                username: true,
                name: true,
                email: true,
                password: false,
                role: true,
                phone: true,
                address: true,
            }
        })

        if (!user) {
            return res.status(500).json(
                new ApiResponse(500, "Internal Server Error")
            )
        }
        await prisma.$disconnect();

        return res.status(200).json(
            new ApiResponse(200, "User registered sccessfully", user)
        )

    } catch (error) {
        console.error(error)
        prisma.$disconnect();
        return res.status(500).json(
            new ApiResponse(500, "Internal Server Error")
        )

    }
    finally {
        await prisma.$disconnect();
    }
}


const login = async (req, res) => {
    try {
        const { cred, password } = req.body;
        console.log(req.body)
        if (!cred) {
            return res.status(400).json(
                new ApiResponse(420, "Username or Email is required")
            )
        }

        if (!password) {
            return res.status(400).json(
                new ApiResponse(423, "Password is required")
            )
        }

        const user = await prisma.user.findFirst({
            where: {
                OR: [
                    {
                        email: cred
                    },
                    {
                        username: cred
                    }
                ]
            },
            select: {
                user_id: true,
                username: true,
                name: true,
                email: true,
                name: true,
                phone: true,
                address: true,
                password: true,
                role: true
            }
        })

        if (!user) {
            prisma.$disconnect();
            return res.status(400).json(
                new ApiResponse(400, "User does not exits")
            )
        }

        const checkPassword = await comparPassword(user.password, password)

        if (!checkPassword) {
            prisma.$disconnect();
            return res.status(400).json(
                new ApiResponse(423, "Password is incorrect")
            )
        }

        const accessToken = await generatesAccessToken(user)

        // console.log(accessToken);

        if (!accessToken) {
            prisma.$disconnect();
            return res.status(500).json(
                new ApiResponse(500, "Internal Server Error || Failed to generate the access token")
            )
        }

        prisma.$disconnect();
        delete user["password"]
        return res.status(200)
            .cookie("accessToken", accessToken, cookieOptions)
            .json(
                new ApiResponse(200, "Login Successfull", user)
            )
    } catch (error) {
        return res.status(500).json(
            new ApiResponse(500, `Internal Server Error || ${error.message}`)
        )
    }
    finally {
        await prisma.$disconnect();
    }

}

const logout = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(400).json(
                new ApiResponse(400, "Unauthorized User")
            )
        }
        return res.status(200)
            .cookie("accessToken", "", cookieOptions)
            .json(
                new ApiResponse(200, "Logout Successfull")
            )
    } catch (error) {
        return res.status(500).json(
            new ApiResponse(500, `Internal Server Error || ${error.message}`)
        )
    }
    finally {
        await prisma.$disconnect();
    }
}

const changeRole = async (req, res) => {
    try {
        const { userRole } = req.body
        const { role, user_id } = req.user


        if (userRole === "admin") {
            return res.status(400).json(
                new ApiResponse(400, "You cannot switch to admin")
            )
        }

        if (userRole === role) {
            return res.status(400).json(
                new ApiResponse(400, "You cannot switch to same role")
            )
        }

        const user = await prisma.user.update({
            where: {
                user_id
            },
            data: {
                role: userRole
            }
        })

        if (!user) {
            return res.status(500).json(
                new ApiResponse(500, "Internal Server Error")
            )
        }

        prisma.$disconnect();
        return res.status(200).json(
            new ApiResponse(200, "Role changed successfully")
        )
    } catch (error) {
        console.log(error);

        return res.status(500).json(
            new ApiResponse(500, `Internal Server Error || ${error.message}`)
        )
    }
    finally {
        await prisma.$disconnect();
    }
}

const jwtLogin = async (req, res) => {
    try {
        const userData = req.user
        delete userData["password"]


        return res.status(200).json(
            new ApiResponse(200, "Login Successfull", userData)
        )
    } catch (error) {
        return res.status(500).json(
            new ApiResponse(500, `Internal Server Error || ${error.message}`)
        )
    }
    finally {

        await prisma.$disconnect();
    }

}



const userDetails = async (req, res) => {
    try {
        const { user_id } = req.user


        const user = await prisma.user.findFirst({
            where: {
                user_id
            },
            select: {
                user_id: true,
                username: true,
                name: true,
                email: true,
                name: true,
                password: false,
                address: true,
                phone: true,
                role: true
            }

        })

        // console.log(user);


        if (!user) {
            return res.status(400).json(
                new ApiResponse(400, "User not found")
            )
        }

        return res.status(200).json(
            new ApiResponse(200, "User details", user)
        )

    } catch (error) {
        return res.status(500).json(
            new ApiResponse(500, `Internal Server Error || ${error.message}`)
        )
    }
    finally {
        await prisma.$disconnect();
    }
}

const updateUserDeatils = async (req, res) => {
    try {
        const { id, user_name, name, new_email, address, new_phone } = req.body
        const { user_id, username, email,phone } = req.user

        if (id !== user_id) {
            return res.status(400).json(
                new ApiResponse(400, "You can only update your own details")
            )
        }

        if (username !== user_name) {
            {
                const userExist = await prisma.user.findFirst({
                    where: {
                        username: user_name
                    }
                })

                if (userExist) {
                    return res.status(400).json(
                        new ApiResponse(420, "Username already exists")
                    )
                }
            }
        }

        if (new_email !== email) {


            const existingEmail = await prisma.user.findFirst({
                where: {
                    email: new_email
                }
            })

            if (existingEmail) {
                return res.status(400).json(
                    new ApiResponse(401, "Email already Exists")
                )
            }
        }
        if (new_phone !== phone) {


            const existingPhone = await prisma.user.findFirst({
                where: {
                    phone: new_phone
                }
            })

            if (existingPhone) {
                return res.status(400).json(
                    new ApiResponse(452, "Phone number already Exists")
                )
            }
        }

        const user = await prisma.user.update({
            where: {
                user_id
            },
            data: {
                username: user_name || username,
                name,
                email: new_email || email,
                address,
                phone : new_phone || phone
            }
        })

        if (!user) {
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

const updatePasswowrd = async (req, res) => {
    try {
        const { currentPassword, newPassword, confirmPassword } = req.body
        const { user_id } = req.user

        if(newPassword !== confirmPassword){
            return res.status(400).json(
                new ApiResponse(452, "Password does not match")
            )
        }

        if(currentPassword === newPassword){
            return res.status(400).json(
                new ApiResponse(453, "New password cannot be same as old password")
            )
        }

        const user = await prisma.user.findFirst({
            where: {
                user_id
            },
            select: {
                password: true
            }
        }) 
        
        const currentCurrentPassword = await comparPassword(user.password, currentPassword)

        if(!currentCurrentPassword){
            return res.status(400).json(
                new ApiResponse(400, "Current password is incorrect")
            )
        }


        const newHashPassword = await hashPassword(newPassword)



        const updateUserPassword = await prisma.user.update({
            where: {
                user_id
            },
            data: {
                password: newHashPassword
            }
        })

        if (!updateUserPassword) {
            return res.status(500).json(
                new ApiResponse(500, "Internal Server Error")
            )
        }

        return res.status(200).json(
            new ApiResponse(200, "Password updated successfully")
        )
    } catch (error) {
        return res.status(500).json(
            new ApiResponse(500, `Internal Server Error`)
        )
    }
    finally {
        await prisma.$disconnect();
    }
}




export { register, login, logout, changeRole, jwtLogin, userDetails, updateUserDeatils, updatePasswowrd }