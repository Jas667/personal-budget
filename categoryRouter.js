const express = require('express');
const categoryRouter = express.Router();
const categories = require('./data.js');

categoryRouter.get('/', (req, res) => {
    res.send({categories: categories})
})

categoryRouter.put('/new-budget', (req, res) => {
    const newBudget = Number(req.query.budget);

    if (newBudget) {
        categories.startingBalance = newBudget;
        res.status(200).send({categories: categories});
    } else {
        res.status(400).send({invalid: 'Please use only numbers as input for income.'});
    }
})
//used to add a category
categoryRouter.put('/add-category', (req, res) => {
    //variables to store the inputs from html page. These will form basis of new category
    const newCategory = String(req.query.categoryName);
    const categoryBudget = Number(req.query.catgeoryBudget);
    //variable to find if category already exists. If it does, an error will be returned.
    const doesCategoryAlreadyExist = categories.categories.findIndex((object) => object.category == newCategory);
    //check all inputs are valid and category does not already exist
    if (newCategory && categoryBudget && doesCategoryAlreadyExist === -1) {
        //new object to push to array of categories
        const categoryObject = {
            id: categories.categories.length + 1,
            category: newCategory,
            budget: categoryBudget,
            remaining: 0,
            expenses: []
        }

        categories.categories.push(categoryObject);
        res.status(201).send({categories: categories});
    } else {
        res.status(400).send();
    }
})

//get id of specific category in order to display that categories expenses
categoryRouter.get('/show-single-category', (req, res) => {
    const selectedId = Number(req.query.selectedId);
    const lengthOfCategoriesArray = categories.categories.length;

    if (selectedId > 0 && selectedId <= lengthOfCategoriesArray) {
        res.status(200).send({selectedCategory: categories.categories[selectedId - 1]});
    } else {
        res.status(404).send('Id Not Found')
    }
})

categoryRouter.delete('/delete', (req, res) => {
    //id of expense to delete
    const chosenId = Number(req.query.deleteId)
    //this is the category currently displayed to user and the category expenses should be deleted from
    const selectedCategory = categories.categories[Number(req.query.categoryIndex)]
    //this is the expenses of the selected category
    const expensesofCategory = selectedCategory.expenses;
    //find if expense chosen exists. If not, send back error
    if (expensesofCategory[chosenId - 1]) {
        expensesofCategory.splice(chosenId - 1, 1)
        //variable to start numbering expense IDs after one has been deleted
        let startId = 1;
        //then we will go back through the remaining expenses and update the ID so that they now match the remaining list of expenses
        expensesofCategory.forEach((expense) => {
            expense.id = startId;
            startId ++;
        })
        res.status(200).send({selectedCategory: selectedCategory});
    } else {
        res.status(400).send();
    }
})

categoryRouter.put('/add', (req, res) => {
    //get date and expense amount from query
    const newDate = String(req.query.date);
    const newAmount = Number(req.query.amount);
    //current selected category. This will make sure the expense is being added to the correct category
    const selectedCategory = categories.categories[Number(req.query.categoryIndex)];
    //work out new ID number depending on number of expenses currently in expenses of selected category
    const newId = selectedCategory.expenses.length + 1;
    //test if inputs match required length/type
    if (newDate && newDate.length === 8 && newAmount) {
        //new expense added to category expenses
        selectedCategory.expenses.push({id: newId, date: newDate, amount: newAmount});
        res.status(201).send({selectedCategory: selectedCategory})
    } else if (newDate.length != 8 || !newDate) {
        res.status(400).send({invalid: 'Please enter date in format dd/mm/yy'});
    } else if (newAmount === 0 || newAmount === undefined) {
        res.status(400).send({invalid: 'Please enter an amount using numbers'});
    } else {
        res.status(400).send({invalid: 'Please enter a date in format dd/mm/yy and an expense amount'});
    }
    
})

categoryRouter.put('/edit', (req, res) => {
    //get all info from req to work with
    const selectedCategory = categories.categories[Number(req.query.categoryIndex)];
    const idToEdit = Number(req.query.idToEdit);
    const editedDate = String(req.query.dateToEdit);
    const editedAmount = Number(req.query.amountToEdit);
    //the expense to edit
    const expenseToEdit = selectedCategory.expenses[idToEdit - 1];

    //check if the expense id is valid before editing. If not, send back an error
    if (expenseToEdit) {
        //nested if statements to check if each input has been added
        if (editedDate && editedDate.length === 8 && !editedAmount) {
            expenseToEdit.date = editedDate;
            res.status(202).send({selectedCategory: selectedCategory});
        } else if (editedAmount && !editedDate) {
            expenseToEdit.amount = editedAmount;
            res.status(202).send({selectedCategory: selectedCategory});
        } else if (editedDate && editedDate.length === 8 && editedAmount) {
            expenseToEdit.date = editedDate;
            expenseToEdit.amount = editedAmount;
            res.status(202).send({selectedCategory: selectedCategory});
        } else if (editedDate && !editedDate.length === 8) {
            res.status(405).send()
        } else {
            res.status(405).send()
        }
    } else {
        res.status(404).send()
    }
})

categoryRouter.put('/edit-category-budget-or-name', (req, res) => {
    //get id and new start budget
    const idToChange = Number(req.query.id);
    const newStartBudget = Number(req.query.newStartBudget);
    const newCategoryName = String(req.query.newCategoryName);

    if (idToChange && newStartBudget && !newCategoryName) {
        categories.categories[idToChange - 1].budget = newStartBudget;
        res.status(200).send()
    } else if (idToChange && newCategoryName && !newStartBudget) {
        categories.categories[idToChange - 1].category = newCategoryName;
        res.status(200).send()
    } else if (idToChange && newCategoryName && newStartBudget) {
        categories.categories[idToChange - 1].category = newCategoryName;
        categories.categories[idToChange - 1].budget = newStartBudget;
        res.status(200).send()
    } else {
        res.status(400).send();
    }
})

//delete category
categoryRouter.delete('/delete-category', (req, res) => {
    const idToDeleteAsIndex = Number(req.query.id - 1);
    const categoriesToWorkWith = categories.categories

    if (categoriesToWorkWith[idToDeleteAsIndex]) {
        categoriesToWorkWith.splice(idToDeleteAsIndex, 1);
        //now we need to reset all of the IDs so that they are in numerical order.
        let newId = 1;
        categoriesToWorkWith.forEach((category) => {
            category.id = newId;
            newId ++
        })
        res.status(204).send();
    } else {
        res.status(400).send();
    }
    
})

module.exports = categoryRouter;