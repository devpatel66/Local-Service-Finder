import ApiResponse from "../utils/ApiResponse.js";
import { hashPassword,comparPassword } from "../utils/hashPassword.js";
import { compareSync } from "bcrypt";
import { generatesAccessToken } from "../utils/generateTokens.js";
import prisma from "../utils/PrismaClient.js";
import { parse } from "path";

const cookieOptions = {
    httpOnly:true,
    secure:true
}

const register = async (req,res)=>{
    try {   
        if(!req.body){
            return res.status(400).json(
                new ApiResponse(400,"Request Body is Empty")
            )
        }

        const {type} = req.admin

        if(type !== "main"){
            return res.status(400).json(
                new ApiResponse(400,"Only main admin can register")
            )
        }
        const {username,name,email,password} = req.body;

        console.log(req.body)
        if(username === ""){
            return res.status(400).json(
                new ApiResponse(420, "Username is required")
            ) 
        }
        if(email === ""){
            return res.status(400).json(
                new ApiResponse(420, "email is required")
            ) 
        }

        if(name === ""){
            return res.status(400).json(
                new ApiResponse(420, "name is required")
            ) 
        }

        if(password === ""){
            return res.status(400).json(
                new ApiResponse(423, "Password is requiired")
            )
        }
        if(password.length < 7){
            return res.status(400).json(
                new ApiResponse(423, "Password is too short")
            )
        }


        const alreadyUsername = await prisma.admin.findFirst({
            where: {
                username
            }
        })

        if(alreadyUsername){
            return res.status(400).json(
                new ApiResponse(452,"Username is already taken")
            )
        }


        const alreadyEmail = await prisma.admin.findFirst({
            where: {
                email
            }
        })

        if(alreadyEmail){
            return res.status(400).json(
                new ApiResponse(420,"Email is already taken")
            )
        }


        const encrytedPassword = await hashPassword(password)

        if(!encrytedPassword){
            return res.status(500).json(
                new ApiResponse(500,"Internal Server Error")
            )
        }

        const admin = await prisma.admin.create({
            data : {
                username,
                name,
                email,
                password : encrytedPassword,
                type:"sub"
            },
            select:{
                username:true,
                name:true,
                email:true,
                password :false,
            }
        })

        if(!admin){
            return res.status(500).json(
                new ApiResponse(500,"Internal Server Error")
            )
        }
        prisma.$disconnect();

        return res.status(200).json(
            new ApiResponse(200,"Admin registered sccessfully",admin)
        )

    } catch (error) {
        console.error(error)
        prisma.$disconnect();
        return res.status(500).json(
            new ApiResponse(500,"Internal Server Error")
        )
        
    }
    finally{
        await prisma.$disconnect();
    }
}


const login = async (req,res)=>{
    try {
        const {username,password} = req.body;
        console.log(req.body)
        if(!username){
            return res.status(400).json(
                new ApiResponse(420,"Username or Email is required")
            )
        }
    
        if(!password){
            return res.status(400).json(
                new ApiResponse(423,"Password is required")
            )
        }
    
        const admin = await prisma.admin.findFirst({
            where:{
               username
            },
            select:{
                username:true,
                name:true,
                email:true,
                password:true,
                type:true,
                admin_id:true
            }
        })
    
        if(!admin){
            prisma.$disconnect();
            return res.status(400).json(
                new ApiResponse(400,"User does not exits")
            )
        }
        
        const checkPassword = await comparPassword(admin.password,password)
    
        if(!checkPassword){
            prisma.$disconnect();
            return res.status(400).json(
                new ApiResponse(423,"Password is incorrect")
            )
        }
        delete admin["password"]
        const adminAccessToken = await generatesAccessToken(admin)
    
        // console.log(adminAccessToken);
        // console.log(admin);
    
        if(!adminAccessToken){
            prisma.$disconnect();
            return res.status(500).json(
                new ApiResponse(500,"Internal Server Error || Failed to generate the access token")
            )
        }
    
        prisma.$disconnect();
        
        return  res.status(200)
        .cookie("adminAccessToken",adminAccessToken,cookieOptions)
        .json(
            new ApiResponse(200,"Login Successfull",admin)
        )
    } catch (error) {
        return res.status(500).json(
            new ApiResponse(500,`Internal Server Error || ${error.message}`)
        )
    }
    finally{
        await prisma.$disconnect();
    }

}

const logout = async(req,res)=>{
    return  res.status(200)
    .cookie("adminAccessToken","",cookieOptions)
    .json(
        new ApiResponse(200,"Logout Successfull")
    ) 
}

const update = async (req,res)=>{
    try {
        // const {admin_id,name,username} = req.admin
        
        const {name,username,email,admin_id} = req.body
        // console.log(req.admin)
    
        if(!name && !username && !password){
            return res.status(400).json(
                new ApiResponse(400,"No data to update")
            )
        }

        const admin = await prisma.admin.findFirst({
            where:{
                admin_id:parseInt(admin_id)
            }
        })

        if(!admin){
            return res.status(400).json(
                new ApiResponse(400,"Admin does not exits")
            )
        }

        if(admin.username !== username){
            const userExist = await prisma.admin.findFirst({
                where:{
                    username : username
                }
            })
    
            if(userExist){
                return res.status(400).json(
                    new ApiResponse(420,"Username already exists")
                )
            }
        }

        if(admin.email !== email){
            const userExist = await prisma.admin.findFirst({
                where:{
                    email : email
                }
            })
    
            if(userExist){
                return res.status(400).json(
                    new ApiResponse(420,"Email already exists")
                )
            }
        }
               
        
    
        const updatedAdmin = await prisma.admin.update({
            where:{
                admin_id:parseInt(admin_id)
            },
            data:{
                name : name.trim() || admin.name,
                username : username.trim() || admin.username,
                email : email.trim() || admin.email,
            }
        })
    
        if(!updatedAdmin){
            return res.status(500).json(
                new ApiResponse(500,"Internal Server Error")
            )
        }
    
        return res.status(200).json(
            new ApiResponse(200,"Update Successfull")
        )
    } catch (error) {

        console.log(error)
        return res.status(500).json(
            new ApiResponse(500,`Internal Server Error`)
        )
    }
    finally{
        await prisma.$disconnect();
    }
}

