import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
import {
  getDatabase,
  ref,
  get,
} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js";

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
const database = getDatabase(app); // Initialize Realtime Database

document.addEventListener("DOMContentLoaded", () => {
  // Fetch data from Firebase Realtime Database
  const hePageRef = ref(database, "he-page");
  const shePageRef = ref(database, "she-page");
  const kidsPageRef = ref(database, "kids-page");
  const unisexPageRef = ref(database, "unisex-page");

  // Fetch data for all pages
  Promise.all([
    get(hePageRef),
    get(shePageRef),
    get(kidsPageRef),
    get(unisexPageRef),
  ])
    .then(([snapshotHe, snapshotShe, snapshotKids, snapshotUnisex]) => {
      if (
        !snapshotHe.exists() ||
        !snapshotShe.exists() ||
        !snapshotKids.exists() ||
        !snapshotUnisex.exists()
      ) {
        throw new Error("One or more database snapshots are empty.");
      }

      // Ensure the data is an array (fallback to empty array if not)
      const productsHe = Array.isArray(snapshotHe.val())
        ? snapshotHe.val()
        : [];
      const productsShe = Array.isArray(snapshotShe.val())
        ? snapshotShe.val()
        : [];
      const productsKids = Array.isArray(snapshotKids.val())
        ? snapshotKids.val()
        : [];
      const productsUnisex = Array.isArray(snapshotUnisex.val())
        ? snapshotUnisex.val()
        : [];

      // Combine all products into one array
      const allProducts = [
        ...productsHe,
        ...productsShe,
        ...productsKids,
        ...productsUnisex,
      ];

      const selectedProductId = getQueryParam("id");

      if (!selectedProductId) {
        displayErrorMessage(
          "Product details not found. Please go back to the product list."
        );
        return;
      }

      // Find the product from the combined array of all products
      const product = allProducts.find((item) => item.id === selectedProductId);

      if (!product) {
        displayErrorMessage(
          "Product details not found. Please go back to the product list."
        );
        return;
      }

      // Display the product details
      displayProductDetails(product);
    })
    .catch((error) => {
      console.error("Error fetching product data:", error);
      displayErrorMessage(
        `Failed to load product details. Error: ${error.message}`
      );
    });

  function displayErrorMessage(message) {
    document.getElementById("product-details").innerHTML = `<p>${message}</p>`;
  }

  // Function to get query parameter (product ID)
  function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
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

    // Display stock status
    displayStockStatus(product.stock);

    // Display size options
    displayProductSizes(product.sizes); // Call the function to display sizes

    // Disable "Buy Now" button initially
    const buyNowButton = document.getElementById("buyNowButton");
    if (buyNowButton) {
      buyNowButton.disabled = true; // Disable "Buy Now" button
    }

    // Check if the product is already in the cart
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    const productInCart = cart.find((item) => item.id === product.id);

    const addToCartButton = document.getElementById("addToCartButton");

    if (productInCart) {
      addToCartButton.textContent = "Visit Cart";
      addToCartButton.onclick = () => {
        window.location.href = "../html/cartPage.html"; // Redirect to cart page
      };
    } else {
      addToCartButton.addEventListener("click", () =>
        addToCart(product, addToCartButton)
      );
    }

    if (buyNowButton) {
      buyNowButton.addEventListener("click", () => showBuyNowPopup());
    }
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

    // Optionally enable the Buy Now button when size is selected
    const buyNowButton = document.getElementById("buyNowButton");
    buyNowButton.disabled = false; // Enable "Buy Now" button when size is selected

    // Optionally enable the Add to Cart button when size is selected
    const addToCartButton = document.getElementById("addToCartButton");
    addToCartButton.disabled = !size; // Disable Add to Cart if no size is selected
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
        stockStatusElement.style.color = "green"; // Set to green if stock is sufficient
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

  // Function to add product to cart
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

      // Change "Add to Cart" button to "Visit Cart"
      const addToCartButton = document.getElementById("addToCartButton");
      if (addToCartButton) {
        addToCartButton.textContent = "Visit Cart";
        addToCartButton.onclick = () => {
          window.location.href = "../html/cartPage.html"; // Redirect to cart page
        };
      }
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

  // Function to update cart count (counting unique products)
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
