require('dotenv').config();
const express = require('express');
const router = express.Router();
const paypal = require('paypal-rest-sdk');

const { PAYPAL_MODE, PAYPAL_CLIENT_KEY, PAYPAL_SECRET_KEY } = process.env;

paypal.configure({
    'mode': PAYPAL_MODE, //sandbox or live
    'client_id': PAYPAL_CLIENT_KEY,
    'client_secret': PAYPAL_SECRET_KEY
});

// Create PayPal Payment
router.post('/create-payment', async (req, res) => {
    const { items } = req.body;

    const totalAmount = items.reduce((sum, item) => sum + item.cardId.price * item.quantity, 0);

    const create_payment_json = {
        intent: 'sale',
        payer: { payment_method: 'paypal' },
        redirect_urls: {
            return_url: 'http://localhost:5173/payment-success',
            cancel_url: 'http://localhost:5173/payment-cancel'
        },
        transactions: [{
            item_list: {
                items: items.map(item => ({
                    name: item.cardId.title,
                    sku: item.cardId._id,
                    price: item.cardId.price.toFixed(2),
                    currency: "USD",
                    quantity: item.quantity
                }))
            },
            amount: {
                currency: "USD",
                total: totalAmount.toFixed(2)
            },
            description: "Purchase from Card Store"
        }]
    };
    paypal.payment.create(create_payment_json, function (error, payment) {
        if (error) {
            console.error(error);
            res.status(500).json({ error: "Payment creation failed" });
        } else {
            const approvalUrl = payment.links.find(link => link.rel === 'approval_url');
            res.json({ approvalUrl: approvalUrl.href });
        }
    });
});

// POST /api/paypal/buy-now
router.post('/buy-now', async (req, res) => {
    const { item } = req.body;
    const create_payment_json = {
        intent: 'sale',
        payer: {
            payment_method: 'paypal'
        },
        redirect_urls: {
            return_url: 'http://localhost:5173/payment-success',
            cancel_url: 'http://localhost:5173/payment-cancel'
        },
        transactions: [{
            item_list: {
                items: [{
                    name: item.title,
                    sku: item._id,
                    price: item.price,
                    currency: 'USD',
                    quantity: 1
                }]
            },
            amount: {
                currency: 'USD',
                total: item.price
            },
            description: `Buy Now for ${item.title}`
        }]
    };

    paypal.payment.create(create_payment_json, function (error, payment) {
        if(error) {
            console.error(error);
            return res.status(500).json({ error: 'Payment creation failed' });
        } else {
            const approvalUrl = payment.links.find(link => link.rel === 'approval_url').href;
            res.json({ approvalUrl });
        }
    });
});

// Success route 
// router.get('/success', (req, res) => {
//     res.send('Payment Successful!');
// });

// Cancel route
// router.get('/cancel', (req, res) => {
//     res.send('Payment Cancelled.');
// });

module.exports = router;
