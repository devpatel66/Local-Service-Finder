import ApiResponse from "../../../utils/ApiResponse.js";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const getAllCategoryListFunc = async (req, res) => {
    try {
        let response = await prisma.category.findMany({
            include: {
              _count: {
                select: {
                    SubCategory: true, 
                },
              },
            },
          });

        if(!Array.isArray(response) && response.length <= 0){
            return res.status(400).json(new ApiResponse(400, "Category List is Empty",response))
        }

        // console.log(response);
        
        return res.status(200).json(
            new ApiResponse(200, "Success", response)
        )
    } catch (error) {
        return res.status(500).json(new ApiResponse(500, "Internal Server Error"))
    }
}

const getAllSubCategoryListFunc = async (req, res) => {
    try {
        const categroyID = req.params.id

        let response = await prisma.subCategory.findMany({
            where:{
                category_id: parseInt(categroyID)
            }
        });
        // console.log(response);
        

        if(!Array.isArray(response) && response.length <= 0){
            return res.status(400).json(new ApiResponse(400, "SubCategory List is Empty",response))
        }

        return res.status(200).json(
            new ApiResponse(200, "Success", response)
        )
    } catch (error) {
        console.log(error);
        
        return res.status(500).json(new ApiResponse(500, "Internal Server Error"))
    }
    finally {
        await prisma.$disconnect();
    }
}

export {
    getAllCategoryListFunc,
    getAllSubCategoryListFunc
}