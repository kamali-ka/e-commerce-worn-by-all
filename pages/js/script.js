// Initialize cart count
let cartCount = 0;

// Function to toggle the navigation menu
function toggleMenu() {
  const menu = document.getElementById("navMenu");
  menu.classList.toggle("open");
}

// Function to add items to the cart
function addToCart() {
  cartCount++;
  console.log("Add to Cart clicked. Current cart count:", cartCount); // Debugging log
  updateCartCount();
  saveCartCount();
}

// Function to update the cart count
function updateCartCount() {
  const cartCountElement = document.getElementById("cartCount");
  if (cartCountElement) {
    cartCountElement.textContent = cartCount; // Update the displayed count
    console.log("Cart count updated in DOM:", cartCount);
  } else {
    console.error("Cart count element not found.");
  }
}

// Save the cart count to localStorage
function saveCartCount() {
  localStorage.setItem("cartCount", cartCount);
  console.log("Cart count saved to localStorage:", cartCount);
}

// Load the cart count from localStorage on page load
document.addEventListener("DOMContentLoaded", () => {
  const savedCartCount = localStorage.getItem("cartCount");
  if (savedCartCount) {
    cartCount = parseInt(savedCartCount, 10);
    updateCartCount();
  }

  // Check if the user is logged in
  const currentUserEmail = localStorage.getItem("email");

  // Get references to the login/signup button and user icon
  const loginSignupButton = document.getElementById("loginSignupButton");
  const userIcon = document.getElementById("userIcon");

  if (currentUserEmail) {
    // If the user is logged in, show the user icon and hide the login/signup button
    if (loginSignupButton) {
      loginSignupButton.style.display = "none";
    }
    if (userIcon) {
      userIcon.style.display = "block"; // Display the user icon
    }
  } else {
    // If no user is logged in, show the login/signup button and hide the user icon
    if (loginSignupButton) {
      loginSignupButton.style.display = "block";
    }
    if (userIcon) {
      userIcon.style.display = "none"; // Hide the user icon
    }
  }
});
// Function to redirect to the Sign In / Sign Up page
function redirectToSignIn() {
  window.location.href = "/pages/html/signup-signin.html"; // Adjust the URL to your sign-in/sign-up page
}
