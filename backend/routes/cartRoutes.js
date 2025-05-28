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
                cart.items[itemIndex].quantity += 1;
            } else {
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
        const cart = await Cart.findOne({ userId }).populate('items.cardId');
        if (!cart) {
            return res.status(200).json({ items: [] });
        }
        res.status(200).json(cart);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to fetch cart' });
    }
});

// Update quantity of a specific cart item (increment or decrement)
router.put('/update', async (req, res) => {
    const { userId, cardId, quantity } = req.body;
    if(quantity < 1) {
        return res.status(400).json({ message: 'Quantity must be at least 1' });
    }
    try {
        const cart = await Cart.findOne({ userId });
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }
        const item = cart.items.find(item => item.cardId.toString() === cardId);
         if (!item) {
            return res.status(404).json({ message: 'Item not found in cart' });
        }
        item.quantity = quantity;
        await cart.save();
        res.status(200).json({ message: 'Cart updated successfully', items: cart.items });
    } catch (err) {
        console.error(error);
        res.status(500).json({ message: 'Failed to update quantity' });
    }
});

// Remove an item from the cart
router.delete('/remove', async (req, res) => {
    const { userId, cardId } = req.body;
    try {
        const cart = await Cart.findOne({ userId });
        if(!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }
        cart.items = cart.items.filter(item => item.cardId.toString() !== cardId);
        await cart.save();
        res.status(200).json({ message: 'Item removed', items: cart.items });
    } catch (err) {
        console.error(error);
        res.status(500).json({ message: 'Failed to remove item' });
    }
});

module.exports = router;