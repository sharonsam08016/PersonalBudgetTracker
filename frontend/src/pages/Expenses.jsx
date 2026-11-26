
import { useEffect, useState } from "react";
import api from "../api";

function Expenses() {
    const [expenses, setExpenses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [search, setSearch] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("All");
    const [sortOption, setSortOption] = useState("newest");

    const initialForm = {
        title: "",
        amount: "",
        category: "Food",
        date: new Date().toISOString().split("T")[0],
        paymentMethod: "UPI"
    };

    const [formData, setFormData] = useState(initialForm);
    const [editingId, setEditingId] = useState(null);

    const fetchExpenses = async () => {
        try {
            const response = await api.get("/expenses");

            const expenseList = Array.isArray(response.data)
                ? response.data
                : Array.isArray(response.data.expenses)
                    ? response.data.expenses
                    : [];

            setExpenses(expenseList);
            setError("");
        } catch (err) {
            setError(err.response?.data?.message || "Unable to fetch expenses");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchExpenses();
    }, []);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setMessage("");

        const payload = {
            ...formData,
            amount: Number(formData.amount)
        };

        try {
            if (editingId) {
                await api.put(`/expenses/${editingId}`, payload);
                setMessage("Expense updated successfully!");
            } else {
                await api.post("/expenses", payload);
                setMessage("Expense added successfully!");
            }

            setFormData(initialForm);
            setEditingId(null);
            await fetchExpenses();
        } catch (err) {
            setError(err.response?.data?.message || "Unable to save expense");
        }
    };

    const handleEdit = (expense) => {
        setFormData({
            title: expense.title,
            amount: expense.amount,
            category: expense.category,
            date: new Date(expense.date).toISOString().split("T")[0],
            paymentMethod: expense.paymentMethod
        });

        setEditingId(expense._id);
        setMessage("");
        setError("");
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleCancelEdit = () => {
        setEditingId(null);
        setFormData(initialForm);
        setError("");
        setMessage("");
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this expense?")) {
            return;
        }

        try {
            await api.delete(`/expenses/${id}`);
            setMessage("Expense deleted successfully!");
            await fetchExpenses();
        } catch (err) {
            setError(err.response?.data?.message || "Unable to delete expense");
        }
    };

    // Search, filter and sort expenses
    const filteredExpenses = expenses
        .filter((expense) =>
            expense.title?.toLowerCase().includes(search.toLowerCase())
        )
        .filter((expense) =>
            categoryFilter === "All" ||
            expense.category === categoryFilter
        )
        .sort((a, b) => {
            switch (sortOption) {
                case "oldest":
                    return new Date(a.date) - new Date(b.date);

                case "amountLow":
                    return Number(a.amount) - Number(b.amount);

                case "amountHigh":
                    return Number(b.amount) - Number(a.amount);

                case "newest":
                default:
                    return new Date(b.date) - new Date(a.date);
            }
        });

    if (loading) {
        return (
            <div className="dashboard-container">
                <h2>Loading expenses...</h2>
            </div>
        );
    }

    return (
        <div className="dashboard-container">
            <h1>Expense Management</h1>
            <p>Track and manage your daily spending.</p>

            {error && <div className="error-message">{error}</div>}
            {message && <p className="success-message">{message}</p>}

            <section className="dashboard-section">
                <h2>{editingId ? "Edit Expense" : "Add New Expense"}</h2>

                <form className="expense-form" onSubmit={handleSubmit}>
                    <label>Expense Title</label>
                    <input
                        type="text"
                        name="title"
                        placeholder="e.g. Lunch"
                        value={formData.title}
                        onChange={handleChange}
                        required
                    />

                    <label>Amount (₹)</label>
                    <input
                        type="number"
                        name="amount"
                        min="0.01"
                        step="0.01"
                        placeholder="Enter amount"
                        value={formData.amount}
                        onChange={handleChange}
                        required
                    />

                    <label>Category</label>
                    <select
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                    >
                        {["Food", "Travel", "Shopping", "Healthcare", "Education", "Others"].map((item) => (
                            <option key={item} value={item}>{item}</option>
                        ))}
                    </select>

                    <label>Date</label>
                    <input
                        type="date"
                        name="date"
                        value={formData.date}
                        onChange={handleChange}
                        required
                    />

                    <label>Payment Method</label>
                    <select
                        name="paymentMethod"
                        value={formData.paymentMethod}
                        onChange={handleChange}
                    >
                        {["Cash", "UPI", "Credit Card", "Debit Card"].map((item) => (
                            <option key={item} value={item}>{item}</option>
                        ))}
                    </select>

                    <button type="submit">
                        {editingId ? "Update Expense" : "Add Expense"}
                    </button>

                    {editingId && (
                        <button type="button" onClick={handleCancelEdit}>
                            Cancel Edit
                        </button>
                    )}
                </form>
            </section>

            <section className="dashboard-section">
                <h2>All Expenses ({filteredExpenses.length})</h2>

                <div className="expense-filters">
                    <input
                        type="text"
                        placeholder="Search by title..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />

                    <select
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                    >
                        <option value="All">All Categories</option>
                        {["Food", "Travel", "Shopping", "Healthcare", "Education", "Others"].map((item) => (
                            <option key={item} value={item}>{item}</option>
                        ))}
                    </select>

                    <select
                        value={sortOption}
                        onChange={(e) => setSortOption(e.target.value)}
                    >
                        <option value="newest">Newest First</option>
                        <option value="oldest">Oldest First</option>
                        <option value="amountLow">Amount: Low to High</option>
                        <option value="amountHigh">Amount: High to Low</option>
                    </select>
                </div>

                <div className="table-wrapper">
                    <table>
                        <thead>
                            <tr>
                                <th>Title</th>
                                <th>Category</th>
                                <th>Amount</th>
                                <th>Date</th>
                                <th>Payment</th>
                                <th>Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {filteredExpenses.map((expense) => (
                                <tr key={expense._id}>
                                    <td>{expense.title}</td>
                                    <td>{expense.category}</td>
                                    <td>₹{Number(expense.amount).toLocaleString("en-IN")}</td>
                                    <td>{new Date(expense.date).toLocaleDateString("en-IN")}</td>
                                    <td>{expense.paymentMethod}</td>
                                    <td>
                                        <button onClick={() => handleEdit(expense)}>
                                            Edit
                                        </button>
                                        {" "}
                                        <button onClick={() => handleDelete(expense._id)}>
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {filteredExpenses.length === 0 && (
                        <p>No expenses found.</p>
                    )}
                </div>
            </section>
        </div>
    );
}

export default Expenses;
