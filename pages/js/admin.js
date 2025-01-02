const addProductBtn = document.getElementById('addProductBtn');
const productModal = document.getElementById('productModal');
const closeModal = document.querySelector('.close');
const productForm = document.getElementById('productForm');
const productsTable = document.getElementById('productsTable').getElementsByTagName('tbody')[0];

// Show Modal when 'Add Product' is clicked
addProductBtn.onclick = function() {
    productModal.style.display = 'block';
}

// Close Modal when 'X' is clicked
closeModal.onclick = function() {
    productModal.style.display = 'none';
}

// Close Modal if clicked outside of the modal
window.onclick = function(event) {
    if (event.target == productModal) {
        productModal.style.display = 'none';
    }
}

// Handle form submission and add product to localStorage
productForm.onsubmit = function(event) {
    event.preventDefault();

    const productName = document.getElementById('productName').value;
    const productCategory = document.getElementById('productCategory').value;
    const productPrice = document.getElementById('productPrice').value;

    // Get products from localStorage (or initialize empty array if not found)
    let products = JSON.parse(localStorage.getItem('products')) || [];

    // Add new product to the products array
    const newProduct = {
        id: Math.floor(Math.random() * 1000), // Generate a random ID
        name: productName,
        category: productCategory,
        price: productPrice,
    };
    products.push(newProduct);

    // Save updated products array to localStorage
    localStorage.setItem('products', JSON.stringify(products));

    // Clear form fields and close the modal
    productForm.reset();
    productModal.style.display = 'none';

    // Reload the products table
    loadProducts();
}

// Retrieve products from localStorage and display them
function loadProducts() {
    // Get products from localStorage
    const products = JSON.parse(localStorage.getItem('products')) || [];

    // Clear existing rows
    productsTable.innerHTML = '';

    // Loop through products and add rows to the table
    products.forEach(product => {
        const newRow = productsTable.insertRow();
        newRow.innerHTML = `
            <td>${product.id}</td>
            <td>${product.name}</td>
            <td>${product.category}</td>
            <td>${product.price}</td>
            <td><button onclick="deleteProduct(${product.id}, this)">Delete</button></td>
        `;
    });
}

// Delete product from localStorage and remove from table
function deleteProduct(productId, button) {
    // Get products from localStorage
    let products = JSON.parse(localStorage.getItem('products')) || [];

    // Remove the product with the specified ID
    products = products.filter(product => product.id !== productId);

    // Save the updated products list back to localStorage
    localStorage.setItem('products', JSON.stringify(products));

    // Remove the row from the table
    const row = button.parentElement.parentElement;
    row.remove();
}

// Initial load of products when the page loads
window.onload = loadProducts;

// Logout functionality (optional)
const logoutBtn = document.getElementById('logout');
logoutBtn.onclick = function() {
    alert('Logging out...');
    // Implement logout logic here (if needed)
}
