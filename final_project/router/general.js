const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Username and password are required" });
  }
  if (isValid(username)) {
    return res.status(400).json({ message: "Username already exists" });
  }
  users.push({ username, password });
  return res.status(200).json({ message: "User registered successfully" });
});

public_users.get("/", function (req, res) {
  //  Send JSON response with formatted books data
  if (books === null || books === undefined) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
  res.send(JSON.stringify(books, null, 2));
});

public_users.get("/isbn/:isbn", function (req, res) {
  // Get book details based on ISBN
  let isbn = req.params.isbn;
  let book = books[isbn];
  if (book) {
    return res.status(200).json(book);
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

// Get book details based on author
public_users.get("/author/:author", (req, res) => {
  const { author } = req.params; // Extract the author parameter

  try {
    const booksByAuthor = Object.values(books).filter(
      (book) => book?.author === author
    );

    if (booksByAuthor.length === 0) {
      return res
        .status(404)
        .json({ message: "No books found by this author." });
    }

    return res.status(200).json(booksByAuthor);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
});

// Get all books based on title
public_users.get("/title/:title", function (req, res) {
  const { title } = req.params; // Extract the title parameter

  if (!title) {
    return res.status(400).json({ message: "Title is required" });
  }

  try {
    const booksByTitle = Object.values(books).filter((book) =>
      book?.title?.toLowerCase().includes(title.toLowerCase())
    );

    if (booksByTitle.length === 0) {
      return res
        .status(404)
        .json({ message: "No books found with this title." });
    }

    return res.status(200).json(booksByTitle);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  // Get the book name and reviews based on ISBN provided in the request parameters.
  const { isbn } = req.params;
  const book = books[isbn];

  if (!book) {
    return res.status(404).json({ message: "Book not found" });
  }

  if (!book.reviews) {
    return res.status(404).json({ message: "No reviews found for the book" });
  }

  return res.status(200).json({ title: book.title, reviews: book.reviews });
});

module.exports.general = public_users;
