import { readUsedSize } from "chart.js/helpers";
import ErrorHandler from "./ErrorHandler";

class Booking{
    constructor(){
        this.url = 'http://localhost:8000/api/v1/booking'
    }

    async addBooking(bookingData){
        console.log(bookingData);
        
        return await ErrorHandler(async ()=>{
            let response = await fetch(this.url+"/addBooking",{
                method:"POST",
                headers:{
                  'Content-Type': 'application/json'
                },
                credentials:"include",
                body:JSON.stringify(bookingData)
            })
            response = await response.json()
            // console.log(response)

            return response
        })
    }

    async reschedule(bookingData){
        console.log(bookingData);
        
        return await ErrorHandler(async ()=>{
            let response = await fetch(this.url+"/reschedule",{
                method:"POST",
                headers:{
                    "Content-Type":"application/json"
                },
                credentials:"include",
                body:JSON.stringify(bookingData)
            })
            response = await response.json()
            // console.log(response)

            return response
        })
    }

    async getBookingByUserId(id){
        return await ErrorHandler(async ()=>{
            let response = await fetch(this.url+"/getBookingByUserId",{
                method:"get",
                credentials:"include"
            })
            response = await response.json()
            // console.log(response)

            return response
        })
    }


    async getBookingByProviderId(status){
        return await ErrorHandler(async ()=>{
            let response = await fetch(`${this.url}/getBookingByProviderId/${status}`,{
                method:"get",
                credentials:"include"
            })
            response = await response.json()
            // console.log(response)

            return response
        })
    }

    async getBookingByServiceId(id){
        return await ErrorHandler(async ()=>{
            let response = await fetch(this.url+"/getBookingByServiceId",{
                method:"get",
                credentials:"include",
                body:JSON.stringify({service_id:id})
            })
            response = await response.json()
            // console.log(response)

            return response
        })
    }

    async updateStatus(data){
        return await ErrorHandler(async ()=>{
            let response = await fetch(`${this.url}/updateStatus`,{
                method:"post",
                credentials:"include",
                headers:{
                    "Content-Type":"application/json"
                },
                body:JSON.stringify(data)
            })

            response = await response.json()

            return response
        })
    }
}


const bookingApi = new Booking()

export default bookingApi