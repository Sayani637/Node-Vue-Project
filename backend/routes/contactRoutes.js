const express = require('express');
const router = express.Router();
const { sendContactMail } = require('../utils/contactMail');

router.post('/send-email', async (req, res) => {
    const { name, email, mobile, subject, message } = req.body;
    try {
       await sendContactMail({ name, email, mobile, subject, message }) ;
       res.status(200).json({ message: 'Email sent successfully.' });
    } catch (error) {
        console.error('Email sending failed:', error);
        res.status(500).json({ message: 'Failed to send email.' });
    }
});

module.exports = router;