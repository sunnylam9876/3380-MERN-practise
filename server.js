const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const Book = require('./model/bookModel');      //Book schema

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());       //must have for json body

const BookData = require('./data/BookData');

//--------------------------------------------------------------------------------
//connection to MongoDB
const uri = 'mongodb://127.0.0.1:27017/myBookDB';
mongoose.connect(uri);
const connection = mongoose.connection;
connection.once('open', () => {
    console.log('MongoDB database connection established successfullly');
});
//--------------------------------------------------------------------------------
//REST API

//-----------------------------------------------------------------
//get all book information
app.get('/', (req, res) => {
    Book.find()
        .then((books) => {
            res.json(books);
            console.log("All books fetched");
        })
        .catch((err) => {
            res.status(400).json('Error: ' + err);
            console.log("Fetch all book data error");
        })
});

//-----------------------------------------------------------------
//get data from BookData and put it in database
app.get('/init', async (req, res) => {
    try {
        await Book.deleteMany({});
        //console.log(BookData);
        await Book.insertMany(BookData.bookInfo);
        res.json({message: "Data initialized"});
        console.log("Data initialized");
    } catch(err) {
        res.status(500),json({message: "Error initialization ", error: err});
        console.log("Error initialization ", err);
    }
});

//-----------------------------------------------------------------
//get a book information by Book ID
app.get('/getbookid/:id', (req, res) => {
    console.log('Getting book information...Book id: ' + req.params.id);
    //Book.findById(req.params.id)

    Book.find({bookId: req.params.id})
        .then((book) => {
            res.json(book)
            console.log("Book found: " + book)
        })
        .catch((err) => {
                res.status(400).json({message: 'Getting book has error: ', error: err})
        })
        
});

//-----------------------------------------------------------------
//get a book information by _id
app.get('/get/:id', (req, res) => {
    console.log('Getting book information..._id: ' + req.params.id);
    //Book.findById(req.params.id)

    Book.findById(req.params.id)
        .then((book) => {
            res.json(book)
            console.log("Book found: " + book)
        })
        .catch((err) => {
                res.status(400).json({message: 'Getting book has error: ', error: err})
        })
        
});


//-----------------------------------------------------------------
//add a new book to database
app.post('/add', async (req, res) => {
    console.log("Add new book....");

/*     const bookName = req.body.bookName;
    const author = req.body.author;
    const year = req.body.year;
    const bookId = req.body.bookId;
    const rating = req.body.rating; */

    const {bookName, author, year, bookId, rating} = req.body;

    const newBook = new Book({
        bookName,
        author,
        year,
        bookId,
        rating
    });

    await newBook
        .save()
        .then(() => {
            res.json({message: `Added new book, bookId: ${bookId}`});
            console.log('Added new book, bookId: ' + bookId);
        })
        .catch((err) => {
            res.status(400).json({message: 'Add book error: ', error: err});
            console.log('Add book error: ' + err);
        });    
});

//-----------------------------------------------------------------
//update a book information by ID
app.post('/update', (req, res) => { 

    const {_id, bookName, author, year, bookId, rating} = req.body;

    console.log('Updating book information, BookId: ' + _id);

    Book.findById(_id)
        .then((bookForUpdate) => {
            bookForUpdate.bookName = bookName;
            bookForUpdate.author = author;
            bookForUpdate.year = year;
            bookForUpdate.rating = rating;

            bookForUpdate
                .save()
                .then(() => res.json({message: 'Book updated'}))
                .catch((err) => {
                    res.status(400).json({message: `Erorr when udpating book, Id: ${_id}`})
                    console.log("Error in updating book: " + err);
                } )
        })
        .catch((err) => {
            res.status(400).json({message: `Erorr when udpating book, Id: ${_id}`})
            console.log("Error in updating book: " + err);
        });
});

//-----------------------------------------------------------------
//delete a book information by ID
app.delete('/delete', (req, res) => {
    console.log("Deleting book Id: " + req.body._id);
    Book.findByIdAndDelete(req.body._id)
        .then(() => {
            res.status(200).json('Book deleted.')
        })
        .catch((err) => {
            res.status(400).json({message: `Error when deleting book, Id: ${req.body._id}`})
        })
});


/*
const bookSchema = new mongoose.Schema({
    book: String,
    author: String,
    year: String,
    bookId: String,
    rating: Number
});
*/



app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});

