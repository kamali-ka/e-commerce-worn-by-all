// Fetch data from JSON
async function fetchProductData() {
  try {
    const response = await fetch("../js/public/he-page.json"); // Update the path to your JSON file
    if (!response.ok) throw new Error("Failed to fetch product data");
    return await response.json();
  } catch (error) {
    console.error("Error fetching product data:", error);
    return [];
  }
}

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
  const cart = getLocalStorage("cart", []);
  const products = await fetchProductData();

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
function renderCartItem(cartItem, product, container) {
  const sizeOptions = product.sizes
    .map(
      (size) =>
        `<option value="${size}" ${
          cartItem.size === size ? "selected" : ""
        }>${size}</option>`
    )
    .join("");

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
document.getElementById("cartItems").addEventListener("click", (event) => {
  const target = event.target;
  const cart = getLocalStorage("cart", []);

  // Handle decrease button
  if (target.classList.contains("decrease-btn")) {
    const productId = target.dataset.id;
    changeQuantity(productId, -1);
  }

  // Handle increase button
  if (target.classList.contains("increase-btn")) {
    const productId = target.dataset.id;
    changeQuantity(productId, 1);
  }

  // Handle remove button
  if (target.classList.contains("remove-btn")) {
    const productId = target.dataset.id;
    removeCartItem(productId);
  }
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

// Remove item
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
  billSummary.innerHTML = `
    <h3>Bill Summary</h3>
    <p>Product Price: ₹${totalPrice.toFixed(2)}</p>
    <p>Tax (2%): ₹${tax.toFixed(2)}</p>
    <p>Delivery Fee: ₹${deliveryFee.toFixed(2)}</p>
    <hr>
    <h4>Total: ₹${totalBill.toFixed(2)}</h4>
  `;

  // Update Total Amount in Footer
  const totalAmountElement = document.getElementById("totalAmount");
  totalAmountElement.textContent = totalBill.toFixed(2);
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

  // Redirect to the address page
  window.location.href = "../html/orderReview.html"; // Update the path as needed
}

// Empty cart functionality
document.getElementById("emptyCartButton").addEventListener("click", () => {
  setLocalStorage("cart", []);
  loadCartItems(); // Re-render the cart after emptying
});

// Attach "Buy Now" button event listener
document.getElementById("buyNowButton").addEventListener("click", handleBuyNow);

// Initialize cart on page load
document.addEventListener("DOMContentLoaded", loadCartItems);
