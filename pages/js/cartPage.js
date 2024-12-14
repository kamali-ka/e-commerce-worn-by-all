// Function to load cart items and display them dynamically
function loadCartItems() {
  const cartItemsContainer = document.getElementById("cartItems");
  const isLoggedIn = localStorage.getItem("email"); // Example: checking for email in localStorage

  if (!isLoggedIn) {
    // If user is not logged in, show a message and clear cart
    cartItemsContainer.innerHTML = "<p>Please log in to view your cart.</p>";
    updateBillSummary();
    updateCartCount();
    toggleCartVisibility(false); // Hide cart icon and count
    toggleLoginSignupVisibility(true); // Show login/signup buttons
    return;
  }

  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  cartItemsContainer.innerHTML = ""; // Clear existing items

  if (cart.length === 0) {
    cartItemsContainer.innerHTML = "<p>Your cart is empty.</p>";
    updateBillSummary();
    updateCartCount();
    toggleCartVisibility(true); // Show cart icon and count
    toggleLoginSignupVisibility(false); // Hide login/signup buttons
    return;
  }

  cart.forEach((item) => {
    const productCard = document.createElement("div");
    productCard.classList.add("product-card");

    // Product image
    const productImage = document.createElement("img");
    productImage.src = item.image || "placeholder.jpg";
    productImage.alt = item.name;

    // Product name
    const productName = document.createElement("h2");
    productName.textContent = item.name;

    // Price
    const productPrice = document.createElement("p");
    productPrice.textContent = `Price: ₹${item.price}`;

    // Size container
    const sizeContainer = document.createElement("div");
    sizeContainer.classList.add("size-container");
    sizeContainer.style.display = "none"; // Initially hidden

    // Add hover event to fetch sizes
    productCard.addEventListener("mouseover", () => fetchSizesOnHover(item.id, sizeContainer));
    productCard.addEventListener("mouseleave", () => {
      sizeContainer.style.display = "none"; // Hide sizes on mouse leave
    });

    // Quantity container
    const quantityContainer = document.createElement("div");
    quantityContainer.classList.add("quantity-container");

    const decreaseButton = createQuantityButton("-", () => updateQuantity(item.id, -1));
    const quantityDisplay = document.createElement("span");
    quantityDisplay.textContent = `Quantity: ${item.quantity || 1}`;
    quantityDisplay.classList.add("quantity-display");
    const increaseButton = createQuantityButton("+", () => updateQuantity(item.id, 1));

    quantityContainer.appendChild(decreaseButton);
    quantityContainer.appendChild(quantityDisplay);
    quantityContainer.appendChild(increaseButton);

    // Remove button
    const removeButton = document.createElement("button");
    removeButton.textContent = "Remove";
    removeButton.classList.add("remove-button");
    removeButton.onclick = () => removeFromCart(item.id);

    // Append elements to the product card
    productCard.appendChild(productImage);
    productCard.appendChild(productName);
    productCard.appendChild(productPrice);
    productCard.appendChild(sizeContainer);
    productCard.appendChild(quantityContainer);
    productCard.appendChild(removeButton);

    cartItemsContainer.appendChild(productCard);
  });

  updateBillSummary(); // Update the bill summary whenever items are loaded
  updateCartCount(); // Update the cart count whenever items are loaded
}

// Function to create quantity buttons
function createQuantityButton(label, onClick) {
  const button = document.createElement("button");
  button.textContent = label;
  button.classList.add("quantity-button");
  button.addEventListener("click", onClick);
  return button;
}

// Function to update quantity of an item in the cart
function updateQuantity(productId, change) {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const product = cart.find((item) => item.id === productId);

  if (product) {
    product.quantity = Math.max(1, (product.quantity || 1) + change);
    localStorage.setItem("cart", JSON.stringify(cart));
    loadCartItems(); // Reload cart items to reflect the updated quantity
  }
}

// Function to fetch sizes dynamically on hover
function fetchSizesOnHover(productId, sizeContainer) {
  fetch("../path-to-your-json.json")
    .then((response) => response.json())
    .then((data) => {
      const product = data.find((item) => item.id === productId);
      if (product && product.sizes) {
        sizeContainer.innerHTML = product.sizes
          .map((size) => `<span class='size'>${size}</span>`)
          .join(" ");
        sizeContainer.style.display = "block";
      } else {
        sizeContainer.innerHTML = "<p>No sizes available</p>";
      }
    })
    .catch((error) => {
      console.error("Error fetching sizes:", error);
      sizeContainer.innerHTML = "<p>Error loading sizes</p>";
    });
}

// Function to remove item from cart
function removeFromCart(productId) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  cart = cart.filter((item) => item.id !== productId);
  localStorage.setItem("cart", JSON.stringify(cart));
  loadCartItems();
  updateCartCount();
}

// Function to update the bill summary
function updateBillSummary() {
  const billSummaryContainer = document.getElementById("billSummary");
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  let totalPrice = 0;

  cart.forEach((item) => {
    totalPrice += item.price * (item.quantity || 1);
  });

  const tax = totalPrice * 0.02; // 2% tax
  const deliveryFee = 30; // Fixed delivery fee
  const totalBill = totalPrice + tax + deliveryFee;

  billSummaryContainer.innerHTML = `
    <h3>Bill Summary</h3>
    <p>Product Price: ₹${totalPrice.toFixed(2)}</p>
    <p>Tax (2%): ₹${tax.toFixed(2)}</p>
    <p>Delivery Fee: ₹${deliveryFee.toFixed(2)}</p>
    <hr>
    <h4>Total: ₹${totalBill.toFixed(2)}</h4>
  `;
}

// Function to update the cart count
function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const cartCount = cart.reduce((total, item) => total + (item.quantity || 1), 0);
  const cartCountElement = document.getElementById("cart-count");

  if (cartCountElement) {
    cartCountElement.textContent = cartCount || 0;
  }
}

// Function to toggle cart visibility based on login status
function toggleCartVisibility(isVisible) {
  const cartIcon = document.getElementById("cartIcon");
  const cartCount = document.getElementById("cart-count");

  if (cartIcon) cartIcon.style.display = isVisible ? "block" : "none";
  if (cartCount) cartCount.style.display = isVisible ? "block" : "none";
}

// Function to toggle login/signup visibility
function toggleLoginSignupVisibility(isVisible) {
  const loginSignupButtons = document.getElementById("loginSignupButtons");
  if (loginSignupButtons) {
    loginSignupButtons.style.display = isVisible ? "block" : "none";
  }
}

// Initialize cart items on page load
document.addEventListener("DOMContentLoaded", () => {
  const isLoggedIn = !!localStorage.getItem("email");
  toggleCartVisibility(isLoggedIn); // Show or hide cart icon and count based on login status
  toggleLoginSignupVisibility(!isLoggedIn); // Show or hide login/signup buttons based on login status
  loadCartItems();
  updateCartCount();

  // Add event listener for logout button
  const logoutButton = document.getElementById("logoutButton");
  if (logoutButton) {
    logoutButton.addEventListener("click", () => {
      localStorage.removeItem("email"); // Clear login data
      localStorage.removeItem("cart"); // Optionally clear cart data
      toggleCartVisibility(false); // Hide cart icon and count
      toggleLoginSignupVisibility(true); // Show login/signup buttons
      window.location.href = "../../index.html"; // Redirect to login page
    });
  }
});
