import express from "express";
import db from "../db.js";
import { check, validationResult } from "express-validator";

const router = express.Router();

// Get all checkouts
router.get("/", async (req, res) => {
  try {
    const result = await db.query(`
      SELECT checkout.id, books.title AS book_title, users.username AS borrowed_by, 
      checkout.checkout_date, checkout.return_date, checkout.returned 
      FROM checkout
      JOIN books ON checkout.book_id = books.id
      JOIN users ON checkout.user_id = users.id
    `);
    res.json(result.rows);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
});

// Checkout a book
router.post(
  "/add",
  [
    check("book_id", "Book ID is required").isNumeric(),
    check("user_id", "User ID is required").isNumeric(),
    check("checkout_date", "Checkout date is required").not().isEmpty(),
    check("return_date", "Return date is required").not().isEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { book_id, user_id, checkout_date, return_date } = req.body;

    try {
      await db.query(
        "INSERT INTO checkout (book_id, user_id, checkout_date, return_date) VALUES ($1, $2, $3, $4)",
        [book_id, user_id, checkout_date, return_date]
      );
      res.status(200).send("Book checked out successfully");
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Server error");
    }
  }
);

// Return a book
router.put("/return/:id", async (req, res) => {
  const { id } = req.params;

  try {
    await db.query("UPDATE checkout SET returned = TRUE WHERE id = $1", [id]);
    res.status(200).send("Book returned successfully");
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
});

export default router;
