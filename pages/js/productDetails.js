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
        displayErrorMessage('Product details not found. Please go back to the product list.');
        return;
      }

      const product = products.find(item => item.id === selectedProductId);
      if (!product) {
        displayErrorMessage('Product details not found. Please go back to the product list.');
        return;
      }

      displayProductDetails(product);
    })
    .catch(error => {
      console.error('Error fetching product data:', error);
      displayErrorMessage(`Failed to load product details. Error: ${error.message}`);
    });

  // Function to display error messages
  function displayErrorMessage(message) {
    document.getElementById('productDetails').innerHTML = `<p>${message}</p>`;
  }

  // Function to display product details
  function displayProductDetails(product) {
    document.getElementById('productImage').src = product.image || 'placeholder.jpg';
    document.getElementById('productName').textContent = product.name || 'Unnamed Product';
    document.getElementById('productPrice').textContent = product.price ? `₹${product.price}` : 'Price not available';

    // Display rating as stars
    displayRating(product.rating || 0);

    // Display product description
    document.getElementById('productDescription').textContent = product.description || 'No description available.';

    const addToCartButton = document.getElementById('addToCartButton');
    const buyNowButton = document.getElementById('buyNowButton');

    addToCartButton.addEventListener('click', () => addToCart(product, addToCartButton));
    buyNowButton.addEventListener('click', () => {
      alert('Redirecting to checkout!');
      window.location.href = '../html/checkoutPage.html';
    });
  }

  // Function to add a product to the cart
  function addToCart(product, addButton) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    // Check if the product is already in the cart
    const existingItemIndex = cart.findIndex(
      item => item.id === product.id
    );

    if (existingItemIndex > -1) {
      // Increment quantity if the item already exists in the cart
      cart[existingItemIndex].quantity += 1;
    } else {
      // Add new item to the cart
      product.quantity = 1;
      cart.push(product);
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount(); // Update the cart count

    // Update the button to visit cart and set the click event
    addButton.textContent = 'Visit Cart';
    addButton.onclick = () => {
      window.location.href = '../html/cartPage.html'; // Redirect to the cart page
    };

    showPopup('Successfully added to your cart!');
  }

  // Function to show the popup message
  function showPopup(message) {
    const popupContainer = document.getElementById('popupContainer');
    const popupMessage = popupContainer.querySelector('.popup-message');

    popupMessage.textContent = message; // Set the message
    popupContainer.classList.add('show'); // Show the popup

    // Hide the popup after 3 seconds
    setTimeout(() => {
      popupContainer.classList.remove('show');
    }, 3000);
  }

  // Function to update cart count
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

  // Utility function to get query parameters
  function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
  }

  // Function to display the star rating
  function displayRating(rating) {
    const starContainer = document.getElementById('productRatings');
    const totalStars = 5;

    const fullStars = Math.floor(rating); // Full stars
    const halfStars = rating % 1 !== 0 ? 1 : 0; // Half stars
    const emptyStars = totalStars - fullStars - halfStars; // Empty stars

    let starsHtml = '';

    for (let i = 0; i < fullStars; i++) {
      starsHtml += '<i class="fa-solid fa-star"></i>';
    }
    if (halfStars) {
      starsHtml += '<i class="fa-solid fa-star-half-alt"></i>';
    }
    for (let i = 0; i < emptyStars; i++) {
      starsHtml += '<i class="fa-regular fa-star"></i>';
    }

    starContainer.innerHTML = starsHtml;
  }

  // Initialize cart count on page load
  updateCartCount();
});
