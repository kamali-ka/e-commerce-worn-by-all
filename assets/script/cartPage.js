import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import {
  getDatabase,
  ref,
  get,
  set,
  remove,
} from "https://www.gstatic.com/firebasejs/11.0.2/firebase-database.js";
import {
  getAuth,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";

// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyAnKtlrGE7lMKtHhjQyzfElqCkI2bupWzs",
  authDomain: "wornbyall-926f5.firebaseapp.com",
  projectId: "wornbyall-926f5",
  storageBucket: "wornbyall-926f5.appspot.com",
  messagingSenderId: "770771226995",
  appId: "1:770771226995:web:15636d6b9e17d27611b506",
  measurementId: "G-B6PER21YN1",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const auth = getAuth(app);

const productId = [];
let totalBill = 0;

// Show and hide loader functions
function showLoader() {
  document.getElementById("loader").style.display = "flex";
}

function hideLoader() {
  document.getElementById("loader").style.display = "none";
}

const checkOut = document.getElementById("buyNowButton");
if (checkOut) {
  checkOut.disabled = true;
}

// Fetch cart items from Firebase
async function fetchCartItems(userId) {
  try {
    const cartRef = ref(database, `cart/${userId}`);
    const snapshot = await get(cartRef);
    if (snapshot.exists()) {
      return snapshot.val(); // The cart data will be in a nested structure
    }
    return {};
  } catch (error) {
    console.error("Error fetching cart items from Firebase:", error);
    return {};
  }
}

// Save cart items to Firebase
async function saveCartItems(userId, cart) {
  try {
    const cartRef = ref(database, `cart/${userId}`);
    await set(cartRef, cart);
  } catch (error) {
    console.error("Error saving cart items to Firebase:", error);
  }
}

// Empty the cart in Firebase
async function emptyCartInFirebase(userId) {
  try {
    const cartRef = ref(database, `cart/${userId}`);
    await set(cartRef, {}); // Set the cart to an empty object to clear it
  } catch (error) {
    console.error("Error emptying the cart in Firebase:", error);
  }
}

function isCartEmpty(cart) {
  return (
    !cart ||
    Object.keys(cart).length === 0 ||
    Object.values(cart).every((category) => category.length === 0)
  );
}

function updateCheckoutButton(cart) {
  const checkOut = document.getElementById("buyNowButton");
  if (isCartEmpty(cart)) {
    checkOut.disabled = true;
    checkOut.classList.add("disabled"); // Optional for styling
  } else {
    checkOut.disabled = false;
    checkOut.classList.remove("disabled");
  }
}

// Fetch and load cart items
async function loadCartItems() {
  const cartItemsContainer = document.getElementById("cartItems");
  if (!cartItemsContainer) return;
  if (checkOut) checkOut.disabled = true; // Default disabled state
  showLoader();

  const user = auth.currentUser;
  if (!user) {
    cartItemsContainer.innerHTML = "<p>Please sign in to view your cart.</p>";
    hideLoader();
    return;
  }

  const userId = user.uid;
  const cart = await fetchCartItems(userId);
  const products = await fetchProductData();

  cartItemsContainer.innerHTML = "";

  if (isCartEmpty(cart)) {
    cartItemsContainer.innerHTML = "<p>Your cart is empty.</p>";
    updateCheckoutButton(cart);
    hideLoader();
    return;
  }

  // Reset cartItemIds array at the start of loading cart items
  let cartItemIds = [];

  // Loop through the cart categories and items
  for (const category in cart) {
    const categoryItems = cart[category];
    categoryItems.forEach((cartItem) => {
      const product = products.find((p) => p.id === cartItem.id);
      if (product) {
        renderCartItem(cartItem, product, cartItemsContainer);
        // Push cartItem.id to the cartItemIds array
        cartItemIds.push(cartItem.id);
      }
    });
  }

  // Store the cartItemIds array in localStorage
  localStorage.setItem("cartItemIds", JSON.stringify(cartItemIds));

  // Optionally log it to check if it's stored correctly
  console.log("cartItemIds :", cartItemIds); // This will log the array of all cart item ids

  updateTotalAmount(cart);
  updateCheckoutButton(cart);
  hideLoader();
}

// localStorage.removeItem("orderedProductsId");
// localStorage.removeItem("orderedTotalPrice");

// Render individual cart item
function renderCartItem(cartItem, product, container) {
  const sizeOptions = Array.isArray(product.sizes)
    ? product.sizes
        .map(
          (size) =>
            `<option value="${size}" ${
              cartItem.size === size ? "selected" : ""
            }>${size}</option>`
        )
        .join(" ")
    : "";

  const cartItemHTML = `
    <div class="cart-item" data-id="${cartItem.id}">
      <img src="${product.image}" alt="${product.alt}" />
      <div class="item-details">
        <h3>${product.name}</h3>
        <p>Price: ₹${product.price}</p>
        <label for="size-select-${cartItem.id}">Size:</label>
        <select class="size-select" id="size-select-${cartItem.id}" data-id="${cartItem.id}">
          ${sizeOptions}
        </select>
        <div class="quantity-controls">
          <button class="decrease-btn" data-id="${cartItem.id}">-</button>
          <span class="quantity">${cartItem.quantity}</span>
          <button class="increase-btn" data-id="${cartItem.id}">+</button>
        </div>
        <button class="remove-btn" data-id="${cartItem.id}">Remove</button>
      </div>
    </div>
  `;

  container.innerHTML += cartItemHTML;
}

// Attach event listeners using event delegation
document.getElementById("cartItems").addEventListener("click", (event) => {
  const target = event.target;
  const productId = target.dataset.id;

  if (!productId) return; // Make sure target has a valid productId

  if (target.classList.contains("increase-btn")) {
    updateQuantity(productId, 1);
  } else if (target.classList.contains("decrease-btn")) {
    updateQuantity(productId, -1);
  } else if (target.classList.contains("remove-btn")) {
    removeCartItem(productId);
  }
});

// Update quantity of product in the cart
async function updateQuantity(productId, change) {
  const user = auth.currentUser;
  if (!user) return;

  const userId = user.uid;
  const cart = await fetchCartItems(userId);

  let productFound = false;

  for (const category in cart) {
    const categoryItems = cart[category];
    for (let i = 0; i < categoryItems.length; i++) {
      const product = categoryItems[i];
      if (product.id === productId) {
        product.quantity = Math.max(1, product.quantity + change);

        const quantityElement = document.querySelector(
          `[data-id="${productId}"] .quantity`
        );
        if (quantityElement) {
          quantityElement.textContent = product.quantity;
        }

        productFound = true;
        break;
      }
    }

    if (productFound) break;
  }

  if (!productFound) {
    console.error("Product not found in the cart.");
    return;
  }

  await saveCartItems(userId, cart);
  updateTotalAmount(cart);
}

// Remove item from cart
async function removeCartItem(productId) {
  const user = auth.currentUser;
  if (!user) return;

  const userId = user.uid;

  try {
    // List of categories to check
    const categories = ["women", "men", "kids", "unisex"];

    for (const category of categories) {
      const cartRef = ref(database, `cart/${userId}/${category}`);
      const snapshot = await get(cartRef);

      if (snapshot.exists()) {
        const cartItems = snapshot.val();

        let updatedCartItems = {};
        let itemRemoved = false;

        // Check if cartItems is an object (Firebase often stores data as objects)
        if (typeof cartItems === "object") {
          updatedCartItems = Object.fromEntries(
            Object.entries(cartItems).filter(([key, item]) => {
              const keepItem = item.id !== productId;
              if (!keepItem) {
                itemRemoved = true;
              }
              return keepItem;
            })
          );
        } else if (Array.isArray(cartItems)) {
          // If it's an array (less common), filter directly
          updatedCartItems = cartItems.filter((item) => item.id !== productId);
          itemRemoved = true;
        }

        if (itemRemoved) {
          // Save updated cart or delete category if empty
          if (Object.keys(updatedCartItems).length > 0) {
            await set(cartRef, updatedCartItems);
          } else {
            await remove(cartRef); // Remove the entire category if empty
          }
          console.log(
            `Removed item with ID ${productId} from ${category} category.`
          );
        }
      }
    }

    // Reload the cart items after removal
    loadCartItems();
  } catch (error) {
    console.error("Error removing item from cart:", error);
  }
}

// Update the total amount in the UI

function updateTotalAmount(cart) {
  const userId = auth.currentUser?.uid;
  if (!userId) return;

  fetchProductData()
    .then((products) => {
      let totalPrice = 0;

      for (const category in cart) {
        const categoryItems = cart[category];
        categoryItems.forEach((cartItem) => {
          const product = products.find((p) => p.id === cartItem.id);
          if (product) {
            totalPrice += product.price * cartItem.quantity;
          }
        });
      }

      const tax = totalPrice * 0.02;
      const deliveryFee = totalPrice > 0 ? 30 : 0;
      totalBill = totalPrice + tax + deliveryFee;

      const billSummary = document.getElementById("billSummary");
      if (billSummary) {
        billSummary.innerHTML = `
        <h3>Bill Summary</h3>
        <p>Product Price: ₹${totalPrice.toFixed(2)}</p>
        <p>Tax (2%): ₹${tax.toFixed(2)}</p>
        <p>Delivery Fee: ₹${deliveryFee.toFixed(2)}</p>
        <hr>
        <h4>Total: ₹${totalBill.toFixed(2)}</h4>
      `;
      }

      const totalAmountElement = document.getElementById("totalAmount");
      if (totalAmountElement) {
        totalAmountElement.textContent = totalBill.toFixed(2);
      }
    })
    .catch((error) => {
      console.error(
        "Error fetching product data for total amount update:",
        error
      );
    });
}

// Initialize cart on page load
document.addEventListener("DOMContentLoaded", () => {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      loadCartItems();
    } else {
      const cartItemsContainer = document.getElementById("cartItems");
      if (cartItemsContainer) {
        cartItemsContainer.innerHTML =
          "<p>Please sign in to view your cart.</p>";
      }
    }
  });
});
document.getElementById("cartItems").addEventListener("change", (event) => {
  const target = event.target;
  if (target.classList.contains("size-select")) {
    const productId = target.dataset.id;
    const selectedSize = target.value;
    updateSelectedSize(productId, selectedSize);
  }
});

