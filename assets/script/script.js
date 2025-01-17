import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import {
  getDatabase,
  ref,
  get,
} from "https://www.gstatic.com/firebasejs/11.0.2/firebase-database.js";
import {
  getAuth,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";

// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyAnKtlrGE7lMKtHhjQyzfElqCkI2bupWzs",
  authDomain: "wornbyall-926f5.firebaseapp.com",
  projectId: "wornbyall-926f5",
  storageBucket: "wornbyall-926f5.appspot.com",
  messagingSenderId: "770771226995",
  appId: "1:770771226995:web:15636d6b9e17d27611b506",
  measurementId: "G-B6PER21YN1",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const auth = getAuth(app);

let userId = null; // Initially null

// Wait for the authentication state to be confirmed
onAuthStateChanged(auth, async (user) => {
  if (user) {
    // User is signed in, set userId
    userId = user.uid;
    console.log("User ID:", userId); // You can check the user ID here
    await updateCartCount(); // Update the cart count once the user is authenticated
  } else {
    // No user is signed in
    console.log("No user is signed in.");
  }
});

// Fetch cart items from Firebase
async function fetchCartItems() {
  try {
    console.log(userId);
    const cartRef = ref(database, `cart/${userId}`);
    const snapshot = await get(cartRef);
    if (snapshot.exists()) {
      return snapshot.val(); // The cart data will be in a nested structure
    }
    return {}; // Return empty if no cart data is found
  } catch (error) {
    console.error("Error fetching cart items from Firebase:", error);
    return {};
  }
}

// Function to update the cart count (counting all items in the cart)
async function updateCartCount() {
  // Get the cart items data
  const cartItems = await fetchCartItems();
  console.log(cartItems);

  let totalItems = 0; // Initialize total item counter

  // Iterate through all categories and sum the quantities of each item
  for (const category in cartItems) {
    if (cartItems.hasOwnProperty(category)) {
      totalItems = cartItems[category].length;
    }
  }

  console.log("Total items in cart:", totalItems);

  // Update the cart count on the page
  const cartCountElement = document.getElementById("cartCount");
  if (cartCountElement) {
    cartCountElement.textContent = totalItems;
  }

  // Save cart count explicitly to localStorage (if needed)
  localStorage.setItem("cartCount", totalItems);
}

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
      window.location.href = "/index.html"; // Redirect to homepage after logout
    })
    .catch((error) => {
      console.error("Logout error:", error.message);
    });
}

// Assuming you have a sign-out button somewhere that triggers the sign-out action
// document.getElementById("signOutButton").addEventListener("click", signOutUser);


document.addEventListener("DOMContentLoaded", () => {
  // Select all the category links by class name
  const categoryLinks = document.querySelectorAll('.category-link');

  // Use forEach to loop through the NodeList of links
  categoryLinks.forEach(link => {
    // Attach an event listener for each link
    link.addEventListener('click', (e) => {
      // Prevent the default behavior of the link
      e.preventDefault();

      // Get the target URL from the data attribute (data-target)
      const targetCategory = link.getAttribute('data-target');
      localStorage.setItem('gender',targetCategory)
      // Redirect to the target URL
      window.location.href = "/pages/html/categories.html";
    });
  });
});
