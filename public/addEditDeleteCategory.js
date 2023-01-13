const addCategoryButton = document.getElementById('add-category-button');

addCategoryButton.addEventListener('click', () => {
    const categoryName = document.getElementById('category-name-input').value;
    const categoryBudget = document.getElementById('category-budget-input').value;
    fetch(`http://localhost:3000/api/budget/add-category?categoryName=${categoryName}&catgeoryBudget=${categoryBudget}`, {
        method: "PUT"
    })
    .then((response) => {
         if (response.ok) {
         location.reload();
         }
        return response.json();
    })
    .then((data) => {
        if (data.invalid) {
            window.alert(data.invalid)
        } else {
            location.reload();
        }
    })
    .catch((error) => {
        console.log(error);
    })
})

//edit category start budget

const editCategoryStartBudgetButton = document.getElementById('edit-starting-budget-button');

editCategoryStartBudgetButton.addEventListener('click', () => {
    const idOfCategoryToChange = document.getElementById('id-to-change-start-budget').value;
    const newStartBudget = document.getElementById('new-start-budget').value;
    const newCategoryName = document.getElementById('new-category-name').value;

    fetch(`http://localhost:3000/api/budget/edit-category-budget-or-name?id=${idOfCategoryToChange}&newStartBudget=${newStartBudget}&newCategoryName=${newCategoryName}`, {
        method: "PUT"
    })
    .then((response) => {
        if (response.ok) {
            location.reload();
        }
        return response.json();
    })
    //I EDITED THIS SECTION IT MAY NEED CORRECTED!!
    .then((data) => {
        if (data.invalid) {
            window.alert(data.invalid)
        }
    })
    .catch((error) => {
        console.log(error)
    })
})

const deleteCategoryButton = document.getElementById('delete-category-button');

deleteCategoryButton.addEventListener('click', () => {
    const idToDelete = document.getElementById('category-id-to-delete').value;

    fetch(`http://localhost:3000/api/budget/delete-category?id=${idToDelete}`, {
        method: "DELETE"
    })
    .then((response) => {
        if (response.ok) {
        location.reload();
        }
        return response.json();
    })
    .then((data) => {
        if (data.invalid) {
            window.alert(data.invalid);
        }
    })
    .catch((error) => {
        console.log(error);
    })
})