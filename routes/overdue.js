const express = require('express');
const router = express.Router();

// Helper function to calculate days overdue
function calculateDaysOverdue(takenOutDate, expectedReturnDate) {
    const today = new Date();
    const expectedReturn = new Date(expectedReturnDate);
    const diffTime = Math.max(today - expectedReturn, 0);
    return Math.floor(diffTime / (1000 * 60 * 60 * 24)); // Convert milliseconds to days
}

// Sample fine per day
const FINE_PER_DAY = 1.0;

// Sample data for overdue books
const overdueBooks = [
    {
        title: 'The Great Gatsby',
        takenOutDate: '2024-07-01',
        expectedReturnDate: '2024-07-15',
        finePerDay: FINE_PER_DAY
    },
];

// Overdue Books Route
router.get('/overdue', (req, res) => {
    const user = req.user; 

    // Calculate overdue days and total fines
    let totalFines = 0;
    overdueBooks.forEach(book => {
        book.daysOverdue = calculateDaysOverdue(book.takenOutDate, book.expectedReturnDate);
        totalFines += book.daysOverdue * book.finePerDay;
    });

    // Render the overdue.ejs file with the dynamic data
    res.render('overdue', {
        user,
        overdueBooks,
        totalFines
    });
});

module.exports = router;
