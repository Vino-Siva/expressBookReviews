const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
  //write code to check if username is valid
  let user = users.find((user) => user.username === username);
  if (user) {
    return true;
  } else {
    return false;
  }
};

const authenticatedUser = (username, password) => {
  //write code to check if username and password match the one we have in records
  let user = users.find((user) => user.username === username);
  if (user && user.password === password) {
    return true;
  } else {
    return false;
  }
};

regd_users.post("/login", (req, res) => {
  // only registered users can login
  return res.status(300).json({ message: "Yet to be implemented" });
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  return res.status(300).json({ message: "Yet to be implemented" });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
