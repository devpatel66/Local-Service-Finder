import { PrismaClient } from "@prisma/client";
import ApiResponse from "../../../utils/ApiResponse.js";

const prisma = new PrismaClient();

const addService = async (req, res) => {
    try {
        const { title, description, address,state,district, category, subCategory, price, email, phone_number } = req.body
        const {role,user_id} = req.user

        const location = `${district}, ${state}`
        
        // console.log(req.body);
        
        if(role == "customer"){
            return res.status(400).json(
                new ApiResponse(400, "Only provider or admin can add service")
            )
        }
        console.log(category);
        
        
        const serviceImagePath = `http://localhost:${process.env.PORT}/public/temp/`+req.file?.filename

        // console.log(req.body);
        
    
        if (!title) {
            return res.status(400).json(
                new ApiResponse(400, "Title is required")
            )
        }
    
        if (!description) {
            return res.status(400).json(
                new ApiResponse(400, "Description is required")
            )
        }
    
        if (!address) {
            return res.status(400).json(
                new ApiResponse(400, "Address is required")
            )
        }
    
        if (!category) {
            return res.status(400).json(
                new ApiResponse(400, "Category is required")
            )
        }
    
        if (!subCategory) {
            return res.status(400).json(
                new ApiResponse(400, "SubCategory is required")
            )
        }
    
        if (!price) {
            return res.status(400).json(
                new ApiResponse(400, "Price is required")
            )
        }
    
        if (!serviceImagePath) {
            return res.status(400).json(
                new ApiResponse(400, "Image is required")
            )
        }
    
        if (description.length > 1200) {
            return res.status(400).json(
                new ApiResponse(400, "Description is too long")
            )
        }
        if(!location){
            return res.status(400).json(
                new ApiResponse(400, "Location is required")
            )
        }
    
        if(price < 0){
            return res.status(400).json(
                new ApiResponse(400, "Price cannot be negative")
            )
        }
        if(!email){
            return res.status(400).json(
                new ApiResponse(400, "Email is required")
            )
        }
        if(!phone_number){
            return res.status(400).json(
                new ApiResponse(400, "Phone Number is required")
            )
        }
        console.log(serviceImagePath);
        // return
        const service = await prisma.service.create({
            data: {
                title,
                description,
                address,
                category,
                email,
                state,
                district,
                phone_number,
                sub_category:subCategory,
                price:parseInt(price),
                location,
                status: "pending",
                provider_id: user_id
            }
        })
    
        if(!service){
            return res.status(500).json(
                new ApiResponse(500, "Internal Server Error")
            )
        }

       
        

        if(serviceImagePath){
            const imagePath = serviceImagePath
            const image = await prisma.serviceImage.create({
                data: {
                    image: imagePath,
                    service_id: service.service_id,
                    name:req.file?.filename
                }
            })
        }
    
        return res.status(200).json(
            new ApiResponse(200,"Service added successfully",service)
        )

    } catch (error) {
        console.log(error);
        
        return res.status(500).json(
            new ApiResponse(500, "Internal Server Error")
        )
    }
    finally{
        await prisma.$disconnect()
    }

}

export default addService