//variable to store starting balance for budget
let startingBalance = 0;
let totalBudget = 0;
let remainingBudget = 0;

const categories = [
    {
        id: 1,
        category: "Groceries",
        budget: 0,
        remaining: 0,
        expenses: []
    },

    {
        id: 2,
        category: "Petrol",
        budget: 0,
        remaining: 0,
        expenses: []
    }
]

module.exports = {categories, startingBalance, totalBudget, remainingBudget};