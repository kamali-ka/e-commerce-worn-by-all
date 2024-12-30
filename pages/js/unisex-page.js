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
// Wait for the DOM to load
document.addEventListener("DOMContentLoaded", () => {
  // Load all products initially and update cart count
  loadProducts().then(() => {
    updateCartCount();
  });

  // Attach event listener for search bar
  const searchBar = document.getElementById("searchBar");
  if (searchBar) {
    searchBar.addEventListener("input", searchProducts);
  } else {
    console.error("Search bar element not found.");
  }

  // Toggle sidebar visibility
  const toggleSidebar = document.getElementById("toggleSidebar");
  if (toggleSidebar) {
    toggleSidebar.addEventListener("click", () => {
      const sidebar = document.getElementById("sidebar");
      if (sidebar) {
        sidebar.classList.toggle("visible");
      } else {
        console.error("Sidebar element not found.");
      }
    });
  }
});
// Function to load and display all products
async function loadProducts() {
  try {
    const response = await fetch("../js/public/unisex-page.json");
    if (!response.ok) {
      throw new Error(
        `Failed to fetch products: ${response.status} ${response.statusText}`
      );
    }

    const products = await response.json();
    const productGrid = document.getElementById("productGrid");

    if (!productGrid) {
      console.error("Element with ID 'productGrid' not found.");
      return;
    }

    productGrid.innerHTML = ""; // Clear existing products

    if (products.length === 0) {
      productGrid.innerHTML = "<p>No products available at the moment.</p>";
      return;
    }

    products.forEach((product) => {
      const productCard = document.createElement("div");
      productCard.classList.add("product-card");
      productCard.setAttribute("data-type", product.type || "unknown");

      const productImage = document.createElement("img");
      productImage.src = product.image || "";
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
      addButton.textContent = isInCart(product) ? "Visit Cart" : "Add to Cart";
      addButton.onclick = (e) => {
        e.stopPropagation(); // Prevent triggering product click event
        handleCartButtonClick(product, addButton);
      };

      productCard.onclick = () => {
        window.location.href = `../html/productDetails.html?id=${product.id}`;
      };

      productCard.append(productImage, productName, productPrice, addButton);
      productGrid.appendChild(productCard);
    });
  } catch (error) {
    console.error("Error loading products:", error.message);
    const productGrid = document.getElementById("productGrid");
    if (productGrid) {
      productGrid.innerHTML = "<p>Failed to load products. Please try again later.</p>";
    }
  }
}

// Function to filter products by type
function filterByType() {
  const selectedType = document.getElementById("clothingType").value.toLowerCase();
  const products = document.querySelectorAll(".product-card");

  products.forEach((product) => {
    const productType = product.getAttribute("data-type")?.toLowerCase();
    if (selectedType === "all" || productType === selectedType) {
      product.style.display = "block";
    } else {
      product.style.display = "none";
    }
  });
}

// Function to search for products
function searchProducts() {
  const searchBarValue = document.getElementById("searchBar").value.toLowerCase();
  const products = document.querySelectorAll(".product-card");

  products.forEach((product) => {
    const productName = product.querySelector("h2").textContent.toLowerCase();
    product.style.display = productName.includes(searchBarValue) ? "block" : "none";
  });
}

// Function to handle the button click for adding/visiting the cart
function handleCartButtonClick(product, button) {
  if (isInCart(product)) {
    window.location.href = "../html/cartPage.html"; // Redirect to cart
  } else {
    addToCart(product);
    button.textContent = "Visit Cart";
  }
}

// Function to check if a product is already in the cart
function isInCart(product) {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  return cart.some((item) => item.id === product.id);
}

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
  
        // Update the button text and behavior
        const addButton = document.querySelector(
          `.product-card[data-id="${item.id}"] button`
        );
        console.log(addButton);
  
        if (addButton) {
          addButton.textContent = "Visit Cart"; // Change button text
          addButton.onclick = navigateToCart; // Change button behavior
        }
  
        // Show popup message
        showPopup("Item added to cart successfully!");
        updateCartCount();
      } else {
        window.location.href = "../html/signup-signin.html";
      }
    });
}

// Function to update the cart count
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

// Function to display the popup message
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
