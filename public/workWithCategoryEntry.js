const categoryIdSelectButton = document.getElementById('category-id-selection-button');
const categoryIdSelectDiv = document.getElementById('category-div-to-show-and-hide');
const expensesDiv = document.getElementById('expenses-display');

const editAddDeleteDiv = document.getElementById('editAddDeleteDivSection');

const returnToCategorySelectorButton = document.getElementById('button-to-return-to-category-select');


const showAddEditDeleteSection = () => {
    categoryIdSelectDiv.style.display = 'none';
    editAddDeleteDiv.style.display = 'block';
}

const backToCategorySelectorSection = () => {
    categoryIdSelectDiv.style.display = 'block';
    editAddDeleteDiv.style.display = 'none';  
}
//used to clear displayed expenses each time we change category
const clearPreviousExpenses = () => {
    expensesDiv.innerHTML = '';
}

//display only the chosen category and category expenses
const selectedCategoryAndExpenses = (selectedCategory = {}) => {
    //Hide current categories
    clearAllCategories();

    //show category to display
    const categorytoShow = document.createElement('div');
    categorytoShow.classList.add('budget-figures');
    categorytoShow.innerHTML = `<div class="categoryText">${selectedCategory.category}<p>Starting Budget: £${selectedCategory.budget}<p>Remaining Budget: £${selectedCategory.remaining}</div>`;
    categoryDisplay.appendChild(categorytoShow);
}

//display all of the expenses for the category. If no expenses, display message showing expenses being empty
const displayExpensesForChosenCategory = (selectedCategory = {}) => {
    clearPreviousExpenses();
    const expenses = selectedCategory.expenses;
    if (expenses.length > 0) {
        expenses.forEach((expense) => {
            const expenseToShow = document.createElement('div');
            expenseToShow.classList.add('individual-expense');
            expenseToShow.innerHTML = `<div>Expense ID: ${expense.id} Expense Date: ${expense.date} Expense Amount: £${expense.amount}</div>`
            expensesDiv.appendChild(expenseToShow);
        })
    } else {
        const expenseToShow = document.createElement('div');
        expenseToShow.classList.add('individual-expense');
        expenseToShow.innerHTML = `<div>No expenses to display for this category yet.</div>`
        expensesDiv.appendChild(expenseToShow);
    }
}

//
categoryIdSelectButton.addEventListener('click', () => {
    //get value of selected id
    const selectedId = document.getElementById('category-id-selection').value;
    fetch(`http://localhost:3000/api/budget/show-single-category?selectedId=${selectedId}`)
    .then((response) => {
        if (response.ok) {
            //take away the button to select single category if response is ok. Also, display sections to edit individual entries
            showAddEditDeleteSection();
            return response.json();
        } else {
            window.alert('Please choose a valid ID')
            console.log(response.status);
        }
    })
    .then((data) => {
        selectedCategoryAndExpenses(data.selectedCategory);
        displayExpensesForChosenCategory(data.selectedCategory);
    })

})

returnToCategorySelectorButton.addEventListener('click', () => {
    backToCategorySelectorSection();
})

//select and display single category and all expenses


