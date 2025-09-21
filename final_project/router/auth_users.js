const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  const { username, password } = req.body;

  // Validate input
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  // Check if user exists and password matches
  const user = users.find(u => u.username === username && u.password === password);
  if (!user) {
    return res.status(401).json({ message: "Invalid username or password" });
  }

  // Create JWT token (use a secret key, e.g., 'access')
  const accessToken = jwt.sign({ username }, 'access', { expiresIn: '1h' });

  // Save token and username in session
  req.session.authorization = { accessToken, username };

  return res.status(200).json({ message: "User logged in successfully", accessToken });

  });

// Add a book review
  regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const review = req.query.review;
    const username = req.session.authorization.username;

    if (!review) {
        return res.status(400).json({ message: "Review content is required" });
    }

    const book = books[isbn];

    if (book) {
        if (!book.reviews) {
            book.reviews = {};
        }
        // Add or update the review for the username
        book.reviews[username] = review;

        return res.status(200).json({ message: "Review successfully added/modified", reviews: book.reviews });
    } else {
        return res.status(404).json({ message: "Book not found" });
    }
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const username = req.session.authorization.username;

  const book = books[isbn];
  if (book) {
      if (book.reviews && book.reviews[username]) {
          // Delete the review by the logged-in user
          delete book.reviews[username];
          return res.status(200).json({ message: "Review deleted successfully", reviews: book.reviews });
      } else {
          return res.status(404).json({ message: "Review by this user not found" });
      }
  } else {
      return res.status(404).json({ message: "Book not found" });
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
