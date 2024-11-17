import ErrorHandler from "./ErrorHandler"

class Category{
    constructor() {
        this.url = 'http://localhost:8000/api/v1/admin'
    }

    async addCategory(new_category_name){
        return await ErrorHandler(async ()=>{
            let response = await fetch(`${this.url}/addCategory/${new_category_name}`,{
                method:"post",
                credentials:"include"
            })
            response = await response.json();
            return response
        })
    }
    async addSubCategory(data){
        return await ErrorHandler(async ()=>{
            let response = await fetch(`${this.url}/addSubCategory/`,{
                method:"post",
                credentials:"include",
                headers:{
                    "Content-Type":"application/json"
                },
                body:JSON.stringify(data)
            })
            response = await response.json();
            return response
        })
    }

}

const categoryApi = new Category()

export default categoryApi