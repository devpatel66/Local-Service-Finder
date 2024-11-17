import prisma from "../../utils/PrismaClient.js";
import ApiResponse from "../../utils/ApiResponse.js";
import { unlink } from 'fs'
const updateService = async (req, res) => {
    const { service_id, title, description, servicePrice, price, address, location, category, sub_category } = req.body
    const {admin_id} = req.admin

    if (!admin_id) {
        return res.status(400).json(
            new ApiResponse(400, "Only Admin Can Access")
        )
    }
    
    // console.log(req.body);
    

    const service = await prisma.service.findFirst({
        where: {
            service_id: parseInt(service_id)
        }
    })

    const serviceImage = await prisma.serviceImage.findFirst({
        where: {
            service_id: parseInt(service_id)
        }
    })

    // console.log(serviceImage);




    if (!service) {
        return res.status(400).json(
            new ApiResponse(400, "Service Not Found")
        )
    }

    // if (service.provider_id !== user_id) {
    //     return res.status(400).json(
    //         new ApiResponse(400, "You are not the provider of this service")
    //     )
    // }


    let image = `http://localhost:${process.env.PORT}/public/temp/` + req.file?.filename

    // console.log(image);


    if (image.slice(serviceImage.image.indexOf("temp") + 5) != "undefined") {
        // console.log(req.file);
        try {
            unlink(`./public/temp/${serviceImage.name}`, (err) => {
                console.log("file deleted");
            })
        } catch (error) {
            console.log(error);
        }
    }
    else {
        image = serviceImage.image
    }
    const updatedService = await prisma.service.update({
        where: {
            service_id: parseInt(service_id)
        },
        data: {
            title: title || service.title,
            description: description || description,
            price: servicePrice || service.price,
            address: address || service.address,
            location: location || service.location,
            price: Number(price || service.price),
            category: category || service.category,
            sub_category: sub_category || service.sub_category
        }
    })

    if (!updatedService) {
        return res.status(400).json(
            new ApiResponse(400, "Failed to update service")
        )
    }

    const updadtedServiceImage = await prisma.serviceImage.update({
        where: {
            image_id: serviceImage.image_id
        },
        data: {
            image: image,
            name:req.file?.filename || serviceImage.name
        }
    })



    return res.status(200).json(
        new ApiResponse(200, "Service updated successfully")
    )


}

export default updateService