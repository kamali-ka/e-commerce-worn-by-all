// Function to fetch and display only shirts
async function loadShirts() {
    try {
      const response = await fetch('/pages/js/public/he-page.json');
      if (!response.ok) {
        throw new Error(`Failed to fetch products: ${response.status} ${response.statusText}`);
      }
  
      const products = await response.json();
      const productGrid = document.getElementById('productGrid');
  
      // Clear existing products
      productGrid.innerHTML = '';
  
      // Filter products to show only shirts
      const jeansProducts = products.filter(product => product.type === 'Jeans');
  
      // Display filtered shirt products
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
  
  // Initialize the page with shirts
  document.addEventListener('DOMContentLoaded', loadShirts);
  
  // Function to add product to cart
  function addToCart(product) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart.push(product);
    localStorage.setItem('cart', JSON.stringify(cart));
  
    // Show the modal with a success message
    const cartModal = document.getElementById('cartModal');
    const modalMessage = document.getElementById('modalMessage');
    
    // Set the message dynamically (optional)
    modalMessage.textContent = `${product.name} has been successfully added to the cart!`;
    
    // Display the modal
    cartModal.style.display = 'flex';
  
    // Hide the modal after 2 seconds
    setTimeout(() => {
      cartModal.style.display = 'none';
    }, 2000); // 2 seconds
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
  // Toggle Sidebar Visibility
document.getElementById('toggleSidebar').addEventListener('click', () => {
    const sidebar = document.getElementById('sidebar');
    sidebar.classList.toggle('visible');
});
// Function to add product to cart
function addToCart(product) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart.push(product);
    localStorage.setItem('cart', JSON.stringify(cart));

    // Show the modal with a success message
    const cartModal = document.getElementById('cartModal');
    const modalMessage = document.getElementById('modalMessage');
    
    // Set the message dynamically (optional)
    modalMessage.textContent = `${product.name} has been successfully added to the cart!`;
    
    // Display the modal
    cartModal.style.display = 'flex';
  
    // Hide the modal after 2 seconds
    setTimeout(() => {
      cartModal.style.display = 'none';
    }, 2000); // 2 seconds
}
// Function to show a cart modal
function showCartModal(message) {
  const cartModal = document.getElementById('cartModal');
  const modalMessage = document.getElementById('modalMessage');
  modalMessage.textContent = message;
  cartModal.style.display = 'flex';

  setTimeout(() => {
    cartModal.style.display = 'none';
  }, 2000);
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

// Function to navigate to the cart page
function navigateToCart() {
  window.location.href = './cartPage.html';
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
});

// Maintain cart count state
let cartCount = 0;

// Save the cart count to localStorage
function saveCartCount() {
  localStorage.setItem('cartCount', cartCount);
}

// Load the cart count from localStorage
document.addEventListener('DOMContentLoaded', () => {
  const savedCartCount = localStorage.getItem('cartCount');
  if (savedCartCount) {
    cartCount = parseInt(savedCartCount, 10);
    updateCartCount();
  }
});