const balanceCheck = document.getElementById('new-income');

balanceCheck.addEventListener('click', (req, res) => {
    const newBudgetInput = document.getElementById('income').value
    fetch(`http://localhost:3000/api/budget/new-budget?budget=${newBudgetInput}`, {
        method: "PUT"
    })
    .then((response) => {
        if (response.ok) {
            // location.reload();
            currentBalance(response.categories);
            location.reload();
        } else {
            throw new Error(response.status)
        }
    })
    .catch((error) => {
        console.log(error);
    })
})
