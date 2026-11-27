# Personal Budget & Expense Tracker

A full-stack MERN application that helps users manage personal finances by tracking daily expenses, setting monthly budgets, and visualizing spending patterns through interactive dashboards.

## Project Overview

The Personal Budget & Expense Tracker provides an organized way to monitor spending habits and manage monthly expenses.

Users can create an account, securely log in, record expenses, categorize transactions, set monthly budgets, and analyze their spending through visual charts.

## Features

### 1. User Authentication
- User registration and login
- Password hashing using bcrypt
- JWT-based authentication
- Protected API routes
- User-specific data access
- Logout functionality

### 2. Expense Management
- Add, view, update, and delete expenses
- Expense details: Title, Amount, Category, Date, Payment Method
- Search expenses by title
- Filter by category
- Filter by payment method
- Filter by date range
- Sort expenses by date and amount
- Users can access only their own expenses

### 3. Monthly Budget Management
- Create and update monthly budgets
- Select month and year
- Calculate total monthly expenses
- Calculate remaining budget
- Track budget utilization
- Display a warning when the budget is exceeded

### 4. Dashboard & Analytics
- Total number of monthly transactions
- Total monthly spending
- Monthly budget overview
- Remaining balance
- Category-wise expense distribution
- Monthly spending trend
- Recent five expenses
- Budget exceeded warning

## Technology Stack

| Layer | Technologies |
|---|---|
| Frontend | React.js, Vite |
| Backend | Node.js, Express.js |
| Database | MongoDB, Mongoose |
| Authentication | JWT, bcrypt |
| API Communication | Axios |
| Charts | Recharts |
| Routing | React Router |
| Icons | Lucide React |

## Project Structure

```text
PersonalBudgetTracker/
│
├── backend/
│   ├── config/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── expenseRoutes.js
│   │   ├── budgetRoutes.js
│   │   └── dashboardRoutes.js
│   ├── .env
│   ├── .gitignore
│   ├── server.js
│   ├── package.json
│   └── package-lock.json
│
├── frontend/
│   ├── src/
│   │   ├── assets/
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Expenses.jsx
│   │   │   └── Budget.jsx
│   │   ├── api.js
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── index.css
│   │   └── main.jsx
│   ├── .env
│   └── package.json
│
├── screenshots/
├── Personal Budget Tracker API.postman_collection.json
├──