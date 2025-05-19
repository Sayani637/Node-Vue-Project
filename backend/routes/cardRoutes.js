const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Card = require('../models/Card');

// Set up multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); 
    }
});
const upload = multer({ storage: storage });

// POST /api/cards
router.post('/', upload.single('image'), async (req, res) => {
    try {
        const { title, description, price } = req.body;
        const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

        const newCard = new Card({
            title,
            description,
            price: parseFloat(price),
            imageUrl,
        });

        await newCard.save();
        res.status(201).json({ message: 'Card created', card: newCard });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to create card' });
    }
});

// GET /api/cards
router.get('/', async (req, res) => {
    try {
        const cards = await Card.find();
        res.json(cards);
    } catch (err) {
       console.log(err);
       res.status(500).json({ error: 'Failed to fetch cards' }); 
    }
});

// PUT /api/cards/:id
router.put('/:id', upload.single('image'), async(req, res) => {
    try {
        const { title, description, price } = req.body;
        const { id } = req.params;

        const updateData = {
            title,
            description,
            price: parseFloat(price),
        };
        if(req.file){
            updateData.imageUrl = `/uploads/${req.file.filename}`;
        }
        const updateCard = await Card.findByIdAndUpdate(id, updateData, { new: true });
        if(! updateCard){
            return res.status(404).json({ error: 'Card not found' })
        }
        res.json({ message: 'Card updated Successfully', card: updateCard });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to update card' });
    }
});

//DELETE /api/cards/:id
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const deletedCard = await Card.findByIdAndDelete(id);
        if (!deletedCard) {
            return res.status(404).json({ error: 'Card not found' });
        }

        res.json({ message: 'Card deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to delete card' });
    }
});

// GET /api/cards/:id
router.get('/:id', async (req, res) => {
    try {
        const card = await Card.findById(req.params.id);
        if(!card){
            return res.status(404).json({ error: 'Card not found' });
        }
        res.json(card);
    } catch (err) {
       console.error('Error fetching card by ID:', err);
       res.status(500).json({ error: 'Server error' }); 
    }
});

module.exports = router;
