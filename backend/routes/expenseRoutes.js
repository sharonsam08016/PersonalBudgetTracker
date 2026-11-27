
const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

const Expense = require("../models/Expense");
const authMiddleware = require("../middleware/authMiddleware");

// ==========================================
// 1. ADD NEW EXPENSE
// POST /api/expenses
// ==========================================

router.post("/", authMiddleware, async (req, res) => {
    try {
        console.log("POST /api/expenses reached");

        const { title, amount, category, date, paymentMethod } = req.body;

        // Validate required fields
        if (
            !title ||
            amount === undefined ||
            amount === null ||
            !category ||
            !date ||
            !paymentMethod
        ) {
            return res.status(400).json({
                message: "Please provide all required expense details"
            });
        }

        // Validate amount
        if (Number(amount) <= 0 || !Number.isFinite(Number(amount))) {
            return res.status(400).json({
                message: "Amount must be a valid number greater than zero"
            });
        }

        // Validate date
        if (isNaN(Date.parse(date))) {
            return res.status(400).json({
                message: "Please provide a valid date"
            });
        }

        const expense = new Expense({
            title: title.trim(),
            amount: Number(amount),
            category,
            date,
            paymentMethod,
            user: req.user.userId
        });

        const savedExpense = await expense.save();

        return res.status(201).json({
            message: "Expense added successfully",
            expense: savedExpense
        });

    } catch (error) {
        console.error("Add Expense Error:", error);

        if (error.name === "ValidationError") {
            return res.status(400).json({
                message: "Invalid expense details",
                error: error.message
            });
        }

        return res.status(500).json({
            message: "Server error while adding expense",
            error: error.message
        });
    }
});


// ==========================================
// 2. GET ALL EXPENSES
// GET /api/expenses
// ==========================================


// ==========================================
// 2. GET ALL EXPENSES WITH SEARCH, FILTERS
// AND SORTING
// GET /api/expenses
// ==========================================

router.get("/", authMiddleware, async (req, res) => {
    try {
        const {
            search,
            category,
            paymentMethod,
            startDate,
            endDate,
            sortBy = "date",
            order = "desc"
        } = req.query;

        // Allowed categories
        const allowedCategories = [
            "Food",
            "Travel",
            "Shopping",
            "Healthcare",
            "Education",
            "Others"
        ];

        // Allowed payment methods
        const allowedPaymentMethods = [
            "Cash",
            "UPI",
            "Credit Card",
            "Debit Card"
        ];

        // Validate category
        if (category && !allowedCategories.includes(category)) {
            return res.status(400).json({
                message: "Invalid expense category"
            });
        }

        // Validate payment method
        if (
            paymentMethod &&
            !allowedPaymentMethods.includes(paymentMethod)
        ) {
            return res.status(400).json({
                message: "Invalid payment method"
            });
        }

        // Validate sorting field
        if (!["date", "amount"].includes(sortBy)) {
            return res.status(400).json({
                message: "Sort by must be date or amount"
            });
        }

        // Validate sorting order
        if (!["asc", "desc"].includes(order)) {
            return res.status(400).json({
                message: "Order must be asc or desc"
            });
        }

        // Build query for logged-in user
        const filter = {
            user: req.user.userId
        };

        // Search by expense title
        if (search !== undefined) {
            if (typeof search !== "string") {
                return res.status(400).json({
                    message: "Invalid search value"
                });
            }

            const escapedSearch = search.trim().replace(
                /[.*+?^${}()|[\]\\]/g,
                "\\$&"
            );

            if (escapedSearch) {
                filter.title = {
                    $regex: escapedSearch,
                    $options: "i"
                };
            }
        }

        // Filter by category
        if (category) {
            filter.category = category;
        }

        // Filter by payment method
        if (paymentMethod) {
            filter.paymentMethod = paymentMethod;
        }

        // Validate and filter by date range
        const isValidDate = (value) => {
            if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
                return false;
            }

            const parsed = new Date(`${value}T00:00:00.000Z`);

            return !isNaN(parsed.getTime()) &&
                parsed.toISOString().startsWith(value);
        };

        if (startDate || endDate) {
            if (
                (startDate && !isValidDate(startDate)) ||
                (endDate && !isValidDate(endDate))
            ) {
                return res.status(400).json({
                    message: "Please provide valid dates in YYYY-MM-DD format"
                });
            }

            if (startDate && endDate && startDate > endDate) {
                return res.status(400).json({
                    message: "Start date cannot be after end date"
                });
            }

            filter.date = {};

            if (startDate) {
                filter.date.$gte = new Date(
                    `${startDate}T00:00:00.000Z`
                );
            }

            if (endDate) {
                const nextDay = new Date(
                    `${endDate}T00:00:00.000Z`
                );

                nextDay.setUTCDate(nextDay.getUTCDate() + 1);

                // Exclusive next-day boundary includes the
                // entire selected end date.
                filter.date.$lt = nextDay;
            }
        }

        // Configure sorting
        const sortOptions = {
            [sortBy]: order === "asc" ? 1 : -1
        };

        // Fetch matching expenses
        const expenses = await Expense.find(filter)
            .sort(sortOptions);

        return res.status(200).json({
            message: "Expenses fetched successfully",
            count: expenses.length,
            filters: {
                search: search || "",
                category: category || "",
                paymentMethod: paymentMethod || "",
                startDate: startDate || "",
                endDate: endDate || "",
                sortBy,
                order
            },
            expenses
        });

    } catch (error) {
        console.error("Fetch Expenses Error:", error);

        return res.status(500).json({
            message: "Server error while fetching expenses"
        });
    }
});



