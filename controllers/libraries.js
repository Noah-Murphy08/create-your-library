const express = require('express');
const verifyToken = require('../middleware/verify-token');
const router = express.Router()
const Library = require('../models/library')


router.use(verifyToken)


router.post('/', async (req, res) => {
    try {
        req.body.owner = req.user._id
        const library = await Library.create(req.body)
        library._doc.owner = req.user
        res.status(201).json(library)
    } catch (error) {
        res.status(500).json(error)
    }
})

router.get('/', async (req, res) => {
    try {
        const libraries = await Library.find({}).populate('owner')
        res.status(200).json(libraries)
    } catch (error) {
        res.status(500).json(error)
    }
})

router.get('/:libraryId', async (req, res) => {
    try {
        const library = await Library.findById(req.params.libraryId).populate('owner')
        res.status(200).json(library)
    } catch (error) {
        res.status(500).json(error)
    }
})

router.put('/:libraryId', async (req, res) => {
    try {
        const library = await Library.findById(req.params.libraryId)

        if (!library.owner.equals(req.user._id)) {
            return res.status(403).send('No touchy')
        }

        const updatedLibrary = await Library.findByIdAndUpdate(
            req.params.libraryId,
            req.body,
            { new: true }
        )
        updatedLibrary._doc.owner = req.user
        res.status(200).json(updatedLibrary)
    } catch (error) {
        res.status(500).json(error)
    }
})

router.delete('/:libraryId', async (req, res) => {
    try {
        const library = await Library.findById(req.params.libraryId)

        if (!library.owner.equals(req.user._id)) {
            return res.status(403).send('No touchy')
        }

        const deletedLibrary = await Library.findByIdAndDelete(req.params.libraryId)
        res.status(200).json(deletedLibrary)
    } catch (error) {
        res.status(500).json(error)
    }
})


module.exports = router