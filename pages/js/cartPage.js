// Function to load cart items
function loadCartItems() {
  const cartItemsContainer = document.getElementById('cartItems');
  let cart = JSON.parse(localStorage.getItem('cart')) || [];

  if (cart.length === 0) {
    cartItemsContainer.innerHTML = `<p>Your cart is empty.</p>`;
    return;
  }

  cart.forEach((item, index) => {
    const productCard = document.createElement('div');
    productCard.classList.add('product-card');

    const productImage = document.createElement('img');
    productImage.src = item.image;
    productImage.alt = item.alt;

    const productName = document.createElement('h2');
    productName.textContent = item.name;

    // Extract numeric value from price
    const numericPrice = parseFloat(item.price.replace(/₹|,/g, ''));

    const productPrice = document.createElement('p');
    productPrice.classList.add('price');
    productPrice.textContent = `Price: ₹${((item.quantity || 1) * numericPrice).toFixed(2)}`;

    // Quantity Container
    const quantityContainer = document.createElement('div');
    quantityContainer.classList.add('quantity-container');

    const decreaseButton = document.createElement('button');
    decreaseButton.textContent = '-';
    decreaseButton.onclick = () => updateQuantity(index, -1);

    const quantityDisplay = document.createElement('span');
    quantityDisplay.textContent = `Quantity: ${item.quantity || 1}`;
    quantityDisplay.classList.add('quantity-display');

    const increaseButton = document.createElement('button');
    increaseButton.textContent = '+';
    increaseButton.onclick = () => updateQuantity(index, 1);

    quantityContainer.appendChild(decreaseButton);
    quantityContainer.appendChild(quantityDisplay);
    quantityContainer.appendChild(increaseButton);

    const removeButton = document.createElement('button');
    removeButton.textContent = "Remove";
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
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  const item = cart[index];

  item.quantity = (item.quantity || 1) + change;
  if (item.quantity <= 0) {
    // Remove item if quantity becomes 0
    cart.splice(index, 1);
  } else {
    cart[index] = item;
  }

  localStorage.setItem('cart', JSON.stringify(cart)); // Update localStorage
  location.reload(); // Reload the page to reflect changes
}

// Function to remove item from cart
function removeFromCart(index) {
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  cart.splice(index, 1); // Remove the item at the specified index
  localStorage.setItem('cart', JSON.stringify(cart)); // Update localStorage
  location.reload(); // Reload the page to reflect changes
}

// Event listener to load cart items on page load
document.addEventListener('DOMContentLoaded', loadCartItems);
