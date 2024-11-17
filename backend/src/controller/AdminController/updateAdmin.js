import prisma from "../../utils/PrismaClient.js";
import ApiResponse from "../../utils/ApiResponse.js";

const updateAdmin = async (req,res)=>{
    try {
        // const {admin_id,name,username} = req.admin
        
        const {name,username,email,admin_id} = req.body
        const {type} = req.admin

        if(type !== "main"){
            return res.status(400).json(
                new ApiResponse(400,"You are not allowed to update")
            )
        }
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
}

export default updateAdmin