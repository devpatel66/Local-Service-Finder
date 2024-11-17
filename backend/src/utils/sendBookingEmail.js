import nodemailer from 'nodemailer';
import prisma from './PrismaClient.js';
// Configure the transporter
const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.APP_PASS,
  },
});


async function sendBookingConfirmation(service_id, bookingDetails, user) {
  try {
    const { message, booking_date } = bookingDetails;
    console.log(bookingDetails);
    const service = await prisma.service.findFirst({
      where: {
        service_id: parseInt(service_id),
      },
    })

    const mailOptions = {
      from: `Servico <${process.env.EMAIL}>`,
      to: service.email,
      subject: `New Booking for ${service.title}`,
      html: `
          <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #ddd; border-radius: 8px; overflow: hidden;">
            <div style="background-color: #4CAF50; color: white; padding: 20px; text-align: center;">
              <h2 style="margin: 0;">New Booking Confirmation</h2>
            </div>
            <div style="padding: 20px;">
              <h3 style="color: #4CAF50;">Dear Provider,</h3>
              <p style="font-size: 16px;">
                You have a new booking for your service, <strong style="color: #333;">${service.title}</strong>! Here are the details:
              </p>
              
              <h4 style="color: #4CAF50; margin-top: 20px;">Booking Details:</h4>
              <ul style="list-style-type: none; padding: 0;">
                <li style="margin-bottom: 8px;"><strong>User Name:</strong> ${user.username}</li>
                <li style="margin-bottom: 8px;"><strong>User Email:</strong> <a href="mailto:${user.email}" style="color: #4CAF50; text-decoration: none;">${user.email}</a></li>
                <li style="margin-bottom: 8px;"><strong>Phone Number:</strong> ${user.phone}</li>
                <li style="margin-bottom: 8px;"><strong>Service:</strong> ${service.title}</li>
                <li style="margin-bottom: 8px;"><strong>Booking Date:</strong> ${booking_date}</li>
                <li style="margin-bottom: 8px;"><strong>Address:</strong> ${user.address}</li>
                <li style="margin-bottom: 8px;"><strong>Message from User:</strong> ${message}</li>
              </ul>
              
              <p style="font-size: 16px; margin-top: 20px;">
                Please prepare for the booking, and feel free to contact the user for any further details.
              </p>
              <p style="font-size: 16px; margin-top: 20px;">
                Thank you for being a part of <strong>Servico</strong>!
              </p>
              <p style="font-size: 16px;">Best Regards,<br><strong>Servico Team</strong></p>
            </div>
            <div style="background-color: #f7f7f7; padding: 15px; text-align: center; font-size: 14px; color: #666;">
              <p style="margin: 0;">&copy; 2024 Servico. All rights reserved.</p>
            </div>
          </div>
        `,
    };

    await transporter.sendMail(mailOptions);
    console.log("Booking confirmation email sent to service provider successfully.");
    return true;
  } catch (error) {
    throw new Error("Error sending booking confirmation email: " + error);
  }
}
async function reshduleEmailToProvider(service_id, bookingDetails, user) {
  try {
    const { message, booking_date } = bookingDetails;
    console.log(bookingDetails);
    const service = await prisma.service.findFirst({
      where: {
        service_id: parseInt(service_id),
      },
    })

    const mailOptions = {
      from: `Servico <${process.env.EMAIL}>`,
      to: service.email,
      subject: `Booking Rescheduled for ${service.title}`,
      html: `
    <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #ddd; border-radius: 8px; overflow: hidden;">
      <div style="background-color: #FFA726; color: white; padding: 20px; text-align: center;">
        <h2 style="margin: 0;">Booking Reschedule Notification</h2>
      </div>
      <div style="padding: 20px;">
        <h3 style="color: #FFA726;">Dear Service Provider,</h3>
        <p style="font-size: 16px;">
          The booking for your service, <strong style="color: #333;">${service.title}</strong>, has been rescheduled. Please review the updated details below:
        </p>
        
        <h4 style="color: #FFA726; margin-top: 20px;">Updated Booking Details:</h4>
        <ul style="list-style-type: none; padding: 0;">
          <li style="margin-bottom: 8px;"><strong>User Name:</strong> ${user.username}</li>
          <li style="margin-bottom: 8px;"><strong>User Email:</strong> <a href="mailto:${user.email}" style="color: #FFA726; text-decoration: none;">${user.email}</a></li>
          <li style="margin-bottom: 8px;"><strong>New Date:</strong> ${booking_date}</li>
        </ul>
        
        <p style="font-size: 16px; margin-top: 20px;">
          Please make a note of the new schedule, and feel free to contact the user for any further clarification.
        </p>
        <p style="font-size: 16px; margin-top: 20px;">
          Thank you for your understanding and for being a part of <strong>Servico</strong>!
        </p>
        <p style="font-size: 16px;">Best Regards,<br><strong>Servico Team</strong></p>
      </div>
      <div style="background-color: #f7f7f7; padding: 15px; text-align: center; font-size: 14px; color: #666;">
        <p style="margin: 0;">&copy; 2024 Servico. All rights reserved.</p>
      </div>
    </div>
  `,
    };

    await transporter.sendMail(mailOptions);
    console.log("Booking confirmation email sent to service provider successfully.");
    return true;
  } catch (error) {
    throw new Error("Error sending booking confirmation email: " + error);
  }
}
async function reshduleEmailToUser(service_id, bookingDetails, user) {
  try {
    const { message, booking_date } = bookingDetails;
    console.log(bookingDetails);
    const service = await prisma.service.findFirst({
      where: {
        service_id: parseInt(service_id),
      },
    })

    const mailOptions = {
      from: `Servico <${process.env.EMAIL}>`,
      to: user.email,
      subject: `Your Booking for ${service.title} Has Been Rescheduled`,
      html: `
    <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #ddd; border-radius: 8px; overflow: hidden;">
      <div style="background-color: #FFA726; color: white; padding: 20px; text-align: center;">
        <h2 style="margin: 0;">Booking Rescheduled</h2>
      </div>
      <div style="padding: 20px;">
        <p style="font-size: 16px;">Hello ${user.username},</p>
        <p style="font-size: 16px;">
          Your booking for <strong>${service.title}</strong> has been rescheduled. Here are the updated details:
        </p>
        
        <ul style="list-style-type: none; padding: 0;">
          <li><strong>New Date:</strong> ${booking_date}</li>
        </ul>
        
        <p style="font-size: 16px; margin-top: 20px;">
          If you have any questions, feel free to contact the provider directly at <a href="mailto:${service.email}" style="color: #FFA726; text-decoration: none;">${service.email}</a>.
        </p>
        
        <p style="font-size: 16px; margin-top: 20px;">Thank you for choosing <strong>Servico</strong>!</p>
      </div>
      <div style="background-color: #f7f7f7; padding: 15px; text-align: center; font-size: 14px; color: #666;">
        <p style="margin: 0;">&copy; ${new Date().getFullYear()} Servico. All rights reserved.</p>
      </div>
    </div>
  `,
    };

    await transporter.sendMail(mailOptions);
    console.log("Booking confirmation email sent to service provider successfully.");
    return true;
  } catch (error) {
    throw new Error("Error sending booking confirmation email: " + error);
  }
}
async function cancelEmailToUser(service_id, bookingDetails, user_id) {
  try {
    const { message, booking_date } = bookingDetails;
    const user = await prisma.user.findFirst({
      where: {
        user_id: parseInt(user_id),
      },
    })
    console.log(bookingDetails);
    const service = await prisma.service.findFirst({
      where: {
        service_id: parseInt(service_id),
      },
    })

    const mailOptions = {
      from: ` Servico <${process.env.EMAIL}>`,
      to: user.email,
      subject: `Your Booking for ${service.title} Has Been Canceled`,
      html: `
    <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #ddd; border-radius: 8px; overflow: hidden;">
      <div style="background-color: #FF4C4C; color: white; padding: 20px; text-align: center;">
        <h2 style="margin: 0;">Booking Canceled</h2>
      </div>
      <div style="padding: 20px;">
        <p style="font-size: 16px;">Hello ${user.username},</p>
        <p style="font-size: 16px;">
          We regret to inform you that your booking for <strong>${service.title}</strong> scheduled on <strong>${booking_date}</strong> has been <span style="color: red;">cancelled</span> by service provider.
        </p>
        
        <p style="font-size: 16px; margin-top: 20px;">
          If you have any questions or would like to reschedule, please feel free to contact us or reach out to your service provider directly at <a href="mailto:${service.email}" style="color: #FF4C4C; text-decoration: none;">${service.email}</a>.
        </p>
        
        <p style="font-size: 16px; margin-top: 20px;">We apologize for any inconvenience this may have caused. Thank you for choosing <strong>Servico</strong>.</p>
        
        <p style="font-size: 16px;">Best Regards,<br><strong>Servico Team</strong></p>
      </div>
      <div style="background-color: #f7f7f7; padding: 15px; text-align: center; font-size: 14px; color: #666;">
        <p style="margin: 0;">&copy; ${new Date().getFullYear()} Servico. All rights reserved.</p>
      </div>
    </div>
  `,
    };

    await transporter.sendMail(mailOptions);
    console.log("Booking confirmation email sent to service provider successfully.");
    return true;
  } catch (error) {
    throw new Error("Error sending booking confirmation email: " + error);
  }
}
async function acceptEmailToUser(service_id, bookingDetails, user_id) {
  try {
    const { message, booking_date } = bookingDetails;
    const user = await prisma.user.findFirst({
      where: {
        user_id: parseInt(user_id),
      },
    })
    console.log(bookingDetails);
    const service = await prisma.service.findFirst({
      where: {
        service_id: parseInt(service_id),
      },
    })

    const mailOptions = {
      from: ` Servico <${process.env.EMAIL}>`,
      to: user.email,
      subject: `Your Booking for ${service.title} Has Been Accepted`,
      html: `
        <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #ddd; border-radius: 8px; overflow: hidden;">
          <div style="background-color: #4CAF50; color: white; padding: 20px; text-align: center;">
            <h2 style="margin: 0;">Booking Accepted</h2>
          </div>
          <div style="padding: 20px;">
            <p style="font-size: 16px;">Hello ${user.username},</p>
            <p style="font-size: 16px;">
              Great news! Your booking for <strong>${service.title}</strong> has been accepted by the provider.
            </p>
            
            <p style="font-size: 16px; margin-top: 20px;">
              If you have any questions or need further assistance, feel free to reach out to the provider at <a href="mailto:${service.email}" style="color: #4CAF50; text-decoration: none;">${service.email}</a>.
            </p>
            
            <p style="font-size: 16px; margin-top: 20px;">We look forward to providing you with an excellent experience!<br>Thank you for choosing <strong>Servico</strong>.</p>
            
            <p style="font-size: 16px;">Best Regards,<br><strong>Servico Team</strong></p>
          </div>
          <div style="background-color: #f7f7f7; padding: 15px; text-align: center; font-size: 14px; color: #666;">
            <p style="margin: 0;">&copy; ${new Date().getFullYear()} Servico. All rights reserved.</p>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log("Booking confirmation email sent to service provider successfully.");
    return true;
  } catch (error) {
    throw new Error("Error sending booking confirmation email: " + error);
  }
}


async function cancelEmailToProvider(service_id, bookingDetails, user) {
  try {
    const { message, booking_date } = bookingDetails;
    console.log(bookingDetails);
    const service = await prisma.service.findFirst({
      where: {
        service_id: parseInt(service_id),
      },
    })

    const mailOptions = {
      from: `Servico <${process.env.EMAIL}>`,
      to: service.email,
      subject: `Booking Canceled for ${service.title}`,
      html: `
    <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #ddd; border-radius: 8px; overflow: hidden;">
      <div style="background-color: #FF4C4C; color: white; padding: 20px; text-align: center;">
        <h2 style="margin: 0;">Booking Canceled</h2>
      </div>
      <div style="padding: 20px;">
        <p style="font-size: 16px;">Hello Service Provider,</p>
        <p style="font-size: 16px;">
          We regret to inform you that the booking for <strong>${service.title}</strong> scheduled on <strong>${booking_date}</strong> has been <span style="color: red;">cancelled</span> by the user.
        </p>
        
        <h4 style="color: #FF4C4C; margin-top: 20px;">Canceled Booking Details:</h4>
        <ul style="list-style-type: none; padding: 0;">
          <li><strong>User Name:</strong> ${user.username}</li>
          <li><strong>User Email:</strong> ${user.email}</li>
          <li><strong>Service:</strong> ${service.title}</li>
        </ul>
        
        <p style="font-size: 16px; margin-top: 20px;">
          We apologize for any inconvenience this may have caused. Feel free to reach out if you need any assistance.
        </p>
        
        <p style="font-size: 16px; margin-top: 20px;">Best Regards,<br><strong>Servico Team</strong></p>
      </div>
      <div style="background-color: #f7f7f7; padding: 15px; text-align: center; font-size: 14px; color: #666;">
        <p style="margin: 0;">&copy; ${new Date().getFullYear()} Servico. All rights reserved.</p>
      </div>
    </div>
  `,
    };

    await transporter.sendMail(mailOptions);
    console.log("Booking confirmation email sent to service provider successfully.");
    return true;
  } catch (error) {
    throw new Error("Error sending booking confirmation email: " + error);
  }
}

export {
  sendBookingConfirmation,
  reshduleEmailToProvider,
  reshduleEmailToUser,
  cancelEmailToProvider,
  cancelEmailToUser,
  acceptEmailToUser
}
