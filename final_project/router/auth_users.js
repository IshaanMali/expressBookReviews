const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const session = require('express-session');
const regd_users = express.Router();

let users = {};

const isValid = (username)=>{
    if (username in users) {
        return false;
    }
    else {
        return true;
    }
}

const authenticatedUser = (username, password) => {
    return username in users && users[username] === password;
};

//only registered users can login
regd_users.post("/login", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
        return res.status(404).json({ message: "Error logging in" });
  }

  if (authenticatedUser(username, password)) {
        let accessToken = jwt.sign({
            data: password
        }, 'access', { expiresIn: 60 * 60 });
        req.session.authorization = {
            accessToken, username
        }
        return res.status(200).send({ message: "User successfully logged in" });
    } else {
        return res.status(208).json({ message: "Invalid Login. Check username and password" });
    }
});

// Add or modify a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const review = req.query.review;
    const username = req.session.username;

    if (!review) {
        return res.status(400).send({ message: "Review query is required" });
    }

    if (books[isbn]) {
        let book = books[isbn];

        book.reviews[username] = review;

        return res.status(200).send({
            message: "Review added/modified successfully",
        });
    } else {
        return res.status(404).send({ message: "Book not found" });
    }
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const username = req.session.username;

    if (!books[isbn]) {
        return res.status(404).send({ message: "Book not found" });
    }

    if (!books[isbn].reviews[username]) {
        return res.status(404).send({ message: "No review found for this user" });
    }

    // Delete the review
    delete books[isbn].reviews[username];

    return res.status(200).send({
        message: "Review deleted successfully"
    });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
