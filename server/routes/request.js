const express = require("express");
const router = express.Router();
const Request = require("../models/Request");
const Book = require("../models/Book");
const authMiddleware = require("../middleware/authMiddleware");

// Create a new book request
router.post("/", authMiddleware, async (req, res) => {
  const { bookId } = req.body;

  if (!bookId) return res.status(400).json({ message: "Book ID is required" });

  try {
    const book = await Book.findById(bookId);
    if (!book) return res.status(404).json({ message: "Book not found" });

    // Prevent owner from requesting their own book
    if (book.owner.toString() === req.user) {
      return res.status(403).json({ message: "You cannot request your own book" });
    }

    // Check for existing request
    const existing = await Request.findOne({ book: bookId, requester: req.user });
    if (existing) {
      return res.status(409).json({ message: "You have already requested this book" });
    }

    const request = new Request({
      book: bookId,
      requester: req.user,
      owner: book.owner,
    });

    await request.save();
    res.status(201).json({ message: "Request sent" });
  } catch (err) {
    console.error("Request creation failed:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});

// Get requests for books owned by current user
router.get("/incoming", authMiddleware, async (req, res) => {
  try {
    const requests = await Request.find({ owner: req.user })
      .populate("book", "title author")
      .populate("requester", "name email");
    res.json(requests);
  } catch (err) {
    console.error("Fetching incoming requests failed:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});

// GET /api/requests/my
router.get("/my", authMiddleware, async (req, res) => {
  try {
    const requests = await Request.find({ requester: req.user })
      .populate("book")
      .populate("book.owner", "name email");

    res.json(requests);
  } catch (err) {
    console.error("Error fetching my requests:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});

// Accept or reject a request
router.patch("/:id", authMiddleware, async (req, res) => {
  const { status } = req.body;

  if (!["accepted", "rejected"].includes(status)) {
    return res.status(400).json({ message: "Invalid status" });
  }

  try {
    const request = await Request.findById(req.params.id);
    if (!request) return res.status(404).json({ message: "Request not found" });

    if (request.owner.toString() !== req.user) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    request.status = status;
    await request.save();
    res.json({ message: `Request ${status}`, request});
  } catch (err) {
    console.error("Updating request failed:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;