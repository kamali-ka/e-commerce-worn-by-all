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

    const productImage = document.createElement("img");
    productImage.src = item.image;
    productImage.alt = item.alt;
    productImage.classList.add("product-image");

    const productName = document.createElement("h2");
    productName.textContent = item.name;
    productName.classList.add("product-name");

    const numericPrice =
      typeof item.price === "string"
        ? parseFloat(item.price.replace(/₹|,/g, ""))
        : item.price;

    const productPrice = document.createElement("p");
    productPrice.classList.add("price");
    productPrice.textContent = `Price: ₹${(
      (item.quantity || 1) * numericPrice
    ).toFixed(2)}`;

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

    const sizeSelectorContainer = document.createElement("div");
    sizeSelectorContainer.classList.add("size-selector-container");
    sizeSelectorContainer.style.display = "none"; // Initially hidden

    // Create size options (row 1: XS, S, M, L, XL, XXL, XXXL)
    const sizeRow1 = document.createElement("div");
    sizeRow1.classList.add("size-row");
    const sizes1 = ["XS", "S", "M", "L", "XL", "XXL", "XXXL"];
    sizes1.forEach((size) => {
      const sizeOption = document.createElement("span");
      sizeOption.textContent = size;
      sizeOption.classList.add("size-option");

      // Check if the size is selected for the quantity and apply a class
      if (item.selectedSizes && item.selectedSizes.includes(size)) {
        sizeOption.classList.add("selected-size");
      }

      sizeOption.addEventListener("click", () => {
        selectSize(index, size, 1); // Update the size in the cart for this quantity, with Row 1 restriction
        loadCartItems(); // Reload the items with updated size
      });

      sizeRow1.appendChild(sizeOption);
    });

    // Create size options (row 2: 24, 26, 28, 30, 32, 34, 36, 38, 40)
    const sizeRow2 = document.createElement("div");
    sizeRow2.classList.add("size-row");
    const sizes2 = [24, 26, 28, 30, 32, 34, 36, 38, 40];
    sizes2.forEach((size) => {
      const sizeOption = document.createElement("span");
      sizeOption.textContent = size;
      sizeOption.classList.add("size-option");

      // Check if the size is selected for the quantity and apply a class
      if (item.selectedSizes && item.selectedSizes.includes(size)) {
        sizeOption.classList.add("selected-size");
      }

      sizeOption.addEventListener("click", () => {
        selectSize(index, size, 2); // Update the size in the cart for this quantity, with Row 2 restriction
        loadCartItems(); // Reload the items with updated size
      });

      sizeRow2.appendChild(sizeOption);
    });

    sizeSelectorContainer.appendChild(sizeRow1);
    sizeSelectorContainer.appendChild(sizeRow2);

    productCard.appendChild(productImage);
    productCard.appendChild(productName);
    productCard.appendChild(productPrice);
    productCard.appendChild(quantityContainer);
    productCard.appendChild(removeButton);
    productCard.appendChild(sizeSelectorContainer);

    productCard.addEventListener("mouseover", () => {
      sizeSelectorContainer.style.display = "block";
    });

    productCard.addEventListener("mouseout", () => {
      sizeSelectorContainer.style.display = "none";
    });

    const sizeDisplay = document.createElement("p");
    sizeDisplay.classList.add("size-display");
    sizeDisplay.textContent = `Selected Sizes: ${item.selectedSizes
      ? item.selectedSizes.join(", ")
      : "Not selected"}`;
    productCard.appendChild(sizeDisplay);

    cartItemsContainer.appendChild(productCard);
  });

  updateBillSummary(); // Update the bill summary whenever items are loaded
}

// Function to select size with row restrictions
function selectSize(index, size, row) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  if (cart[index]) {
    // Restrict size selection based on the row
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
  
  if (cart[index]) {
    cart[index].quantity = (cart[index].quantity || 1) + change;

    // Ensure quantity does not go below 1
    if (cart[index].quantity < 1) {
      cart[index].quantity = 1;
    }

    while (cart[index].selectedSizes.length < cart[index].quantity) {
      cart[index].selectedSizes.push(null); // Fill up with null if less sizes are selected
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    loadCartItems();
  }
}

// Function to update the bill summary
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

// Other functions (removeFromCart, handleBuyNow, etc.) remain unchanged


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

// Function to update selected size in the cart
function selectSize(index, size) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  if (cart[index]) {
    // Ensure selectedSizes is an array
    if (!cart[index].selectedSizes) {
      cart[index].selectedSizes = [];
    }

    // If the product quantity is one, directly update the selected size
    if (cart[index].quantity === 1) {
      cart[index].selectedSizes[0] = size; // Update the single selected size
    } else {
      // For multiple quantities, assign the selected size to the first empty position
      for (let i = 0; i < cart[index].quantity; i++) {
        if (!cart[index].selectedSizes[i]) {
          cart[index].selectedSizes[i] = size;
          break;
        }
      }
    }

    // Save the updated cart
    localStorage.setItem("cart", JSON.stringify(cart));
    loadCartItems(); // Reload the cart to reflect changes
  }
}


// Event listener to load cart items on page load
document.addEventListener("DOMContentLoaded", () => {
  loadCartItems();
});

// Event listener for the Buy Now button
document.addEventListener("DOMContentLoaded", () => {
  const buyNowButton = document.getElementById("buyNowButton");
  if (buyNowButton) {
    buyNowButton.addEventListener("click", handleBuyNow);
  }
});
