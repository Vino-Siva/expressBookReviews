const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require("axios");

const endPoint =
  "https://vinothparama-5000.theianext-0-labs-prod-misc-tools-us-east-0.proxy.cognitiveclass.ai/";

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

// Get all books Task 1
// public_users.get("/", function (req, res) {
//   //  Send JSON response with formatted books data
//   if (books === null || books === undefined) {
//     return res.status(500).json({ message: "Internal Server Error" });
//   }
//   res.send(JSON.stringify(books, null, 2));
// });

// Get all books Task 10
public_users.get("/", function (req, res) {
  const getBooks = new Promise((resolve, reject) => {
    if (books === null || books === undefined) {
      reject(new Error("Internal Server Error"));
    } else {
      resolve(books);
    }
  });

  getBooks
    .then((books) => res.send(JSON.stringify(books, null, 2)))
    .catch((err) => res.status(500).json({ message: err.message }));
});

// // Get book details based on ISBN - Task 2
// public_users.get("/isbn/:isbn", function (req, res) {
//   // Get book details based on ISBN
//   const { isbn } = req.params;
//   const book = books[isbn];
//   if (book) {
//     return res.status(200).json(book);
//   } else {
//     return res.status(404).json({ message: "Book not found" });
//   }
// });

// Get book details based on ISBN Using Axios - Task 11
public_users.get("/isbn/:isbn", async function (req, res) {
  // Get book details based on ISBN
  const { isbn } = req.params;

  try {
    const { data: booksData } = await axios.get(endPoint);

    if (booksData === null || booksData === undefined) {
      throw new Error("Failed to get book data");
    }

    const book = booksData[isbn];

    if (book === null || book === undefined) {
      return res.status(404).json({ message: "Book not found" });
    }

    return res.status(200).json(book);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
});

// Get book details based on author - Task 3
// public_users.get("/author/:author", (req, res) => {
//   const { author } = req.params;

//   try {
//     const booksByAuthor = Object.values(books).filter(
//       (book) => book?.author === author
//     );

//     if (booksByAuthor.length === 0) {
//       return res
//         .status(404)
//         .json({ message: "No books found by this author." });
//     }

//     return res.status(200).json(booksByAuthor);
//   } catch (err) {
//     console.error(err);
//     return res.status(500).json({ message: "Server error" });
//   }
// });

// Get book details based on author Using Axios - Task 12
public_users.get("/author/:author", async (req, res) => {
  const { author } = req.params;

  try {
    const { data: booksData } = await axios.get(endPoint);

    if (booksData === null || booksData === undefined) {
      throw new Error("Failed to get book data");
    }

    const booksByAuthor = Object.values(booksData).filter(
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

// // Get all books based on title - Task 4
// public_users.get("/title/:title", function (req, res) {
//   const { title } = req.params; // Extract the title parameter

//   if (!title) {
//     return res.status(400).json({ message: "Title is required" });
//   }

//   try {
//     const booksByTitle = Object.values(books).filter((book) =>
//       book?.title?.toLowerCase().includes(title.toLowerCase())
//     );

//     if (booksByTitle.length === 0) {
//       return res
//         .status(404)
//         .json({ message: "No books found with this title." });
//     }

//     return res.status(200).json(booksByTitle);
//   } catch (err) {
//     console.error(err);
//     return res.status(500).json({ message: "Server error" });
//   }
// });

// Get all books based on title Using Axios - Task 13
public_users.get("/title/:title", async function (req, res) {
  const { title } = req.params;
  try {
    const { data: booksData } = await axios.get(endPoint);

    if (booksData === null || booksData === undefined) {
      throw new Error("Failed to get book data");
    } else {
      const booksByTitle = Object.values(booksData).filter((book) =>
        book?.title?.toLowerCase().includes(title.toLowerCase())
      );

      if (booksByTitle.length === 0) {
        return res
          .status(404)
          .json({ message: "No books found with this title." });
      }

      return res.status(200).json(booksByTitle);
    }
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
