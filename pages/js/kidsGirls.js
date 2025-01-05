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


// Loader functions
function showLoader() {
  document.getElementById("loader").style.display = "flex";
}

function hideLoader() {
  document.getElementById("loader").style.display = "none";
}

// Function to load and display only shirts (or all products)
async function loadProducts() {
  try {
    showLoader(); // Show loader while fetching data
    // Fetch the product data from the JSON file
   const dbRef = ref(database, "kids-page"); // Reference to your data in Firebase
       const snapshot = await get(dbRef);
       if (!snapshot.exists()) {
         throw new Error("No products found in the database.");
       }
   
       const products = snapshot.val(); // Get the products array
    const productGrid = document.getElementById("productGrid");

    if (!productGrid) {
      console.error("Element with ID 'productGrid' not found.");
      return;
    }

    productGrid.innerHTML = "";

    // Filter and display jeans
    const jeansProducts = products.filter(
      (product) => product.type === "frock" || product.type === "co-ords"
    );
    if (jeansProducts.length === 0) {
      productGrid.innerHTML = "<p>No products available at the moment.</p>";
      return;
    }

    jeansProducts.forEach((product) => {
      const productCard = document.createElement("div");
      productCard.classList.add("product-card");

      const productImage = document.createElement("img");
      productImage.src = product.image || ""; // Fallback if the image is missing
      productImage.alt = product.alt || product.name || "Product Image";

      const productName = document.createElement("h2");
      productName.textContent = product.name || "Unnamed Product";

      const productPrice = document.createElement("p");
      productPrice.classList.add("price");
      const price = parseFloat(product.price); // Remove ₹ and commas
      productPrice.textContent = isNaN(price)
        ? "Price not available"
        : `₹${price.toFixed(2)}`;

      const addButton = document.createElement("button");
      addButton.textContent = isInCart(product) ? "Visit Cart" : "Add to Cart";
      addButton.onclick = (event) => {
        event.stopPropagation(); // Prevent bubbling to the product card
        handleCartButtonClick(product, addButton);
      };

      // Add a click event to redirect to the product detail page
      productCard.addEventListener("click", (event) => {
        event.stopPropagation(); // Prevent the event from bubbling up
        redirectToProductDetail(product.id);
      });

      productCard.append(productImage, productName, productPrice, addButton);
      productGrid.appendChild(productCard);
    });
  } catch (error) {
    console.error("Error loading jeans:", error.message);
  }
  finally{
    hideLoader();
  }
}
// Load page content on DOMContentLoaded
document.addEventListener("DOMContentLoaded", () => {
  loadShirts();
  updateCartCount();

  const popupContainer = document.getElementById("popupContainer");
  if (popupContainer) {
    popupContainer.classList.remove("show");
  }
});

// Function to redirect to the product detail page
function redirectToProductDetail(productId) {
  // Redirect to the product detail page with the product ID as a query parameter
  window.location.href = `../html/productDetails.html?id=${productId}`;
}

// Function to handle the button click for adding/visiting the cart
function handleCartButtonClick(product, button) {
  if (isInCart(product)) {
    // Redirect to cart
    window.location.href = "../html/cartPage.html"; // Adjust path to your cart page
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

// Toggle sidebar visibility
document.getElementById("toggleSidebar").addEventListener("click", (event) => {
  event.stopPropagation(); // Prevent the event from bubbling up
  const sidebar = document.getElementById("sidebar");
  sidebar.classList.toggle("visible");
});

// Load cart count on page load and fetch products
document.addEventListener("DOMContentLoaded", () => {
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
});

// Function to navigate to the cart page
function navigateToCart() {
  window.location.href = "../html/cartPage.html"; // Ensure this path is correct
}

// Load cart count on page load and fetch products
document.addEventListener("DOMContentLoaded", () => {
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
});

// Function to show the popup message
function showBuyNowPopup() {
  const popupContainer = document.getElementById("popupContainer");
  const popupMessage = popupContainer.querySelector(".popup-message");

  // Check if the user is logged in
  const isLoggedIn = localStorage.getItem("email"); // Assuming login sets an email in localStorage

  if (isLoggedIn) {
    // Set the popup message for logged-in users
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
  } else {
    // Set the popup message for users not logged in
    popupMessage.innerHTML = `
        <p>You need to log in to proceed to checkout.</p>
        <button id="loginButton" class="popup-ok-button">Log In</button>
        `;

    // Show the popup
    popupContainer.classList.add("show");

    // Add event listener to the Log In button
    const loginButton = document.getElementById("loginButton");
    if (loginButton) {
      loginButton.addEventListener("click", () => {
        // Redirect to login/sign-up page
        popupContainer.classList.remove("show");
        window.location.href = "../html/signup-signin.html";
      });
    }
  }
}

// Load cart count on page load and fetch products
document.addEventListener("DOMContentLoaded", () => {
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
});
const response = await fetch("/pages/js/public/kids-page.json").then(res=>res.json('kids-page')).then(data=>data);
console.log(response)