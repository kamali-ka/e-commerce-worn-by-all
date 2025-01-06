import {
  getAuth,
  signOut,
} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";

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
const auth = getAuth(app); // Initialize Firebase Auth

document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("accountForm");
  const nameInput = document.getElementById("name");
  const emailInput = document.getElementById("email");
  const phoneInput = document.getElementById("phone");
  const addressInput = document.getElementById("address");
  const profilePlaceholder = document.getElementById("profile-placeholder");
  const popupMessage = document.getElementById("popupMessage");
  const logoutButton = document.getElementById("logoutButton");
  const signUpSignInOption = document.getElementById("signUpSignInOption");

  const currentUserEmail = localStorage.getItem("email");
  const currentUserName = localStorage.getItem("username");


  // Redirect to login page if no user is logged in
  if (!currentUserEmail) {
    signUpSignInOption.style.display = "block"; // Ensure the option is visible for unauthenticated users
    window.location.href = "../html/signup-signin.html";
    return; // Prevent further execution if redirected
  } else {
    signUpSignInOption.style.display = "none"; // Hide for logged-in users
  }

  // Display user data
  function loadProfileData() {
    emailInput.value = currentUserEmail;

    const userName = currentUserName || "";
    const phone = localStorage.getItem(getUserKey("phone")) || "";
    const address = localStorage.getItem(getUserKey("address")) || "";

    nameInput.value = userName;
    phoneInput.value = phone;
    addressInput.value = address;


    profilePlaceholder.textContent = userName
      ? userName.charAt(0).toUpperCase()
      : "?";

    document.getElementById("profile-username").textContent =
      userName || "Not provided";
    document.getElementById("profile-email").textContent =
      currentUserEmail || "Not provided";
    document.getElementById("profile-phone").textContent =
      phone || "Not provided";
    document.getElementById("profile-address").textContent =
      address || "Not provided";
  }

  function getUserKey(field) {
    return `${field}_${currentUserEmail}`;
  }

  // Form submit event to save the user's data
  form.addEventListener("submit", function (event) {
    event.preventDefault();

    const userName = nameInput.value.trim();
    const email = emailInput.value.trim();
    const phone = phoneInput.value.trim();
    const address = addressInput.value.trim();

    // Save profile data to localStorage
    localStorage.setItem("username", userName);
    localStorage.setItem("phone", phone);
    localStorage.setItem("address", address); 

    // Update UI
    profilePlaceholder.textContent = userName
      ? userName.charAt(0).toUpperCase()
      : "?";

    document.getElementById("profile-username").textContent =
      userName || "Not provided";
    document.getElementById("profile-email").textContent =
      email || "Not provided";
    document.getElementById("profile-phone").textContent =
      phone || "Not provided";
      document.getElementById("profile-address").textContent =
      address || "Not provided";
      
    // Show confirmation popup
    showPopup("Profile details saved successfully!", "success");
  });

  // Logout button event
  logoutButton.addEventListener("click", function () {
    // Clear user-specific data from localStorage
    localStorage.removeItem("email");
    localStorage.removeItem("username");
    localStorage.removeItem(getUserKey("name"));
    localStorage.removeItem(getUserKey("phone"));
    localStorage.removeItem(getUserKey("address"));

    // Clear cart from localStorage
    localStorage.removeItem("cart");

    // Firebase logout
    signOut(auth)
      .then(() => {
        // Ensure "Sign-Up or Sign-In" option is visible
        signUpSignInOption.style.display = "block";

        // Redirect to login page after sign-out
        window.location.href = "../../index.html";
      })
      .catch((error) => {
        console.error("Error during logout:", error);
      });
  });

  function showPopup(message, type) {
    popupMessage.textContent = message;
    popupMessage.className = `popup-message ${type}`;
    popupMessage.classList.add("show");

    setTimeout(() => {
      popupMessage.classList.remove("show");
    }, 3000);
  }

  // Load profile data on page load
  loadProfileData();

  // Load cart items dynamically
  function loadCartItems() {
    const cartItemsContainer = document.getElementById("cartItems");
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    // Clear existing items in container
    cartItemsContainer.innerHTML = "";

    if (cart.length === 0) {
      cartItemsContainer.innerHTML = "<p>Your cart is empty.</p>";
      updateBillSummary(); // Update bill summary even when empty
      updateCartCount(); // Ensure cart count shows as 0
      return;
    }

    cart.forEach((item, index) => {
      const productCard = document.createElement("div");
      productCard.classList.add("product-card");

      // Create product image
      const productImage = document.createElement("img");
      productImage.src = item.image || "placeholder.jpg";
      productImage.alt = item.name;
      productImage.classList.add("product-image");

      // Create product name
      const productName = document.createElement("h2");
      productName.textContent = item.name;
      productName.classList.add("product-name");

      // Create price display
      const numericPrice =
        typeof item.price === "string"
          ? parseFloat(item.price.replace(/₹|,/g, ""))
          : item.price;
      const productPrice = document.createElement("p");
      productPrice.classList.add("price");
      productPrice.textContent = `Price: ₹${(
        (item.quantity || 1) * numericPrice
      ).toFixed(2)}`;

      // Create quantity container and buttons
      const quantityContainer = document.createElement("div");
      quantityContainer.classList.add("quantity-container");

      const decreaseButton = createQuantityButton("-", () =>
        updateQuantity(index, -1)
      );
      const quantityDisplay = document.createElement("span");
      quantityDisplay.textContent = `Quantity: ${item.quantity || 1}`;
      quantityDisplay.classList.add("quantity-display");
      const increaseButton = createQuantityButton("+", () =>
        updateQuantity(index, 1)
      );

      quantityContainer.appendChild(decreaseButton);
      quantityContainer.appendChild(quantityDisplay);
      quantityContainer.appendChild(increaseButton);

      // Create remove button
      const removeButton = document.createElement("button");
      removeButton.textContent = "Remove";
      removeButton.classList.add("remove-button");
      removeButton.onclick = () => removeFromCart(index);

      // Append all elements to product card
      productCard.appendChild(productImage);
      productCard.appendChild(productName);
      productCard.appendChild(productPrice);
      productCard.appendChild(quantityContainer);
      productCard.appendChild(removeButton);

      cartItemsContainer.appendChild(productCard);
    });

    updateBillSummary(); // Update the bill summary whenever items are loaded
    updateCartCount(); // Update the cart count whenever items are loaded
  }

  // Function to update the cart count
  function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const cartCount = cart.reduce((total, item) => total + (item.quantity || 1), 0);
    const cartCountElement = document.getElementById("cartCount");

    if (cartCountElement) {
      cartCountElement.textContent = cartCount || 0; // Ensure cart count is 0 if empty
    }
  }

  // Load cart items on page load
  loadCartItems();
  updateCartCount();
});
