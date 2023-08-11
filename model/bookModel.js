const mongoose= require('mongoose');

//create Schemea
const bookSchema = new mongoose.Schema({
    bookName: String,
    author: String,
    year: String,
    bookId: String,
    rating: Number
});

//create a collection called books in MongoDB
const Book = mongoose.model("book", bookSchema);

module.exports = Book;