async function updateSelectedSize(productId, size) {
  const user = auth.currentUser;
  if (!user) return;

  const userId = user.uid;
  const cart = await fetchCartItems(userId);

  for (const category in cart) {
    cart[category].forEach((item) => {
      if (item.id === productId) {
        item.size = size;
      }
    });
  }

  await saveCartItems(userId, cart);
}

// Fetch product data
async function fetchProductData() {
  showLoader();
  try {
    const productCategories = [
      "he-page",
      "she-page",
      "kids-page",
      "unisex-page",
    ];
    let allProducts = [];

    for (let category of productCategories) {
      const snapshot = await get(ref(database, category));
      if (snapshot.exists()) {
        const categoryProducts = snapshot.val();
        allProducts = [...allProducts, ...Object.values(categoryProducts)];
      } else {
        console.error(`No data found for category: ${category}`);
      }
    }

    return allProducts;
  } catch (error) {
    console.error("Error fetching product data:", error);
    return [];
  } finally {
    hideLoader();
  }
}

// Empty cart button click event listener
document
  .getElementById("emptyCartButton")
  .addEventListener("click", async () => {
    const user = auth.currentUser;
    if (!user) return;

    const userId = user.uid;

    // Clear cart items in the UI
    const cartItemsContainer = document.getElementById("cartItems");
    if (cartItemsContainer) {
      document.getElementById("buyNowButton").disabled = true;
      document.getElementById("buyNowButton").classList.add("disabled");

      cartItemsContainer.innerHTML = "<p>Your cart is now empty.</p>";
    }

    // Empty the cart in Firebase
    await emptyCartInFirebase(userId);

    // Optionally, you can update the total amount to 0 after clearing the cart
    updateTotalAmount({}); // Pass an empty cart to reset the total
  });

