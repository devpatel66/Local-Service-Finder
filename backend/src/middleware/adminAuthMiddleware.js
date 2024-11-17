import jwt from "jsonwebtoken";
import ApiResponse from "../utils/ApiResponse.js";
import prisma from "../utils/PrismaClient.js";



const veriifyAdminJwt = async (req,res,next)=>{

    try {  
        // console.log(req.cookies.adminAccessToken);
        const token = req.cookies.adminAccessToken;
        if(!token){
            return res.status(401).json(
                new ApiResponse(401,"Unavaible Token")
            )
        }
        // console.log(token)
    
        const decode = jwt.verify(token,process.env.ACCESS_TOKEN_KEY);
        // console.log(decode)
        let admin = await prisma.admin.findFirst({
            where:{
                admin_id:decode.admin_id
            },
            select:{
                admin_id:true,
                username:true,
                email:true,
                name:true,
                password:true,
                type:true
            }
        })

        // console.log(admin)
        if(!admin){
            return res.status(401).json(
                new ApiResponse(401,"Unauthorized User")
            )
        }
    
        req.admin = admin;
        next()
    } 
    catch (error) {
        prisma.$disconnect();
        return res.status(500).json({
            statusCode : 500,
            msg:"Internal Server Error",
            errMsg:error.message
        })
    }
    finally{
        await prisma.$disconnect();
    }
}

export default veriifyAdminJwt