// ============================================
// STEP 1: GET ALL HTML ELEMENTS
// ============================================

const itemName = document.getElementById("itemName");
const itemPrice = document.getElementById("itemPrice");
const itemsList = document.getElementById("itemsList");
const emptyCartMessage = document.getElementById("emptyCartMessage");
const addItemBtn = document.getElementById("addItemBtn");

// ============================================
// STEP 2: CREATE CART STORAGE
// ============================================

// Array to store all cart items
// Starts empty, will hold item objects
let cartItem = [];

// ============================================
// STEP 3: FUNCTION TO ADD ITEM TO CART
// ============================================

/**
 * Adds a new item to the shopping cart
 * 1. Gets values from input fields
 * 2. Validates the inputs
 * 3. Creates item object
 * 4. Adds to cart array
 * 5. Clears inputs
 * 6. Updates display
 */
const addItemToCart = () => {
    const item = itemName.value;  // Get the text value from item name input
    const price = parseFloat(itemPrice.value); // Get the numeric value from price input

    // VALIDATION: Check if inputs are valid
    // 1. Item name cannot be empty
    // 2. Price must be a valid number
    // 3. Price must be greater than 0
    if (item === '' || isNaN(price) || price <= 0) {
        alert("Please enter a valid name and price");
        return; // Stop function if invalid
    }

    // CREATE ITEM OBJECT
    const newItem = {  // Each item has: unique ID, name, price, and quantity
        id: Date.now(), // Creates unique ID using current timestamp
        name: item,     // Item name from input
        price: price,   // Item price from input
        quantity: 1     // Start with quantity 1
    };

    // ADD TO CART ARRAY
    cartItem.push(newItem);  // Push the new item object to our cart array

    // CLEAR INPUT FIELDS
    itemName.value = "";
    itemPrice.value = "";

    // UPDATE DISPLAY
    updateDisplay();    // Call function to refresh what user sees
    console.log("Cart items:", cartItem);   // DEBUG: Show cart in console (F12 to see)
};

// ============================================
// STEP 4: FUNCTION TO DISPLAY CART ITEMS
// ============================================

/**
 * Updates the visual display of cart items
 * 1. Clears current display
 * 2. Shows empty message if cart is empty
 * 3. Creates HTML for each item if cart has items
 * 4. Calculates and shows total
 */
const updateDisplay = () => {
    itemsList.innerHTML = '';   // Clear the entire items list container

    if (cartItem.length === 0) {    // CHECK IF CART IS EMPTY
        // Show empty cart message
        // This assumes emptyCartMessage element exists in HTML
        if (emptyCartMessage) {
            emptyCartMessage.style.display = 'block';
        }
        calculateTotal();                   // Also update total to show $0.00
        return; // Stop function here, nothing else to display
    }

    // HIDE EMPTY CART MESSAGE (since we have items)
    if (emptyCartMessage) {
        emptyCartMessage.style.display = 'none';
    }

    // LOOP THROUGH ALL ITEMS IN CART
    cartItem.forEach((item, index) => {
        const itemElement = document.createElement('div');  // Create a new div element for this item
        
        // Add CSS class for styling
        itemElement.className = 'cart-item';
        
        // Create HTML content for this item
        // Shows: name, price, quantity, and remove button
        itemElement.innerHTML = `
            <div class="item-info">
                <span class="item-name">${item.name}</span>
                <span class="item-price">$${item.price.toFixed(2)}</span>
                <div class="quantity-controls">
                    <button class="qty-btn minus" data-index="${index}">-</button>
                    <span class="quantity">${item.quantity}</span>
                    <button class="qty-btn plus" data-index="${index}">+</button>
                </div>
            </div>
            <button class="remove-btn" data-index="${index}">
                <i class="fas fa-trash"></i> Remove
            </button>
        `;
        itemsList.appendChild(itemElement);   // Add this item to the display container
    });
    // UPDATE TOTALS
    calculateTotal();
    // ADD EVENT LISTENERS TO NEW BUTTONS
    // This connects the +, -, and Remove buttons to their functions
    addItemEventListeners();
};

// ============================================
// STEP 5: FUNCTION TO CALCULATE TOTAL
// ============================================

/**
 * Calculates and displays:
 * 1. Subtotal (sum of all item prices × quantities)
 * 2. Discount (based on subtotal amount)
 * 3. Total (subtotal - discount)
 */
