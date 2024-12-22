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

// Function to load Chudithars from JSON file
async function loadShortTops() {
    try {
      const response = await fetch("/pages/js/public/she-page.json");
      if (!response.ok) {
        throw new Error(
          `Failed to fetch products: ${response.status} ${response.statusText}`
        );
      }
  
      const products = await response.json();
      const productGrid = document.getElementById("productGrid");
      if (!productGrid) {
        console.error("Product grid element not found!");
        return;
      }
      productGrid.innerHTML = ""; // Clear existing products
  
      // Filter and display Short Tops
      const shortTopProducts = products.filter(
        (product) =>
          product.type &&
          product.type.toLowerCase() === "short tops".toLowerCase()
      );
  
      if (shortTopProducts.length === 0) {
        productGrid.textContent = "No Short Tops found!";
        return;
      }
  
      shortTopProducts.forEach((product) => {
        const productCard = document.createElement("div");
        productCard.classList.add("product-card");
        productCard.setAttribute("data-type", product.type);
  
        // Create a link for the product card
        const productLink = document.createElement("a");
        productLink.href = `../html/productDetails.html?id=${product.id}`;
        productLink.style.textDecoration = "none"; // Remove the default link underline
  
        const productImage = document.createElement("img");
        productImage.src = product.image || "default-image.jpg";
        productImage.alt = product.alt || product.name || "Product Image";
  
        const productName = document.createElement("h2");
        productName.textContent = product.name || "Unnamed Product";
  
        const productPrice = document.createElement("p");
        productPrice.classList.add("price");
        const price = parseFloat(product.price);
        productPrice.textContent = isNaN(price)
          ? "Price not available"
          : `₹${price.toFixed(2)}`;
  
        const addButton = document.createElement("button");
        addButton.textContent = "Add to Cart";
  
        // Check if the product is already in the cart
        const cart = JSON.parse(localStorage.getItem("cart")) || [];
        const existingItem = cart.find((item) => item.name === product.name);
  
        if (existingItem) {
          addButton.textContent = "Visit Cart"; // Change to 'Visit Cart' if the item is in the cart
          addButton.onclick = () => navigateToCart(); // Navigate to the cart
        } else {
          addButton.onclick = () => addToCart(product); // Add to cart
        }
  
        // Append product details to the link
        productLink.appendChild(productImage);
        productLink.appendChild(productName);
        productLink.appendChild(productPrice);
  
        // Append the link and add button to the product card
        productCard.appendChild(productLink);
        productCard.appendChild(addButton);
  
        productGrid.appendChild(productCard);
      });
    } catch (error) {
      console.error("Error loading Short Tops:", error.message);
      const productGrid = document.getElementById("productGrid");
      if (productGrid) {
        productGrid.textContent = "Failed to load Short Tops.";
      }
    }
  }
  
  // Load Short Tops on page load
  document.addEventListener("DOMContentLoaded", () => {
    loadShortTops();
    updateCartCount();
    const popupContainer = document.getElementById("popupContainer");
    popupContainer.classList.remove("show"); // Ensure the popup is hidden on page load
  });
  // Navigate to the cart page
function searchProducts() {
  const searchBarValue = document.getElementById("searchBar").value.toLowerCase();
  const products = document.querySelectorAll(".product-card");
  products.forEach((product) => {
    const productName = product.querySelector("h2").textContent.toLowerCase();
    product.style.display = productName.includes(searchBarValue) ? "block" : "none";
  });
}


// Add event listener to the search bar to trigger search when typing
document.getElementById("searchBar").addEventListener("input", searchProducts);

// Add product to the cart
function addToCart(item) {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      console.log("User is signed in:", user);
      let cart = JSON.parse(localStorage.getItem("cart")) || [];

      // Check if the item already exists in the cart
      const existingItemIndex = cart.findIndex(
        (cartItem) => cartItem.id === item.id
      );
      if (existingItemIndex > -1) {
        // Update quantity if item exists
        cart[existingItemIndex].quantity += 1;
      } else {
        // Add new item to the cart
        cart.push({ ...item, quantity: 1 });
      }

      localStorage.setItem("cart", JSON.stringify(cart));

      // Show popup message
      showPopup("Item added to cart successfully!");
      updateCartCount();
    } else {
      window.location.href = "../html/signup-signin.html";
    }
  });
}

// Function to show the popup message
function showPopup(message) {
  const popupContainer = document.getElementById("popupContainer");
  const popupMessage = popupContainer.querySelector(".popup-message");

  // Set the message
  popupMessage.textContent = message;

  // Ensure the popup is styled for success
  popupMessage.style.backgroundColor = "green"; // Set to green for success
  popupMessage.style.color = "white";

  // Show the popup
  popupContainer.classList.add("show");

  // Hide the popup after 3 seconds
  setTimeout(() => {
    popupContainer.classList.remove("show");
  }, 3000);
}

// Update cart count
function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);

  const cartCountElement = document.getElementById("cartCount");
  if (cartCountElement) {
    cartCountElement.textContent = totalItems;
  }

  // Save cart count to localStorage
  localStorage.setItem("cartCount", totalItems);
}


// Function to get URL parameters
function getQueryParam(param) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}

// Load product details from URL parameter
function loadProductDetails() {
  const productId = getQueryParam("id");
  const productDetailsElement = document.getElementById("productDetails");
  if (!productDetailsElement) {
    document.getElementById("productDetails").textContent =
      "Element with ID 'productDetails' not found.";
    return;
  }
  if(!productId){
    productDetailsElement.textContent = "Product ID not found!";
   return;  
}

 
   fetch("/pages/js/public/she-page.json")
     .then((response) => response.json())
     .then((data) => {
       const product = data.find((p) => p.id === productId);
       if (product) {
         document.getElementById("productImage").src =
           product.image || "default-image.jpg";
         document.getElementById("productName").textContent =
           product.name || "Unnamed Product";
         document.getElementById("productPrice").textContent = `₹${
           product.price || "Price not available"
         }`;
         document.getElementById("productRatings").textContent = `Rating: ${
           product.rating || "N/A"
         }`;
         document.getElementById("productDescription").textContent =
           product.description || "No description available.";
 
         const addToCartButton = document.createElement("button");
         addToCartButton.textContent = "Add to Cart";
 
         onAuthStateChanged(auth, (user) => {
           if (user) {
             addToCartButton.onclick = () => addToCart(product);
           } else {
             addToCartButton.onclick = () =>
               (window.location.href = "../html/signup-signin.html");
           }
         });
 
         productDetailsElement.appendChild(addToCartButton);
       } else {
         productDetailsElement.textContent = "Product not found!";
       }
     })
     .catch((error) => {
       console.error("Error fetching product details:", error);
       productDetailsElement.textContent = "Failed to load product details.";
     });
 }
// Toggle sidebar visibility
document.getElementById("toggleSidebar").addEventListener("click", () => {
  const sidebar = document.getElementById("sidebar");
  sidebar.classList.toggle("visible"); // Toggle 'visible' class to show/hide sidebar
});
