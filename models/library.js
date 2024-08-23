const mongoose = require('mongoose')

const librarySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    location: {
        type: String,
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    books: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Books'
    }
})


const Library = mongoose.model('Library', librarySchema)

module.exports = Library