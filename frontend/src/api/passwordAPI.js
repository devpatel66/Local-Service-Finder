import ErrorHandler from "./ErrorHandler";

class Password {
     constructor(){
        this.url = "http://localhost:8000/api/v1/password"
     }

     async forgotPassword (email){
        const data = {
            email : email
        }
        return await ErrorHandler(async()=>{
            let response = await fetch(`${this.url}/forgotPassword`,{
                method : "POST",
                headers:{
                    'Content-Type':"application/json"
                },
                body:JSON.stringify(data)
            })
            // console.log(response);
            
            response = await response.json()

            return response
        })
     }
     async adminForgotPassword (email){
        const data = {
            email : email
        }
        return await ErrorHandler(async()=>{
            let response = await fetch(`${this.url}/adminForgotPassword`,{
                method : "POST",
                headers:{
                    'Content-Type':"application/json"
                },
                body:JSON.stringify(data)
            })
            // console.log(response);
            
            response = await response.json()

            return response
        })
     }
     async resetPassword (data){
        return await ErrorHandler(async()=>{
            let response = await fetch(`${this.url}/changePassword`,{
                method : "POST",
                headers:{
                    'Content-Type':"application/json"
                },
                body:JSON.stringify(data)
            })
            response = await response.json()
            console.log(response)

            return response
        })
     }
     async adminChangePassword (data){
        return await ErrorHandler(async()=>{
            let response = await fetch(`${this.url}/adminChangePassword`,{
                method : "POST",
                headers:{
                    'Content-Type':"application/json"
                },
                body:JSON.stringify(data)
            })
            response = await response.json()
            console.log(response)

            return response
        })
     }
}

const passwordApi = new Password()

export default passwordApi