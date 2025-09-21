const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
  res.send(JSON.stringify(books, null, 4)); 
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;  // Get the ISBN from request parameters
  if (books[isbn]) {
    res.send(JSON.stringify(books[isbn], null, 4));  // Send book details as pretty JSON
  } else {
    res.status(404).json({ message: "Book not found" });
  }
});
  
// Get book details based on author
public_users.get('/author/:author', function (req, res) {
  const author = req.params.author;
  const booksByAuthor = [];

  // Get all ISBN keys
  const bookKeys = Object.keys(books);

  // Iterate through books and check for matching author
  bookKeys.forEach((isbn) => {
    if (books[isbn].author.toLowerCase() === author.toLowerCase()) {
      booksByAuthor.push(books[isbn]);
    }
  });

  if (booksByAuthor.length > 0) {
    res.send(JSON.stringify(booksByAuthor, null, 4)); // Pretty print JSON
  } else {
    res.status(404).json({ message: "No books found by that author" });
  }
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title.toLowerCase();
  const booksByTitle = [];

  // Get all ISBN keys
  const bookKeys = Object.keys(books);

  // Iterate through books and check for matching title
  bookKeys.forEach((isbn) => {
    if (books[isbn].title.toLowerCase() === title) {
      booksByTitle.push(books[isbn]);
    }
  });

  if (booksByTitle.length > 0) {
    res.send(JSON.stringify(booksByTitle, null, 4)); // Pretty print JSON
  } else {
    res.status(404).json({ message: "No books found with that title" });
  }
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;

  if (books[isbn]) {
    res.send(JSON.stringify(books[isbn].reviews, null, 4)); // Pretty print JSON reviews
  } else {
    res.status(404).json({ message: "Book not found" });
  }
});

module.exports.general = public_users;