const calculateTotal = () => {
    let subtotal = 0;
    // Calculate subtotal: price × quantity for each item
    cartItem.forEach(item => {
        subtotal += item.price * item.quantity;
    });
    // CALCULATE DISCOUNT BASED ON RULES:
    let discountRate = 0;
    let discountAmount = 0;
    
    if (subtotal > 5000) {
        discountRate = 0.15; // 15% discount for over $5000
    } else if (subtotal > 2000) {
        discountRate = 0.10; // 10% discount for over $2000
    } else if (subtotal > 500) {
        discountRate = 0.05; // 5% discount for over $500
    }
    // No discount for subtotal $500 or less
    
    discountAmount = subtotal * discountRate;  // Calculate discount amount
    const total = subtotal - discountAmount;    // Calculate final total
    
    // GET DISPLAY ELEMENTS (make sure these exist in your HTML)
    const subtotalElement = document.getElementById('subtotal');
    const discountElement = document.getElementById('discount');
    const totalElement = document.getElementById('totalAmount');
    const discountRateElement = document.getElementById('discountRate');
    const discountSection = document.getElementById('discountSection');
    
    // UPDATE DISPLAY ELEMENTS
    if (subtotalElement) subtotalElement.textContent = `$${subtotal.toFixed(2)}`;
    if (discountElement) discountElement.textContent = `-$${discountAmount.toFixed(2)}`;
    if (totalElement) totalElement.textContent = `$${total.toFixed(2)}`;
    if (discountRateElement) discountRateElement.textContent = `${(discountRate * 100)}%`;
    
    // SHOW/HIDE DISCOUNT SECTION
    if (discountSection) {
        if (discountRate > 0) {
            discountSection.style.display = 'block';
        } else {
            discountSection.style.display = 'none';
        }
    }
};
// ============================================
// STEP 6: FUNCTIONS FOR ITEM CONTROLS
// ============================================

/**
 * Changes quantity of an item
 * @param {number} index - Position of item in cart array
 * @param {number} change - Amount to change (+1 or -1)
 */
const changeQuantity = (index, change) => {
    // Make sure index is valid
    if (index < 0 || index >= cartItem.length) return;
    
    // Update quantity
    cartItem[index].quantity += change;
    
    // Ensure quantity doesn't go below 1
    if (cartItem[index].quantity < 1) {
        cartItem[index].quantity = 1;
    }
    // Refresh display with new quantities
    updateDisplay();
};
/**
 * Removes an item from cart
 * @param {number} index - Position of item to remove
 */
const removeItem = (index) => {
    if (index < 0 || index >= cartItem.length) return;   // Make sure index is valid
    cartItem.splice(index, 1);    // Remove item from array
    updateDisplay();    // Refresh display
};

/**
 * Adds event listeners to all item control buttons
 * This is called every time display is updated
 */
const addItemEventListeners = () => {
    // Get all minus (-) buttons
    const minusButtons = document.querySelectorAll('.minus');
    minusButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const index = parseInt(e.target.getAttribute('data-index'));
            changeQuantity(index, -1); // Decrease quantity
        });
    });
    
    // Get all plus (+) buttons
    const plusButtons = document.querySelectorAll('.plus');
    plusButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const index = parseInt(e.target.getAttribute('data-index'));
            changeQuantity(index, 1); // Increase quantity
        });
    });
    
    // Get all remove buttons
    const removeButtons = document.querySelectorAll('.remove-btn');
    removeButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const index = parseInt(e.target.getAttribute('data-index'));
            removeItem(index); // Remove item
        });
    });
};

// ============================================
// STEP 7: SETUP EVENT LISTENERS
// ============================================

/**
 * Initializes all event listeners when page loads
 */
const initializeApp = () => {
    // Add click listener to "Add to Cart" button
    if (addItemBtn) {
        addItemBtn.addEventListener("click", addItemToCart);
    }
    
    // Allow pressing Enter in name field to add item
    if (itemName) {
        itemName.addEventListener("keypress", (e) => {
            if (e.key === "Enter") {
                addItemToCart();
            }
        });
    }
    
    // Allow pressing Enter in price field to add item
    if (itemPrice) {
        itemPrice.addEventListener("keypress", (e) => {
            if (e.key === "Enter") {
                addItemToCart();
            }
        });
    }
    
    // Initial display setup
    updateDisplay();
    
    console.log("Shopping cart initialized!");
};

// ============================================
// STEP 8: START THE APPLICATION
// ============================================

// Wait for HTML to fully load before running JavaScript
// This prevents errors when trying to access HTML elements
document.addEventListener("DOMContentLoaded", initializeApp);