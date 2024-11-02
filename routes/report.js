import express from "express";
import db from "../db.js";
import { check, validationResult } from "express-validator";

const router = express.Router();

// Get all reports
router.get("/", async (req, res) => {
  try {
    const result = await db.query(`
      SELECT reports.id, users.username, reports.report_text, reports.report_date 
      FROM reports
      JOIN users ON reports.user_id = users.id
    `);
    res.json(result.rows);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
});

// Create a new report
router.post(
  "/add",
  [
    check("user_id", "User ID is required").isNumeric(),
    check("report_text", "Report text is required").not().isEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { user_id, report_text } = req.body;

    try {
      await db.query(
        "INSERT INTO reports (user_id, report_text) VALUES ($1, $2)",
        [user_id, report_text]
      );
      res.status(200).send("Report created successfully");
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Server error");
    }
  }
);

// Delete a report
router.delete("/delete/:id", async (req, res) => {
  const { id } = req.params;

  try {
    await db.query("DELETE FROM reports WHERE id = $1", [id]);
    res.status(200).send("Report deleted successfully");
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
});

export default router;
