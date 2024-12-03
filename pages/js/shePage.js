document.addEventListener("DOMContentLoaded", function () {
  // Sidebar toggle
  const hamburgerMenu = document.querySelector("#toggleSidebar");
  if (hamburgerMenu) {
    hamburgerMenu.addEventListener("click", toggleSidebar);
  }

  // Fetch products data from the server
  fetch("/pages/js/public/she-page.json")
    .then((response) => {
      if (!response.ok) throw new Error("Network response was not ok");
      return response.json();
    })
    .then((data) => {
      console.log("Fetched data:", data); // Log fetched data to debug
      if (data && data.clothes) {
        displayProducts(data.clothes); // Display the products
      } else {
        console.error('Data format error: "clothes" key not found');
      }
    })
    .catch((error) => {
      console.error("Error fetching products:", error); // Log fetch errors
    });

  // Event listeners for search and filter
  const searchInput = document.getElementById("searchInput");
  const filter = document.getElementById("filter");

  if (searchInput) {
    searchInput.addEventListener("keyup", searchProducts);
  }

  if (filter) {
    filter.addEventListener("change", filterProducts);
  }

  loadCartItems(); // Load cart items on page load
});

// Function to toggle the sidebar
function toggleSidebar() {
  const sidebar = document.getElementById("sidebar");
  if (sidebar) {
    sidebar.classList.toggle("visible");
  }
}

// Function to display products
function displayProducts(clothes) {
  const productGrid = document.getElementById("productGrid");
  if (!productGrid) {
    console.error("Error: productGrid element not found");
    return;
  }

  productGrid.innerHTML = ""; // Clear existing content
  clothes.forEach((product) => {
    const productCard = document.createElement("div");
    productCard.className = "product-card";
    productCard.setAttribute("data-type", product.type);

    productCard.innerHTML = `
      <img src="${product.image}" alt="${product.name}">
      <h2>${product.name}</h2>
      <p>${product.description}</p>
      <p class="price">₹${product.price}</p>
      <button class="add-to-cart-button">Add to Cart</button>
    `;

    productCard.querySelector(".add-to-cart-button").addEventListener("click", () => addToCart(product));
    productGrid.appendChild(productCard);
  });

  console.log("Products displayed successfully");
}

// Function to search products
function searchProducts() {
  const searchTerm = document.getElementById("searchInput").value.trim().toLowerCase();
  const products = document.querySelectorAll(".product-card");

  products.forEach((product) => {
    const productName = product.querySelector("h2").innerText.toLowerCase();
    product.style.display = productName.includes(searchTerm) ? "flex" : "none";
  });
}

// Function to filter products
function filterProducts() {
  const selectedType = document.getElementById("filter").value;
  const products = document.querySelectorAll(".product-card");

  products.forEach((product) => {
    const productType = product.getAttribute("data-type");
    product.style.display = selectedType === "all" || productType === selectedType ? "flex" : "none";
  });
}

// Function to add a product to the cart
function addToCart(product) {
  console.log("Adding product to cart:", product); // Log product being added

  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  if (!product.id) {
    console.error("Product is missing an ID:", product);
    return;
  }

  const existingItem = cart.find((item) => item.id === product.id);
  if (existingItem) {
    existingItem.quantity = (existingItem.quantity || 1) + 1;
  } else {
    product.quantity = 1;
    cart.push(product);
  }

  try {
    localStorage.setItem("cart", JSON.stringify(cart)); // Safely save cart
  } catch (error) {
    console.error("Error saving to localStorage:", error);
  }

  alert(`${product.name} has been added to your cart.`);
  loadCartItems();
}

// Function to load cart items
function loadCartItems() {
  const cartItemsContainer = document.getElementById("cartItems");
  if (!cartItemsContainer) {
    console.error("Error: cartItems element not found");
    return;
  }

  let cart = [];
  try {
    cart = JSON.parse(localStorage.getItem("cart")) || [];
  } catch (error) {
    console.error("Error parsing cart data:", error);
    localStorage.removeItem("cart"); // Reset invalid data
    cart = [];
  }

  cartItemsContainer.innerHTML = ""; // Clear previous content
  if (cart.length === 0) {
    cartItemsContainer.style.display = "none"; // Hide empty cart
  } else {
    cart.forEach((item, index) => {
      cartItemsContainer.innerHTML += `
        <div class="product-card">
          <img src="${item.image}" alt="${item.name}">
          <h2>${item.name}</h2>
          <p class="price">₹${(item.quantity * item.price).toFixed(2)}</p>
          <div class="quantity-container">
            <button onclick="updateQuantity(${index}, -1)">-</button>
            <span>Quantity: ${item.quantity}</span>
            <button onclick="updateQuantity(${index}, 1)">+</button>
          </div>
          <button onclick="removeFromCart(${index})">Remove</button>
        </div>
      `;
    });

    updateBillSummary();
  }
}

// Function to update item quantity in the cart
function updateQuantity(index, change) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  if (!cart[index]) return;

  cart[index].quantity += change;
  if (cart[index].quantity <= 0) {
    cart.splice(index, 1); // Remove item if quantity is 0
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  loadCartItems(); // Refresh cart display
}

// Function to remove an item from the cart
function removeFromCart(index) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  cart.splice(index, 1);

  localStorage.setItem("cart", JSON.stringify(cart));
  loadCartItems(); // Refresh cart display
}

// Function to update bill summary
function updateBillSummary() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const totalPrice = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const billSummaryElement = document.getElementById("cartSummary");
  if (billSummaryElement) {
    billSummaryElement.innerHTML = `
      <h3>Total Bill: ₹${totalPrice.toFixed(2)}</h3>
    `;
  }
}
