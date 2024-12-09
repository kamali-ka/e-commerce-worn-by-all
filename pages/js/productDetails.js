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
    document.getElementById('productPrice').textContent = product.price ? `${product.price}` : 'Price not available';

    // Display rating as stars
    displayRating(product.rating || 0);

    // Display product description
    document.getElementById('productDescription').textContent = product.description || 'No description available.';

    // Display available sizes
    displayProductSizes(product.sizes);

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

  // Function to display available sizes
  function displayProductSizes(sizes) {
    const sizeContainer = document.getElementById('productSizes');
    const savedSize = localStorage.getItem('selectedSize'); // Retrieve saved size

    if (sizes && sizes.length > 0) {
      let sizesHtml = '';
      sizes.forEach(size => {
        const isSelected = size === savedSize ? 'selected' : '';
        sizesHtml += `<button class="size-option ${isSelected}" data-size="${size}">${size}</button>`;
      });
      sizeContainer.innerHTML = sizesHtml;

      // Add event listeners for size selection
      const sizeButtons = sizeContainer.querySelectorAll('.size-option');
      sizeButtons.forEach(button => {
        button.addEventListener('click', () => selectSize(button));
      });
    } else {
      sizeContainer.innerHTML = '<p>No sizes available.</p>';
    }
  }

  // Function to highlight the selected size
  function selectSize(button) {
    // Remove the highlight from all size buttons
    const sizeButtons = document.querySelectorAll('.size-option');
    sizeButtons.forEach(btn => btn.classList.remove('selected'));

    // Add the highlight to the selected size
    button.classList.add('selected');

    // Store the selected size in localStorage
    localStorage.setItem('selectedSize', button.dataset.size);
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
