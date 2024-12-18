import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";

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
const auth = getAuth(app);
document.addEventListener("DOMContentLoaded", () => {
  // Fetch the JSON file containing product data
  fetch("../js/public/he-page.json") // Update the path if needed
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((products) => {
      // Retrieve productId from URL query params
      const selectedProductId = getQueryParam("id");

      if (!selectedProductId) {
        displayErrorMessage(
          "Product details not found. Please go back to the product list."
        );
        return;
      }

      // Find the product by ID
      const product = products.find((item) => item.id === selectedProductId);

      if (!product) {
        displayErrorMessage(
          "Product details not found. Please go back to the product list."
        );
        return;
      }

      // Display product details on the page
      displayProductDetails(product);
    })
    .catch((error) => {
      console.error("Error fetching product data:", error);
      displayErrorMessage(
        `Failed to load product details. Error: ${error.message}`
      );
    });

  // Function to display error messages
  function displayErrorMessage(message) {
    document.getElementById("product-details").innerHTML = `<p>${message}</p>`;
  }

  // Function to display product details
  function displayProductDetails(product) {
    // Set product details in the HTML
    document.getElementById("productImage").src =
      product.image || "placeholder.jpg";
    document.getElementById("productName").textContent =
      product.name || "Unnamed Product";
    document.getElementById("productPrice").textContent = product.price
      ? `₹${product.price}`
      : "Price not available";
    displayRating(product.rating || 0); // Display rating stars
    document.getElementById("productDescription").textContent =
      product.description || "No description available.";
  
    // Add event listeners to buttons
    const addToCartButton = document.getElementById("addToCartButton");
    const buyNowButton = document.getElementById("buyNowButton");
  
    if (addToCartButton) {
      addToCartButton.addEventListener("click", () =>
        addToCart(product, addToCartButton)
      );
    } else {
      console.error("Add to Cart button not found in the DOM.");
    }
  
    if (buyNowButton) {
      buyNowButton.addEventListener("click", () => {
        // Show popup for Buy Now action
        showBuyNowPopup();
      });
    } else {
      console.error("Buy Now button not found in the DOM.");
    }
  }
  
  // Function to show Buy Now popup
  function showBuyNowPopup() {
    const popupContainer = document.getElementById("popupContainer");
    const popupMessage = popupContainer.querySelector(".popup-message");
  
    // Set the popup message
    popupMessage.innerHTML = `
      <p>Proceeding to checkout!</p>
      <button id="confirmButton" class="popup-ok-button">OK</button>
    `;
  
    // Show the popup
    popupContainer.classList.add("show");
  
    // Add event listener to the OK button
    const confirmButton = document.getElementById("confirmButton");
    if (confirmButton) {
      confirmButton.addEventListener("click", () => {
        // Hide popup and redirect to the address page
        popupContainer.classList.remove("show");
        window.location.href = "../html/address-page.html";
      });
    }
  }
  
  

    // Function to add product to cart
    function addToCart(product, addButton) {
      // Check Auth State
      onAuthStateChanged(auth, (user) => {
        if (user) {
          console.log("User is signed in:", user);
          let cart = JSON.parse(localStorage.getItem("cart")) || [];
    
          // Check if the product is already in the cart
          const existingItemIndex = cart.findIndex((item) => item.id === product.id);
    
          if (existingItemIndex > -1) {
            // Increment quantity if the item already exists in the cart
            cart[existingItemIndex].quantity += 1;
          } else {
            // Add new item to the cart
            product.quantity = 1;
            cart.push(product);
          }
    
          localStorage.setItem("cart", JSON.stringify(cart));
          updateCartCount(); // Update the cart count
    
          // Change button to visit cart
          addButton.textContent = "Visit Cart";
          addButton.onclick = () => {
            window.location.href = "../html/cartPage.html"; // Redirect to cart page
          };
    
          showPopup("Successfully added to your cart!");
        } else {
          // Show popup for unauthenticated users
          showRedirectPopup("Please log in or sign up to add items to your cart.");
        }
      });
    }
    function showRedirectPopup(message) {
      const popupContainer = document.getElementById("popupContainer");
      const popupMessage = popupContainer.querySelector(".popup-message");
    
      popupMessage.textContent = message; // Set the message
      popupContainer.classList.add("show"); // Show the popup
    
      // Add "OK" button to the popup
      const okButton = document.createElement("button");
      okButton.textContent = "OK";
      okButton.classList.add("popup-ok-button"); // Add styling if needed
      popupMessage.appendChild(okButton);
    
      // Handle click on "OK" button
      okButton.addEventListener("click", () => {
        popupContainer.classList.remove("show"); // Hide the popup
        window.location.href = "../html/signup-signin.html"; // Redirect to login/signup page
      });
    }
        
  

  // Function to show the popup message
  function showPopup(message) {
    const popupContainer = document.getElementById("popupContainer");
    const popupMessage = popupContainer.querySelector(".popup-message");

    popupMessage.textContent = message; // Set the message
    popupContainer.classList.add("show"); // Show the popup

    // Hide the popup after 3 seconds
    setTimeout(() => {
      popupContainer.classList.remove("show");
    }, 3000);
  }

  // Function to update cart count
  function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const totalItems = cart.reduce(
      (sum, item) => sum + (item.quantity || 1),
      0
    );

    const cartCountElement = document.getElementById("cartCount");
    if (cartCountElement) {
      cartCountElement.textContent = totalItems;
    }

    // Save cart count explicitly to localStorage
    localStorage.setItem("cartCount", totalItems);
  }

  // Utility function to get query parameters from the URL
  function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
  }

  // Function to display the star rating
  function displayRating(rating) {
    const starContainer = document.getElementById("productRatings");
    const totalStars = 5;

    const fullStars = Math.floor(rating); // Full stars
    const halfStars = rating % 1 !== 0 ? 1 : 0; // Half stars
    const emptyStars = totalStars - fullStars - halfStars; // Empty stars

    let starsHtml = "";

    // Add full stars
    for (let i = 0; i < fullStars; i++) {
      starsHtml += '<i class="fa-solid fa-star"></i>';
    }

    // Add half star
    if (halfStars) {
      starsHtml += '<i class="fa-solid fa-star-half-alt"></i>';
    }

    // Add empty stars
    for (let i = 0; i < emptyStars; i++) {
      starsHtml += '<i class="fa-regular fa-star"></i>';
    }

    starContainer.innerHTML = starsHtml;
  }

  // Initialize cart count on page load
  updateCartCount();
});
