// Fetch data from JSON
async function fetchProductData() {
  try {
    const response = await fetch("../js/public/he-page.json"); // Path to your JSON file
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
    updateBillSummary();
    return;
  }

  cart.forEach((cartItem) => {
    const product = products.find((p) => p.id === cartItem.id);
    if (product) {
      renderCartItem(cartItem, product, cartItemsContainer);
    }
  });

  updateBillSummary();
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

  const quantityOptions = Array.from(
    { length: 10 },
    (_, i) =>
      `<option value="${i + 1}" ${
        cartItem.quantity === i + 1 ? "selected" : ""
      }>${i + 1}</option>`
  ).join("");

  const cartItemHTML = `
    <div class="cart-item">
      <img src="${product.image}" alt="${product.alt}" />
      <div class="item-details">
        <h3>${product.name}</h3>
        <p>Price: ₹${product.price}</p>
        <label for="size-select-${cartItem.id}">Size:</label>
        <select class="size-select" id="size-select-${cartItem.id}" data-id="${cartItem.id}">
          ${sizeOptions}
        </select>
        <label for="quantity-select-${cartItem.id}">Quantity:</label>
        <select class="quantity-select" id="quantity-select-${cartItem.id}" data-id="${cartItem.id}">
          ${quantityOptions}
        </select>
        <button class="remove-btn" data-id="${cartItem.id}">Remove</button>
      </div>
    </div>
  `;

  container.innerHTML += cartItemHTML;

  // Attach event listeners
  document
    .getElementById(`size-select-${cartItem.id}`)
    .addEventListener("change", handleSizeChange);
  document.querySelectorAll(`.quantity-select`).forEach((item) => {
    item.addEventListener("change", handleQuantityChange);
  });

  document
    .querySelector(`.remove-btn[data-id="${cartItem.id}"]`)
    .addEventListener("click", handleRemoveItem);
}

// Handle size change
function handleSizeChange(event) {
  const productId = event.target.dataset.id;
  const selectedSize = event.target.value;

  const cart = getLocalStorage("cart", []);
  const product = cart.find((item) => item.id === productId);

  if (product) {
    product.size = selectedSize;
    setLocalStorage("cart", cart);
  }
}

// Handle quantity change
function handleQuantityChange(event) {
  console.log("Nadakuthu");

  const productId = event.target.dataset.id;
  const selectedQuantity = parseInt(event.target.value, 10);

  const cart = getLocalStorage("cart", []);
  const product = cart.find((item) => item.id === productId);

  if (product) {
    product.quantity = selectedQuantity;
    setLocalStorage("cart", cart);
    updateBillSummary();
  }
}

// Handle item removal
function handleRemoveItem(event) {
  const productId = event.target.dataset.id;
  const cart = getLocalStorage("cart", []).filter(
    (item) => item.id !== productId
  );
  setLocalStorage("cart", cart);
  loadCartItems();
}

// Update bill summary
function updateBillSummary() {
  const cart = getLocalStorage("cart", []); // Retrieve cart data from local storage
  let totalPrice = 0;
  for (const item of cart) {
    totalPrice += item.price * item.quantity;
    console.log(item.price, " ", item.quantity);
  }

  console.log(totalPrice);

  const tax = totalPrice * 0.02; // Calculate 2% tax
  const deliveryFee = totalPrice > 0 ? 30 : 0; // Delivery fee only if there are items
  const totalBill = totalPrice + tax + deliveryFee;

  // Update the total price in the footer
  const totalPriceAmount = document.getElementById("totalPriceAmount");
  if (totalPriceAmount) {
    totalPriceAmount.textContent = totalBill.toFixed(2); // Update footer total price
  }

  // Populate the bill summary section
  const billSummaryContainer = document.getElementById("billSummary");
  if (billSummaryContainer) {
    billSummaryContainer.innerHTML = `
      <h3>Bill Summary</h3>
      <p>Product Price: ₹${totalPrice.toFixed(2)}</p>
      <p>Tax (2%): ₹${tax.toFixed(2)}</p>
      <p>Delivery Fee: ₹${deliveryFee.toFixed(2)}</p>
      <hr>
      <h4>Total: ₹${totalBill.toFixed(2)}</h4>
    `;
  }
}

// Empty cart
document.getElementById("emptyCartButton").addEventListener("click", () => {
  setLocalStorage("cart", []);
  loadCartItems();
});

// Initialize cart on page load
document.addEventListener("DOMContentLoaded", loadCartItems);
