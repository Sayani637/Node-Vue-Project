const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport(
    {
        host: "smtp.gmail.com",
        port: 465,
        secure: true, 
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    }
);

const sendOtpEmail = async (email, otp) => {
    const otpmailoption = {
        from: '"App OTP" <sayani2023paul@gmail.com>',
        to: email,
        subject: "OTP Verification",
        html: `<div style="max-width: 400px; margin: auto; padding: 30px; background-color: #ffffff; border-radius: 8px; text-align: center; font-family: Arial, sans-serif; box-shadow: 0 4px 10px rgba(0,0,0,0.1);">
        <div style="margin-bottom: 20px;">
            <img src="https://png.pngtree.com/png-clipart/20250112/original/pngtree-secure-email-icon-with-lock-symbol-png-image_19116470.png" alt="OTP Icon" width="60" height="60">
        </div>
        <h2 style="color: #333333; margin: 0;">Here is your One Time Password</h2>
        <p style="color: #666666; margin: 8px 0 24px;">for login</p>
        <div style="font-size: 40px; font-weight: bold; color: #333333;">${otp}</div>
        <p style="color: #f44336; margin-top: 20px;">Valid for 5 minutes only</p>
        </div>
        `,
    };
     try {
        await transporter.sendMail(otpmailoption);
    } catch (error) {
        console.error('Error sending email:', error);
    }
};

module.exports = {
    sendOtpEmail
};