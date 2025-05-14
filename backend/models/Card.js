const mongoose = require('mongoose');

const cardSchema = mongoose.Schema({
    title: String,
    description: String,
    imageUrl: String,
    price: Number,
}, {timestamps: true});

module.exports = mongoose.model('Card', cardSchema);