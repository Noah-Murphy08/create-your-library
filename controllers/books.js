const express = require('express');
const verifyToken = require('../middleware/verify-token.js')
const router = express.Router();
const Book = require('../models/book');


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
        const book = await Book.findById(req.params.bookId).populate([
            'owner',
            'comments.owner',
        ])
        res.status(200).json(book)
    } catch (error) {
        res.status(500).json(error)
    }
})

router.post('/:bookId/like/:userId', async (req, res) => {
    try {
        const book = await Book.findById(req.params.bookId)
        if (book.like.includes(req.params.userId)) {
            await Book.findByIdAndUpdate(req.params.bookId, {
                $pull: { like: req.params.userId}
            })
        } else {
            await Book.findByIdAndUpdate(req.params.bookId, {
                $push: { like: req.params.userId},
                $pull: {dislike: req.params.userId}
            })
        }
        res.status(200).json(book)
    } catch (error) {
        res.status(500).json(book)
    }
})

router.post('/:bookId/dislike/:userId', async (req, res) => {
    try {
        const book = await Book.findById(req.params.bookId)
        if (book.dislike.includes(req.params.userId)) {
            await Book.findByIdAndUpdate(req.params.bookId, {
                $pull: { dislike: req.params.userId}
            })
        } else {
            await Book.findByIdAndUpdate(req.params.bookId, {
                $push: { dislike: req.params.userId},
                $pull: { like: req.params.userId}
            })
        }
        res.status(200).json(book)
    } catch (error) {
        res.status(500).json(book)
    }
})

router.post('/:bookId/comments', async (req, res) => {
    try {
        req.body.owner = req.user._id
        const book = await Book.findById(req.params.bookId)
        book.comments.push(req.body)
        await book.save()

        const newComment = book.comments[book.comments.length - 1]
        newComment._doc.owner = req.user

        res.status(201).json(newComment)
    } catch (error) {
        res.status(500).json(error)
    }
})

router.put('/:bookId/comments/:commentId', async (req, res) => {
    try {
        const book = await Book.findById(req.params.bookId)
        const comment = book.comments.id(req.params.commentId)
        comment.text = req.body.text
        await book.save()
        res.status(200).json({ message: 'nailed it!' })
    } catch (error) {
        res.status(500).json(error)
    }
})

router.delete('/:bookId/comments/:commentId', async (req, res) => {
    try {
        const book = await Book.findById(req.params.bookId)
        book.comments.remove({ _id: req.params.commentId })
        await book.save()
        res.status(200).json({ message: 'delete comment successful'})
    } catch (error) {
        res.status(500).json(error)
    }
})


module.exports = router