-- Users table (for login/register)
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  role VARCHAR(20) DEFAULT 'user' 
);

-- Books table
CREATE TABLE books (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  isbn VARCHAR(50) UNIQUE NOT NULL,
  year INT NOT NULL,
  edition VARCHAR(50),
  quantity INT NOT NULL
);

-- Checkout table
CREATE TABLE checkout (
  id SERIAL PRIMARY KEY,
  book_id INT REFERENCES books(id),
  user_id INT REFERENCES users(id),
  checkout_date DATE NOT NULL,
  return_date DATE NOT NULL,
  returned BOOLEAN DEFAULT FALSE
);

-- Overdue books view
CREATE VIEW overdue_books AS
SELECT 
  checkout.id AS checkout_id,
  books.title AS book_title,
  users.username AS borrowed_by,
  checkout.checkout_date,
  checkout.return_date
FROM 
  checkout
JOIN 
  books ON checkout.book_id = books.id
JOIN 
  users ON checkout.user_id = users.id
WHERE 
  checkout.returned = FALSE
  AND checkout.return_date < CURRENT_DATE;

-- Reports table 
CREATE TABLE reports (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id),
  report_text TEXT NOT NULL,
  report_date DATE DEFAULT CURRENT_DATE
);
