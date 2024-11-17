import {randomInt} from 'crypto'
import bcrypt from 'bcrypt'

async function generateOtp(){
    const otp = randomInt(100000, 999999)
    const hasdedOTP  = await bcrypt.hash(otp.toString(),10)
    return {hasdedOTP,otp}
}

async function comapreOTP(hashedOTP,plainOTP){
    console.log(hashedOTP,plainOTP);
    
    return await bcrypt.compare(plainOTP,hashedOTP)
}

export {
    generateOtp,
    comapreOTP
}
