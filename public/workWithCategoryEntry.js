const categoryIdSelectButton = document.getElementById('category-id-selection-button');
const categoryIdSelectDiv = document.getElementById('category-div-to-show-and-hide');
const expensesDiv = document.getElementById('expenses-display');

const editAddDeleteDiv = document.getElementById('editAddDeleteDivSection');

const returnToCategorySelectorButton = document.getElementById('button-to-return-to-category-select');

//this variable will store the id of the currently shown category. It will be stored as the index position of chosen category
let currentDisplayedExpenseCategory = 0;


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
    //work out totals for category
    const expensesForCategory = selectedCategory.expenses;
    //variable to tally up all expenses
    let totalExpenses = 0;
    //iterate through each expense and add to total expense
    expensesForCategory.forEach((expense) => {
        totalExpenses += expense.amount;
    })
    //work out remaining budget by taking expenses away from starting budget
    selectedCategory.remaining = selectedCategory.budget - totalExpenses;

    //show category to display
    const categorytoShow = document.createElement('div');
    categorytoShow.classList.add('budget-figures');
    categorytoShow.innerHTML = `<div class="categoryText">${selectedCategory.category}<p>Starting Budget: £${selectedCategory.budget}<p>Remaining Budget: £${selectedCategory.remaining}</div>`;
    if (selectedCategory.remaining < 0) {
        categorytoShow.setAttribute('id', 'loss');
    }
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
    currentDisplayedExpenseCategory = Number(selectedId - 1);
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

//Delete Expense
const deleteExpenseButton = document.getElementById('deleteExpense');
const deleteIdInput = document.getElementById('idToDelete');
deleteExpenseButton.addEventListener('click', () => {
const deleteId = document.getElementById('idToDelete').value;

    //get elementId for delete input so it can be cleared once expense is deleted
    fetch(`http://localhost:3000/api/budget/delete?deleteId=${deleteId}&categoryIndex=${currentDisplayedExpenseCategory}`, {
        method: "DELETE"
    })
    .then((response) => {
        if (response.ok) {
            deleteIdInput.innerHTML = '';
        } 
        return response.json();
    })
    .then((data) => {
        if (data.invalid) {
            window.alert(data.invalid);
        } else {
            selectedCategoryAndExpenses(data.selectedCategory);
            displayExpensesForChosenCategory(data.selectedCategory);
        }
    })
    .catch((error) => {
        console.log(error)
    })
})

//add expense

const addExpenseButton = document.getElementById('addExpense');

addExpenseButton.addEventListener('click', () => {
    //get values from inputs
    const expenseDate = document.getElementById('dateForAdd').value;
    const expenseAmount = document.getElementById('expenseAmountForAdd').value;
    //get values of inputs to clear one expense added
    const dateToEditClear = document.getElementById('dateForAdd');
    const amountToEditClear = document.getElementById('expenseAmountForAdd');
    fetch(`http://localhost:3000/api/budget/add?date=${expenseDate}&amount=${expenseAmount}&categoryIndex=${currentDisplayedExpenseCategory}`, {
        method: "PUT"
    })
    .then((response) => {
        if (response.ok) {
            dateToEditClear.value = '';
            amountToEditClear.value = '';
        }
        return response.json();
    })
    .then((data) => {
        if (data.invalid) {
            window.alert(data.invalid);
        } else {
            selectedCategoryAndExpenses(data.selectedCategory);
            displayExpensesForChosenCategory(data.selectedCategory);
        }
    })
    .catch((error) => {
        console.log(error);
    })

})

//edit current expense
const editCurrentExpenseButton = document.getElementById('editExpense');

editCurrentExpenseButton.addEventListener('click', () => {
    //get input values from each input section
    const idToEdit = document.getElementById('idToEdit').value;
    const dateToEdit = document.getElementById('dateToEdit').value;
    const amountToEdit = document.getElementById('editedExpense').value;

    //get id of each section without value so we can clear after click
    const idToEditClear = document.getElementById('idToEdit');
    const dateToEditClear = document.getElementById('dateToEdit');
    const amountToEditClear = document.getElementById('editedExpense');

    fetch(`http://localhost:3000/api/budget/edit?idToEdit=${idToEdit}&dateToEdit=${dateToEdit}&amountToEdit=${amountToEdit}&categoryIndex=${currentDisplayedExpenseCategory}`, {
        method: "PUT"
    })
    .then((response) => {
        if (response.ok) {
            idToEditClear.value = '';
            dateToEditClear.value = '';
            amountToEditClear.value = '';
        }
        return response.json();
    })
    .then((data) => {
        if (!data.invalid) {
            selectedCategoryAndExpenses(data.selectedCategory);
            displayExpensesForChosenCategory(data.selectedCategory);
        } else {
            window.alert(data.invalid);
        }
    })
    .catch((error) => {
        console.log(error);
    })
})


