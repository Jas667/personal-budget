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

module.exports = categoryRouter;