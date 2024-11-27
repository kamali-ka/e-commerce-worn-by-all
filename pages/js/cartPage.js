// Function to load cart items
function loadCartItems() {
  const cartItemsContainer = document.getElementById("cartItems");
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  // Clear existing items in container
  cartItemsContainer.innerHTML = "";

  if (cart.length === 0) {
    cartItemsContainer.innerHTML = `<p>Your cart is empty.</p>`;
    return;
  }

  cart.forEach((item, index) => {
    const productCard = document.createElement("div");
    productCard.classList.add("product-card");

    const productImage = document.createElement("img");
    productImage.src = item.image;
    productImage.alt = item.alt;
    productImage.classList.add("product-image");

    const productName = document.createElement("h2");
    productName.textContent = item.name;
    productName.classList.add("product-name");

    // Extract numeric value from price
    const numericPrice = parseFloat(item.price.replace(/₹|,/g, ""));

    const productPrice = document.createElement("p");
    productPrice.classList.add("price");
    productPrice.textContent = `Price: ₹${(
      (item.quantity || 1) * numericPrice
    ).toFixed(2)}`;

    // Quantity Container
    const quantityContainer = document.createElement("div");
    quantityContainer.classList.add("quantity-container");

    const decreaseButton = document.createElement("button");
    decreaseButton.textContent = "-";
    decreaseButton.classList.add("quantity-button");
    decreaseButton.onclick = () => updateQuantity(index, -1);

    const quantityDisplay = document.createElement("span");
    quantityDisplay.textContent = `Quantity: ${item.quantity || 1}`;
    quantityDisplay.classList.add("quantity-display");

    const increaseButton = document.createElement("button");
    increaseButton.textContent = "+";
    increaseButton.classList.add("quantity-button");
    increaseButton.onclick = () => updateQuantity(index, 1);

    quantityContainer.appendChild(decreaseButton);
    quantityContainer.appendChild(quantityDisplay);
    quantityContainer.appendChild(increaseButton);

    const removeButton = document.createElement("button");
    removeButton.textContent = "Remove";
    removeButton.classList.add("remove-button");
    removeButton.onclick = () => removeFromCart(index);

    productCard.appendChild(productImage);
    productCard.appendChild(productName);
    productCard.appendChild(productPrice);
    productCard.appendChild(quantityContainer);
    productCard.appendChild(removeButton);

    cartItemsContainer.appendChild(productCard);
  });
}

// Function to update quantity
function updateQuantity(index, change) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  const item = cart[index];

  item.quantity = (item.quantity || 1) + change;
  if (item.quantity <= 0) {
    cart.splice(index, 1);
  } else {
    cart[index] = item;
  }

  localStorage.setItem("cart", JSON.stringify(cart)); // Update localStorage
  loadCartItems(); // Reload the cart dynamically
}

// Function to remove item from cart
function removeFromCart(index) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  cart.splice(index, 1); // Remove the item at the specified index
  localStorage.setItem("cart", JSON.stringify(cart)); // Update localStorage
  loadCartItems(); // Reload the cart dynamically
}

// Function to handle Buy Now
function handleBuyNow() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  if (cart.length === 0) {
    alert("Your cart is empty. Add items before proceeding to buy.");
    return;
  }

  // Redirect to payment page
  window.location.href = "../html/payment.html";
}

// Add hover effects via JS
function setupButtonHoverEffects() {
  const removeButtons = document.querySelectorAll(".remove-button");
  removeButtons.forEach((button) => {
    button.addEventListener("mouseover", () => {
      button.style.backgroundColor = "red";
      button.style.color = "white";
    });
    button.addEventListener("mouseout", () => {
      button.style.backgroundColor = "";
      button.style.color = "";
    });
  });

  const quantityButtons = document.querySelectorAll(".quantity-button");
  quantityButtons.forEach((button) => {
    button.addEventListener("mouseover", () => {
      button.style.backgroundColor = "#e0e0e0";
    });
    button.addEventListener("mouseout", () => {
      button.style.backgroundColor = "";
    });
  });
}

// Smooth scroll to top after operations
function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
}

// Event listener to load cart items on page load
document.addEventListener("DOMContentLoaded", () => {
  loadCartItems();
  setupButtonHoverEffects();
});

// Event listener for the Buy Now button
document.addEventListener("DOMContentLoaded", () => {
  const buyNowButton = document.getElementById("buyNowButton");
  if (buyNowButton) {
    buyNowButton.addEventListener("click", handleBuyNow);
  }
});
