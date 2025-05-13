const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    fullname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    is_verify: {
        type: Boolean,
        default: false
    },
    verificationToken: {
        type: String
    },
    otp: {
        type: String,
        default: null
    },
     otpExpires: {
        type: Date,
        default: null
    }
});

module.exports = mongoose.model('User', userSchema);