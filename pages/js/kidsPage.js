// Load and display products dynamically
async function loadProducts() {
  try {
    const response = await fetch('/pages/js/public/kids-page.json'); // Adjust the path to your JSON file
    if (!response.ok) {
      throw new Error(`Failed to fetch products: ${response.status} ${response.statusText}`);
    }

    const products = await response.json();
    const productGrid = document.getElementById('productGrid');
    productGrid.innerHTML = ""; // Clear existing content

    // Populate the product grid with cards
    products.forEach(product => {
      const productCard = document.createElement('div');
      productCard.classList.add('product-card');
      productCard.setAttribute('data-type', product.type.toLowerCase()); // Add data-type for filtering

      const productImage = document.createElement('img');
      productImage.src = product.image;
      productImage.alt = product.alt;

      const productName = document.createElement('h2');
      productName.textContent = product.name;

      const productPrice = document.createElement('p');
      productPrice.classList.add('price');
      productPrice.textContent = product.price;

      const addButton = document.createElement('button');
      addButton.textContent = product.button;
      addButton.onclick = () => addToCart(product);

      productCard.appendChild(productImage);
      productCard.appendChild(productName);
      productCard.appendChild(productPrice);
      productCard.appendChild(addButton);

      productGrid.appendChild(productCard);
    });
  } catch (error) {
    console.error(error.message);
    document.getElementById('productGrid').innerHTML = `<p class="error">Failed to load products. Please try again later.</p>`;
  }
}

// Search and filter functionality combined
function filterAndSearchProducts() {
  const searchBar = document.getElementById('searchBar').value.toLowerCase();
  const filter = document.getElementById('clothingType').value.toLowerCase();
  const products = document.querySelectorAll('.product-card');

  products.forEach(product => {
    const productType = product.getAttribute('data-type');
    const productNameElement = product.querySelector('h2');
    const productName = productNameElement ? productNameElement.textContent.toLowerCase() : '';

    if (
      (filter === 'all' || (productType && productType === filter)) &&
      productName.includes(searchBar)
    ) {
      product.style.display = 'block';
    } else {
      product.style.display = 'none';
    }
  });
}

// Add product to cart
function addToCart(product) {
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  const { id, name, price, image } = product; // Only store essential fields
  cart.push({ id, name, price, image });
  localStorage.setItem('cart', JSON.stringify(cart));
  console.log('Cart updated:', cart);
}

// Initialize page and bind events
document.addEventListener('DOMContentLoaded', () => {
  loadProducts();

  // Attach search and filter events
  document.getElementById('searchBar').addEventListener('keyup', filterAndSearchProducts);
  document.getElementById('clothingType').addEventListener('change', filterAndSearchProducts);
});
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('toggleSidebar').addEventListener('click', () => {
    const sidebar = document.getElementById('sidebar');
    sidebar.classList.toggle('hidden'); // Toggles the 'hidden' class
  });
});
