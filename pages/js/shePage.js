
  // Search Products Function
function searchProducts() {
  const searchTerm = document.getElementById('searchBar').value.toLowerCase();
  const products = document.querySelectorAll('.product-card');

  products.forEach((product) => {
    const productName = product.querySelector('h2').innerText.toLowerCase();

    if (productName.includes(searchTerm)) {
      product.style.display = 'flex'; // Show matching products
    } else {
      product.style.display = 'none'; // Hide non-matching products
    }
  });
}

// Filter by Type Function
function filterByType() {
  const selectedType = document.getElementById('clothingType').value;
  const products = document.querySelectorAll('.product-card');

  products.forEach((product) => {
    const productType = product.getAttribute('data-type');

    if (selectedType === 'all' || productType === selectedType) {
      product.style.display = 'flex'; // Show matching or all products
    } else {
      product.style.display = 'none'; // Hide non-matching products
    }
  });
}
