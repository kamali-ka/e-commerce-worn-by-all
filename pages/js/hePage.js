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
