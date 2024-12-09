document.addEventListener('DOMContentLoaded', () => {
  // Fetch the JSON file containing product data
  fetch('../js/public/he-page.json') // Update this path if needed
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(products => {
      const selectedProductId = localStorage.getItem('selectedProductId') || getQueryParam('id');
      if (!selectedProductId) {
        document.getElementById('productDetails').innerHTML = '<p>Product details not found. Please go back to the product list.</p>';
        return;
      }

      const product = products.find(item => item.id === selectedProductId);
      if (!product) {
        document.getElementById('productDetails').innerHTML = '<p>Product details not found. Please go back to the product list.</p>';
        return;
      }

      displayProductDetails(product);
    })
    .catch(error => {
      console.error('Error fetching product data:', error);
      document.getElementById('productDetails').innerHTML = `<p>Failed to load product details. Error: ${error.message}</p>`;
    });

  // Function to display product details
  function displayProductDetails(product) {
    document.getElementById('productImage').src = product.image || 'placeholder.jpg';
    document.getElementById('productName').textContent = product.name || 'Unnamed Product';
    document.getElementById('productPrice').textContent = product.price ? `${product.price}` : 'Price not available';
    document.getElementById('productRatings').textContent = product.rating ? `${product.rating} Stars` : 'No ratings available';
    document.getElementById('productDescription').textContent = product.name || 'No description available.';

    const addToCartButton = document.getElementById('addToCartButton');
    const buyNowButton = document.getElementById('byNowButton');

    addToCartButton.addEventListener('click', () => addToCart(product, addToCartButton));
    buyNowButton.addEventListener('click', () => {
      alert('Redirecting to checkout!');
      window.location.href = '../html/checkoutPage.html';
    });
  }

  // Function to add a product to the cart
  function addToCart(product, addButton) {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];

    const existingItemIndex = cart.findIndex(item => item.name === product.name);
    if (existingItemIndex > -1) {
      cart[existingItemIndex].quantity += 1; // Increment quantity
    } else {
      product.quantity = 1; // Add quantity property
      cart.push(product);
    }

    localStorage.setItem('cart', JSON.stringify(cart));

    updateCartCount();
    addButton.textContent = 'Visit Cart';
    addButton.onclick = () => window.location.href = '../html/cartPage.html';

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

  // Function to update cart count
  function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const totalItems = cart.reduce((sum, item) => sum + (item.quantity ||1),0);

    const cartCountElement = document.getElementById('cartCount');
    if (cartCountElement) {
      cartCountElement.textContent = totalItems;
    }
  }

  // Utility function to get query parameters
  function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
  }

  // Initialize cart count on page load
  updateCartCount();
});
