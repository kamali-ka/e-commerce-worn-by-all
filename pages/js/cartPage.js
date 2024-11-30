function loadCartItems() {
  const cartItemsContainer = document.getElementById("cartItems");
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  // Clear existing items in container
  cartItemsContainer.innerHTML = "";

  if (cart.length === 0) {
    cartItemsContainer.innerHTML = `<p>Your cart is empty.</p>`;
    updateBillSummary(); // Update bill summary even when empty
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

    // Handle numeric and string price
    const numericPrice =
      typeof item.price === "string"
        ? parseFloat(item.price.replace(/₹|,/g, ""))
        : item.price;

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

  updateBillSummary(); // Update the bill summary whenever items are loaded
}
// Function to update quantity of an item in the cart
function updateQuantity(index, change) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  
  if (cart[index]) {
    // Update the quantity
    cart[index].quantity = (cart[index].quantity || 1) + change;

    // Ensure quantity does not go below 1
    if (cart[index].quantity < 1) {
      cart[index].quantity = 1;
    }

    // Save updated cart to localStorage
    localStorage.setItem("cart", JSON.stringify(cart));

    // Reload the cart display
    loadCartItems();
  }
}
function updateBillSummary() {
  const billSummaryContainer = document.getElementById("billSummary");
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  let totalPrice = 0;

  cart.forEach((item) => {
    const numericPrice =
      typeof item.price === "string"
        ? parseFloat(item.price.replace(/₹|,/g, ""))
        : item.price;
    totalPrice += (item.quantity || 1) * numericPrice;
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

// Event listener to load cart items on page load
document.addEventListener("DOMContentLoaded", () => {
  loadCartItems();

  // Add a bill summary container dynamically
  const buyNowContainer = document.getElementById("buyNowContainer");
  const billSummaryContainer = document.createElement("div");
  billSummaryContainer.id = "billSummary";
  billSummaryContainer.classList.add("bill-summary");
  buyNowContainer.insertAdjacentElement("beforebegin", billSummaryContainer);

  setupButtonHoverEffects();
});

// Event listener for the Buy Now button
document.addEventListener("DOMContentLoaded", () => {
  const buyNowButton = document.getElementById("buyNowButton");
  if (buyNowButton) {
    buyNowButton.addEventListener("click", handleBuyNow);
  }
});

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
  window.location.href = "../html/address-page.html";
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
