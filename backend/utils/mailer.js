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

const sendVerificationEmail = async (toEmail, name, token) => {
    const link = `http://localhost:3000/api/auth/verify/${token}`;
    const mailOptions = {
        from: '"App Verification" <sayani2023paul@gmail.com>',
        to: toEmail,
        subject: "Email Verification",
        html: `<div style="max-width:600px;margin:0 auto;border:1px solid #ddd;font-family:Arial,sans-serif;">
            <div style="background-color:#e74c3c;padding:40px 0;text-align:center;">
                <img src="https://i.pinimg.com/736x/61/76/16/617616eaa2cb8cdf5fe02dfde88632de.jpg" alt="Mail Icon" width="60" height="60" style="background:white;padding:10px;border-radius:50%;" />
            </div>
            <div style="padding:30px;text-align:left;color:#2c3e50;">
                <h2 style="margin-top:0;">Email verification</h2>
                <p>Hi ${name},</p>
                <p>Simply click the link below to verify your email address and get started. The link expires in 48 hours.</p>
                <div style="margin:30px 0;text-align:center;">
                <a href="${link}" style="background-color:#e74c3c;color:#fff;text-decoration:none;padding:15px 25px;border-radius:5px;font-weight:bold;display:inline-block;">
                    Verify my email address
                </a>
                </div>
            </div>
            <div style="border-top:1px solid #ddd;padding:20px;text-align:center;font-size:12px;color:#aaa;">
                If you didn’t request this, please ignore this email.
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
    sendVerificationEmail
};