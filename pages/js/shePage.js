document.addEventListener('DOMContentLoaded', function () {
  // Fetch products data from the server
  fetch('/pages/js/public/she-page.json')
    .then(response => {
      if (!response.ok) throw new Error('Network response was not ok');
      return response.json();
    })
    .then(data => {
      if (data && data.clothes) {
        console.log('Product data fetched:', data.clothes);  // Log data to verify content
        displayProducts(data.clothes);  // Display the products
      } else {
        console.error('Data format error: "clothes" key not found');
      }
    })
    .catch(error => {
      console.error('Error fetching products:', error);  // Log any fetch errors
    });
});

function displayProducts(clothes) {
  const productGrid = document.getElementById('productGrid');
  if (!productGrid) {
    console.error('Error: productGrid element not found');
    return;
  }

  productGrid.innerHTML = '';  // Clear existing content
  clothes.forEach(product => {
    const productCard = document.createElement('div');
    productCard.className = 'product-card';
    productCard.setAttribute('data-type', product.type);

    productCard.innerHTML = `
      <img src="${product.image}" alt="${product.name}">
      <h2>${product.name}</h2>
      <p>${product.description}</p>
      <p class="price">₹${product.price}</p>
      <button>Add to Cart</button>
    `;

    productGrid.appendChild(productCard);
  });

  console.log('Products displayed successfully');
}

function searchProducts() {
  const searchTerm = document.getElementById('searchInput').value.trim().toLowerCase();
  const products = document.querySelectorAll('.product-card');
  console.log("Search Term:", searchTerm);  // Log search term

  products.forEach(product => {
    const productName = product.querySelector('h2').innerText.toLowerCase();
    console.log(`Product Name: "${productName}"`);

    const isMatch = productName.includes(searchTerm);
    console.log(`Product match for "${productName}": ${isMatch}`);

    product.style.display = isMatch ? 'flex' : 'none';  // Adjust display
    console.log(`Product "${productName}" display: ${product.style.display}`);
  });
}

// Function to filter products by type
function filterProducts() {
  const selectedType = document.getElementById('filter').value;
  const products = document.querySelectorAll('.product-card');
  
  products.forEach(product => {
    const productType = product.getAttribute('data-type');
    
    if (selectedType === 'all' || productType === selectedType) {
      product.style.display = 'flex';  // Show matching or all items
    } else {
      product.style.display = 'none';  // Hide non-matching items
    }
  });
}
