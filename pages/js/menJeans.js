// Function to load and display only shirts (or all products)
async function loadProducts() {
  try {
    // Fetch the product data from the JSON file
    const response = await fetch("../js/public/he-page.json"); // Adjusted path for local file
    if (!response.ok) {
      throw new Error(
        `Failed to fetch products: ${response.status} ${response.statusText}`
      );
    }

    const products = await response.json();
    const productGrid = document.getElementById("productGrid");

    if (!productGrid) {
      console.error("Element with ID 'productGrid' not found.");
      return;
    }

    productGrid.innerHTML = ""; // Clear existing products

    // Filter and display jeans
    const jeansProducts = products.filter(
      (product) => product.type === "Jeans"
    );
    if (jeansProducts.length === 0) {
      productGrid.innerHTML = "<p>No jeans available at the moment.</p>";
      return;
    }

    jeansProducts.forEach((product) => {
      const productCard = document.createElement("div");
      productCard.classList.add("product-card");

      const productImage = document.createElement("img");
      productImage.src = product.image || ""; // Fallback if the image is missing
      productImage.alt = product.alt || product.name || "Product Image";

      const productName = document.createElement("h2");
      productName.textContent = product.name || "Unnamed Product";

      const productPrice = document.createElement("p");
      productPrice.classList.add("price");
      const price = parseFloat(product.price.replace(/[₹,]/g, "")); // Remove ₹ and commas
      productPrice.textContent = isNaN(price)
        ? "Price not available"
        : `₹${price.toFixed(2)}`;

      const addButton = document.createElement("button");
      addButton.textContent = isInCart(product) ? "Visit Cart" : "Add to Cart";
      addButton.onclick = () => handleCartButtonClick(product, addButton);

      // Add a click event to redirect to the product detail page
      productCard.addEventListener("click", () =>
        redirectToProductDetail(product.id)
      );

      productCard.append(productImage, productName, productPrice, addButton);
      productGrid.appendChild(productCard);
    });
  } catch (error) {
    console.error("Error loading jeans:", error.message);
    const productGrid = document.getElementById("productGrid");
    if (productGrid) {
      productGrid.innerHTML =
        "<p>Failed to load products. Please try again later.</p>";
    }
  }
}

// Function to redirect to the product detail page
function redirectToProductDetail(productId) {
  // Redirect to the product detail page with the product ID as a query parameter
  window.location.href = `../html/productDetails.html?id=${productId}`;
}

// Function to handle the button click for adding/visiting the cart
function handleCartButtonClick(product, button) {
  if (isInCart(product)) {
    // Redirect to cart
    window.location.href = "../html/cartPage.html"; // Adjust path to your cart page
  } else {
    addToCart(product);
    button.textContent = "Visit Cart";
  }
}

// Function to check if a product is already in the cart
function isInCart(product) {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  return cart.some((item) => item.name === product.name);
}

// Function to add a product to the cart
function addToCart(product) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  const existingItemIndex = cart.findIndex(
    (item) => item.name === product.name
  );
  if (existingItemIndex === -1) {
    product.quantity = 1; // Add quantity property
    cart.push(product);
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
  showCartPopup("Successfully added to the cart!");
}

// Function to update the cart count
function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);

  const cartCountElement = document.getElementById("cartCount");
  if (cartCountElement) {
    cartCountElement.textContent = totalItems;
  }
}

// Function to display the popup message
function showCartPopup(message) {
  const popupContainer = document.getElementById("popupContainer");
  const popupMessage = document.getElementById("popupMessage");

  // Set the message content
  popupMessage.textContent = message;

  // Display the popup
  popupContainer.classList.add("show");

  // Hide the popup after 3 seconds
  setTimeout(() => {
    popupContainer.classList.remove("show");
  }, 3000);
}

// Function to search for products
function searchProducts() {
  const searchBarValue = document
    .getElementById("searchBar")
    .value.toLowerCase();
  const products = document.querySelectorAll(".product-card");

  products.forEach((product) => {
    const productName = product.querySelector("h2").textContent.toLowerCase();
    product.style.display = productName.includes(searchBarValue)
      ? "block"
      : "none";
  });
}

// Toggle sidebar visibility
document.getElementById("toggleSidebar").addEventListener("click", () => {
  const sidebar = document.getElementById("sidebar");
  sidebar.classList.toggle("visible");
});

// Load cart count on page load and fetch products
document.addEventListener("DOMContentLoaded", () => {
  loadProducts().then(() => {
    updateCartCount();
  });

  // Attach event listener for search bar
  const searchBar = document.getElementById("searchBar");
  if (searchBar) {
    searchBar.addEventListener("input", searchProducts);
  } else {
    console.error("Search bar element not found.");
  }
});

// Function to redirect to the product detail page
function redirectToProductDetail(productId) {
  // Redirect to the product detail page with the product ID as a query parameter
  window.location.href = `../html/productDetails.html?id=${productId}`;
}

// Function to handle the button click for adding/visiting the cart
function handleCartButtonClick(product, button) {
  if (isInCart(product)) {
    // Redirect to cart
    window.location.href = "../html/cartPage.html"; // Adjust path to your cart page
  } else {
    addToCart(product);
    button.textContent = "Visit Cart";
  }
}

// Function to check if a product is already in the cart
function isInCart(product) {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  return cart.some((item) => item.name === product.name);
}

