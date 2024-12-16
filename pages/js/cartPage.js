// Helper to safely get or set data in localStorage
function getLocalStorage(key, defaultValue = null) {
  try {
    return JSON.parse(localStorage.getItem(key)) || defaultValue;
  } catch (e) {
    console.error(`Error accessing localStorage key: ${key}`, e);
    return defaultValue;
  }
}

function setLocalStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error(`Error setting localStorage key: ${key}`, e);
  }
}

// Global variable to cache sizes data
let cachedSizesData = null;

// Fetch sizes data once and cache it
function fetchSizesData() {
  if (cachedSizesData) {
    return Promise.resolve(cachedSizesData); // Return cached data if already fetched
  }

  return fetch("../js/public/he-page.json") // Ensure this path is accurate
    .then((response) => {
      if (!response.ok) throw new Error("Failed to fetch sizes");
      return response.json();
    })
    .then((data) => {
      cachedSizesData = data; // Cache the sizes data
      return data;
    })
    .catch((error) => {
      console.error("Error fetching sizes:", error);
      return [];
    });
}

// Load cart items and display them dynamically
function loadCartItems() {
  const cartItemsContainer = document.getElementById("cartItems");
  const isLoggedIn = !!localStorage.getItem("email"); // Check login status

  if (!cartItemsContainer) {
    console.error("Cart items container not found.");
    return;
  }

  if (!isLoggedIn) {
    cartItemsContainer.innerHTML = "<p>Please log in to view your cart.</p>";
    updateBillSummary();
    updateCartCount();
    toggleCartVisibility(false);
    toggleLoginSignupVisibility(true);
    return;
  }

  const cart = getLocalStorage("cart", []);
  cartItemsContainer.innerHTML = ""; // Clear existing items

  if (cart.length === 0) {
    cartItemsContainer.innerHTML = "<p>Your cart is empty.</p>";
    updateBillSummary();
    updateCartCount();
    toggleCartVisibility(true);
    toggleLoginSignupVisibility(false);
    return;
  }

  fetchSizesData().then((sizesData) => {
    cart.forEach((item) => renderCartItem(item, cartItemsContainer, sizesData));
    updateBillSummary(); // Update the bill summary
    updateCartCount(); // Update the cart count
  });
}

// Render individual cart item
function renderCartItem(item, container, sizesData) {
  const productCard = document.createElement("div");
  productCard.classList.add("product-card");
  productCard.dataset.productId = item.id;

  productCard.innerHTML = `
    <img src="${item.image || "placeholder.jpg"}" alt="${item.name || "Product"}">
    <h2>${item.name || "Unnamed Product"}</h2>
    <p>Price: ₹${parseFloat(item.price) || 0}</p>
    <div class="sizes-container"></div>
    <div class="selected-size-display">Selected Size: <span class="selected-size">${item.selectedSize || "None"}</span></div>
    <div class="quantity-container">
      <button class="quantity-button" onclick="updateQuantity('${item.id}', -1)">-</button>
      <span class="quantity-display">Quantity: ${item.quantity || 1}</span>
      <button class="quantity-button" onclick="updateQuantity('${item.id}', 1)">+</button>
    </div>
    <button class="remove-button" onclick="removeFromCart('${item.id}')">Remove</button>
  `;

  const sizesContainer = productCard.querySelector(".sizes-container");
  populateSizes(sizesContainer, item, sizesData);

  container.appendChild(productCard);
}

// Populate sizes dynamically for a product
function populateSizes(sizesContainer, product, sizesData) {
  const productData = sizesData.find((item) => item.id === product.id);

  sizesContainer.innerHTML = ""; // Clear previous sizes

  if (productData && productData.sizes) {
    productData.sizes.forEach((size) => {
      const sizeElement = document.createElement("span");
      sizeElement.textContent = size;
      sizeElement.classList.add("size-option");

      // Highlight the selected size
      if (product.selectedSize === size) sizeElement.classList.add("selected");

      // Add click event for selecting size
      sizeElement.addEventListener("click", () => {
        console.log(`Size clicked: ${size}`);
        selectSize(product.id, size);
      });

      sizesContainer.appendChild(sizeElement);
    });
  } else {
    sizesContainer.innerHTML = "<p>No sizes available</p>";
  }
}

