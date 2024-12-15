import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.9.3/firebase-auth.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.9.3/firebase-app.js";

  const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID",
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
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
  // Add click event listener to dynamically created "Add to Cart" buttons
  document.addEventListener("click", (e) => {
    if (e.target && e.target.classList.contains("add-to-cart-btn")) {
      const productId = e.target.dataset.id;
      const productName = e.target.dataset.name;
      const productPrice = parseFloat(e.target.dataset.price);
      const productImage = e.target.dataset.image;

      const product = {
        id: productId,
        name: productName,
        price: productPrice,
        image: productImage,
      };

      handleCartButtonClick(product, e.target);
    }
  });
});

// Function to load and display all products
async function loadProducts() {
  try {
    const response = await fetch("../js/public/she-page.json");
    if (!response.ok) {
      throw new Error(`Failed to fetch products: ${response.status}`);
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
      productPrice.textContent = product.price
        ? `₹${parseFloat(product.price).toFixed(2)}`
        : "Price not available";

      const addButton = document.createElement("button");
      addButton.classList.add("add-to-cart-btn");
      addButton.dataset.id = product.id;
      addButton.dataset.name = product.name;
      addButton.dataset.price = product.price;
      addButton.dataset.image = product.image;
      addButton.textContent = isInCart(product) ? "Visit Cart" : "Add to Cart";

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

      // Show popup message
      showPopup("Item added to cart successfully!");
      updateCartCount();
    } else {
      // If user is not signed in, redirect to the sign-in page
      window.location.href = "../html/signup-signin.html";
    }
  });
}


// Function to update the cart count
function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);

  const cartCountElement = document.getElementById("cartCount");
  if (cartCountElement) {
    cartCountElement.textContent = totalItems;
  }
}

// Function to display the popup message
function showPopup(message) {
  const popupContainer = document.getElementById("popupContainer");
  const popupMessage = popupContainer.querySelector(".popup-message");

  if (!popupContainer || !popupMessage) {
    console.error("Popup container or message not found!");
    return;
  }

  popupMessage.textContent = message;
  popupContainer.classList.add("show");

  setTimeout(() => {
    popupContainer.classList.remove("show");
  }, 3000);
}
