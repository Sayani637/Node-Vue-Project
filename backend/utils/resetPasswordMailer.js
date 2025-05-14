const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport(
    {
        host: 'smtp.gmail.com',
        port: 465,
        secure: true, 
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    }
);

const sendResetPasswordEmail = async (email, token) => {
    const resetLink = `http://localhost:5173/reset-password/${token}`;
    const mailOptions = {
        from: '"Password Reset" <sayani2023paul@gmail.com>',
        to: email,
        subject: "Password Reset",
       html: `
            <div style="font-family: Arial, sans-serif; background-color: #f7f9fc; padding: 40px 0;">
                <div style="max-width: 600px; margin: auto; background-color: #ffffff; border-radius: 10px; box-shadow: 0 0 10px rgba(0,0,0,0.05); padding: 30px; text-align: center;">
                <div style="margin-bottom: 20px;">
                    <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSBbYrpuP5oTHQXP5dHsn2Oym_cW-yjwdr4wQ&s" alt="Logo" style="height: 50px;">
                </div>
                <h2 style="color: #2c3e50; font-size: 24px; margin-bottom: 20px;">Password Reset</h2>
                <p style="color: #333; font-size: 16px; margin: 20px 0;">
                    Seems like you forgot your password for Logo Inc. If this is true, click below to reset your password.
                </p>
                <a href="${resetLink}" style="display: inline-block; background-color: #007bff; color: #ffffff; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: bold; font-size: 16px;">
                    Reset My Password
                </a>
                <p style="color: #666; font-size: 14px; margin-top: 30px;">
                    If you did not forget your password, you can safely ignore this email.
                </p>
                </div>
            </div>
            `,
    };
    try {
        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error('Error sending email:', error);
    }
};

module.exports = {
    sendResetPasswordEmail
};