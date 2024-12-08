async function loadShirts() {
  try {
    const response = await fetch('/pages/js/public/he-page.json');
    if (!response.ok) {
      throw new Error(`Failed to fetch products: ${response.status} ${response.statusText}`);
    }

    const products = await response.json();
    const productGrid = document.getElementById('productGrid');
    productGrid.innerHTML = ''; // Clear existing products

    // Filter and display shirts
    const shirtProducts = products.filter(product => product.type === 'Shirts');
    shirtProducts.forEach(product => {
      const productCard = document.createElement('div');
      productCard.classList.add('product-card');
      productCard.setAttribute('data-type', product.type);

      // Create a link for the product card that will redirect to the product details page
      const productLink = document.createElement('a');
      productLink.href = `../html/productDetails.html?id=${product.id}`;  // Link to the product details page
      productLink.style.textDecoration = 'none';  // Remove the default link underline

      const productImage = document.createElement('img');
      productImage.src = product.image || ''; // Fallback if the image is missing
      productImage.alt = product.alt || product.name || 'Product Image';

      const productName = document.createElement('h2');
      productName.textContent = product.name || 'Unnamed Product';

      const productPrice = document.createElement('p');
      productPrice.classList.add('price');

      // Handle invalid or missing price values
      const price = parseFloat(product.price.replace(/[₹,]/g, '')); // Remove ₹ and commas
      if (isNaN(price)) {
        productPrice.textContent = 'Price not available';
      } else {
        productPrice.textContent = `₹${price.toFixed(2)}`;
      }

      const addButton = document.createElement('button');
      addButton.textContent = 'Add to Cart';

      // Check if the product is already in the cart
      const cart = JSON.parse(localStorage.getItem('cart')) || [];
      const existingItem = cart.find(item => item.name === product.name);

      if (existingItem) {
        addButton.textContent = 'Visit Cart';  // Change to 'Visit Cart' if the item is in the cart
        addButton.onclick = () => navigateToCart(); // Navigate to the cart
      } else {
        addButton.onclick = () => addToCart(product, addButton); // Add to cart
      }

      // Append product details to the link
      productLink.appendChild(productImage);
      productLink.appendChild(productName);
      productLink.appendChild(productPrice);

      // Append the link and add button to the product card
      productCard.appendChild(productLink);
      productCard.appendChild(addButton);

      productGrid.appendChild(productCard);
    });
  } catch (error) {
    console.error('Error loading shirts:', error.message);
  }
}


// Function to add a product to the cart
function addToCart(product, addButton) {
  let cart = JSON.parse(localStorage.getItem('cart')) || [];

  const existingItemIndex = cart.findIndex(item => item.name === product.name);
  if (existingItemIndex > -1) {
    cart[existingItemIndex].quantity += 1; // Increment quantity
  } else {
    product.quantity = 1; // Add quantity property
    cart.push(product);
  }

  // Save the updated cart to localStorage
  localStorage.setItem('cart', JSON.stringify(cart));

  // Update cart count
  updateCartCount();

  // Change the button text to "Visit Cart" and link it to the cart page
  addButton.textContent = 'Visit Cart';
  addButton.onclick = () => navigateToCart();

  // Show the popup message when an item is added to the cart
  showPopup(`Successfully added to your cart!`);
}

// Function to show the popup message
function showPopup(message) {
  const popupContainer = document.getElementById('popupContainer');
  const popupMessage = popupContainer.querySelector('.popup-message');
  
  // Set the message
  popupMessage.textContent = message;
  
  // Show the popup
  popupContainer.classList.add('show');
  
  // Hide the popup after 3 seconds
  setTimeout(() => {
    popupContainer.classList.remove('show');
  }, 3000);
}

function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
  
  const cartCountElement = document.getElementById('cartCount');
  if (cartCountElement) {
    cartCountElement.textContent = totalItems;
  }
  // Save cart count explicitly to localStorage
  localStorage.setItem('cartCount', totalItems);
}


// Function to search for products
function searchProducts() {
  const searchBarValue = document.getElementById('searchBar').value.toLowerCase();
  const products = document.querySelectorAll('.product-card');

  products.forEach(product => {
    const productName = product.querySelector('h2').textContent.toLowerCase();
    product.style.display = productName.includes(searchBarValue) ? 'block' : 'none';
  });
}

// Toggle sidebar visibility
document.getElementById('toggleSidebar').addEventListener('click', () => {
  const sidebar = document.getElementById('sidebar');
  sidebar.classList.toggle('visible');
});

// Load cart count on page load
document.addEventListener('DOMContentLoaded', () => {
  loadShirts();
  updateCartCount();
  const popupContainer = document.getElementById('popupContainer');
  popupContainer.classList.remove('show'); // Ensure the popup is hidden on page load
});

// Maintain cart count state
let cartCount = 0;

// Save the cart count to localStorage
function saveCartCount() {
  localStorage.setItem('cartCount', cartCount);
}

// Load the cart count from localStorage
document.addEventListener('DOMContentLoaded', () => {
  loadShirts();
  updateCartCount();
  const popupContainer = document.getElementById('popupContainer');
  popupContainer.classList.remove('show');  // Ensure the popup is hidden on page load
  
  const savedCartCount = localStorage.getItem('cartCount');
  if (savedCartCount) {
    cartCount = parseInt(savedCartCount, 10);
    updateCartCount();
  }
});

// Function to get the URL parameter
function getQueryParam(param) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}

function loadProductDetails() {
  const productId = getQueryParam("id");
  if (!productId) {
    document.getElementById("productDetails").textContent = "Product ID not found!";
    return;
  }

  fetch('/pages/js/public/he-page.json')  // Ensure this path is correct
    .then(response => response.json())
    .then(data => {
      const product = data.find(p => p.id === productId);
      if (product) {
        document.getElementById("productImage").src = product.image || 'default-image.jpg';
        document.getElementById("productName").textContent = product.name || 'Unnamed Product';
        document.getElementById("productPrice").textContent = product.price || 'Price not available';
        document.getElementById("productRatings").textContent = `Rating: ${product.rating || 'N/A'}`;
        document.getElementById("productDescription").textContent = product.description || 'No description available.';
      } else {
        document.getElementById("productDetails").textContent = "Product not found!";
      }
    })
    .catch(error => {
      console.error("Error fetching product details:", error);
      document.getElementById("productDetails").textContent = "Failed to load product details.";
    });
}
