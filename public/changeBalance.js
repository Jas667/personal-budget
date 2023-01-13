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
        } else if (response.status === 400){
            return response.json();
        } else {
            throw new Error(response.status)
        }

    })
    .then((data) => {
        window.alert(data.invalid)
    })
    .catch((error) => {
        console.log(error);
    })
})
