const express = require("express");
const router = express.Router();

const Budget = require("../models/Budget");
const Expense = require("../models/Expense");
const authMiddleware = require("../middleware/authMiddleware");

// Set or update monthly budget
router.post("/", authMiddleware, async (req, res) => {
    try {
        const { month, year, amount } = req.body;

        if (!month || !year || amount === undefined) {
            return res.status(400).json({
                message: "Month, year and amount are required"
            });
        }

        if (month < 1 || month > 12 || amount < 0) {
            return res.status(400).json({
                message: "Invalid month or budget amount"
            });
        }

        let budget = await Budget.findOne({
            user: req.user.userId,
            month,
            year
        });

        if (budget) {
            budget.amount = amount;
            await budget.save();
        } else {
            budget = await Budget.create({
                user: req.user.userId,
                month,
                year,
                amount
            });
        }

        res.status(200).json({
            message: "Budget saved successfully",
            budget
        });

    } catch (error) {
        res.status(500).json({
            message: "Error saving budget",
            error: error.message
        });
    }
});

// Get monthly budget and spending
router.get("/", authMiddleware, async (req, res) => {
    try {
        const month = Number(req.query.month);
        const year = Number(req.query.year);

        if (!month || !year || month < 1 || month > 12) {
            return res.status(400).json({
                message: "Valid month and year are required"
            });
        }

        const budget = await Budget.findOne({
            user: req.user.userId,
            month,
            year
        });

        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 1);

        const expenses = await Expense.find({
            user: req.user.userId,
            date: {
                $gte: startDate,
                $lt: endDate
            }
        });

        const totalSpent = expenses.reduce(
            (total, expense) => total + expense.amount,
            0
        );

        const budgetAmount = budget ? budget.amount : 0;
        const remaining = budgetAmount - totalSpent;

        res.status(200).json({
            month,
            year,
            budget: budgetAmount,
            totalSpent,
            remaining,
            exceeded: totalSpent > budgetAmount,
            expenses
        });

    } catch (error) {
        res.status(500).json({
            message: "Error fetching budget",
            error: error.message
        });
    }
});

module.exports = router;