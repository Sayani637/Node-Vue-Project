const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart');

let userCarts = {};

router.post('/add', async (req, res) => {
    const { userId, cardId } = req.body;

    try {
        let cart = await Cart.findOne({ userId });

        if (!cart) {
            // No cart found: create a new one
            cart = new Cart({
                userId,
                items: [{ cardId, quantity: 1 }]
            });
        } else {
            // Cart exists: check if card already in cart
            const itemIndex = cart.items.findIndex(item => item.cardId.toString() === cardId);

            if (itemIndex > -1) {
                // If card exists, increment quantity
                cart.items[itemIndex].quantity += 1;
            } else {
                // If card doesn't exist, add it
                cart.items.push({ cardId, quantity: 1 });
            }
        }

        await cart.save();

        res.status(200).json({
            message: 'Item added to cart',
            cartCount: cart.items.length
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to add to cart' });
    }
});

// Get all cart items for a user
router.get('/:userId', async (req, res) => {
    const { userId } = req.params;
    try {
        const cart = await Cart.findOne({ userId });
        if (!cart) {
            return res.status(200).json({ items: [] });
        }
        res.status(200).json(cart);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to fetch cart' });
    }
});

module.exports = router;