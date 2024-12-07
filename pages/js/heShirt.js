// Function to load and display only shirts
async function loadShirts() {
  try {
    // Fetch the product data from the JSON file
    const response = await fetch('../js/public/he-page.json'); // Adjusted path for local file
    if (!response.ok) {
      throw new Error(`Failed to fetch products: ${response.status} ${response.statusText}`);
    }

    const products = await response.json();
    const productGrid = document.getElementById('productGrid');

    if (!productGrid) {
      console.error("Element with ID 'productGrid' not found.");
      return;
    }

    productGrid.innerHTML = ''; // Clear existing products

    // Filter and display shirts
    const shirtProducts = products.filter(product => product.type === 'Shirts');
    if (shirtProducts.length === 0) {
      productGrid.innerHTML = '<p>No shirts available at the moment.</p>';
      return;
    }

    shirtProducts.forEach(product => {
      const productCard = document.createElement('div');
      productCard.classList.add('product-card');

      const productImage = document.createElement('img');
      productImage.src = product.image || ''; // Fallback if the image is missing
      productImage.alt = product.alt || product.name || 'Product Image';

      const productName = document.createElement('h2');
      productName.textContent = product.name || 'Unnamed Product';

      const productPrice = document.createElement('p');
      productPrice.classList.add('price');
      const price = parseFloat(product.price.replace(/[₹,]/g, '')); // Remove ₹ and commas
      productPrice.textContent = isNaN(price) ? 'Price not available' : `₹${price.toFixed(2)}`;

      const addButton = document.createElement('button');
      addButton.textContent = 'Add to Cart';
      addButton.onclick = () => addToCart(product);

      productCard.append(productImage, productName, productPrice, addButton);
      productGrid.appendChild(productCard);
    });
  } catch (error) {
    console.error('Error loading shirts:', error.message);
    const productGrid = document.getElementById('productGrid');
    if (productGrid) {
      productGrid.innerHTML = '<p>Failed to load products. Please try again later.</p>';
    }
  }
}

// Function to add a product to the cart
function addToCart(product) {
  let cart = JSON.parse(localStorage.getItem('cart')) || [];

  const existingItemIndex = cart.findIndex(item => item.name === product.name);
  if (existingItemIndex > -1) {
    cart[existingItemIndex].quantity += 1; // Increment quantity
  } else {
    product.quantity = 1; // Add quantity property
    cart.push(product);
  }

  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartCount();

  showCartPopup(`Successfully added to the cart!`);
}

// Function to update the cart count
function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);

  const cartCountElement = document.getElementById('cartCount');
  if (cartCountElement) {
    cartCountElement.textContent = totalItems;
  }
}

// Function to show a popup message
function showCartPopup(message) {
  const popupContainer = document.getElementById('popupContainer');
  const popupMessage = document.getElementById('popupMessage');

  if (popupContainer && popupMessage) {
    popupMessage.textContent = message;
    popupContainer.style.display = 'flex';

    setTimeout(() => {
      popupContainer.style.display = 'none';
    }, 2000);
  } else {
    console.error("Popup container or message element not found.");
  }
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

// Load cart count on page load and fetch products
document.addEventListener('DOMContentLoaded', () => {
  loadShirts().then(() => {
    updateCartCount();
  });

  // Attach event listener for search bar
  const searchBar = document.getElementById('searchBar');
  if (searchBar) {
    searchBar.addEventListener('input', searchProducts);
  } else {
    console.error("Search bar element not found.");
  }
});
