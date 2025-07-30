const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


// Route to serve books directly
public_users.get('/books', (req, res) => {
    res.json(books);
  });

public_users.post("/register", (req,res) => {
    const { username, password } = req.body;
    console.log(username, password);
    if (!username || !password) {
        res.status(404).send({ message: "Username or password not entered" });
    } else {
        if (isValid(username)) {
            users[username] = password;
            return res.status(201).send({ message: "User registered successfully" });
        } else {
            res.status(404).send({ message: "Username already taken" });
        }
    }
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
   res.send(JSON.stringify(books, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  let isbn = req.params.isbn;
  if (books[isbn]) {
    res.send(JSON.stringify(books[isbn], null, 4));
  } else {
    res.status(404).send({ message: "Book not found" });
  }
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  let authorToCheck = req.params.author;
  let books_by_author = [];
  Object.keys(books).forEach((id) => {
    let book = books[id];
    if (book.author === authorToCheck) {
        books_by_author.push(book);
    }
  })
  console.log(books_by_author);
  if (books_by_author.length > 0) {
    res.send(JSON.stringify(books_by_author, null, 4));
  } else {
    res.status(404).send({ message: "Book/s not found" });
  }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    let titleToCheck = req.params.title;
    let books_by_title = [];
    Object.keys(books).forEach((id) => {
      let book = books[id];
      if (book.title === titleToCheck) {
          books_by_title.push(book);
      }
    })
    if (books_by_title.length > 0) {
        res.send(JSON.stringify(books_by_title, null, 4));
      } else {
        res.status(404).send({ message: "Book/s not found" });
      }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    let isbn = req.params.isbn;
    if (books[isbn]) {
      res.send(JSON.stringify(books[isbn].reviews, null, 4));
    } else {
      res.status(404).send({ message: "Book not found" });
    }
});

module.exports.general = public_users;
