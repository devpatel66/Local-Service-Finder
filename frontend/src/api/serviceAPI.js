import ErrorHandler from "./ErrorHandler";

class ServiceAPI {
    constructor() {
        this.url = 'http://localhost:8000/api/v1/service'
    }
    
   async getAllServiceList(){
        return await ErrorHandler(async ()=>{
            const response = await fetch(`${this.url}/getAllServcieList/`)
            const parseData = await response.json();
            // console.log(parseData)
            return parseData
        })
    }
   async getState(){
        return await ErrorHandler(async ()=>{
            const response = await fetch(`${this.url}/getAllState`)
            const parseData = await response.json();
            // console.log(parseData)
            return parseData
        })
    }
   async getDistrict(id){
        return await ErrorHandler(async ()=>{
            const response = await fetch(`${this.url}/getAllDistrict/${id}`)
            const parseData = await response.json();
            // console.log(parseData)
            return parseData
        })
    }

    async getServiceById(id){
        return await ErrorHandler(async ()=>{
            const response = await fetch(`${this.url}/getServiceByID/${id}`,{
                method:'GET',
                credentials:"include"
            })
            const parseData = await response.json();
            // console.log("service data"+parseData)
            return parseData
        })
    }
    async getServiceByUserId(id){
        // console.log(id);
        
        return await ErrorHandler(async ()=>{
            const response = await fetch(`${this.url}/getServiceByUserId/${id}`,{
                method:'GET',
                credentials:"include"
            })
            // console.log(response);
            
            const parseData = await response.json();
            return parseData
        })
    }

    async addService(serviceData){
        return  await ErrorHandler(async ()=>{
            const response = await fetch(`${this.url}/addService`,{
                method:'POST',
                credentials:"include",
                body:serviceData
            })
            
            const parseData = await response.json();
            return parseData
        })
    }


    async updateService(serviceData,service_id){
        return await ErrorHandler(async ()=>{
            const response = await fetch(`${this.url}/updateService/${service_id}`,{
                method:'PUT',
                credentials:"include",
                body:serviceData
            })
            const parseData = await response.json();
            // console.log(parseData)
            return parseData
        })
    }
 

    async deleteService(detail){
        return await ErrorHandler(async ()=>{
            const response = await fetch(`${this.url}/deleteService`,{
                method:'DELETE',
                credentials:"include",
                headers:{
                    'Content-Type': 'application/json'
                },
                body:JSON.stringify(detail)
            })
            const parseData = await response.json();
            console.log(parseData)
            return parseData
        })
    }

    async getAllCategoryList(){
        return await ErrorHandler(async ()=>{
            const response = await fetch(`${this.url}/getAllCategoryList`)
            const parseData = await response.json();
            // console.log(parseData)
            return parseData
        })
    }

    async getSubCategoryList(id){
        return await ErrorHandler(async ()=>{
            const response = await fetch(`${this.url}/getAllSubCategoryList/${id}`)
            const parseData = await response.json();
            console.log(parseData)
            return parseData
        })
    }

    async getServiceByLocation (state,district,category){
        return await ErrorHandler(async ()=>{
            const response = await fetch(`${this.url}/getServiceByLocation/${state}/${district}/${category}`)
            const parseData = await response.json();
            return parseData
        
        })
    }

    async getSearchedService(searchService){
        return await ErrorHandler(async ()=>{
            let response = await fetch(`${this.url}/getSerachService/${searchService}`,{
                method:"get",
            })
            response = await response.json();
            // console.log(response)
            return response 
        })
    }
}

export const serviceApi = new ServiceAPI()