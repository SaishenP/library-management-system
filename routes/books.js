import express from "express";
import db from "../db.js";
import { check, validationResult } from "express-validator";

const router = express.Router();

// Get all books
router.get("/", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM books");
    res.json(result.rows);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
});

// Add a new book
router.post(
  "/add",
  [
    check("title", "Title is required").not().isEmpty(),
    check("isbn", "ISBN is required").not().isEmpty(),
    check("year", "Year must be a valid number").isNumeric(),
    check("quantity", "Quantity must be a valid number").isNumeric(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, isbn, year, edition, quantity } = req.body;

    try {
      await db.query(
        "INSERT INTO books (title, isbn, year, edition, quantity) VALUES ($1, $2, $3, $4, $5)",
        [title, isbn, year, edition, quantity]
      );
      res.status(200).send("Book added successfully");
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Server error");
    }
  }
);

// Edit a book
router.put(
  "/edit/:id",
  [
    check("title", "Title is required").not().isEmpty(),
    check("isbn", "ISBN is required").not().isEmpty(),
    check("year", "Year must be a valid number").isNumeric(),
    check("quantity", "Quantity must be a valid number").isNumeric(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, isbn, year, edition, quantity } = req.body;
    const { id } = req.params;

    try {
      await db.query(
        "UPDATE books SET title = $1, isbn = $2, year = $3, edition = $4, quantity = $5 WHERE id = $6",
        [title, isbn, year, edition, quantity, id]
      );
      res.status(200).send("Book updated successfully");
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Server error");
    }
  }
);

// Delete a book
router.delete("/delete/:id", async (req, res) => {
  const { id } = req.params;

  try {
    await db.query("DELETE FROM books WHERE id = $1", [id]);
    res.status(200).send("Book deleted successfully");
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
});

export default router;
