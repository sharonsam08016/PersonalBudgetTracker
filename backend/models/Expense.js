
const mongoose = require("mongoose");

const expenseSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true
        },

        amount: {
            type: Number,
            required: true,
            min: 0.01
        },

        category: {
            type: String,
            required: true,
            enum: [
                "Food",
                "Travel",
                "Shopping",
                "Healthcare",
                "Education",
                "Others"
            ]
        },

        date: {
            type: Date,
            required: true
        },

        paymentMethod: {
            type: String,
            required: true,
            enum: [
                "Cash",
                "UPI",
                "Credit Card",
                "Debit Card"
            ]
        },

        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        }
    },
    {
        timestamps: true
    }
);

const Expense = mongoose.model("Expense", expenseSchema);

module.exports = Expense;
