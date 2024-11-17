import ErrorHandler from "./ErrorHandler";

class Admin{
    constructor() {
        this.url = 'http://localhost:8000/api/v1/admin'
    }

    async getServiceList(){
        return await ErrorHandler(async ()=>{
            const response = await fetch(`${this.url}/getPenndingInReviewServiceList`,{
                credentials:"include"
            })
            const parseData = await response.json();
            // console.log(parseData)
            return parseData
        })
    }

    async getUserData(){
        return await ErrorHandler(async ()=>{
            const response = await fetch(`${this.url}/getUserData`,{
                credentials:"include"
            })
            const parseData = await response.json();
            // console.log(parseData)
            return parseData 
        })
    }
    async getRecentUser(){
        return await ErrorHandler(async ()=>{
            const response = await fetch(`${this.url}/getRecentUser`,{
                credentials:"include"
            })
            const parseData = await response.json();
            // console.log(parseData)
            return parseData 
        })
    }
    async login(credentails){
        return await ErrorHandler(async ()=>{
            let response = await fetch(`${this.url}/login`,{
                method:"post",
                headers:{
                    "Content-Type":"application/json"
                },
                credentials:"include",
                body:JSON.stringify(credentails)
            })
            response = await response.json();
            return response 
        })
    }
    async logout(){
        return await ErrorHandler(async ()=>{
            let response = await fetch(`${this.url}/logout`,{
                method:"get",
                credentials:"include"
            })
            response = await response.json();
            return response 
        })
    }
    
    async jwtLogin(){
        return await ErrorHandler(async ()=>{
            let response = await fetch(`${this.url}/jwtLogin`,{
                method:"get",
                credentials:"include"
            })
            response = await response.json();
            return response 
        })
    }
    async getUsers(role){
        return await ErrorHandler(async ()=>{
            let response = await fetch(`${this.url}/getUsers/${role}`,{
                method:"get",
                credentials:"include"
            })
            response = await response.json();
            // console.log(response)
            return response 
        })
    }
    async getSearchedUsers(searchUser){
        return await ErrorHandler(async ()=>{
            let response = await fetch(`${this.url}/getSearchedUsers/${searchUser}`,{
                method:"get",
                credentials:"include"
            })
            response = await response.json();
            // console.log(response)
            return response 
        })
    }
    async getBookingStatistics(){
        return await ErrorHandler(async ()=>{
            let response = await fetch(`${this.url}/getBookingStatistics`,{
                method:"get",
                credentials:"include"
            })
            response = await response.json();
            // console.log(response)
            return response 
        })
    }
    async getBookings(){
        return await ErrorHandler(async ()=>{
            let response = await fetch(`${this.url}/getBookings`,{
                method:"get",
                credentials:"include"
            })
            response = await response.json();
            // console.log(response)
            return response 
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

    async updateService(serviceData,service_id){
        return await ErrorHandler(async ()=>{
            const response = await fetch(`${this.url}/updateService/${service_id}`,{
                method:'PUT',
                credentials:"include",
                body:serviceData
            })
            const parseData = await response.json();
            console.log(parseData)
            return parseData
        })
    }

    async addAdmin(adminData){
        return await ErrorHandler(async ()=>{
            const response = await fetch(`${this.url}/addAdmin`,{
                method:'POST',
                credentials:"include",
                headers:{
                    "Content-Type":"application/json"
                },
                body:JSON.stringify(adminData)
            })
            const parseData = await response.json();
            console.log(parseData)
            return parseData
        })
    }

    async getAllAdminsList(){
        return await ErrorHandler(async ()=>{
            const response = await fetch(`${this.url}/getAdminList`,{
                method:'GET',
                credentials:"include"
            })
            const parseData = await response.json();
            console.log(parseData)
            return parseData
        })
    }

    async getUserId(id){
        return await ErrorHandler(async ()=>{
            const response = await fetch(`${this.url}/getUserId/${id}`,{
                method:'GET',
                credentials:"include"
            })
            const parseData = await response.json();
            // console.log("service data"+parseData)
            return parseData
        })
    }
    async getAdminById(id){
        return await ErrorHandler(async ()=>{
            const response = await fetch(`${this.url}/getAdminById/${id}`,{
                method:'GET',
                credentials:"include"
            })
            const parseData = await response.json();
            // console.log("service data"+parseData)
            return parseData
        })
    }


    async updateUser(uesrData){
        return await ErrorHandler(async ()=>{
            const response = await fetch(`${this.url}/updateUser`,{
                method:'post',
                credentials:"include",
                headers:{
                    "Content-Type":"application/json"
                },
                body:JSON.stringify(uesrData)
            })
            const parseData = await response.json();
            // console.log("service data"+parseData)
            return parseData
        })
    }

    async deleteAdmin(id){
        return await ErrorHandler(async ()=>{
            const response = await fetch(`${this.url}/deleteAdmin/${id}`,{
                method:'DELETE',
                credentials:"include"
            })
            const parseData = await response.json();
            // console.log("service data"+parseData)
            return parseData
        })
    }
    async deleteUser(id){
        return await ErrorHandler(async ()=>{
            const response = await fetch(`${this.url}/deleteUser/${id}`,{
                method:'DELETE',
                credentials:"include"
            })
            const parseData = await response.json();
            // console.log("service data"+parseData)
            return parseData
        })
    }

    async update(data){
        return await ErrorHandler(async ()=>{
            const response = await fetch(`${this.url}/update`,{
                method:'put',
                credentials:"include",
                headers:{
                    "Content-Type":"application/json"
                },
                body:JSON.stringify(data)
            })
            const parseData = await response.json();
            // console.log("service data"+parseData)
            return parseData
        })
    }
    
    async updateAdmin(data){
        return await ErrorHandler(async ()=>{
            const response = await fetch(`${this.url}/updateAdmin`,{
                method:'put',
                credentials:"include",
                headers:{
                    "Content-Type":"application/json"
                },
                body:JSON.stringify(data)
            })
            const parseData = await response.json();
            // console.log("service data"+parseData)
            return parseData
        })
    }
    async updatePassword(data){
        return await ErrorHandler(async ()=>{
            const response = await fetch(`${this.url}/updatePassword`,{
                method:'put',
                credentials:"include",
                headers:{
                    "Content-Type":"application/json"
                },
                body:JSON.stringify(data)
            })
            const parseData = await response.json();
            // console.log("service data"+parseData)
            return parseData
        })
    }
}

export const adminAPI = new Admin()