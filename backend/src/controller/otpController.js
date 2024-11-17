import nodemailer from 'nodemailer';
import { generateOtp, comapreOTP } from '../utils/generateOPT.js';
import ApiResponse from '../utils/ApiResponse.js';
import prisma from '../utils/PrismaClient.js';

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "devp3891@gmail.com",
    pass: process.env.APP_PASS,
  }
});


async function sendOTP(req, res) {

  try {
    const { otp, hasdedOTP } = await generateOtp();
    const {username,user_id} = req.user
    const {email} = req.body
    console.log(req.body);
    
    if (!email) {
      return res.status(400).json(
        new ApiResponse(400, "Email is required")
      )
    }

    const deletedAllExistingOtp = await prisma.otp.deleteMany({
      where:{
        user_id:parseInt(user_id)
      }
    })
    

    const info = await transporter.sendMail({
      from: '"Dev from Servico 👋" <devpt957@gmail.com>', // sender email
      to: `${email}`, //reciver email
      subject: "Your OTP Code for Secure Access 🔐",
      text: `Hello ${username},
      
      Your One-Time Password (OTP) for accessing your account is: ${otp}.
      
      Please use this code to complete your login or registration process. This OTP is valid for the next 5 minutes.
      
      If you did not request this, please ignore this message.
      
      Best regards,
      Servico Team`, // plain text body
      html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);">
            <h2 style="text-align: center; color: #6B17FF;">Servico Verification Code</h2>
            <p style="font-size: 16px; color: #333;">Hello ${username},</p>
            <p style="font-size: 16px; color: #333;">To proceed with your account access, please use the following One-Time Password (OTP): ${otp}</p>
            <div style="text-align: center; margin: 20px 0;">
              <span style="font-size: 24px; font-weight: bold; color: #6B17FF; border: 2px dashed #6B17FF; padding: 10px 20px; border-radius: 5px;">${otp}</span>
            </div>
            <p style="font-size: 16px; color: #333;">This OTP is valid for the next 5 minutes. Please do not share this code with anyone.</p>
            <p style="font-size: 16px; color: #333;">If you did not request this code, please ignore this email.</p>
            <p style="font-size: 14px; color: #777; text-align: center; margin-top: 40px;">Best regards,<br>Servico Team</p>
          </div>
        `,
    });
    console.log(new Date(Date.now() + 5 * 60 * 1000))
    const otpDetails = await prisma.otp.create({
      data: {
        user_id,
        otp: hasdedOTP,
        used: false,
        expireAt: new Date(Date.now() + 5 * 60 * 1000)
      }
    })

    if (!otpDetails) {
      return res.status(400).json(
        new ApiResponse(400, "OTP not created")
      )
    }


    console.log("Message sent: %s", info.messageId);

    return res.status(200).json(new ApiResponse(200, "OTP sent successfully"));

  } catch (error) {
    console.log(error.message);
    
    return res.status(500).json(new ApiResponse(500, "Internal Server Error"));
  }
}


const veriifyOTP = async (req, res) => {

  try {
    const { otp } = req.body
    const { user_id } = req.user
  
    if (!otp) {
      return res.status(400).json(
        new ApiResponse(400, "OTP is required")
      )
    }

    console.log(new Date());
    
  
    const otpDetails = await prisma.otp.findFirst({
      where: {
        user_id,
        used: false,
        expireAt: {
          gte: new Date() 
        }
      }
    });
  
    if (!otpDetails) {
      return res.status(400).json(new ApiResponse(400, "OTP not found or expired"));
    }
  
    const isMatch = await comapreOTP(otpDetails.otp,otp)
    console.log(isMatch);
    
    if (!isMatch) {
      return res.status(400).json(
        new ApiResponse(400, "Invalid OTP")
      )
    }
  
    await prisma.otp.delete({
      where: {
        opt_id: otpDetails.opt_id
      }
    })
  
    return res.status(200).json(new ApiResponse(200, "OTP verified successfully"))
  } catch (error) {

    return res.status(500).json(new ApiResponse(500, "Internal Server Error"));
  }
}

export { sendOTP, veriifyOTP }