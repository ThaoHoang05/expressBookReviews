const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();
const JWT_SECRET = 'access';

let users = [{"username":"user1","password":"password1"},{"username":"user2","password":"password2"}];

const isValid = (username)=>{ 
  return !(users.includes(username));//returns boolean
//write code to check is the username is valid
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
  return users.find(user => user.username === username && user.password === password);
}

//only registered users can login
regd_users.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  if (authenticatedUser(username, password)) {
    // Payload nên đặt key rõ ràng là "username"
    const token = jwt.sign(
      { username: username },    // 👈 thay vì {data: username}
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    return res.json({
      username: username,
      token: token,
      message: "User successfully logged in"
    });
  }

  return res.status(401).json({ message: "Invalid Login. Check username and password" });
});


// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const review = req.body.review;
  const username = req.username; 
  console.log(username);// 👈 lấy từ JWT thay vì session

  if (!username) {
    return res.status(401).json({ 
      information: username,
      message: "You must be logged in to post a review" });
  }

  if (!isbn || !review) {
    return res.status(400).json({ message: "ISBN and review are required" });
  }

  if (books[isbn]) {
    books[isbn].reviews = books[isbn].reviews || {};
    books[isbn].reviews[username] = review;

    return res.status(200).json({
      information: username,
      message: "Review added/updated successfully",
      book: books[isbn]
    });
  }

  return res.status(404).json({ message: "Book not found" });
});


regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const username = req.username; 
  console.log(username);

  if (!username) {
    return res.status(401).json({ message: "You must be logged in to delete a review" });
  }

  if (books[isbn] && books[isbn].reviews && books[isbn].reviews[username]) {
    delete books[isbn].reviews[username];
    return res.status(200).json({
      message: "Review deleted successfully",
      book: books[isbn]
    });
  }

  return res.status(404).json({ message: "Book or review not found" });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
