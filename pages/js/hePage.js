document.addEventListener('DOMContentLoaded', () => {
  // Load all products initially and update cart count
  loadProducts().then(() => {
    updateCartCount();
  });

  // Attach event listener for search bar
  const searchBar = document.getElementById('searchBar');
  if (searchBar) {
    searchBar.addEventListener('input', searchProducts);
  } else {
    console.error("Search bar element not found.");
  }

  // Attach event listener for filter dropdown
  const clothingTypeFilter = document.getElementById('clothingType');
  if (clothingTypeFilter) {
    clothingTypeFilter.addEventListener('change', filterByType);
  } else {
    console.error("Clothing type filter element not found.");
  }

  // Toggle sidebar visibility
  const toggleSidebar = document.getElementById('toggleSidebar');
  if (toggleSidebar) {
    toggleSidebar.addEventListener('click', () => {
      const sidebar = document.getElementById('sidebar');
      if (sidebar) {
        sidebar.classList.toggle('visible');
      } else {
        console.error("Sidebar element not found.");
      }
    });
  }
});

// Function to load and display all products
// Function to load and display all products
async function loadProducts() {
  try {
    // Fetch the product data from the JSON file
    const response = await fetch('../js/public/he-page.json'); // Adjust the path as needed
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

    if (products.length === 0) {
      productGrid.innerHTML = '<p>No products available at the moment.</p>';
      return;
    }

    // Display each product
    products.forEach(product => {
      const productCard = document.createElement('div');
      productCard.classList.add('product-card');
      productCard.setAttribute('data-type', product.type || 'unknown'); // Add data-type for filtering

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
      addButton.textContent = isInCart(product) ? 'Visit Cart' : 'Add to Cart';
      addButton.onclick = () => handleCartButtonClick(product, addButton);

      // Add click event to the product card to open the details page
      productCard.onclick = () => {
        localStorage.setItem('selectedProductId', product.id);  // Store the selected product's ID
        window.location.href = '../html/productDetails.html'; // Redirect to the product details page
      };

      productCard.append(productImage, productName, productPrice, addButton);
      productGrid.appendChild(productCard);
    });
  } catch (error) {
    console.error('Error loading products:', error.message);
    const productGrid = document.getElementById('productGrid');
    if (productGrid) {
      productGrid.innerHTML = '<p>Failed to load products. Please try again later.</p>';
    }
  }
}

// Function to filter products by type
function filterByType() {
  const selectedType = document.getElementById('clothingType').value.toLowerCase();
  const products = document.querySelectorAll('.product-card');

  products.forEach(product => {
    const productType = product.getAttribute('data-type')?.toLowerCase();
    if (selectedType === 'all' || productType === selectedType) {
      product.style.display = 'block';
    } else {
      product.style.display = 'none';
    }
  });
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

// Function to handle the button click for adding/visiting the cart
function handleCartButtonClick(product, button) {
  if (isInCart(product)) {
    // Redirect to cart
    window.location.href = '../html/cartPage.html'; // Adjust path to your cart page
  } else {
    addToCart(product);
    button.textContent = 'Visit Cart';
  }
}

// Function to check if a product is already in the cart
function isInCart(product) {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  return cart.some(item => item.name === product.name);
}

// Function to add a product to the cart
function addToCart(product) {
  let cart = JSON.parse(localStorage.getItem('cart')) || [];

  const existingItemIndex = cart.findIndex(item => item.name === product.name);
  if (existingItemIndex === -1) {
    product.quantity = 1; // Add quantity property
    cart.push(product);
  }

  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartCount();
  showCartPopup('Successfully added to the cart!');
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

// Function to display the popup message
function showCartPopup(message) {
  const popupContainer = document.getElementById('popupContainer');
  const popupMessage = document.getElementById('popupMessage');

  // Set the message content
  popupMessage.textContent = message;

  // Display the popup
  popupContainer.classList.add('show');

  // Hide the popup after 3 seconds
  setTimeout(() => {
    popupContainer.classList.remove('show');
  }, 3000);
}
