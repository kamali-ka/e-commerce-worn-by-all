document.addEventListener('DOMContentLoaded', () => {
    // Retrieve the selected product from localStorage
    const product = JSON.parse(localStorage.getItem('selectedProduct'));
  
    // Check if product data is available
    if (!product) {
      document.body.innerHTML = '<p>Product details not found. Please go back to the product list.</p>';
      return;
    }
  
    // Grab DOM elements to display product details
    const productImage = document.getElementById('productImage');
    const productName = document.getElementById('productName');
    const productDescription = document.getElementById('productDescription');
    const productPrice = document.getElementById('productPrice');
    const productSizes = document.getElementById('sizesContainer');
    const productRatings = document.getElementById('productRatings');
    const addToCartButton = document.getElementById('addToCart');
    const buyNowButton = document.getElementById('buyNow');
  
    // Set product details to the page, including handling missing fields
    productImage.src = product.image || 'placeholder.jpg';
    productImage.alt = product.name || 'Product Image';
  
    productName.textContent = product.name || 'Unnamed Product';
    productDescription.textContent = product.description ? product.description : 'No description available.';
    productPrice.textContent = product.price ? `₹${parseFloat(product.price.replace(/[₹,]/g, '')).toFixed(2)}` : 'Price not available';
    productRatings.textContent = product.rating ? `${product.rating} Stars` : 'No ratings available';
  
    // Display available sizes
    if (product.size && Array.isArray(product.size) && product.size.length > 0) {
      productSizes.innerHTML = ''; // Clear any existing content
      product.size.forEach(size => {
        const sizeElement = document.createElement('span');
        sizeElement.textContent = size;
        sizeElement.classList.add('size-option');
        sizeElement.addEventListener('click', () => selectSize(sizeElement, size));
        productSizes.appendChild(sizeElement);
      });
    } else {
      productSizes.textContent = 'No sizes available';
    }
  
    // Add to Cart functionality
    addToCartButton.addEventListener('click', () => {
      addToCart(product);
    });
  
    // Buy Now functionality
    buyNowButton.addEventListener('click', () => {
      alert('Redirecting to checkout!');
      window.location.href = '../html/checkoutPage.html'; // Replace with actual checkout page URL
    });
  
    // Initialize cart count display
    updateCartCount();
  
    // Function to handle size selection
    let selectedSize = null;
  
    function selectSize(sizeElement, size) {
      // Deselect any previously selected size
      const selectedElement = document.querySelector('.selected-size');
      if (selectedElement) {
        selectedElement.classList.remove('selected-size');
      }
  
      // Mark the clicked size as selected
      sizeElement.classList.add('selected-size');
      selectedSize = size;
      console.log('Selected Size:', selectedSize); // Log for debugging
    }
  });
  
  // Add product to the cart
  function addToCart(product) {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const existingItem = cart.find(item => item.name === product.name && item.size === selectedSize);
  
    // Check if the product is already in the cart
    if (existingItem) {
      alert('This item is already in your cart!');
      return;
    }
  
    // If no size is selected, alert the user
    if (!selectedSize) {
      alert('Please select a size!');
      return;
    }
  
    // Attach the selected size to the product and set a default quantity
    product.size = selectedSize;
    product.quantity = 1;
  
    // Add the product to the cart
    cart.push(product);
  
    // Save the updated cart back to localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    alert('Product added to cart successfully!');
  }
  
  // Update cart count display
  function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
  
    const cartCountElement = document.getElementById('cartCount');
    if (cartCountElement) {
      cartCountElement.textContent = totalItems;
    }
  }
  