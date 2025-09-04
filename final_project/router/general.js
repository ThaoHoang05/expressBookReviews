const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const axios = require('axios');
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;
  if(username == null || password == null){
    return res.status(400).json({message: "Username and password are required"});
  }
  else{ 
    if(isValid(username)){
    users.push({"username": username, "password": password});
    }else{
    res.send("User already exists");
  }
  return res.status(200).json({message: "User successfully registered"});
  }
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  res.send(JSON.stringify(books,null,4));
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  if(isbn){
    res.send(books[isbn]);
  }
  return res.status(300).json({message: "Yet to be implemented"});
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  const author = req.params.author;
  if(author){
    const filteredBooks = Object.values(books).filter(book => book.author.toLowerCase() === author.toLowerCase());
    res.send(filteredBooks);
  }
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  const title = req.params.title;
  if(title){
    const filteredBooks = Object.values(books).filter(book => book.title.toLowerCase() === title.toLowerCase());
    res.send(filteredBooks);
  }
  return res.status(300).json({message: "Yet to be implemented"});
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  if(isbn && books[isbn]){
    res.send(books[isbn].reviews);
  }
  return res.status(300).json({message: "Yet to be implemented"});
});
public_users.get('/books-promise', (req, res) => {
  // Simulate async with axios (or any async operation)
  axios.get('http://localhost:5000/')
    .then(response => {
      res.status(200).json(response.data);
    })
    .catch(error => {
      res.status(500).json({ message: "Error fetching books", error: error.message });
    });
});

public_users.get('/isbn-promise/:isbn', (req, res) => {
  const isbn = req.params.isbn;
  axios.get(`http://localhost:5000/isbn/${isbn}`)
    .then(response => {
      res.status(200).json(response.data);
    })
    .catch(error => {
      res.status(500).json({ message: "Error fetching book by ISBN", error: error.message });
    });});

public_users.get('/author-promise/:author', (req, res) => {
  const author = req.params.author;
  axios.get(`http://localhost:5000/author/${author}`).then(response =>{
    res.status(200).json(response.data);
  })
  .catch(error => {
    res.status(500).json({ message: "Error fetching book by author", error: error.message });
  });});
module.exports.general = public_users;
