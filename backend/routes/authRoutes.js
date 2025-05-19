const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const User = require('../models/User');
const { generateToken } = require('../utils/generateToken');
const { sendVerificationEmail } = require('../utils/mailer');
const { generateOTP } = require('../utils/otpGenerator');
const { sendOtpEmail } = require('../utils/otpmailer');
const { sendResetPasswordEmail } = require('../utils/resetPasswordMailer');

// Sign up route
router.post('/signup', async (req, res) => {
    const { fullname, email, password } = req.body;
    try {
        const existingUser = await User.findOne({ email });
        if(existingUser){
            return res.status(400).json({ message: 'User already exists' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const verificationToken = Math.random().toString(36).substring(2);
        const user = new User({ fullname, email, password: hashedPassword, verificationToken: verificationToken });
        await user.save();

        await sendVerificationEmail(email, fullname, verificationToken);

        // ✅ Generate JWT token
        const token = generateToken(user);
        user.token = token;
        await user.save();
        res.cookie('token', token);

        res.status(201).json({ message: 'User Created Successfully & Verification email sent.', token });
    } catch (err) {
         res.status(500).json({ message: 'Server error', error: err.message });
    }
});

// GET /api/auth/verify/:token
router.get('/verify/:token', async (req, res) => {
    const { token } = req.params;
    try {
        const user = await User.findOne({ verificationToken: token });
        if(!user){
            return res.status(400).send('Invalid or expired varification link.');
        }
        user.is_verify = true;
        user.verificationToken = null;
        await user.save();
        res.send(`<h2>User verified successfully!</h2>`);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// Login route
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if(!user){
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        if(!user.is_verify){
            return res.status(403).json({ message: 'Please verify your email before logging in.' });
        }
        // Generate JWT token
        const token = generateToken(user);
        res.cookie('token', token);

        // Generate and store OTP
        const otp = generateOTP();
        user.otp = otp;
        user.otpExpires = Date.now() + 5 * 60 * 1000;
        await user.save();
        await sendOtpEmail(user.email, otp);

        return res.status(200).json({ message: 'OTP sent to email', step: 'otp', role: user.role  });
    } catch (err) {
        return res.status(500).json({ message: 'Server error' });
    }
});

// Verify otp
router.post('/verify-otp', async (req, res) => {
    const { email, otp } = req.body;
    try {
        const user = await User.findOne({ email });
        if(!user || user.otp !== otp.toString() || Date.now() > user.otpExpires) {
            return res.status(400).json({ message: 'Invalid or expired OTP' });
        }
        // Clear OTP
        user.otp = null;
        user.otpExpires = null;
        await user.save();
        return res.status(200).json({ message: 'OTP verified' });
    } catch (err) {
        return res.status(500).json({ message: 'Server error' });
    }
});

// Forgot password route
router.post('/forgot-password', async (req, res) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user){
            return res.status(400).json({ message: 'No account found with this email.' });
        }
        const resetToken = crypto.randomBytes(32).toString('hex');
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpires = Date.now() + 60 * 60 * 1000;
        await user.save();
        
        await sendResetPasswordEmail(email, resetToken);
        res.status(200).json({ message: 'Password reset email sent.' });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

//POST /reset-password/:token
router.post('/reset-password/:token', async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;
    try {
        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() }
        });
        if(!user){
            return res.status(400).json({ message: 'Invalid or expired token.' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        user.password = hashedPassword;
        user.resetPasswordToken = null;
        user.resetPasswordExpires = null;
        await user.save();
        res.status(200).json({ message: 'Password reset successfully.' });
    } catch (err) {
       res.status(500).json({message: 'Server error' }); 
    }
})

module.exports = router;