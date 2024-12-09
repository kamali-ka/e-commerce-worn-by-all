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

    // Display rating as stars
    const rating = product.rating || 0; // Default to 0 if no rating
    displayRating(rating);

    // Display product description
    document.getElementById('productDescription').textContent = product.description || 'No description available.';

    // Display available sizes
    displayProductSizes(product.sizes);

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
    const selectedSize = localStorage.getItem('selectedSize') || 'M'; // Default to 'M' if no size is selected

    const existingItemIndex = cart.findIndex(item => item.name === product.name && item.size === selectedSize);
    if (existingItemIndex > -1) {
      cart[existingItemIndex].quantity += 1; // Increment quantity
    } else {
      product.quantity = 1; // Add quantity property
      product.size = selectedSize; // Add size property
      cart.push(product);
    }

    localStorage.setItem('cart', JSON.stringify(cart));

    updateCartCount();
    addButton.textContent = 'Visit Cart';
    addButton.onclick = () => window.location.href = '../html/cartPage.html';

    showPopup(`Successfully added to your cart!`);
  }

  // Function to display available sizes as selectable options
  function displayProductSizes(sizes) {
  const sizeContainer = document.getElementById('productSizes');

  if (sizes && sizes.length > 0) {
    console.log("Available sizes:", sizes); // Debugging
    let sizesHtml = '';
    const savedSize = localStorage.getItem('selectedSize'); // Retrieve the saved size from localStorage

    sizes.forEach(size => {
      const isSelected = size === savedSize ? 'selected' : '';
      sizesHtml += `
        <button class="size-option ${isSelected}" data-size="${size}">${size}</button>
      `;
    });
    sizeContainer.innerHTML = sizesHtml;

    // Add event listeners for size selection
    const sizeButtons = sizeContainer.querySelectorAll('.size-option');
    sizeButtons.forEach(button => {
      button.addEventListener('click', () => {
        selectSize(button);
      });
    });
  } else {
    sizeContainer.innerHTML = '<p>No sizes available.</p>';
  }
}


  // Function to highlight the selected size
  function selectSize(button) {
    // Remove the highlight from all size buttons
    const sizeButtons = document.querySelectorAll('.size-option');
    sizeButtons.forEach(btn => {
      btn.classList.remove('selected');
    });

    // Add the highlight to the selected size
    button.classList.add('selected');

    // Store the selected size in localStorage
    localStorage.setItem('selectedSize', button.dataset.size);
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
    const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);

    const cartCountElement = document.getElementById('cartCount');
    if (cartCountElement) {
      cartCountElement.textContent = totalItems;
    }
    localStorage.setItem('cartCount',totalItems);
  }

  // Utility function to get query parameters
  function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
  }

  // Initialize cart count on page load
  updateCartCount();
});

// Function to display the star rating
function displayRating(rating) {
  const starContainer = document.getElementById('productRatings');
  
  // Number of stars to display
  const totalStars = 5;
  
  // Calculate the number of full and empty stars
  const fullStars = Math.floor(rating); // Number of full stars
  const halfStars = (rating % 1 !== 0) ? 1 : 0; // Half star if the rating has a decimal part
  const emptyStars = totalStars - fullStars - halfStars; // Remaining empty stars
  
  // Create the HTML for the stars
  let starsHtml = '';
  
  // Add full stars
  for (let i = 0; i < fullStars; i++) {
    starsHtml += '<i class="fa-solid fa-star"></i>';
  }
  
  // Add half stars
  if (halfStars) {
    starsHtml += '<i class="fa-solid fa-star-half-alt"></i>';
  }
  
  // Add empty stars
  for (let i = 0; i < emptyStars; i++) {
    starsHtml += '<i class="fa-regular fa-star"></i>';
  }
  
  // Set the inner HTML of the rating container
  starContainer.innerHTML = starsHtml;
}
