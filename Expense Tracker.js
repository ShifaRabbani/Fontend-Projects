// Get all the input boxes and buttons
let expenses = [];
const descriptionInput = document.getElementById('description');
const amountInput = document.getElementById('amount');
const categorySelect = document.getElementById('category');

// console.log("Got all HTML elements!");

const AddExpense = (event) => {
    event.preventDefault();
    const description = descriptionInput.value;
    const amount = parseFloat(amountInput.value);
    const category = categorySelect.value;  
    
    if (description === '' || isNaN(amount) || category === '') {
        alert('Please fill in all fields correctly.');
        return;
    }
    
    console.log("All Field Fields!");
    
    //  ************************STEP 4: CREATE & STORE EXPENSE OBJECT**********88
    const newExpense = {
        id: Date.now(),
        name: description,
        amount: amount,
        category: category,  
        date: "Today"
    };
    expenses.push(newExpense);
    
    // **********************Clear form inputs***************
    descriptionInput.value = '';
    amountInput.value = '';
    categorySelect.value = '';
    
    console.log("Expense Added:", newExpense);
    console.log("All Expenses:", expenses);
     displayExpenses();
}

// Event listener should be OUTSIDE function
document.getElementById('expenseForm').addEventListener('submit', AddExpense);

// **********************Step 5 DISPLAY EXPENSES ON SCREEN*****************
// Step 5: Display expenses on screen
const displayExpenses = () => {
    // 1. Get the display area
    const expensesList = document.getElementById('expensesList');
  
    // 2. Clear old list
    expensesList.innerHTML = '';
    
    // 3. Check if empty
    if (expenses.length === 0) {
        expensesList.innerHTML = '<div class="empty-state">No expenses yet</div>';
        return;
    }
    
    // 4. Loop through each expense
    expenses.forEach(expense => {
        // 5. Create div for each expense
        const expenseItem = document.createElement('div');
        expenseItem.className = `expense-item ${expense.category}`;
        
        // 6. Add HTML content
       expenseItem.innerHTML = `
    <div style="display: flex; justify-content: space-between; align-items: center; width: 100%;">
        <div>
            <strong>${expense.name}</strong>
            <p>${expense.category} • ${expense.date}</p>
        </div>
        <div>₹${expense.amount}</div>
        <button class="delete-btn" onclick="deleteExpense(${expense.id})">X</button>
    </div>
`;
         
        // 7. Add to screen
        expensesList.appendChild(expenseItem);
    });


}


function deleteExpense(id) {
    if (confirm('Delete this expense?')) {
        expenses = expenses.filter(expense => expense.id !== id);
        displayExpenses();
    }
}