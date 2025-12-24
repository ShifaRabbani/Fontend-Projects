// Get all the input boxes and buttons
let expenses = [];


const descriptionInput = document.getElementById('description');
const amountInput = document.getElementById('amount');
const categorySelect = document.getElementById('category');

const categories = ['All', 'Food', 'Transport', 'Entertainment', 'Shopping', 'Bills', 'Health', 'Education', 'Other'];


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
   
    
    // console.log("All Field Fields!");
    
    //  ************************STEP 4: CREATE & STORE EXPENSE OBJECT**********88
    const newExpense = {
        id: Date.now(),
        name: description,
        amount: amount,
        category: category,  
        date: "Today"
    };
    expenses.push(newExpense);
    calculateTotal(); // Update total after adding expense
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
    calculateTotal(); // Update total whenever expenses are displayed
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
calculateTotal();  // Add this
    }
}
// ******************************* CALCULATE TOTAL*******************************
function calculateTotal() {
    const total = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    document.getElementById('totalAmount').textContent = `₹${total.toFixed(2)}`;
    document.getElementById('totalCount').textContent = `${expenses.length} expenses`;
    console.log("calculateTotal called!");
    console.log("totalAmount element:", document.getElementById('totalAmount'));
    console.log("totalCount element:", document.getElementById('totalCount'));
}
// Initialize the app
displayExpenses();
createFilterButtons();  // This will create filter buttons
calculateTotal();       // This will update total display

  // Add this call to initialize total on page load
// *************************FILTER EXPENSES BY CATEGORY*************************
// ******************FILTER BY CATEGORY*************
// const categories = ['All', 'Food', 'Transport', 'Entertainment', 'Shopping', 'Bills', 'Health', 'Education', 'Other'];
let currentFilter = 'All';

function createFilterButtons() {
    const filterContainer = document.getElementById('categoryFilters'); // FIXED ID
    filterContainer.innerHTML = '';
    
    categories.forEach(category => {
        const button = document.createElement('button');
        button.className = 'category-btn'; // ADD CLASS
        button.textContent = category;
        button.onclick = () => filterExpenses(category);
        filterContainer.appendChild(button);
    });
}

function filterExpenses(category) {
    currentFilter = category;
    const expensesList = document.getElementById('expensesList');
    expensesList.innerHTML = '';
    
    const filteredExpenses = category === 'All' 
        ? expenses 
        : expenses.filter(expense => expense.category === category);
    
    if (filteredExpenses.length === 0) {
        expensesList.innerHTML = '<div class="empty-state">No expenses in this category</div>';
        return;
    }
    
    filteredExpenses.forEach(expense => {
        const expenseItem = document.createElement('div');
        expenseItem.className = `expense-item ${expense.category}`; 
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
        expensesList.appendChild(expenseItem);
    });
    
    // Update active button
    document.querySelectorAll('.category-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.textContent === category) {
            btn.classList.add('active');
        }
    });
}

// Update displayExpenses to respect filter
const originalDisplayExpenses = displayExpenses;
displayExpenses = function() {
    filterExpenses(currentFilter);
    calculateTotal();
};

createFilterButtons();

// console.log("Filter container:", document.getElementById('categoryFilters'));
// console.log("Categories:", categories);
// Initialize everything
document.addEventListener('DOMContentLoaded', function() {
    displayExpenses();
    createFilterButtons();
    calculateTotal();
});
// ****************************** SORTING EXPENSES *******************************

// Future enhancement: Implement sorting functionality here

// Sorting function
function sortExpenses(sortType) {
    let sortedExpenses = [...expenses]; // Copy array
    
    if (sortType === 'amount-high') {
        sortedExpenses.sort((a, b) => b.amount - a.amount);
    } else if (sortType === 'amount-low') {
        sortedExpenses.sort((a, b) => a.amount - b.amount);
    }
    // 'date' = keep original order (newest first)
    
    // Display sorted expenses
    displaySortedExpenses(sortedExpenses);
}

// Display sorted expenses
function displaySortedExpenses(sortedArray) {
    const expensesList = document.getElementById('expensesList');
    expensesList.innerHTML = '';
    
    if (sortedArray.length === 0) {
        expensesList.innerHTML = '<div class="empty-state">No expenses yet</div>';
        return;
    }
    
    sortedArray.forEach(expense => {
        const expenseItem = document.createElement('div');
        expenseItem.className = `expense-item ${expense.category}`;
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
        expensesList.appendChild(expenseItem);
    });
}

// Add click events to sort buttons
document.addEventListener('DOMContentLoaded', function() {
    const sortButtons = document.querySelectorAll('.sort-btn');
    
    sortButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            sortButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');
            // Get sort type
            const sortType = this.getAttribute('data-sort');
            // Sort expenses
            sortExpenses(sortType);
        });
    });
});


