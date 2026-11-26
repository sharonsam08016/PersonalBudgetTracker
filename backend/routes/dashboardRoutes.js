
const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

const Expense = require("../models/Expense");
const Budget = require("../models/Budget");
const authMiddleware = require("../middleware/authMiddleware");

// GET Dashboard Analytics
router.get("/", authMiddleware, async (req, res) => {
    try {
        const userId = new mongoose.Types.ObjectId(req.user.userId);

        const now = new Date();
        const month = Number(req.query.month) || now.getMonth() + 1;
        const year = Number(req.query.year) || now.getFullYear();

        if (month < 1 || month > 12) {
            return res.status(400).json({
                message: "Invalid month"
            });
        }

        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 1);

        // Fetch monthly expenses
        const expenses = await Expense.find({
            user: userId,
            date: { $gte: startDate, $lt: endDate }
        }).sort({ date: -1 });

        const totalSpent = expenses.reduce(
            (total, expense) => total + expense.amount,
            0
        );

        // Fetch monthly budget
        const budgetData = await Budget.findOne({
            user: userId,
            month,
            year
        });

        const budget = budgetData ? budgetData.amount : 0;
        const remaining = budget - totalSpent;

        // Category-wise spending
        const categoryBreakdown = await Expense.aggregate([
            {
                $match: {
                    user: userId,
                    date: { $gte: startDate, $lt: endDate }
                }
            },
            {
                $group: {
                    _id: "$category",
                    total: { $sum: "$amount" }
                }
            },
            {
                $project: {
                    _id: 0,
                    category: "$_id",
                    total: 1
                }
            },
            {
                $sort: { total: -1 }
            }
        ]);

        // Latest five expenses
        const recentExpenses = await Expense.find({
            user: userId
        })
            .sort({ date: -1, createdAt: -1 })
            .limit(5);

        res.status(200).json({
            message: "Dashboard data fetched successfully",
            month,
            year,
            summary: {
                totalExpenses: expenses.length,
                totalSpent,
                budget,
                remaining,
                exceeded: totalSpent > budget
            },
            categoryBreakdown,
            recentExpenses
        });

    } catch (error) {
        console.error("Dashboard Error:", error);

        res.status(500).json({
            message: "Error fetching dashboard data",
            error: error.message
        });
    }
});

module.exports = router;
