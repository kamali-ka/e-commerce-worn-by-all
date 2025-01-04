// Import Firebase functions from the modular SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
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

// Export Firebase database references and the 'get' function for use
export { database, ref, get };





// Import the necessary functions from firebase-config.js
// import { database, ref, get } from './firebase-config.js'; // Ensure the correct path

// Fetch product data from Firebase Realtime Database
async function fetchProductData() {
  try {
    const productCategories = ['he-page', 'she-page', 'kids-page', 'unisex-page'];
    let allProducts = [];

    for (let category of productCategories) {
      // Use the new ref() and get() functions
      const snapshot = await get(ref(database, category)); // Correct usage of ref and get in Firebase v9+
      
      if (snapshot.exists()) {
        const categoryProducts = snapshot.val();
        allProducts = [...allProducts, ...Object.values(categoryProducts)];
      } else {
        console.error(`No data found for category: ${category}`);
      }
    }

    return allProducts; // Return the combined products
  } catch (error) {
    console.error("Error fetching product data from Firebase:", error);
    return [];
  }
}

// Other existing functions for handling cart and rendering cart items
// Helper to get/set localStorage safely
function getLocalStorage(key, defaultValue = []) {
  try {
    return JSON.parse(localStorage.getItem(key)) || defaultValue;
  } catch {
    return defaultValue;
  }
}

function setLocalStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

// Load cart items
async function loadCartItems() {
  const cartItemsContainer = document.getElementById("cartItems");
  if (!cartItemsContainer) return;

  const cart = getLocalStorage("cart", []);
  const products = await fetchProductData(); // Fetch data from both files

  cartItemsContainer.innerHTML = "";

  if (cart.length === 0) {
    cartItemsContainer.innerHTML = "<p>Your cart is empty.</p>";
    updateBillSummary(cart, products);
    return;
  }

  cart.forEach((cartItem) => {
    const product = products.find((p) => p.id === cartItem.id);
    if (product) {
      renderCartItem(cartItem, product, cartItemsContainer);
    }
  });

  updateBillSummary(cart, products);
}

// Render individual cart item
// Render individual cart item
function renderCartItem(cartItem, product, container) {
  // Check if product.sizes exists and is an array
  const sizeOptions = Array.isArray(product.sizes)
    ? product.sizes
        .map(
          (size) =>
            `<option value="${size}" ${
              cartItem.size === size ? "selected" : ""
            }>${size}</option>`
        )
        .join("")
    : ""; // If no sizes, set empty string

  const cartItemHTML = `
    <div class="cart-item" data-id="${cartItem.id}">
      <img src="${product.image}" alt="${product.alt}" />
      <div class="item-details">
        <h3>${product.name}</h3>
        <p>Price: ₹${product.price}</p>
        <label for="size-select-${cartItem.id}">Size:</label>
        <select class="size-select" id="size-select-${cartItem.id}">
          ${sizeOptions}
        </select>
        <div class="quantity-controls">
          <button class="decrease-btn" data-id="${cartItem.id}">-</button>
          <span class="quantity">${cartItem.quantity}</span>
          <button class="increase-btn" data-id="${cartItem.id}">+</button>
        </div>
        <button class="remove-btn" data-id="${cartItem.id}">Remove</button>
      </div>
    </div>
  `;
  container.innerHTML += cartItemHTML;
}


// Attach event delegation for cart controls
document.addEventListener("DOMContentLoaded", () => {
  const cartItemsContainer = document.getElementById("cartItems");
  if (cartItemsContainer) {
    cartItemsContainer.addEventListener("click", (event) => {
      const target = event.target;
      const productId = target.dataset.id;

      if (target.classList.contains("decrease-btn")) {
        changeQuantity(productId, -1);
      } else if (target.classList.contains("increase-btn")) {
        changeQuantity(productId, 1);
      } else if (target.classList.contains("remove-btn")) {
        removeCartItem(productId);
      }
    });
  }

  const emptyCartButton = document.getElementById("emptyCartButton");
  if (emptyCartButton) {
    emptyCartButton.addEventListener("click", () => {
      setLocalStorage("cart", []);
      loadCartItems(); // Re-render the cart after emptying
    });
  }

  const buyNowButton = document.getElementById("buyNowButton");
  if (buyNowButton) {
    buyNowButton.addEventListener("click", handleBuyNow);
  }

  const confirmOrderButton = document.getElementById("confirmOrderButton");
  if (confirmOrderButton) {
    confirmOrderButton.addEventListener("click", clearCartAfterOrder);
  }

  loadCartItems(); // Initialize cart on page load
});

// Remove item from cart
function removeCartItem(productId) {
  const cart = getLocalStorage("cart", []);
  const updatedCart = cart.filter((item) => item.id !== productId); // Remove the item with the given ID
  setLocalStorage("cart", updatedCart);
  loadCartItems(); // Re-render the cart after removal
}

// Change quantity
function changeQuantity(productId, change) {
  const cart = getLocalStorage("cart", []);
  const item = cart.find((i) => i.id === productId);

  if (item) {
    item.quantity = Math.max(1, item.quantity + change); // Ensure quantity is at least 1
    setLocalStorage("cart", cart);
    loadCartItems(); // Re-render the cart after update
  }
}

// Update bill summary
function updateBillSummary(cart, products) {
  let totalPrice = 0;

  cart.forEach((item) => {
    const product = products.find((p) => p.id === item.id);
    if (product) {
      totalPrice += product.price * item.quantity;
    }
  });

  const tax = totalPrice * 0.02;
  const deliveryFee = totalPrice > 0 ? 30 : 0;
  const totalBill = totalPrice + tax + deliveryFee;

  // Update Bill Summary Section
  const billSummary = document.getElementById("billSummary");
  if (billSummary) {
    billSummary.innerHTML = `
      <h3>Bill Summary</h3>
      <p>Product Price: ₹${totalPrice.toFixed(2)}</p>
      <p>Tax (2%): ₹${tax.toFixed(2)}</p>
      <p>Delivery Fee: ₹${deliveryFee.toFixed(2)}</p>
      <hr>
      <h4>Total: ₹${totalBill.toFixed(2)}</h4>
    `;
  }

  // Update Total Amount in Footer
  const totalAmountElement = document.getElementById("totalAmount");
  if (totalAmountElement) {
    totalAmountElement.textContent = totalBill.toFixed(2);
  }
}

// Handle "Buy Now" button click
function handleBuyNow() {
  const cart = getLocalStorage("cart", []);

  if (cart.length === 0) {
    alert("Your cart is empty. Add items before proceeding to checkout.");
    return;
  }

  // Save cart details for checkout
  setLocalStorage("checkoutItems", cart);
  localStorage.setItem('isFromCartPage',true);
  window.location.href='../html/orderReview.html'
  
  // Redirect to the address page
  window.location.href = "../html/orderReview.html"; // Update the path as needed
}

// Clear cart after order submission
function clearCartAfterOrder() {
  setLocalStorage("cart", []); // Clear cart data
  alert("Your order has been placed successfully! The cart is now empty.");
  window.location.href = "/index.html"; // Redirect to home or any other page
}
