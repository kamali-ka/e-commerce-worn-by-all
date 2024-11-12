document.addEventListener("DOMContentLoaded", () => {
    // Load products from JSON file
    fetch('../js/public/unisex-page.json')  // Adjust the path based on your server setup
        .then(response => response.json())
        .then(data => {
            const products = data.unisex;  // Assuming the JSON structure contains the "unisex" array
            renderProducts(products);
        })
        .catch(error => console.error("Error loading JSON:", error));

    // Add event listeners for filtering and searching
    document.getElementById("clothingType").addEventListener("change", filterByType);
    document.getElementById("searchBar").addEventListener("keyup", searchProducts);
});

// Render products based on JSON data
function renderProducts(products) {
    const productGrid = document.getElementById("productGrid");
    productGrid.innerHTML = ""; // Clear existing products

    products.forEach(product => {
        const productCard = document.createElement("div");
        productCard.classList.add("product-card");
        productCard.setAttribute("data-type", product.type);

        productCard.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <h2>${product.name}</h2>
            <p class="price">₹${product.price}</p>
            <button>Add to Cart</button>
        `;

        productGrid.appendChild(productCard);
    });
}

// Filter products by type
function filterByType() {
    const type = document.getElementById("clothingType").value.toLowerCase();
    const products = document.querySelectorAll(".product-card");

    products.forEach(product => {
        const productType = product.getAttribute("data-type").toLowerCase();
        product.style.display = type === "all" || productType === type ? "flex" : "none";
    });
}

// Search products by name
function searchProducts() {
    const query = document.getElementById("searchBar").value.toLowerCase();
    const products = document.querySelectorAll(".product-card");

    products.forEach(product => {
        const productName = product.querySelector("h2").innerText.toLowerCase();
        product.style.display = productName.includes(query) ? "flex" : "none";
    });
}
