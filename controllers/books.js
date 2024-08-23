const express = require('express');
const verifyToken = require('../middleware/verify-token');
const Book = require('../models/book');
const router = express.Router()


router.use(verifyToken);


router.post('/', async (req, res) => {
    try {
        req.body.owner = req.user._id
        const book = await Book.create(req.body)
        book._doc.owner = req.user
        res.status(201).json(book)
    } catch (error) {
        res.status(500).json(error)
    }
})

router.get('/', async (req, res) => {
    try {
        const books = await Book.find({})
            .populate('owner')
            .sort({ genre: -1 })
        res.status(200).json(books)
    } catch (error) {
        res.status(500).json(error)
    }
})

router.get('/:bookId', async (req, res) => {
    try {
        const book = await Book.findById(req.params.bookId).populate('owner')
        res.status(200).json(book)
    } catch (error) {
        res.status(500).json(error)
    }
})


module.exports = router;