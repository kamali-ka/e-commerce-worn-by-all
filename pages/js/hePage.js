// Search Functionality
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

// Filter Functionality
function filterByType() {
  const filter = document.getElementById('clothingType').value;
  const products = document.querySelectorAll('.product-card');

  products.forEach(product => {
    const productType = product.getAttribute('data-type');
    if (filter === 'all' || productType === filter) {
      product.style.display = 'block';
    } else {
      product.style.display = 'none';
    }
  });
}
document.getElementById("toggleSidebar").addEventListener("click", function () {
  const sidebar = document.getElementById("sidebar");
  sidebar.classList.toggle("visible");
});
// Function to fetch and display products
async function loadProducts() {
  try {
    const response = await fetch('/pages/js/public/he-page.json'); // Adjust path to your `products.json` file
    if (!response.ok) {
      throw new Error(`Failed to fetch products: ${response.status}`);
    }

    const products = await response.json();
    const productGrid = document.getElementById('productGrid');

    products.forEach(product => {
      // Create product card
      const productCard = document.createElement('div');
      productCard.classList.add('product-card');
      productCard.setAttribute('data-type', product.type);

      // Add image
      const productImage = document.createElement('img');
      productImage.src = product.image;
      productImage.alt = product.title;

      // Add title
      const productTitle = document.createElement('h2');
      productTitle.textContent = product.title;

      // Add price
      const productPrice = document.createElement('p');
      productPrice.classList.add('price');
      productPrice.textContent = product.price;

      // Add button
      const addButton = document.createElement('button');
      addButton.textContent = "Add to Cart";
      addButton.onclick = () => addToCart(product.title);

      // Append elements to product card
      productCard.appendChild(productImage);
      productCard.appendChild(productTitle);
      productCard.appendChild(productPrice);
      productCard.appendChild(addButton);

      // Append product card to the grid
      productGrid.appendChild(productCard);
    });
  } catch (error) {
    console.error(error.message);
  }
}

// Example addToCart function
function addToCart(item) {
  alert(`${item} added to cart!`);
}

// Load products on page load
document.addEventListener('DOMContentLoaded', loadProducts);
