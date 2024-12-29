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
      productCard.setAttribute("data-type", product.type);
    
      // Create a link for the product card
      const productLink = document.createElement("a");
      productLink.href = `../html/productDetails.html?id=${product.id}`;
      productLink.style.textDecoration = "none";
    
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
    
      // Check if the product is already in the cart
      const cart = JSON.parse(localStorage.getItem("cart")) || [];
      const existingItem = cart.find((item) => item.id === product.id);
    
      if (existingItem) {
        addButton.textContent = "Visit Cart";
        addButton.onclick = () => navigateToCart();
      } else {
        addButton.textContent = "Add to Cart";
        addButton.onclick = () => addToCart(product, addButton); // Pass button
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
function addToCart(item, buttonElement) {
  onAuthStateChanged(auth, (user) => {
    if (user) {
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

      // Change the clicked button's text to "Visit Cart"
      buttonElement.textContent = "Visit Cart";
      buttonElement.onclick = () => navigateToCart(); // Update the button's click behavior
    } else {
      window.location.href = "../html/signup-signin.html";
    }
  });
}


// Function to show the popup message
function showPopup(message) {
  const popupContainer = document.getElementById("popupContainer");
  const popupMessage = popupContainer?.querySelector(".popup-message");

  if (!popupContainer || !popupMessage) return;

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
  }, 1500);
}

// Update cart count
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
