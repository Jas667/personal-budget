const express = require('express');
const categoryRouter = express.Router();
const categories = require('./data.js')

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
    console.log(categories)
    const doesCategoryAlreadyExist = categories.findIndex((object) => object.category == newCategory);
    //check all inputs are valid and category does not already exist
    if (newCategory && categoryBudget && doesCategoryAlreadyExist === -1) {
        //new object to push to array of categories
        const categoryObject = {
            id: categories.length + 1,
            category: newCategory,
            budget: categoryBudget,
            remaining: 0
        }

        categories.push(categoryObject);
        res.status(201).send();
    } else {
        res.status(400).send();
    }
})

module.exports = categoryRouter;