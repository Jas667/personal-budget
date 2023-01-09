const categoryDisplay = document.getElementById('category-display');
const balanceDisplay = document.getElementById('balance-display');
//I will use indexHTML id as a way to specify what data to load as each page is opened. This is because pages need to display different info on load
const indexHTML = document.getElementById('index')

//functions to clear all innerHTML. This will allow me to reset figures.
const clearAllCategories = () => {
    categoryDisplay.innerHTML = '';
};
const clearCurrentBalance = () => {
    balanceDisplay.innerHTML = '';
}

const currentBalance = (categories = []) => {
    clearCurrentBalance();
    //display starting balance
    const startBalance = document.createElement('div');
    startBalance.classList.add('budget-figures');
    startBalance.innerHTML = `<div class="balance-info">Monthly Income: <p>£${categories.startingBalance}</div>`;
    balanceDisplay.appendChild(startBalance);

    //now check if there are any categories in array. If not, advise to update.
    if (categories.length > 0) {
        categories.forEach((object) => {
            categories.totalBudget += object.budget;
            categories.remainingBudget += object.remaining;
        })
    } else {
        const noInfo = document.createElement('div');
        noInfo.classList.add('budget-figures');
        noInfo.innerHTML = `<div class="balance-info">You haven't set up a budget yet. Add categories using '+' and set income with 'Set Income'.</div>`;
        balanceDisplay.appendChild(noInfo);
        return;
    }

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
        balanceDisplay.appendChild(remainingB);
    } else {
        //what to display if assigned too much budget
        const remainingB = document.createElement('div');
        remainingB.classList.add('budget-figures');
        remainingB.innerHTML = `<div class="balance-info">Remaining Budget: <p>${categories.remainingBudget}</div>`
        balanceDisplay.appendChild(remainingB);
    }
}

//function to display all categories
const renderCategories = (categories = []) => {
    clearAllCategories();
    //check to make sure there is an input to display. If not, ask for one.
    if (categories.length > 0) {
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
            renderCategories(response.categories);
            currentBalance(response.categories);
        } else {
            currentBalance(response.categories);
        }
    })
})