const deleteAdmin = async (req,res)=>{
    try {
        const {admin_id} = req.params
        const {type} = req.admin

        if(type !== "main"){
            return res.status(400).json(
                new ApiResponse(400,"Only main admin can delete")
            )
        }

        if(!admin_id){
            return res.status(400).json(
                new ApiResponse(400,"Admin id is required")
            )
        }

        const user = await prisma.admin.delete({
            where:{
                admin_id:parseInt(admin_id)
            }    
        })

        if(!user){
            return res.status(500).json(
                new ApiResponse(500,"Internal Server Error")
            )
        }

        return res.status(200).json(
            new ApiResponse(200,"Delete Successfull")
        )
    } catch (error) {
        console.log(error)
        return res.status(500).json(
            new ApiResponse(500,`Internal Server Error`)
        )
    }
    finally{
        await prisma.$disconnect();
    }

}

const jwtAdminLogin = async(req,res)=>{
    const {username,type,name,email,admin_id} = req.admin
    return res.status(200).json(
        new ApiResponse(200,"Login Successfull",{username,type,name,email,admin_id})
    )
}



const updatePassword = async(req,res)=>{
    try {
        const {currentPassword, newPassword, confirmPassword} = req.body
        const {admin_id} = req.admin

        if(newPassword !== confirmPassword){
            return res.status(400).json(
                new ApiResponse(452,"Password does not match")
            )
        }

        const admin = await prisma.admin.findFirst({
            where:{
                admin_id:parseInt(admin_id)
            }
        })

        if(!admin){
            return res.status(400).json(
                new ApiResponse(400,"Admin does not exits")
            )
        }   

        const checkPassword = await comparPassword(admin.password,currentPassword)

        if(!checkPassword){
            return res.status(400).json(
                new ApiResponse(454,"Incorrect current password")
            )
        }

        const hashedPassword = await hashPassword(newPassword)

        const updatedAdmin = await prisma.admin.update({
            where:{
                admin_id:parseInt(admin_id)
            },
            data:{
                password : hashedPassword
            }
        })

        if(!updatedAdmin){
            return res.status(500).json(
                new ApiResponse(500,"Internal Server Error")
            )
        }

        return res.status(200).json(
            new ApiResponse(200,"Update Successfull")
        )
    } catch (error) {
        console.log(error)
        return res.status(500).json(
            new ApiResponse(500,`Internal Server Error`)
        )
    }
    finally{
        await prisma.$disconnect();
    }
}


const registerMainAdmin = async (req,res)=>{
    try {   
        
        const {username,name,email,password} = req.body;

        console.log(req.body)
        if(username === ""){
            return res.status(400).json(
                new ApiResponse(420, "Username is required")
            ) 
        }
        if(email === ""){
            return res.status(400).json(
                new ApiResponse(420, "email is required")
            ) 
        }

        if(name === ""){
            return res.status(400).json(
                new ApiResponse(420, "name is required")
            ) 
        }

        if(password === ""){
            return res.status(400).json(
                new ApiResponse(423, "Password is requiired")
            )
        }
        if(password.length < 7){
            return res.status(400).json(
                new ApiResponse(423, "Password is too short")
            )
        }


        const alreadyUsername = await prisma.admin.findFirst({
            where: {
                username
            }
        })

        if(alreadyUsername){
            return res.status(400).json(
                new ApiResponse(452,"Username is already taken")
            )
        }


        const alreadyEmail = await prisma.admin.findFirst({
            where: {
                email
            }
        })

        if(alreadyEmail){
            return res.status(400).json(
                new ApiResponse(420,"Email is already taken")
            )
        }


        const encrytedPassword = await hashPassword(password)

        if(!encrytedPassword){
            return res.status(500).json(
                new ApiResponse(500,"Internal Server Error")
            )
        }

        const admin = await prisma.admin.create({
            data : {
                username,
                name,
                email,
                password : encrytedPassword,
                type:"main"
            },
            select:{
                username:true,
                name:true,
                email:true,
                password :false,
            }
        })

        if(!admin){
            return res.status(500).json(
                new ApiResponse(500,"Internal Server Error")
            )
        }
        prisma.$disconnect();

        return res.status(200).json(
            new ApiResponse(200,"Admin registered sccessfully",admin)
        )

    } catch (error) {
        console.error(error)
        prisma.$disconnect();
        return res.status(500).json(
            new ApiResponse(500,"Internal Server Error")
        )
        
    }
    finally{
        await prisma.$disconnect();
    }
}
export {register,login,logout,update,deleteAdmin,jwtAdminLogin,updatePassword,registerMainAdmin}