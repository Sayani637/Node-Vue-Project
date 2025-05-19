const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart');

let userCarts = {};

router.post('/add', async (req, res) => {
    const { userId, cardId } = req.body;
    try {
        let cartItem = await Cart.findOne({ userId, cardId });
        if(cartItem) {
            cartItem.quantity += 1;
            await cartItem.save();
        } else {
            cartItem = await Cart.create({ userId, cardId });
        }
        const cartCount = await Cart.countDocuments({ userId });
         res.status(200).json({ message: 'Item added to cart', cartCount });
    } catch (err) {
       console.error(error);
        res.status(500).json({ message: 'Failed to add to cart' }); 
    }
});

// Get all cart items for a user
router.get('/:userId', async (req, res) => {
    const { userId } = req.params;
    try {
        const cartItems = await Cart.find({ userId });
        res.status(200).json(cartItems);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to fetch cart' });
    }
});

module.exports = router;