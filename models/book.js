const mongoose = require('mongoose')



const bookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    author: {
        type: String,
        required: true,
    },
    genre: {
        type: String,
        required: true,
        enum: ['Fantasy', 'Mystery', 'Thriller', 'Horror', 'Romance', 'Sci-Fi', 'Magical Realism', 'Realist', 'Historical']
    }
})


const Book = mongoose.model('Book', bookSchema)
module.exports = Book