# Personal Budget & Expense Tracker

A full-stack MERN application that helps users manage personal finances by recording daily expenses, setting monthly budgets and analysing spending patterns through an interactive dashboard.

## 1. Project Overview

The Personal Budget & Expense Tracker provides users with a simple way to monitor their spending and manage monthly budgets.

Users can register, log in securely, add and manage expenses, filter transactions, set monthly budgets and view financial summaries.

## 2. Features

### User Authentication
- User registration and login
- Password hashing using bcryptjs
- JWT-based authentication
- Protected backend API routes
- User-specific data access
- Logout functionality

### Expense Management
- Add, view, update and delete expenses
- Search expenses by title
- Filter by category and payment method
- Filter using date ranges
- Sort by date and amount

### Monthly Budget Management
- Create and update monthly budgets
- Select month and year
- Calculate total monthly spending
- Calculate remaining budget
- Display budget utilisation
- Warn when spending exceeds the budget

### Dashboard and Analytics
- Total monthly transactions
- Total amount spent
- Monthly budget and remaining balance
- Category-wise expense distribution
- Spending by category
- Monthly spending trend
- Recent five transactions
- Budget exceeded warning

## 3. Technology Stack

| Layer | Technologies |
|---|---|
| Frontend | React.js, Vite |
| Backend | Node.js, Express.js |
| Database | MongoDB, Mongoose |
| Authentication | JWT, bcryptjs |
| API communication | Axios |
| Routing | React Router |
| Charts | Recharts |
| Icons | Lucide React |
| Styling | CSS |

## 4. Project Structure

```text
PersonalBudgetTracker/
│
├── backend/
│   ├── config/
│   ├── middleware/
│   │   └── authMiddleware.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Expense.js
│   │   └── Budget.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── expenseRoutes.js
│   │   ├── budgetRoutes.js
│   │   └── dashboardRoutes.js
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
│   │   ├── App.css
│   │   ├── index.css
│   │   └── main.jsx
│   └── package.json
│
├── screenshots/
├── Personal Budget Tracker API.postman_collection.json
├── .gitignore
└── README.md
```

## 5. Installation and Setup

### Prerequisites
- Node.js and npm
- MongoDB Atlas account or local MongoDB
- Git

### Clone the repository

```bash
git clone https://github.com/sharonsam08016/PersonalBudgetTracker.git
cd PersonalBudgetTracker
```

### Backend setup

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

Start the backend:

```bash
npm run dev
```

Backend address:

`http://localhost:5000`

### Frontend setup

Open another terminal:

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

Frontend address:

`http://localhost:5173`

## 6. API Endpoints

All protected APIs require a JWT token in the Authorization header:

```text
Authorization: Bearer YOUR_JWT_TOKEN
```

### Authentication

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register a user |
| POST | `/api/auth/login` | Login |
| GET | `/api/auth/profile` | Get authenticated profile |

### Expense Management

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/expenses` | Add an expense |
| GET | `/api/expenses` | Get all expenses |
| GET | `/api/expenses/:id` | Get expense by ID |
| PUT | `/api/expenses/:id` | Update an expense |
| DELETE | `/api/expenses/:id` | Delete an expense |

Supported query parameters include `search`, `category`, `paymentMethod`, `startDate`, `endDate`, `sortBy` and `order`.

### Budget Management

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/budget` | Create or save a monthly budget |
| GET | `/api/budget?month=11&year=2026` | Get budget and spending summary |
| PUT | `/api/budget/:id` | Update a specific budget |

The backend also supports `/api/budgets` as an alternative route used by the frontend.

### Dashboard

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/dashboard/summary` | Retrieve dashboard analytics |

## 7. Expense Categories

- Food
- Travel
- Shopping
- Healthcare
- Education
- Others

## 8. Payment Methods

- Cash
- UPI
- Credit Card
- Debit Card

## 9. Security

- Passwords are hashed before storage.
- JWT authentication protects private backend routes.
- Expense and budget records are associated with their respective users.
- Database queries restrict access to the authenticated user's records.
- Sensitive configuration is stored in environment variables.
- Environment files are excluded from Git using `.gitignore`.

## 10. API Testing

The project includes a Postman collection containing requests for authentication, expense management, budget management and dashboard analytics.

Collection variables:
- `baseUrl`
- `token`
- `expenseId`
- `budgetId`

Import the collection into Postman and configure the variables before testing protected endpoints.

## 11. Future Enhancements

- Export expenses to PDF and CSV
- Recurring expense management
- Income tracking
- Advanced financial reports
- Email notifications for budget alerts
- Cloud deployment

## 12. Author

**Sharon Sam**

BCA Student | Data Science

## 13. Repository

https://github.com/sharonsam08016/PersonalBudgetTracker