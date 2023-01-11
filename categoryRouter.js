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
        res.status(400).send();
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

module.exports = categoryRouter;