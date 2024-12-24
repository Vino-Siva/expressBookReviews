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
  let { username, password } = req.body;
  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Username and password are required" });
  }
  if (typeof username !== "string" || typeof password !== "string") {
    return res
      .status(400)
      .json({ message: "Username and password must be strings" });
  }
  if (!isValid(username)) {
    return res.status(400).json({ message: "Invalid username" });
  }
  if (!authenticatedUser(username, password)) {
    return res.status(400).json({ message: "Invalid username or password" });
  }
  try {
    let accessToken = jwt.sign({ username }, "access");
    req.session.authorization = { accessToken };
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
  return res.status(200).json({ message: "User logged in successfully" });
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const book = books[isbn];

  // Check exist book by isbn
  if (book) {
    const bookReviews = Object.keys(book.reviews);
    let userReview = false;
    let indexReview = 0;
    const username = req.session.authorization["username"];
    const content = req.query.content;

    bookReviews.forEach((index) => {
      if (book.reviews[index].username === username) {
        userReview = true;
        indexReview = index;
      }
    });

    // Update
    if (userReview) {
      book.reviews[indexReview].content = content;

      res.send(`Reviews of the book with isbn ${isbn} updated.`);
      // Create
    } else {
      book.reviews[bookReviews.length + 1] = { username, content };

      res.send(`Reviews of the book with isbn ${isbn} added.`);
    }
  } else {
    res.status(404).json({ message: "Unable to find book" });
  }
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  const { isbn } = req.params;
  const username = req.session.authorization["username"];
  const book = books[isbn];

  if (book) {
    const index = Object.entries(book.reviews).findIndex(
      ([, review]) => review.username === username
    );

    if (index >= 0) {
      delete book.reviews[index];
      res.send(`Reviews of the book with isbn ${isbn} deleted.`);
    } else {
      res.status(404).json({ message: "Unable to find review" });
    }
  } else {
    res.status(404).json({ message: "Unable to find book" });
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
