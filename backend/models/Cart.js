const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    cardId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Card',
        required: true
    },
    quantity: {
        type: Number,
        default: 1
    }
}, { timestamps: true });

module.exports = mongoose.model('Cart', cartSchema);