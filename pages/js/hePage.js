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
// Function to fetch and display products
async function loadProducts() {
  try {
    const response = await fetch('/pages/js/public/he-page.json'); // Adjust path to your JSON file
    if (!response.ok) {
      throw new Error(`Failed to fetch products: ${response.status} ${response.statusText}`);
    }

    const products = await response.json();
    const productGrid = document.getElementById('productGrid');

    products.forEach(product => {
      const productCard = document.createElement('div');
      productCard.classList.add('product-card');
      productCard.setAttribute('data-type', product.type);

      const productImage = document.createElement('img');
      productImage.src = product.image;
      productImage.alt = product.alt;

      const productName = document.createElement('h2');
      productName.textContent = product.name;

      const productPrice = document.createElement('p');
      productPrice.classList.add('price');
      productPrice.textContent = product.price;

      const addButton = document.createElement('button');
      addButton.textContent = "Add to Cart";
      addButton.onclick = () => addToCart(product);

      productCard.appendChild(productImage);
      productCard.appendChild(productName);
      productCard.appendChild(productPrice);
      productCard.appendChild(addButton);

      productGrid.appendChild(productCard);
    });
  } catch (error) {
    console.error(error.message);
  }
}

document.addEventListener('DOMContentLoaded', loadProducts);

const addButton = document.createElement('button');
addButton.textContent = "Add to Cart";
addButton.onclick = () => addToCart(product); // Pass the entire product object

function addToCart(product) {
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  cart.push(product); // Store the entire product object
  localStorage.setItem('cart', JSON.stringify(cart));
  console.log(cart);
}



