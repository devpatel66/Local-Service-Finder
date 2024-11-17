import ApiResponse from "../utils/ApiResponse.js";
import prisma from "../utils/PrismaClient.js";
import nodemailer from 'nodemailer';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import { hashPassword, comparPassword as compareToken } from "../utils/hashPassword.js";
const port = 5173
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "devp3891@gmail.com",
        pass: process.env.APP_PASS,
    }
});
const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body

        const user = await prisma.user.findFirst({
            where: {
                email
            }
        });

        if (!user) return res.status(404).json(
            new ApiResponse(404, "User not found")
        );


        // generate a rest password token 
        const resetToken = crypto.randomBytes(32).toString('hex');
        const hashedToken = await bcrypt.hash(resetToken, 10);

        console.log(hashedToken, new Date(Date.now() + 3600000))

        await prisma.user.update({
            where: {
                user_id: user.user_id
            },
            data: {
                resetPasswordToken: hashedToken,
                resetPasswordExpires: new Date(Date.now() + 3600000)
            }
        })

        const resetLink = `http://localhost:${port}/resetPassword/${resetToken}/${email}/user`;

        const mailOptions = {
            to: email,
            from: 'devp3891@gmail.com',
            subject: 'Password Reset Request',
            html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9; border: 1px solid #e0e0e0; border-radius: 10px;">
      <h2 style="color: #333; text-align: center;">Password Reset Request</h2>
      <p style="color: #555; font-size: 16px; text-align: center;">Hello,${user.username}</p>
      <p style="color: #555; font-size: 16px; text-align: center;">
        You requested a password reset. Please click the button below to reset your password. This link will expire in 1 hour.
      </p>

      <div style="text-align: center; margin-top: 30px;">
        <a href="${resetLink}" style="
          display: inline-block;
          padding: 12px 25px;
          font-size: 18px;
          color: #fff;
          background-color: #007BFF;
          text-decoration: none;
          border-radius: 8px;
          box-shadow: 0 4px 8px rgba(0, 123, 255, 0.2);
          transition: background-color 0.3s ease;
        " onmouseover="this.style.backgroundColor='#0056b3';" onmouseout="this.style.backgroundColor='#007BFF';">
          Reset Password
        </a>
      </div>

      <p style="color: #999; font-size: 14px; text-align: center; margin-top: 30px;">
        If you did not request a password reset, please ignore this email.
      </p>

      <div style="border-top: 1px solid #e0e0e0; margin-top: 40px; padding-top: 20px; text-align: center; font-size: 12px; color: #777;">
        <p>Thank you,<br/>Your Company Name</p>
        <p style="font-size: 12px; color: #aaa;">This is an automated email, please do not reply.</p>
      </div>
    </div>
  `,
        };

        transporter.sendMail(mailOptions, (err, info) => {
            if (err) return res.status(500).json(
                new ApiResponse(500, 'Error sending email')
            );
            res.status(200).json(
                new ApiResponse(200, "Password link send sccessfully")
            );
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json(
            new ApiResponse(500, `Internal Server Error`)
        )

    } finally {
        await prisma.$disconnect();
    }
}
const adminForgotPassword = async (req, res) => {
    try {
        const { email } = req.body

        const admin = await prisma.admin.findFirst({
            where: {
                email
            }
        });

        if (!admin) {
            return res.status(404).json(
                new ApiResponse(404, "Admin not found")
            );
        }


        // generate a rest password token 
        const resetToken = crypto.randomBytes(32).toString('hex');
        const hashedToken = await bcrypt.hash(resetToken, 10);

        console.log(hashedToken, new Date(Date.now() + 3600000))

        await prisma.admin.update({
            where: {
                admin_id:admin.admin_id
            },
            data: {
                resetPasswordToken: hashedToken,
                resetPasswordExpires: new Date(Date.now() + 3600000)
            }
        })

        const resetLink = `http://localhost:${port}/resetPassword/${resetToken}/${email}/admin`;

        const mailOptions = {
            to: email,
            from: 'devp3891@gmail.com',
            subject: 'Password Reset Request',
            html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9; border: 1px solid #e0e0e0; border-radius: 10px;">
      <h2 style="color: #333; text-align: center;">Password Reset Request</h2>
      <p style="color: #555; font-size: 16px; text-align: center;">Hello,${admin.username}</p>
      <p style="color: #555; font-size: 16px; text-align: center;">
        You requested a password reset. Please click the button below to reset your password. This link will expire in 1 hour.
      </p>

      <div style="text-align: center; margin-top: 30px;">
        <a href="${resetLink}" style="
          display: inline-block;
          padding: 12px 25px;
          font-size: 18px;
          color: #fff;
          background-color: #007BFF;
          text-decoration: none;
          border-radius: 8px;
          box-shadow: 0 4px 8px rgba(0, 123, 255, 0.2);
          transition: background-color 0.3s ease;
        " onmouseover="this.style.backgroundColor='#0056b3';" onmouseout="this.style.backgroundColor='#007BFF';">
          Reset Password
        </a>
      </div>

      <p style="color: #999; font-size: 14px; text-align: center; margin-top: 30px;">
        If you did not request a password reset, please ignore this email.
      </p>

      <div style="border-top: 1px solid #e0e0e0; margin-top: 40px; padding-top: 20px; text-align: center; font-size: 12px; color: #777;">
        <p>Thank you,<br/>Your Company Name</p>
        <p style="font-size: 12px; color: #aaa;">This is an automated email, please do not reply.</p>
      </div>
    </div>
  `,
        };

        transporter.sendMail(mailOptions, (err, info) => {
            if (err) return res.status(500).json(
                new ApiResponse(500, 'Error sending email')
            );
            res.status(200).json(
                new ApiResponse(200, "Password link send sccessfully")
            );
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json(
            new ApiResponse(500, `Internal Server Error`)
        )

    } finally {
        await prisma.$disconnect();
    }
}


const resetPassword = async (req, res) => {
    try {
        const { token, email, newPassword, confirmPassword } = req.body;

        console.log(req.body)

        if (!token || !email || !newPassword || !confirmPassword) {
            return res.status(400).json(
                new ApiResponse(400, "All fields are required")
            )
        }


        if (newPassword !== confirmPassword) {
            return res.status(400).json(
                new ApiResponse(400, "Password does not match")
            )
        }

        const user = await prisma.user.findFirst({
            where: {
                email
            }
        });

        if (!user) return res.status(404).json(
            new ApiResponse(404, "User not found")
        );

        if (!user.resetPasswordToken || !user.resetPasswordExpires) {
            return res.status(400).json(
                new ApiResponse(400, "Invalid")
            );
        }

        console.log(user)
        const isValide = await compareToken(user.resetPasswordToken, token);
        if (!isValide || user.resetPasswordExpires < Date.now()) return res.status(400).json(
            new ApiResponse(400, "Invalid or expired token")
        );


        const hashedPassword = await hashPassword(newPassword);


        await prisma.user.update({
            where: {
                user_id: user.user_id
            },
            data: {
                password: hashedPassword,
                resetPasswordToken: null,
                resetPasswordExpires: null
            }
        });


        return res.status(200).json(
            new ApiResponse(200, "Password reset successfully")
        );



    } catch (error) {

        console.log(error);
        return res.status(500).json(
            new ApiResponse(500, `Internal Server Error`)
        )

    } finally {
        await prisma.$disconnect();
    }
}
const adminResetPassword = async (req, res) => {
    try {
        const { token, email, newPassword, confirmPassword } = req.body;

        console.log(req.body)

        if (!token || !email || !newPassword || !confirmPassword) {
            return res.status(400).json(
                new ApiResponse(400, "All fields are required")
            )
        }


        if (newPassword !== confirmPassword) {
            return res.status(400).json(
                new ApiResponse(400, "Password does not match")
            )
        }

        const admin = await prisma.admin.findFirst({
            where: {
                email
            }
        });

        if (!admin) return res.status(404).json(
            new ApiResponse(404, "User not found")
        );

        if (!admin.resetPasswordToken || !admin.resetPasswordExpires) {
            return res.status(400).json(
                new ApiResponse(400, "Invalid")
            );
        }

        console.log(admin)
        const isValide = await compareToken(admin.resetPasswordToken, token);
        if (!isValide || admin.resetPasswordExpires < Date.now()) return res.status(400).json(
            new ApiResponse(400, "Invalid or expired token")
        );


        const hashedPassword = await hashPassword(newPassword);


        await prisma.admin.update({
            where: {
                admin_id: admin.admin_id
            },
            data: {
                password: hashedPassword,
                resetPasswordToken: null,
                resetPasswordExpires: null
            }
        });


        return res.status(200).json(
            new ApiResponse(200, "Password reset successfully")
        );



    } catch (error) {

        console.log(error);
        return res.status(500).json(
            new ApiResponse(500, `Internal Server Error`)
        )

    } finally {
        await prisma.$disconnect();
    }
}


export {
    forgotPassword,
    resetPassword,
    adminForgotPassword,
    adminResetPassword
}