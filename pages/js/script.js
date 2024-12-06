function toggleMenu() {
    const menu = document.getElementById('navMenu');
    menu.classList.toggle('open');
}

// Initialize cart count
let cartCount = 0;

// Function to add items to the cart
function addToCart() {
    cartCount++;
    console.log("Add to Cart clicked. Current cart count:", cartCount); // Debugging log
    updateCartCount();
    saveCartCount();
}

// Function to update the cart count
function updateCartCount() {
    const cartCountElement = document.getElementById('cartCount');
    if (cartCountElement) {
        cartCountElement.textContent = cartCount; // Update the displayed count
        console.log("Cart count updated in DOM:", cartCount);
    } else {
        console.error("Cart count element not found.");
    }
}

// Save the cart count to localStorage
function saveCartCount() {
    localStorage.setItem('cartCount', cartCount);
    console.log("Cart count saved to localStorage:", cartCount);
}

// Load the cart count from localStorage on page load
document.addEventListener('DOMContentLoaded', () => {
    const savedCartCount = localStorage.getItem('cartCount');
    if (savedCartCount) {
        cartCount = parseInt(savedCartCount, 10);
        updateCartCount();
    }
});
