
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Tooltip,
    Legend,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    LineChart,
    Line
} from "recharts";
import api from "../api";

const COLORS = [
    "#2563eb",
    "#16a34a",
    "#f59e0b",
    "#dc2626",
    "#8b5cf6",
    "#0891b2"
];

const monthNames = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

function Dashboard() {
    const navigate = useNavigate();

    const [dashboard, setDashboard] = useState(null);
    const [monthlyTrend, setMonthlyTrend] = useState([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (!token) {
            navigate("/");
            return;
        }

        const fetchDashboard = async () => {
            try {
                const [dashboardResponse, expensesResponse] =
                    await Promise.all([
                        api.get("/dashboard/summary"),
                        api.get("/expenses")
                    ]);

                setDashboard(dashboardResponse.data);

                const expenseList = Array.isArray(expensesResponse.data)
                    ? expensesResponse.data
                    : Array.isArray(expensesResponse.data.expenses)
                        ? expensesResponse.data.expenses
                        : [];

                const currentYear = new Date().getFullYear();

                const trend = monthNames.map((name, index) => {
                    const total = expenseList
                        .filter((expense) => {
                            const date = new Date(expense.date);

                            return (
                                date.getFullYear() === currentYear &&
                                date.getMonth() === index
                            );
                        })
                        .reduce(
                            (sum, expense) =>
                                sum + Number(expense.amount),
                            0
                        );

                    return {
                        month: name,
                        spending: total
                    };
                });

                setMonthlyTrend(trend);

            } catch (err) {
                setError(
                    err.response?.data?.message ||
                    "Unable to load dashboard"
                );
            } finally {
                setLoading(false);
            }
        };

        fetchDashboard();

    }, [navigate]);

    if (loading) {
        return (
            <div className="dashboard-container">
                <h2>Loading dashboard...</h2>
            </div>
        );
    }

    if (error) {
        return (
            <div className="dashboard-container">
                <div className="error-message">{error}</div>
            </div>
        );
    }

    if (!dashboard) return null;

    const {
        summary,
        categoryBreakdown = [],
        recentExpenses = []
    } = dashboard;

    const currency = (value) =>
        `₹${Number(value || 0).toLocaleString("en-IN")}`;

    return (
        <div className="dashboard-container">

            <header className="dashboard-header">
                <div>
                    <h1>Personal Budget Tracker</h1>
                    <p>Manage your money, track your expenses.</p>
                </div>
            </header>

            <h2>Dashboard Overview</h2>

            {/* SUMMARY CARDS */}

            <div className="summary-grid">

                <div className="summary-card">
                    <h3>Total Transactions</h3>
                    <h2>{summary.totalExpenses}</h2>
                </div>

                <div className="summary-card">
                    <h3>Total Spent</h3>
                    <h2>{currency(summary.totalSpent)}</h2>
                </div>

                <div className="summary-card">
                    <h3>Monthly Budget</h3>
                    <h2>{currency(summary.budget)}</h2>
                </div>

                <div className="summary-card">
                    <h3>Remaining Balance</h3>
                    <h2>{currency(summary.remaining)}</h2>
                </div>

            </div>

            {/* BUDGET WARNING */}

            {summary.exceeded && (
                <div
                    className="error-message"
                    style={{ marginTop: "20px" }}
                >
                    Warning! You have exceeded your monthly budget.
                </div>
            )}

            {/* CATEGORY CHARTS */}

            <div
                className="summary-grid"
                style={{ marginTop: "25px" }}
            >

                <section
                    className="dashboard-section"
                    style={{ marginTop: 0 }}
                >
                    <h2>Category-wise Expense Distribution</h2>

                    {categoryBreakdown.length === 0 ? (
                        <p>No category data available.</p>
                    ) : (
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={categoryBreakdown}
                                    dataKey="total"
                                    nameKey="category"
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={100}
                                    label
                                >
                                    {categoryBreakdown.map(
                                        (item, index) => (
                                            <Cell
                                                key={item.category}
                                                fill={
                                                    COLORS[
                                                        index % COLORS.length
                                                    ]
                                                }
                                            />
                                        )
                                    )}
                                </Pie>

                                <Tooltip formatter={currency} />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    )}
                </section>

                <section
                    className="dashboard-section"
                    style={{ marginTop: 0 }}
                >
                    <h2>Spending by Category</h2>

                    {categoryBreakdown.length === 0 ? (
                        <p>No category data available.</p>
                    ) : (
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={categoryBreakdown}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="category" />
                                <YAxis />
                                <Tooltip formatter={currency} />

                                <Bar
                                    dataKey="total"
                                    name="Amount Spent"
                                    fill="#2563eb"
                                    radius={[6, 6, 0, 0]}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    )}
                </section>

            </div>

            {/* MONTHLY SPENDING TREND */}

            <section className="dashboard-section">
                <h2>
                    Monthly Spending Trend ({new Date().getFullYear()})
                </h2>

                <ResponsiveContainer width="100%" height={320}>
                    <LineChart data={monthlyTrend}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip formatter={currency} />
                        <Legend />

                        <Line
                            type="monotone"
                            dataKey="spending"
                            name="Monthly Spending"
                            stroke="#2563eb"
                            strokeWidth={3}
                            activeDot={{ r: 7 }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </section>

            {/* RECENT EXPENSES */}

            <section className="dashboard-section">
                <h2>Recent Expenses</h2>

                {recentExpenses.length === 0 ? (
                    <p>No recent expenses.</p>
                ) : (
                    <div className="table-wrapper">
                        <table>
                            <thead>
                                <tr>
                                    <th>Title</th>
                                    <th>Category</th>
                                    <th>Amount</th>
                                    <th>Date</th>
                                </tr>
                            </thead>

                            <tbody>
                                {recentExpenses.map((expense) => (
                                    <tr key={expense._id}>
                                        <td>{expense.title}</td>
                                        <td>{expense.category}</td>
                                        <td>
                                            {currency(expense.amount)}
                                        </td>
                                        <td>
                                            {new Date(
                                                expense.date
                                            ).toLocaleDateString("en-IN")}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </section>

        </div>
    );
}

export default Dashboard;
