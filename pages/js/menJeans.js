// Function to fetch and display only jeans products
async function loadProducts() {
  try {
      const response = await fetch('/pages/js/public/he-page.json');
      if (!response.ok) {
          throw new Error(`Failed to fetch products: ${response.status} ${response.statusText}`);
      }

      const products = await response.json();
      const productGrid = document.getElementById('productGrid');

      // Ensure productGrid exists
      if (!productGrid) {
          console.error("Element with ID 'productGrid' not found.");
          return;
      }

      // Clear existing products
      productGrid.innerHTML = '';

      // Filter products to show only jeans
      const jeansProducts = products.filter(product => product.type === 'Jeans');

      // Display filtered jeans products
      jeansProducts.forEach(product => {
          const productCard = document.createElement('div');
          productCard.classList.add('product-card');
          productCard.setAttribute('data-type', product.type);

          const productImage = document.createElement('img');
          productImage.src = product.image;
          productImage.alt = product.alt;

          const productName = document.createElement('h2');
          productName.textContent = product.name;

          const productPrice = document.createElement('p');
          productPrice.classList.add('price');
          productPrice.textContent = product.price;

          const addButton = document.createElement('button');
          addButton.textContent = "Add to Cart";
          addButton.onclick = () => addToCart(product);

          productCard.appendChild(productImage);
          productCard.appendChild(productName);
          productCard.appendChild(productPrice);
          productCard.appendChild(addButton);

          productGrid.appendChild(productCard);
      });
  } catch (error) {
      console.error(error.message);
  }
}

// Function to add product to cart
function addToCart(product) {
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  cart.push(product);
  localStorage.setItem('cart', JSON.stringify(cart));

  // Show a success message
  showPopup(`${product.name} has been added to your cart!`);
  updateCartCount();
}

// Function to search for products
function searchProducts() {
  const searchBar = document.getElementById('searchBar').value.toLowerCase();
  const products = document.querySelectorAll('.product-card');

  products.forEach(product => {
      const productName = product.querySelector('h2').textContent.toLowerCase();
      if (productName.includes(searchBar)) {
          product.style.display = 'block';
      } else {
          product.style.display = 'none';
      }
  });
}

// Function to update the cart count
function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  const totalItems = cart.length;

  const cartCountElement = document.getElementById('cartCount');
  if (cartCountElement) {
      cartCountElement.textContent = totalItems;
  }
}

// Function to show a popup message
function showPopup(message) {
  const popupContainer = document.getElementById("popupContainer");
  const popupMessage = document.getElementById("popupMessage");

  if (!popupContainer || !popupMessage) {
      console.error("Popup container or message element not found.");
      return;
  }

  popupMessage.textContent = message;
  popupContainer.style.display = "flex"; // Make the popup visible
  popupContainer.classList.add("show");

  // Automatically hide the popup after 3 seconds
  setTimeout(() => {
      popupContainer.classList.remove("show");
      popupContainer.style.display = "none";
  }, 1000);
}

// Function to toggle sidebar visibility
function toggleSidebar() {
  const sidebar = document.getElementById('sidebar');
  if (sidebar) {
      sidebar.classList.toggle('visible');
  } else {
      console.error("Sidebar element not found.");
  }
}

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
  const toggleSidebarButton = document.getElementById('toggleSidebar');
  if (toggleSidebarButton) {
      toggleSidebarButton.addEventListener('click', toggleSidebar);
  } else {
      console.error("Sidebar toggle button not found.");
  }

  const savedCartCount = localStorage.getItem('cartCount');
  if (savedCartCount) {
      updateCartCount();
  }

  loadProducts(); // Load products on page load
});
