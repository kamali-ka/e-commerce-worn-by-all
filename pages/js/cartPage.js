// Function to load cart items and display them dynamically
function loadCartItems() {
  const cartItemsContainer = document.getElementById("cartItems");
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  // Clear existing items in container
  cartItemsContainer.innerHTML = "";

  if (cart.length === 0) {
    cartItemsContainer.innerHTML = "<p>Your cart is empty.</p>";
    updateBillSummary(); // Update bill summary even when empty
    return;
  }

  cart.forEach((item, index) => {
    const productCard = document.createElement("div");
    productCard.classList.add("product-card");

    // Create product image
    const productImage = document.createElement("img");
    productImage.src = item.image || 'placeholder.jpg';
    productImage.alt = item.name;
    productImage.classList.add("product-image");

    // Create product name
    const productName = document.createElement("h2");
    productName.textContent = item.name;
    productName.classList.add("product-name");

    // Create price display
    const numericPrice = typeof item.price === "string"
                          ? parseFloat(item.price.replace(/₹|,/g, ""))
                          : item.price;
    const productPrice = document.createElement("p");
    productPrice.classList.add("price");
    productPrice.textContent = `Price: ₹${((item.quantity || 1) * numericPrice).toFixed(2)}`;

    // Create quantity container and buttons
    const quantityContainer = document.createElement("div");
    quantityContainer.classList.add("quantity-container");

    const decreaseButton = createQuantityButton("-", () => updateQuantity(index, -1));
    const quantityDisplay = document.createElement("span");
    quantityDisplay.textContent = `Quantity: ${item.quantity || 1}`;
    quantityDisplay.classList.add("quantity-display");
    const increaseButton = createQuantityButton("+", () => updateQuantity(index, 1));

    quantityContainer.appendChild(decreaseButton);
    quantityContainer.appendChild(quantityDisplay);
    quantityContainer.appendChild(increaseButton);

    // Create remove button
    const removeButton = document.createElement("button");
    removeButton.textContent = "Remove";
    removeButton.classList.add("remove-button");
    removeButton.onclick = () => removeFromCart(index);

    // Create size display
    const sizeDisplay = document.createElement("p");
    sizeDisplay.classList.add("size-display");
    sizeDisplay.textContent = `Selected Sizes: ${item.selectedSizes ? item.selectedSizes.join(", ") : "Not selected"}`;

    // Create size selector container
    const sizeSelectorContainer = document.createElement("div");
    sizeSelectorContainer.classList.add("size-selector-container");
    sizeSelectorContainer.style.display = "none"; // Initially hidden

    // Create and append size rows
    appendSizeRow(sizeSelectorContainer, item, index, 1, ["XS", "S", "M", "L", "XL", "XXL", "XXXL"]);
    appendSizeRow(sizeSelectorContainer, item, index, 2, [24, 26, 28, 30, 32, 34, 36, 38, 40]);

    // Append all elements to product card
    productCard.appendChild(productImage);
    productCard.appendChild(productName);
    productCard.appendChild(productPrice);
    productCard.appendChild(quantityContainer);
    productCard.appendChild(removeButton);
    productCard.appendChild(sizeDisplay);
    productCard.appendChild(sizeSelectorContainer);

    // Show/hide size selector on hover
    productCard.addEventListener("mouseover", () => {
      sizeSelectorContainer.style.display = "block";
    });

    productCard.addEventListener("mouseout", () => {
      sizeSelectorContainer.style.display = "none";
    });

    cartItemsContainer.appendChild(productCard);
  });

  updateBillSummary(); // Update the bill summary whenever items are loaded
}

// Helper function to create a quantity button
function createQuantityButton(text, onClick) {
  const button = document.createElement("button");
  button.textContent = text;
  button.classList.add("quantity-button");
  button.onclick = onClick;
  return button;
}

// Helper function to append size options to a size row
function appendSizeRow(container, item, index, row, sizes) {
  const sizeRow = document.createElement("div");
  sizeRow.classList.add("size-row");

  sizes.forEach((size) => {
    const sizeOption = document.createElement("span");
    sizeOption.textContent = size;
    sizeOption.classList.add("size-option");

    if (item.selectedSizes && item.selectedSizes.includes(size)) {
      sizeOption.classList.add("selected-size");
    }

    sizeOption.addEventListener("click", () => {
      selectSize(index, size, row);
      loadCartItems(); // Reload the items with updated size
    });

    sizeRow.appendChild(sizeOption);
  });

  container.appendChild(sizeRow);
}

// Function to select size with row restrictions
function selectSize(index, size, row) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  if (cart[index]) {
    if (cart[index].selectedRow && cart[index].selectedRow !== row) {
      alert("You can only select sizes from one row. Please choose a size from the current row.");
      return;
    }

    cart[index].selectedRow = row; // Store the row where the size was selected
    cart[index].selectedSizes = cart[index].selectedSizes || [];

    // Update the selected size for the quantity
    for (let i = 0; i < cart[index].quantity; i++) {
      if (!cart[index].selectedSizes[i]) {
        cart[index].selectedSizes[i] = size;
        break;
      }
    }

    localStorage.setItem("cart", JSON.stringify(cart)); // Save the updated cart
  }
}

// Function to update quantity of an item in the cart
function updateQuantity(index, change) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  
  // Check if the item exists at the given index
  if (cart[index]) {
    // Ensure `selectedSizes` is initialized
    if (!cart[index].selectedSizes) {
      cart[index].selectedSizes = []; // Initialize if undefined
    }

    console.log("Before Update:", cart[index].quantity);
    cart[index].quantity = Math.max(1, (cart[index].quantity || 1) + change);

    // Fill `selectedSizes` array if needed
    while (cart[index].selectedSizes.length < cart[index].quantity) {
      cart[index].selectedSizes.push(null);
    }

    console.log("After Update:", cart[index].quantity);
    localStorage.setItem("cart", JSON.stringify(cart));
    loadCartItems(); // Reload cart items to reflect the updated quantity
  } else {
    console.error("Item not found in cart at index:", index);
  }
}


// Function to update the bill summary
function updateBillSummary() {
  const billSummaryContainer = document.getElementById("billSummary");
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  let totalPrice = 0;

  cart.forEach((item) => {
    const numericPrice = typeof item.price === "string"
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
    showPopupMessage();
    return;
  }

  // Redirect to payment page if the cart is not empty
  window.location.href = "../html/address-page.html";
}

// Function to show a popup message if the cart is empty
function showPopupMessage() {
  const popupModal = document.getElementById("popupModal");
  const closePopupButton = document.getElementById("closePopupButton");

  // Show the modal
  popupModal.style.display = "flex";

  // Close the popup when the button is clicked
  closePopupButton.onclick = () => {
    popupModal.style.display = "none";
  };

  // Close the popup when clicking outside the content
  popupModal.onclick = (e) => {
    if (e.target === popupModal) {
      popupModal.style.display = "none";
    }
  };
}

// Event listener to load cart items on page load
document.addEventListener("DOMContentLoaded", () => {
  loadCartItems();

  const buyNowButton = document.getElementById("buyNowButton");
  if (buyNowButton) {
    buyNowButton.addEventListener("click", handleBuyNow);
  }
});
