const express = require("express");
const Book = require("../models/Book");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", authMiddleware, async (req, res) => {
  const { title, author, description, image } = req.body;

  if (!title || !author) {
    return res.status(400).json({ message: "Title and author are required" });
  }

  try {
    const newBook = new Book({
      title,
      author,
      description,
      image,
      owner: req.user,
    });

    const savedBook = await newBook.save();
    res.status(201).json(savedBook);
  } catch (err) {
    console.error("Error adding book:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});

// @route   GET /api/books
// @desc    Get all books
// @access  Public
router.get("/", async (req, res) => {
  try {
    const books = await Book.find().populate("owner", "name email");
    res.json(books);
  } catch (err) {
    console.error("Error fetching books:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});

// @route   GET /api/my-books
// @desc    Get books uploaded by the current user
// @access  Protected
router.get("/my-books", authMiddleware, async (req, res) => {
  try {
    const books = await Book.find({ owner: req.user });
    res.json(books);
  } catch (err) {
    console.error("Error fetching user's books:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});

// @route   DELETE /api/books/:id
// @desc    Delete a book by ID (only by its owner)
// @access  Protected
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    if (book.owner.toString() !== req.user) {
      return res.status(403).json({ message: "Not authorized to delete this book" });
    }

    await book.deleteOne();
    res.json({ message: "Book deleted successfully" });

  } catch (err) {
    console.error("Error deleting book:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;