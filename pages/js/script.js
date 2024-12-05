function toggleMenu() {
    const menu = document.getElementById('navMenu');
    menu.classList.toggle('open');
}

// Function to add items to the cart
function addToCart() {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    // Add a default product (for example purposes)
    const newItem = {
        name: 'Sample Product',
        price: 100, // Replace with dynamic price
        quantity: 1,
        image: 'path/to/image.jpg', // Replace with actual image path
        alt: 'Sample Product',
    };

    // Check if item already exists in cart
    const existingItemIndex = cart.findIndex((item) => item.name === newItem.name);
    if (existingItemIndex > -1) {
        cart[existingItemIndex].quantity += 1;
    } else {
        cart.push(newItem);
    }

    // Save updated cart to localStorage
    localStorage.setItem('cart', JSON.stringify(cart));

    // Update cart count
    updateCartCount();
}

// Function to update cart count
function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);

    const cartCountElement = document.getElementById('cartCount');
    if (cartCountElement) {
        cartCountElement.textContent = totalItems; // Update the displayed count
    }

    // Save cart count to localStorage for synchronization
    localStorage.setItem('cartCount', totalItems);
}

// Load cart count on page load
document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();
});
