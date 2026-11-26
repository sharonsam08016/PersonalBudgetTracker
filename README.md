# Personal Budget & Expense Tracker

A full-stack MERN application that helps users manage their personal finances by tracking daily expenses, setting monthly budgets, and visualizing spending patterns through interactive dashboards.

## Project Overview

The Personal Budget & Expense Tracker provides a simple and organized way to monitor spending habits and manage monthly expenses.

Users can create an account, securely log in, record expenses, categorize transactions, set monthly budgets, and analyze their spending through visual charts.

## Features

### Authentication
- User registration and login
- Password hashing using bcrypt
- JWT-based authentication
- Protected API routes

### Expense Management
- Add new expenses
- View all expenses
- Update existing expenses
- Delete expenses
- Search expenses by title
- Filter expenses by category
- Sort expenses by date and amount

### Monthly Budget Management
- Set and update monthly budgets
- Select month and year
- Track total monthly spending
- Calculate remaining budget
- Display budget utilization percentage
- Warn users when they exceed their budget

### Dashboard & Analytics
- Total number of expenses
- Total amount spent
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
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── server.js
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Expenses.jsx
│   │   │   └── Budget.jsx
│   │   ├── App.jsx
│   │   ├── api.js
│   │   └── index.css
│   └── package.json
│
├── screenshots/
│   ├── Budget.png
│   ├── Dashboard - 1.png
│   ├── Dashboard - 2.png
│   ├── Expenses.png
│   ├── Log-in.png
│   └── Register Log-in.png
│
├── Personal Budget Tracker API.postman_collection.json
└── README.md
```

## Installation and Setup

### Prerequisites

- Node.js and npm
- MongoDB Atlas account or local MongoDB installation
- Git

### 1. Clone the Repository

```bash
git clone https://github.com/sharonsam08016/PersonalBudgetTracker.git
cd PersonalBudgetTracker
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file inside the backend folder:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secure_jwt_secret
```

Start the backend server:

```bash
npm run dev
```

Backend runs at:

`http://localhost:5000`

### 3. Frontend Setup

Open another terminal from the project root:

```bash
cd frontend
npm install
```

Create a `.env` file inside the frontend folder:

```env
VITE_API_URL=http://localhost:5000/api
```

Start the frontend:

```bash
npm run dev
```

Frontend runs at:

`http://localhost:5173`

## API Endpoints

All protected endpoints require a JWT access token in the Authorization header:

```text
Authorization: Bearer YOUR_JWT_TOKEN
```

### Authentication

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Login user |
| GET | `/api/auth/profile` | Get authenticated user profile |

### Expenses

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/expenses` | Add an expense |
| GET | `/api/expenses` | Get all user expenses |
| GET | `/api/expenses/:id` | Get expense by ID |
| PUT | `/api/expenses/:id` | Update an expense |
| DELETE | `/api/expenses/:id` | Delete an expense |

### Budgets

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/budgets` | Create or update monthly budget |
| GET | `/api/budgets?month=11&year=2026` | Get monthly budget summary |

### Dashboard

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/dashboard` | Get dashboard analytics |

## Expense Categories

- Food
- Travel
- Shopping
- Healthcare
- Education
- Others

## Security

- Passwords are hashed before being stored.
- JWT authentication protects private endpoints.
- User-specific