// ==========================================
// 3. GET SINGLE EXPENSE
// GET /api/expenses/:id
// ==========================================

router.get("/:id", authMiddleware, async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({
                message: "Invalid expense ID"
            });
        }

        const expense = await Expense.findOne({
            _id: id,
            user: req.user.userId
        });

        if (!expense) {
            return res.status(404).json({
                message: "Expense not found"
            });
        }

        return res.status(200).json({
            message: "Expense fetched successfully",
            expense
        });

    } catch (error) {
        console.error("Fetch Single Expense Error:", error);

        return res.status(500).json({
            message: "Server error while fetching expense"
        });
    }
});


// ==========================================
// 4. UPDATE EXPENSE
// PUT /api/expenses/:id
// ==========================================

router.put("/:id", authMiddleware, async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({
                message: "Invalid expense ID"
            });
        }

        const allowedFields = [
            "title",
            "amount",
            "category",
            "date",
            "paymentMethod"
        ];

        const updates = {};

        allowedFields.forEach((field) => {
            if (req.body[field] !== undefined) {
                updates[field] = req.body[field];
            }
        });

        if (Object.keys(updates).length === 0) {
            return res.status(400).json({
                message: "Please provide at least one field to update"
            });
        }

        if (updates.title !== undefined) {
            if (typeof updates.title !== "string" || !updates.title.trim()) {
                return res.status(400).json({
                    message: "Title cannot be empty"
                });
            }

            updates.title = updates.title.trim();
        }

        if (updates.amount !== undefined) {
            if (
                !Number.isFinite(Number(updates.amount)) ||
                Number(updates.amount) <= 0
            ) {
                return res.status(400).json({
                    message: "Amount must be greater than zero"
                });
            }

            updates.amount = Number(updates.amount);
        }

        if (updates.date !== undefined && isNaN(Date.parse(updates.date))) {
            return res.status(400).json({
                message: "Please provide a valid date"
            });
        }

        const updatedExpense = await Expense.findOneAndUpdate(
            {
                _id: id,
                user: req.user.userId
            },
            updates,
            {
                new: true,
                runValidators: true
            }
        );

        if (!updatedExpense) {
            return res.status(404).json({
                message: "Expense not found"
            });
        }

        return res.status(200).json({
            message: "Expense updated successfully",
            expense: updatedExpense
        });

    } catch (error) {
        console.error("Update Expense Error:", error);

        if (error.name === "ValidationError" || error.name === "CastError") {
            return res.status(400).json({
                message: "Invalid expense details",
                error: error.message
            });
        }

        return res.status(500).json({
            message: "Server error while updating expense"
        });
    }
});


// ==========================================
// 5. DELETE EXPENSE
// DELETE /api/expenses/:id
// ==========================================

router.delete("/:id", authMiddleware, async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({
                message: "Invalid expense ID"
            });
        }

        const deletedExpense = await Expense.findOneAndDelete({
            _id: id,
            user: req.user.userId
        });

        if (!deletedExpense) {
            return res.status(404).json({
                message: "Expense not found"
            });
        }

        return res.status(200).json({
            message: "Expense deleted successfully"
        });

    } catch (error) {
        console.error("Delete Expense Error:", error);

        return res.status(500).json({
            message: "Server error while deleting expense"
        });
    }
});


// ==========================================
// EXPORT ROUTER
// ==========================================

module.exports = router;
