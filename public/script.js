const categoryDisplay = document.getElementById('category-display');
const balanceDisplay = document.getElementById('balance-display');
//I will use indexHTML id as a way to specify what data to load as each page is opened. This is because pages need to display different info on load
const indexHTML = document.getElementById('index');
const editHTML = document.getElementById('edit');
const addOrEditCategory = document.getElementById('addoreditcategory');
const editCategoryExpense = document.getElementById('category-expense-edit');


//functions to clear all innerHTML. This will allow me to reset figures.
const clearAllCategories = () => {
    categoryDisplay.innerHTML = '';
};
const clearCurrentBalance = () => {
    balanceDisplay.innerHTML = '';
}

const currentBalance = (categories = [], arrOfCategoryObjects = []) => {
    clearCurrentBalance();
    //display starting balance
    const startBalance = document.createElement('div');
    startBalance.classList.add('budget-figures');
    startBalance.innerHTML = `<div class="balance-info">Monthly Income: <p>£${categories.startingBalance}</div>`;
    balanceDisplay.appendChild(startBalance);
    //now check if there are any categories in array. If not, advise to update.
    if (categories.startingBalance === 0) {
        const noInfo = document.createElement('div');
        noInfo.classList.add('budget-figures');
        noInfo.innerHTML = `<div class="balance-info">You haven't set up a budget yet. Add categories using '+' and set income with 'Set Income'.</div>`;
        balanceDisplay.appendChild(noInfo);
        return;
    }
    //work out total budget assigned from categories so it can be displayed
    arrOfCategoryObjects.forEach((element) => {
        categories.totalBudget += element.budget
    });
    //work out remaining budget now that we know the monthly income and the total expenditure in each category
    categories.remainingBudget = categories.startingBalance - categories.totalBudget;

    //display totals in their own divs so we can see remaining budgets. Have messages display to warn of potential overspends
    if (categories.totalBudget <= categories.startingBalance) {
        const totalB = document.createElement('div');
        totalB.classList.add('budget-figures');
        totalB.innerHTML = `<div class="balance-info">Total Budget Assigned By You: <p>${categories.totalBudget}</div>`
        balanceDisplay.appendChild(totalB);
    } else {
        //what to display if assigned too much budget
        const totalB = document.createElement('div');
        totalB.classList.add('budget-figures');
        totalB.innerHTML = `<div class="balance-info">You have assigned too much of your budget.: <p>${categories.totalBudget}</div>`
        balanceDisplay.appendChild(totalB);
    }

    //same again for remaining budget
    if (categories.remainingBudget < 0) {
        const remainingB = document.createElement('div');
        remainingB.classList.add('budget-figures');
        remainingB.innerHTML = `<div class="balance-info">Remaining Budget: <p>${categories.remainingBudget}</div>`
        remainingB.setAttribute('id', 'loss');
        balanceDisplay.appendChild(remainingB);
    } else {
        //what to display if assigned too much budget
        const remainingB = document.createElement('div');
        remainingB.classList.add('budget-figures');
        remainingB.innerHTML = `<div class="balance-info">Remaining Budget: <p>${categories.remainingBudget}</div>`;
        remainingB.setAttribute('id', 'profit');
        balanceDisplay.appendChild(remainingB);
    }
}

//function to display all categories
const renderCategories = (categories = []) => {
    clearAllCategories();
    //check to make sure there is an input to display. If not, ask for one.
    if (categories.length > 0) {
        categories.forEach((category) => {
            const expensesForCategory = category.expenses;
            //variable to tally up all expenses
            let totalExpenses = 0;
            //iterate through each expense and add to total expense
            expensesForCategory.forEach((expense) => {
                totalExpenses += expense.amount;
            })
            //work out remaining budget by taking expenses away from starting budget
            category.remaining = category.budget - totalExpenses;
        })
        //iterate through each category and for each, extract info and display it to user
        categories.forEach((object) => {
            const category = document.createElement('div');
            category.classList.add('budget-figures');
            category.innerHTML = `<div class="categoryText">${object.category}<p>Starting Budget: £${object.budget}<p>Remaining Budget: £${object.remaining}</div>`;
            categoryDisplay.appendChild(category);
        });
    } else {
        const category = document.createElement('div');
        category.classList.add('budget-figures');
        category.innerHTML = `<div class="categoryText">No categories found. Please add a category using the + sign.</div>`;
        categoryDisplay.appendChild(category);
    }};
    //this will include the ID when rendering categories. This will allow for easy selection of category to edit
    const renderCategoriesWithId = (categories = []) => {
        clearAllCategories();
        //check to make sure there is an input to display. If not, ask for one.
        if (categories.length > 0) {
            //Iterate through each category so we can extract expenses and subtract them from starting budget
            categories.forEach((category) => {
                const expensesForCategory = category.expenses;
                //variable to tally up all expenses
                let totalExpenses = 0;
                //iterate through each expense and add to total expense
                expensesForCategory.forEach((expense) => {
                    totalExpenses += expense.amount;
                })
                //work out remaining budget by taking expenses away from starting budget
                category.remaining = category.budget - totalExpenses;
            })
            
            //iterate through each category and for each, extract info and display it to user
            categories.forEach((object) => {
                const category = document.createElement('div');
                category.classList.add('budget-figures');
                category.innerHTML = `<div class="categoryText">${object.category}<p><b>ID: ${object.id}</b><p>Starting Budget: £${object.budget}<p>Remaining Budget: £${object.remaining}</div>`;
                categoryDisplay.appendChild(category);
            });
        } else {
            const category = document.createElement('div');
            category.classList.add('budget-figures');
            category.innerHTML = `<div class="categoryText">No categories found. Please add a category using the + sign.</div>`;
            categoryDisplay.appendChild(category);
        }
    };

//run on load of main page. This will allow for categories to be displayed as well as balance    
window.addEventListener('load', () => {
    fetch('http://localhost:3000/api/budget')
    .then((response) => {
        if (response.ok) {
            return response.json();
        } else {
            console.log(response.status);
        }
    })
    .then((response) => {
        if (indexHTML) {
            renderCategories(response.categories.categories);
            currentBalance(response.categories, response.categories.categories);
        } else if (editHTML || addOrEditCategory) {
            currentBalance(response.categories, response.categories.categories);
            renderCategoriesWithId(response.categories.categories);
        } else if (editCategoryExpense) {
            currentBalance(response.categories, response.categories.categories);
            // renderCategoriesWithId(response.categories.categories);
        } else {
            currentBalance(response.categories, response.categories.categories);
        }
    })
})