// Function to add a product to the cart
// Corrected heShirt.js

// Function to navigate to the cart page
function navigateToCart() {
  window.location.href = "../html/cartPage.html"; // Ensure this path is correct
}

// Function to handle adding an item to the cart
function addToCart(item) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  // Check if the item already exists in the cart
  const existingItemIndex = cart.findIndex(
    (cartItem) => cartItem.id === item.id
  );
  if (existingItemIndex > -1) {
    // Update quantity if item exists
    cart[existingItemIndex].quantity += 1;
  } else {
    // Add new item to the cart
    cart.push({ ...item, quantity: 1 });
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  alert("Item added to cart!");
}

// Add click event listener to the "Add to Cart" button
const addButton = document.getElementById("addToCartButton");
if (addButton) {
  addButton.onclick = () => {
    // Example item data - Replace this with dynamic data as needed
    const item = {
      id: "12345",
      name: "T-Shirt",
      price: 499,
      image: "../images/tshirt.jpg",
    };

    addToCart(item); // Add item to the cart
    navigateToCart(); // Navigate to the cart page
  };
} else {
  console.error("Add to Cart button not found!");
}

// Function to update the cart count
function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);

  const cartCountElement = document.getElementById("cartCount");
  if (cartCountElement) {
    cartCountElement.textContent = totalItems;
  }
}

// Function to display the popup message
function showCartPopup(message) {
  const popupContainer = document.getElementById("popupContainer");
  const popupMessage = document.getElementById("popupMessage");

  // Set the message content
  popupMessage.textContent = message;

  // Display the popup
  popupContainer.classList.add("show");

  // Hide the popup after 3 seconds
  setTimeout(() => {
    popupContainer.classList.remove("show");
  }, 3000);
}

// Function to search for products
function searchProducts() {
  const searchBarValue = document
    .getElementById("searchBar")
    .value.toLowerCase();
  const products = document.querySelectorAll(".product-card");

  products.forEach((product) => {
    const productName = product.querySelector("h2").textContent.toLowerCase();
    product.style.display = productName.includes(searchBarValue)
      ? "block"
      : "none";
  });
}

// Toggle sidebar visibility
document.getElementById("toggleSidebar").addEventListener("click", () => {
  const sidebar = document.getElementById("sidebar");
  sidebar.classList.toggle("visible");
});

// Load cart count on page load and fetch products
document.addEventListener("DOMContentLoaded", () => {
  loadProducts().then(() => {
    updateCartCount();
  });

  // Attach event listener for search bar
  const searchBar = document.getElementById("searchBar");
  if (searchBar) {
    searchBar.addEventListener("input", searchProducts);
  } else {
    console.error("Search bar element not found.");
  }
});

// Function to handle the button click for adding/visiting the cart
function handleCartButtonClick(product, button) {
  if (isInCart(product)) {
    // Redirect to cart
    window.location.href = "../html/cartPage.html"; // Adjust path to your cart page
  } else {
    addToCart(product);
    button.textContent = "Visit Cart";
  }
}

// Function to check if a product is already in the cart
function isInCart(product) {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  return cart.some((item) => item.name === product.name);
}

// Function to add a product to the cart
function addToCart(item) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  // Check if the item already exists in the cart
  const existingItemIndex = cart.findIndex(
    (cartItem) => cartItem.id === item.id
  );
  if (existingItemIndex > -1) {
    // Update quantity if item exists
    cart[existingItemIndex].quantity += 1;
  } else {
    // Add new item to the cart
    cart.push({ ...item, quantity: 1 });
  }

  localStorage.setItem("cart", JSON.stringify(cart));

  // Show popup message
  showPopup("Item added to cart successfully!");
}

// Function to update the cart count
function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);

  const cartCountElement = document.getElementById("cartCount");
  if (cartCountElement) {
    cartCountElement.textContent = totalItems;
  }
}

// Function to display the popup message
// Function to show the popup message
function showPopup(message) {
  const popupContainer = document.getElementById("popupContainer");
  const popupMessage = popupContainer.querySelector(".popup-message");

  // Set the message
  popupMessage.textContent = message;

  // Ensure the popup is styled for success
  popupMessage.style.backgroundColor = "green"; // Set to green for success
  popupMessage.style.color = "white";

  // Show the popup
  popupContainer.classList.add("show");

  // Hide the popup after 3 seconds
  setTimeout(() => {
    popupContainer.classList.remove("show");
  }, 3000);
}

// Function to search for products
function searchProducts() {
  const searchBarValue = document
    .getElementById("searchBar")
    .value.toLowerCase();
  const products = document.querySelectorAll(".product-card");

  products.forEach((product) => {
    const productName = product.querySelector("h2").textContent.toLowerCase();
    product.style.display = productName.includes(searchBarValue)
      ? "block"
      : "none";
  });
}

// Toggle sidebar visibility
document.getElementById("toggleSidebar").addEventListener("click", () => {
  const sidebar = document.getElementById("sidebar");
  sidebar.classList.toggle("visible");
});

// Load cart count on page load and fetch products
document.addEventListener("DOMContentLoaded", () => {
  loadShirts().then(() => {
    updateCartCount();
  });

  // Attach event listener for search bar
  const searchBar = document.getElementById("searchBar");
  if (searchBar) {
    searchBar.addEventListener("input", searchProducts);
  } else {
    console.error("Search bar element not found.");
  }
});
