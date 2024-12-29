// Function to toggle the navigation menu
function toggleMenu() {
  const menu = document.getElementById("navMenu");
  menu.classList.toggle("open");
}

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

// Function to update the cart count dynamically
// Function to update the cart count (counting unique products)
function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  
  // Get the number of unique products in the cart
  const totalProducts = cart.length;

  const cartCountElement = document.getElementById("cartCount");
  if (cartCountElement) {
    cartCountElement.textContent = totalProducts;
  }

  // Save cart count explicitly to localStorage (if needed)
  localStorage.setItem("cartCount", totalProducts);
}

// Function to initialize all necessary updates on page load
document.addEventListener("DOMContentLoaded", () => {
  const isLoggedIn = localStorage.getItem("email");

  // Call functions to update cart visibility and count
  updateCartVisibility();
  updateCartCount();
});

// Function to redirect to the Sign In/Sign Up page
function redirectToSignIn() {
  console.log("Redirecting to sign-in page");
  window.location.href = "/pages/html/signup-signin.html"; // Adjust path as needed
}

// Event listener for form submission (Login/Signup button)
document
  .getElementById("loginForm")
  .addEventListener("submit", function (event) {
    event.preventDefault(); // Prevents the default form submit action
    redirectToSignIn(); // Redirects to the sign-in page
  });

// Function to sign out user
function signOutUser() {
  // Assuming you have Firebase or another authentication system
  signOut(auth)
    .then(() => {
      localStorage.clear(); // Clear session data
      window.location.href = "../../index.html"; // Redirect to homepage after logout
    })
    .catch((error) => {
      console.error("Logout error:", error.message);
    });
}

// Assuming you have a sign-out button somewhere that triggers the sign-out action
// document.getElementById("signOutButton").addEventListener("click", signOutUser);
