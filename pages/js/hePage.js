import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";
import { getDatabase, ref, get } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-database.js";

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

  // Attach event listener for filter dropdown
  const clothingTypeFilter = document.getElementById("clothingType");
  if (clothingTypeFilter) {
    clothingTypeFilter.addEventListener("change", filterByType);
  } else {
    console.error("Clothing type filter element not found.");
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
    const dbRef = ref(database, "he-page");
    const snapshot = await get(dbRef);

    if (!snapshot.exists()) {
      throw new Error("No products found in the database.");
    }

    const products = snapshot.val();

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
  }
}

//Load page content on DOMContentLoaded
document.addEventListener("DOMContentLoaded",() =>{
  loadProducts();
  updateCartCount();

  const popupContainer = document.getElementById("popupContainer");
  if(popupContainer) {
    popupContainer.classList.remove("show");
  }
});


// Function to filter products by type
function filterByType() {
  const selectedType = document
    .getElementById("clothingType")
    .value.toLowerCase();
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

// Function to handle the button click for adding/visiting the cart
function handleCartButtonClick(product, button) {
  if (isInCart(product)) {
    // Redirect to cart
    window.location.href = "../html/cartPage.html";
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

// Function to add a product to the cart
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

const response = await fetch("/pages/js/public/he-page.json").then(res=>res.json('he-page')).then(data=>data);
console.log(response)