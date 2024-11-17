import ErrorHandler from "./ErrorHandler";

class Review {
    constructor(){
        this.url = "http://localhost:8000/api/v1/review" 
    }


    async addReview(reviewData){
        return await ErrorHandler(async ()=>{
            let response = await fetch(`${this.url}/addReview`,{
                method:"post",
                headers:{
                    "Content-Type":"application/json"
                },
                credentials:"include",
                body:JSON.stringify(reviewData)
            })

            response = await response.json()
            return response
        })
    }

    async getReviewsOfUser(){
        return await ErrorHandler(async ()=>{
            let response = await fetch(`${this.url}/getReviewsOfUser`,{
                method:"get",
                credentials:"include"
            })

            response = await response.json()
            return response
        })
    }

    async getReviewsForPaticularService(service_id){
        return await ErrorHandler(async ()=>{
            let response = await fetch(`${this.url}/getReviewsForPaticularService/${service_id}`,{
                method:"get",
                credentials:"include"
            })

            response = await response.json()
            return response
        })
    }
}


const reviewApi = new Review()

export default reviewApi