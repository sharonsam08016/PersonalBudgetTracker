
import { useEffect, useState } from "react";
import api from "../api";

function Budget() {
    const today = new Date();

    const [month, setMonth] = useState(today.getMonth() + 1);
    const [year, setYear] = useState(today.getFullYear());
    const [amount, setAmount] = useState("");
    const [budgetData, setBudgetData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    const months = [
        "January", "February", "March", "April",
        "May", "June", "July", "August",
        "September", "October", "November", "December"
    ];

    const fetchBudget = async () => {
        setLoading(true);
        setError("");
        setMessage("");

        try {
            const response = await api.get(
                `/budgets?month=${month}&year=${year}`
            );

            const data = response.data;
            setBudgetData(data);

            const budgetAmount =
                typeof data.budget === "object"
                    ? data.budget?.amount
                    : data.budget;

            setAmount(budgetAmount ?? "");
        } catch (err) {
            setBudgetData(null);
            setAmount("");
            setError(
                err.response?.data?.message || "Unable to fetch budget"
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBudget();
    }, [month, year]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setMessage("");

        if (Number(amount) < 0) {
            setError("Budget cannot be negative.");
            return;
        }

        setSaving(true);

        try {
            await api.post("/budgets", {
                month: Number(month),
                year: Number(year),
                amount: Number(amount)
            });

            setMessage("Monthly budget saved successfully!");
            await fetchBudget();
        } catch (err) {
            setError(
                err.response?.data?.message || "Unable to save budget"
            );
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="dashboard-container">
                <h2>Loading budget...</h2>
            </div>
        );
    }

    const totalSpent = Number(budgetData?.totalSpent || 0);
    const budgetAmount =
        typeof budgetData?.budget === "object"
            ? Number(budgetData?.budget?.amount || 0)
            : Number(budgetData?.budget || 0);

    const remaining = budgetAmount - totalSpent;
    const exceeded = totalSpent > budgetAmount;
    const percentage = budgetAmount > 0
        ? Math.min((totalSpent / budgetAmount) * 100, 100)
        : 0;

    return (
        <div className="dashboard-container">
            <h1>Monthly Budget</h1>
            <p>Plan your monthly spending and manage your money wisely.</p>

            {error && <div className="error-message">{error}</div>}
            {message && <p className="success-message">{message}</p>}

            <section className="dashboard-section">
                <h2>Set Your Budget</h2>

                <form className="expense-form" onSubmit={handleSubmit}>
                    <label>Select Month</label>
                    <select
                        value={month}
                        onChange={(e) => setMonth(Number(e.target.value))}
                    >
                        {months.map((item, index) => (
                            <option key={item} value={index + 1}>
                                {item}
                            </option>
                        ))}
                    </select>

                    <label>Select Year</label>
                    <select
                        value={year}
                        onChange={(e) => setYear(Number(e.target.value))}
                    >
                        {[today.getFullYear() - 1, today.getFullYear(), today.getFullYear() + 1].map((item) => (
                            <option key={item} value={item}>{item}</option>
                        ))}
                    </select>

                    <label>Budget Amount (₹)</label>
                    <input
                        type="number"
                        min="0"
                        step="0.01"
                        placeholder="Enter monthly budget"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        required
                    />

                    <button type="submit" disabled={saving}>
                        {saving ? "Saving..." : "Save Monthly Budget"}
                    </button>
                </form>
            </section>

            <section className="dashboard-section">
                <h2>
                    {months[month - 1]} {year} Overview
                </h2>

                <div className="summary-grid">
                    <div className="summary-card">
                        <h3>Monthly Budget</h3>
                        <h2>₹{budgetAmount.toLocaleString("en-IN")}</h2>
                    </div>

                    <div className="summary-card">
                        <h3>Total Spent</h3>
                        <h2>₹{totalSpent.toLocaleString("en-IN")}</h2>
                    </div>

                    <div className="summary-card">
                        <h3>Remaining Balance</h3>
                        <h2>₹{remaining.toLocaleString("en-IN")}</h2>
                    </div>

                    <div className="summary-card">
                        <h3>Budget Used</h3>
                        <h2>{percentage.toFixed(1)}%</h2>
                    </div>
                </div>

                <div style={{ marginTop: "25px" }}>
                    <h3 style={{ marginBottom: "12px" }}>Spending Progress</h3>

                    <div style={{
                        width: "100%",
                        height: "16px",
                        background: "#e2e8f0",
                        borderRadius: "20px",
                        overflow: "hidden"
                    }}>
                        <div style={{
                            width: `${percentage}%`,
                            height: "100%",
                            background: exceeded ? "#dc2626" : "#2563eb",
                            borderRadius: "20px",
                            transition: "width 0.3s"
                        }} />
                    </div>

                    {budgetAmount === 0 ? (
                        <p style={{ marginTop: "12px" }}>
                            Set a budget to track your spending progress.
                        </p>
                    ) : exceeded ? (
                        <p style={{ color: "#dc2626", marginTop: "12px", fontWeight: "600" }}>
                            Warning! You have exceeded your monthly budget by ₹{Math.abs(remaining).toLocaleString("en-IN")}.
                        </p>
                    ) : (
                        <p style={{ color: "#15803d", marginTop: "12px", fontWeight: "600" }}>
                            You are within your monthly budget.
                        </p>
                    )}
                </div>
            </section>
        </div>
    );
}

export default Budget;
