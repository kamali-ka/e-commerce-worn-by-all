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
  // Fetch the JSON files containing product data
  Promise.all([
    fetch("../js/public/he-page.json"), // Update the path if needed
    fetch("../js/public/she-page.json"), // Fetch from the second JSON file
    fetch("../js/public/kids-page.json"),
    fetch("../js/public/unisex-page.json")
  ])
    .then(([responseHe, responseShe]) => {
      if (!responseHe.ok || !responseShe.ok) {
        throw new Error("One or more network responses were not ok");
      }
      return Promise.all([responseHe.json(), responseShe.json()]);
    })
    .then(([productsHe, productsShe]) => {
      // Combine both products from the he-page and she-page
      const products = [...productsHe, ...productsShe];

      const selectedProductId = getQueryParam("id");

      if (!selectedProductId) {
        displayErrorMessage(
          "Product details not found. Please go back to the product list."
        );
        return;
      }

      const product = products.find((item) => item.id === selectedProductId);

      if (!product) {
        displayErrorMessage(
          "Product details not found. Please go back to the product list."
        );
        return;
      }

      displayProductDetails(product);
    })
    .catch((error) => {
      console.error("Error fetching product data:", error);
      displayErrorMessage(
        `Failed to load product details. Error: ${error.message}`
      );

      // Fallback example product data
      const product = {
        cashOnDelivery: true,
        returnsAndExchanges: true,
        isOriginal: true
      };

      // Check if each feature should be displayed based on product data
      if (!product.cashOnDelivery) {
        document.getElementById("cashOnDelivery").style.display = "none";
      }

      if (!product.returnsAndExchanges) {
        document.getElementById("returnsAndExchanges").style.display = "none";
      }

      if (!product.isOriginal) {
        document.getElementById("isOriginal").style.display = "none";
      }
    });

  function displayErrorMessage(message) {
    document.getElementById("product-details").innerHTML = `<p>${message}</p>`;
  }

  // Example function to get query parameter (product ID)
  function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
  }

// Function to display product details
function displayProductDetails(product) {
  // Set product details in the HTML
  document.getElementById("productImage").src = product.image || "placeholder.jpg";
  document.getElementById("productName").textContent = product.name || "Unnamed Product";
  document.getElementById("productPrice").textContent = product.price ? `₹${product.price}` : "Price not available";
  displayRating(product.rating || 0); // Display rating stars
  document.getElementById("productDescription").textContent = product.description || "No description available.";

  // Display stock status
  displayStockStatus(product.stock);

  // Display size options
  displayProductSizes(product.sizes); // Call the function to display sizes

  // Check if the product is already in the cart
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  const productInCart = cart.find((item) => item.id === product.id);

  const addToCartButton = document.getElementById("addToCartButton");
  const buyNowButton = document.getElementById("buyNowButton");

  if (productInCart) {
    addToCartButton.textContent = "Visit Cart";
    addToCartButton.onclick = () => {
      window.location.href = "../html/cartPage.html"; // Redirect to cart page
    };
  } else {
    addToCartButton.addEventListener("click", () => addToCart(product, addToCartButton));
  }

  if (buyNowButton) {
    buyNowButton.addEventListener("click", () => showBuyNowPopup());
  }
}

// Function to display stock status
function displayStockStatus(stock) {
  const stockStatusElement = document.getElementById("stockStatus");
  if (stockStatusElement) {
    stockStatusElement.textContent = `Stock Available: ${stock} items`;
    
    // Check stock quantity
    if (stock < 10) {
      stockStatusElement.style.color = "red"; // Change color to red if stock is less than 10
    } else {
      stockStatusElement.style.color = "green"; // You can set this to any color based on your design
    }
  }
}

// Function to display size options
function displayProductSizes(sizes) {
  const sizeOptionsContainer = document.getElementById("sizeOptions");
  sizeOptionsContainer.innerHTML = ""; // Clear any existing options

  sizes.forEach((size) => {
    const sizeButton = document.createElement("button");
    sizeButton.textContent = size;
    sizeButton.onclick = () => selectSize(sizeButton, size);
    sizeOptionsContainer.appendChild(sizeButton);
  });
}
// Function to handle size selection
function selectSize(button, size) {
  // Remove the 'selected' class from all size buttons
  const allSizeButtons = document.querySelectorAll(".size-options button");
  allSizeButtons.forEach((btn) => btn.classList.remove("selected"));

  // Add the 'selected' class to the clicked size button
  button.classList.add("selected");

  // Store the selected size in localStorage
  localStorage.setItem("selectedSize", size);
  
  // Optionally enable the Add to Cart button when size is selected
  const addToCartButton = document.getElementById("addToCartButton");
  addToCartButton.disabled = !size; // Disable Add to Cart if no size is selected
}

// Function to display error messages
function displayErrorMessage(message) {
  const productDetailsElement = document.getElementById("product-details");
  if (!productDetailsElement) {
    console.error("Product details element not found!");
    return;
  }

  productDetailsElement.innerHTML = `<p>${message}</p>`;
}

// Function to add product to cart
function addToCart(product, addButton) {
  const selectedSize = localStorage.getItem("selectedSize");

  if (!selectedSize) {
    // Show an error or prompt the user to select a size
    alert("Please select a size before adding the product to the cart.");
    return;
  }

  // Proceed with adding the product to the cart
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  // Add selected size to the product data
  const productWithSize = { ...product, size: selectedSize, quantity: 1 };

  const existingItemIndex = cart.findIndex((item) => item.id === product.id && item.size === selectedSize);

  if (existingItemIndex > -1) {
    // Increment quantity if the item already exists in the cart with the same size
    cart[existingItemIndex].quantity += 1;
  } else {
    // Add new item to the cart with the selected size
    cart.push(productWithSize);
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount(); // Update the cart count

  // Change button to visit cart
  addButton.textContent = "Visit Cart";
  addButton.onclick = () => {
    window.location.href = "../html/cartPage.html"; // Redirect to cart page
  };

  showPopup("Successfully added to your cart!");
}

// Function to show the popup message
function showPopup(message) {
  const popupContainer = document.getElementById("popupContainer");
  const popupMessage = popupContainer.querySelector(".popup-message");

  popupMessage.textContent = message; // Set the message
  popupContainer.classList.add("show"); // Show the popup

  // Hide the popup after 1 seconds
  setTimeout(() => {
    popupContainer.classList.remove("show");
  }, 1000);
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
  function displayRating(rating, count) {
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
