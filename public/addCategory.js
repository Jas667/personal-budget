const addCategoryButton = document.getElementById('add-category-button');

addCategoryButton.addEventListener('click', () => {
    const categoryName = document.getElementById('category-name-input').value;
    const categoryBudget = document.getElementById('category-budget-input').value;
    fetch(`http://localhost:3000/api/budget/add-category?categoryName=${categoryName}&catgeoryBudget=${categoryBudget}`, {
        method: "PUT"
    })
    .then((response) => {
        if(response.ok) {
            location.reload();
            return response.json();
        }
    })
    .catch((error) => {
        console.log(response.status);
    })
})