import ErrorHandler from "./ErrorHandler";

class OTP {
     constructor(){
        this.url = "http://localhost:8000/api/v1/otp"
     }

     async sendOtp (email){
        console.log(email);
        const data = {
            email : email
        }
        return await ErrorHandler(async()=>{
            let response = await fetch(`${this.url}/sendOtp`,{
                method : "POST",
                credentials:"include",
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
     async verifyOtp (otp){
        return await ErrorHandler(async()=>{
            let response = await fetch(`${this.url}/verifyOtp`,{
                method : "POST",
                credentials:"include",
                headers:{
                    'Content-Type':"application/json"
                },
                body:JSON.stringify({otp:otp})
            })
            response = await response.json()

            return response
        })
     }
}

const otpApi = new OTP()

export default otpApi