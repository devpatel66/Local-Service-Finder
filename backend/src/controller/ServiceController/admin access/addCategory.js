import ApiResponse from "../../../utils/ApiResponse.js";
import prisma from "../../../utils/PrismaClient.js";

const addCategoryFunc = async (req, res) => {
    try {   
        const {category_name} = req.params
        
        if (!category_name) {
            return res.status(400).json(
                new ApiResponse(400, "Category Name is required")
            )
        }   

        const  nameAlreadyExists = await prisma.category.findUnique({
            where:{
                name:category_name
            }
        })

        if(nameAlreadyExists){
            return res.status(400).json(
                new ApiResponse(400, "Category Name already exists")
            )
        }

        const category = await prisma.category.create({
            data: {
                name:category_name
            }
        })

        if(!category) {
            return res.status(400).json(
                new ApiResponse(400, "Category not created")
            )
        }

        return res.status(200).json(
            new ApiResponse(200, "Success", category)
        )
    } catch (error) {
        console.log(error)
        return res.status(500).json(
            new ApiResponse(500, error.message)
        )
    }
    finally {
        await prisma.$disconnect();
    }
}

const addSubCategoryFunc = async (req, res) => {
    try {
       
        const {category_id, name} = req.body
        if(!category_id){
            return res.status(400).json(
                new ApiResponse(400, "Category Id is required")
            )
        }

        if(!name){
            return res.status(400).json(
                new ApiResponse(400, "Sub Category Name is required")
            )
        }

        const category = await prisma.category.findUnique({
            where: {
                category_id
            }
        })

        if(!category){
            return res.status(400).json(
                new ApiResponse(400, "Category does not exits, Create One First")
            )
        }

        const subCategoery = await prisma.subCategory.create({
            data: {
                name,
                category_id:parseInt(category_id)
            }
        })

        if(!subCategoery) {
            return res.status(400).json(
                new ApiResponse(400, "Sub Category not created")
            )
        }

        return res.status(200).json(
            new ApiResponse(200, "Success", subCategoery)
        )

    } catch (error) {
        prisma.$disconnect()
        return res.status(500).json(
            new ApiResponse(500, error.message)
        )
    }
    finally {
        await prisma.$disconnect();
    }
}

export {
    addCategoryFunc,
    addSubCategoryFunc
}