document.getElementById("buyNowButton").addEventListener("click", () => {
  document
    .getElementById("buyNowButton")
    .addEventListener("click", async () => {
      const user = auth.currentUser;
      if (!user) return;

      const userId = user.uid;

      // Store order details in localStorage
      localStorage.setItem("orderedProductsId", JSON.stringify(productId));
      localStorage.setItem("orderedTotalPrice", totalBill);

      // Clear the cart in Firebase before redirection
      await emptyCartInFirebase(userId);

      // Redirect to the order review page
      window.location.href = "../html/orderReview.html";
    });
});
// Toggle sidebar visibility
const toggleSidebar = document.getElementById("toggleSidebar");
const sidebar = document.getElementById("sidebar");
const overlay = document.getElementById("overlay"); // Assuming you have an overlay element to cover the background

if (toggleSidebar) {
  toggleSidebar.addEventListener("click", () => {
    if (sidebar) {
      sidebar.classList.toggle("visible");
      overlay.classList.toggle("visible"); // Show the overlay when sidebar is visible
    }
  });
}

// Close sidebar when clicking outside of it
if (sidebar && overlay) {
  overlay.addEventListener("click", () => {
    sidebar.classList.remove("visible");
    overlay.classList.remove("visible"); // Hide the overlay
  });
}
