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

const sendContactMail = async ({ name, email, mobile, subject, message }) => {
     const mailOptions = {
        from: '"Reaching out Message" <sayani2023paul@gmail.com>',
        to: email,
        subject: `Thank You to reaching out for ${subject}`,
        text: `
          Hi ${name},
            We appreciate you getting in touch with us. Here's a copy of the message you sent:

            "${message}"

            Our team will review it and respond shortly if further information is needed.  
            If necessary, we may contact you at ${mobile}.

            Kind regards,  
        `,
     };
     return transporter.sendMail(mailOptions);
};

module.exports = {
    sendContactMail
};