import express from "express";
import db from "./db.js";
import authRoutes from "./routes/auth.js";  
import booksRoutes from "./routes/books.js";  
import checkoutRoutes from "./routes/checkout.js";  
import reportRoutes from "./routes/report.js";  
import overdueRoutes from "./routes/overdue.js";  

const app = express();

// Middleware
app.use(express.json());  // To parse incoming requests with JSON payloads

// Set view engine to EJS
app.set('view engine', 'ejs');

// Routes
app.use("/api/auth", authRoutes);  // Authentication routes
app.use("/api/books", booksRoutes);  // Books routes
app.use("/api/checkout", checkoutRoutes);  // Checkout routes
app.use("/api/reports", reportRoutes);  // Reports routes
app.use("/overdue", overdueRoutes);  // Overdue books route

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
