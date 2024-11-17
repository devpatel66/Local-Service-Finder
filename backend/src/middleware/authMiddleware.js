import jwt from "jsonwebtoken";
import ApiResponse from "../utils/ApiResponse.js";
import prisma from "../utils/PrismaClient.js";



const veriifyJwt = async (req,res,next)=>{

    try {
        // console.log(req.body)   
        // console.log(req.cookies.accessToken);
        const token = req.cookies.accessToken;
        if(!token){
            return res.status(401).json(
                new ApiResponse(401,"Unavaible Token")
            )
        }
        // console.log(token)
    
        const decode = jwt.verify(token,process.env.ACCESS_TOKEN_KEY);
        const user = await prisma.user.findFirst({
            where:{
                user_id:decode.user_id
            },
            select:{
                user_id:true,
                username:true,
                name:true,
                email:true,
                phone:true,
                address:true,
                password:true,
                role:true
            }
        })
        // console.log(user)
        if(!user){
            return res.status(401).json(
                new ApiResponse(401,"Unauthorized User")
            )
        }
    
        req.user = user;
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

export default veriifyJwt