// Select a size for a product
function selectSize(productId, size) {
  const cart = getLocalStorage("cart", []);
  const product = cart.find((item) => item.id === productId);

  if (product) {
    // Update the selected size for the product
    product.selectedSize = size;

    // Update the cart in localStorage
    const updatedCart = cart.map((item) =>
      item.id === productId ? { ...item, selectedSize: size } : item
    );
    setLocalStorage("cart", updatedCart);

    // Update the UI
    const productCard = document.querySelector(`[data-product-id="${productId}"]`);
    if (productCard) {
      const selectedSizeDisplay = productCard.querySelector(".selected-size");
      if (selectedSizeDisplay) selectedSizeDisplay.textContent = size;

      const sizesContainer = productCard.querySelector(".sizes-container");
      if (sizesContainer) {
        sizesContainer.querySelectorAll(".size-option").forEach((el) =>
          el.classList.remove("selected")
        );
        const clickedSizeElement = [...sizesContainer.children].find(
          (el) => el.textContent === size
        );
        if (clickedSizeElement) clickedSizeElement.classList.add("selected");
      }
    }

    // Log for debugging
    console.log(`Size selected: ${size} for Product ID: ${productId}`);
  }
}

// Update item quantity in the cart
function updateQuantity(productId, change) {
  const cart = getLocalStorage("cart", []);
  const product = cart.find((item) => item.id === productId);

  if (product) {
    product.quantity = Math.max(1, (product.quantity || 1) + change);
    setLocalStorage("cart", cart);
    loadCartItems(); // Reload items to reflect the updated quantity
  }
}

// Remove item from cart
function removeFromCart(productId) {
  const cart = getLocalStorage("cart", []).filter((item) => item.id !== productId);
  setLocalStorage("cart", cart);
  loadCartItems();
}

// Update bill summary
function updateBillSummary() {
  const billSummaryContainer = document.getElementById("billSummary");
  if (!billSummaryContainer) {
    console.error("Bill summary container not found.");
    return;
  }

  const cart = getLocalStorage("cart", []);
  const totalPrice = cart.reduce((sum, item) => {
    const price = parseFloat(item.price) || 0; // Validate price
    const quantity = item.quantity || 1; // Default quantity to 1
    return sum + price * quantity;
  }, 0);

  const tax = totalPrice * 0.02;
  const deliveryFee = 30;
  const totalBill = totalPrice + tax + deliveryFee;

  billSummaryContainer.innerHTML = `
    <h3>Bill Summary</h3>
    <p>Product Price: ₹${totalPrice.toFixed(2)}</p>
    <p>Tax (2%): ₹${tax.toFixed(2)}</p>
    <p>Delivery Fee: ₹${deliveryFee.toFixed(2)}</p>
    <hr>
    <h4>Total: ₹${totalBill.toFixed(2)}</h4>
  `;

  const totalPriceAmount = document.getElementById("totalPriceAmount");
  if (totalPriceAmount) totalPriceAmount.textContent = totalBill.toFixed(2);
}

// Update cart count
function updateCartCount() {
  const cart = getLocalStorage("cart", []);
  const cartCount = cart.reduce((total, item) => total + (item.quantity || 1), 0);
  const cartCountElement = document.getElementById("cart-count");
  if (cartCountElement) cartCountElement.textContent = cartCount || 0;
}

// Toggle visibility helpers
function toggleCartVisibility(isVisible) {
  const cartIcon = document.getElementById("cartIcon");
  const cartCount = document.getElementById("cart-count");

  if (cartIcon) cartIcon.style.display = isVisible ? "block" : "none";
  if (cartCount) cartCount.style.display = isVisible ? "block" : "none";
}

function toggleLoginSignupVisibility(isVisible) {
  const loginSignupButtons = document.getElementById("loginSignupButtons");
  if (loginSignupButtons) loginSignupButtons.style.display = isVisible ? "block" : "none";
}

// Clear the cart
function clearCart() {
  setLocalStorage("cart", []);
  loadCartItems();
}

// Show popup modal
function showPopup(message) {
  const popupModal = document.getElementById("popupModal");
  const popupMessage = document.getElementById("popupMessage");

  if (popupModal && popupMessage) {
    popupMessage.textContent = message;
    popupModal.style.display = "block";

    const closePopupButton = document.getElementById("closePopupButton");
    if (closePopupButton) {
      closePopupButton.addEventListener("click", () => {
        popupModal.style.display = "none";
      });
    }
  }
}

// Buy Now button handler
const buyNowButton = document.getElementById("buyNowButton");
if (buyNowButton) {
  buyNowButton.addEventListener("click", (event) => {
    const cart = getLocalStorage("cart", []);
    if (cart.length === 0) {
      event.preventDefault();
      showPopup("Please add items to proceed to payment.");
    }
  });
}

// Initialize cart functionality on page load
document.addEventListener("DOMContentLoaded", () => {
  const isLoggedIn = !!localStorage.getItem("email");
  toggleCartVisibility(isLoggedIn);
  toggleLoginSignupVisibility(!isLoggedIn);
  loadCartItems();
});
