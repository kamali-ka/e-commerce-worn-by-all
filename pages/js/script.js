// Function to toggle the navigation menu
function toggleMenu() {
  const menu = document.getElementById("navMenu");
  menu.classList.toggle("open");
}

// Function to update cart visibility and user-related buttons/icons
// Function to update cart visibility and user-related buttons/icons
function updateCartVisibility() {
  const isLoggedIn = localStorage.getItem("email"); // Check if user is logged in
  const cartIcon = document.getElementById("cartIcon");
  const loginSignupButton = document.getElementById("loginSignupButton");
  const userIcon = document.getElementById("userIcon");

  if (isLoggedIn) {
      // Show cart icon and user icon, hide login/signup button
      cartIcon.style.display = "block";
      userIcon.style.display = "block";
      loginSignupButton.style.display = "none";
  } else {
      // Hide cart icon and user icon, show login/signup button
      cartIcon.style.display = "none";
      userIcon.style.display = "none";
      loginSignupButton.style.display = "block";
  }
}


// Function to initialize all necessary updates on page load
document.addEventListener("DOMContentLoaded", () => {
  updateCartVisibility(); // Manage visibility of cart and user-related elements
  updateCartCount(); // Initialize cart count with current items
});


// Function to redirect to the Sign In/Sign Up page
function redirectToSignIn() {
  window.location.href = "./pages/html/signup-signin.html";
}

// Function to update the cart count dynamically
function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const totalItems = cart.reduce((total, item) => total + (item.quantity || 1), 0);
  const cartCountElement = document.getElementById("cartCount");

  if (cartCountElement) {
      cartCountElement.textContent = totalItems;
  }
}



