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
async function loadChudithars() {
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

    // Filter and display Chudithars
    const chuditharProducts = products.filter(
      (product) => product.type.toLowerCase() === "chudithar"
    );

    if (chuditharProducts.length === 0) {
      productGrid.textContent = "No Chudithars found!";
      return;
    }

    chuditharProducts.forEach((product) => {
      const productCard = document.createElement("div");
      productCard.classList.add("product-card");
      productCard.setAttribute("data-type", product.id);
    
      // Create a link for the product card
      const productLink = document.createElement("a");
      productLink.href = `../html/productDetails.html?id=${product.id}`;
      productLink.style.textDecoration = "none";
    
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
    
      // Check if the product is already in the cart
      const cart = JSON.parse(localStorage.getItem("cart")) || [];
      const existingItem = cart.find((item) => item.name === product.name);
    
      if (existingItem) {
        addButton.textContent = "Visit Cart";
        addButton.onclick = () => navigateToCart;
      } else {
        addButton.textContent = "Add to Cart";
        addButton.onclick = () => addToCart(product); // Pass button
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
    console.error("Error loading Chudithars:", error.message);
    const productGrid = document.getElementById("productGrid");
    if (productGrid) {
      productGrid.textContent = "Failed to load Chudithars.";
    }
  }
}

// Load Chudithars on page load
document.addEventListener("DOMContentLoaded", () => {
  loadChudithars();
  updateCartCount();
  const popupContainer = document.getElementById("popupContainer");
  if (popupContainer) {
    popupContainer.classList.remove("show"); // Ensure the popup is hidden on page load
  }
});

// Search products
function searchProducts() {
  const searchBarValue = document
    .getElementById("searchBar")
    .value.toLowerCase();
  const products = document.querySelectorAll(".product-card");
  products.forEach((product) => {
    const productName = product.querySelector("h2").textContent.toLowerCase();
    product.style.display = productName.includes(searchBarValue)
      ? "block"
      : "none";
  });
}

// Add event listener to the search bar
const searchBar = document.getElementById("searchBar");
if (searchBar) {
  searchBar.addEventListener("input", searchProducts);
}

// Add product to the cart
// Add product to the cart
function addToCart(item) {
  const user = auth.currentUser;
  console.log("Checking user state in addToCart:", user);

  if (user) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    const existingItemIndex = cart.findIndex(
      (cartItem) => cartItem.id === item.id
    );

    if (existingItemIndex > -1) {
      cart[existingItemIndex].quantity += 1;
    } else {
      cart.push({ ...item, quantity: 1 });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartCount();
    showPopup("Item added to cart successfully!");
  } else {
    console.log("User is not signed in. Redirecting...");

    const currentURL = window.location.href;
    const itemToStore = JSON.stringify(item);

    // Store current URL and item to add after login
    localStorage.setItem("redirectAfterLogin", currentURL);
    localStorage.setItem("itemToAdd", itemToStore);

    if (!currentURL.includes("signup-signin.html")) {
      window.location.href = "../html/signup-signin.html";
    }
  }
}
async function handlePostLoginRedirect() {
  const redirectURL = localStorage.getItem("redirectAfterLogin");
  const itemToAdd = localStorage.getItem("itemToAdd");

  if (redirectURL && itemToAdd) {
    const parsedItem = JSON.parse(itemToAdd);
    
    // Add item to cart first
    addToCart(parsedItem);

    // Clear stored data
    localStorage.removeItem("redirectAfterLogin");
    localStorage.removeItem("itemToAdd");

    // Redirect to the previous page
    window.location.href = redirectURL || "../../index.html";  // Use stored URL, fallback to default
  }
}

// Listen for Authentication State Changes
onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log("User signed in:", user);
    // Add the item to cart and redirect immediately
    handlePostLoginRedirect();
  } else {
    console.log("No user signed in.");
  }
});


// Function to show the popup message
function showPopup(message) {
  const popupContainer = document.getElementById("popupContainer");
  const popupMessage = popupContainer?.querySelector(".popup-message");

  if (!popupContainer || !popupMessage) return;

  // Set the message
  popupMessage.textContent = message;

  // Ensure the popup is styled for success
  popupMessage.style.backgroundColor = "green"; 
  popupMessage.style.color = "white";

  // Show the popup
  popupContainer.classList.add("show");

  // Hide the popup after 3 seconds
  setTimeout(() => {
    popupContainer.classList.remove("show");
  }, 1500);
}

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

// Sidebar toggle
const toggleSidebarButton = document.getElementById("toggleSidebar");
if (toggleSidebarButton) {
  toggleSidebarButton.addEventListener("click", () => {
    const sidebar = document.getElementById("sidebar");
    if (sidebar) {
      sidebar.classList.toggle("visible");
    }
  });
}
