import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";
import {
  getDatabase,
  ref,
  get,
  set,
} from "https://www.gstatic.com/firebasejs/11.0.2/firebase-database.js";
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
let gender = localStorage.getItem("gender");
let userId = null;

const productTypeForFilter = {
  Shirts: "Shirts",
  Jeans: "Jeans",
  "See All": null,
  "Short Top": "Short tops",
  Chudithar: "Chudithar",
  Boys: ["pant", "co-ords"],
  Girls: ["frock", "co-ords"],
  Babies: "onesie",
};
const dataSet = {
  men: "he-page",
  women: "she-page",
  kids: "kids-page",
};

let dataSetName = dataSet[gender];
let productType = productTypeForFilter[localStorage.getItem("productType")];

// Loader functions
function showLoader() {
  document.getElementById("loader").style.display = "flex";
}

function hideLoader() {
  document.getElementById("loader").style.display = "none";
}

async function loadProducts() {
  try {
    showLoader();
    const dbRef = ref(database, dataSetName);
    const snapshot = await get(dbRef);
    if (!snapshot.exists()) {
      throw new Error("No products found in the database.");
    }

    const products = snapshot.val();
    console.log("Products from Firebase:", products); // Log products to verify

    const productGrid = document.getElementById("productGrid");
    if (!productGrid) {
      console.error("Product grid element not found!");
      return;
    }
    productGrid.innerHTML = "";

    let filteredProducts = products;
    if (productType) {
      filteredProducts = products.filter((product) => {
        // Check if productType is an array
        if (Array.isArray(productType)) {
          return productType.includes(product.type); // Filter products whose type matches any item in the array
        } else {
          return product.type === productType; // For non-array productType, check for equality
        }
      });
    }

    if (filteredProducts.length === 0) {
      productGrid.textContent = "No Products found!";
      return;
    }

    const user = auth.currentUser;
    let cart = [];
    if (user) {
      const cartRef = ref(database, `cart/${user.uid}/${gender}`);
      const cartSnapshot = await get(cartRef);
      cart = cartSnapshot.exists() ? cartSnapshot.val() : [];
    }

    filteredProducts.forEach((product, index) => {
      if (!product || !product.id) {
        console.error(`Product at index ${index} is invalid:`, product); // Log the problematic product
        return; // Skip this product if no valid data or id
      }

      const productCard = document.createElement("div");
      productCard.classList.add("product-card");
      productCard.setAttribute("data-id", product.id);

      const productLink = document.createElement("a");
      productLink.href = `../html/productDetails.html?id=${product.id}`;
      productLink.style.textDecoration = "none";

      const productImage = document.createElement("img");
      productImage.src = product.image || "";
      productImage.alt = product.alt || product.name || "Product Image";

      const productName = document.createElement("h2");
      productName.textContent = product.name || "Unnamed Product";

      const productPrice = document.createElement("p");
      productPrice.classList.add("price");
      const price = parseFloat(product.price);
      productPrice.textContent = isNaN(price)
        ? "Price not available"
        : `₹${price.toFixed(2)}`;

      const addButton = document.createElement("button");
      console.log(product);
      console.log(cart);

      const existingItem = cart.find((item) => item.id === product.id);

      if (existingItem) {
        addButton.textContent = "Visit Cart";
        addButton.onclick = () =>
          (window.location.href = "../html/cartPage.html");
      } else {
        addButton.textContent = "Add to Cart";
        addButton.onclick = () => addToCart(product);
      }

      productLink.appendChild(productImage);
      productLink.appendChild(productName);
      productLink.appendChild(productPrice);

      productCard.appendChild(productLink);
      productCard.appendChild(addButton);

      productGrid.appendChild(productCard);
    });
  } catch (error) {
    console.error("Error loading products:", error.message);
  } finally {
    hideLoader();
  }
}

// Function to add an item to the cart
function addToCart(item) {
  const user = auth.currentUser;
  if (user) {
    const userId = user.uid;
    const cartRef = ref(database, `cart/${userId}/${gender}`);

    get(cartRef)
      .then((snapshot) => {
        const cart = snapshot.exists() ? snapshot.val() : [];
        const existingItemIndex = cart.findIndex(
          (cartItem) => cartItem.id === item.id
        );

        if (existingItemIndex > -1) {
          // If the item already exists, increase its quantity
          cart[existingItemIndex].quantity += 1;
        } else {
          // If the item is new, add it with its id and initial quantity
          cart.push({ id: item.id, quantity: 1 });
        }

        // Save the updated cart back to Firebase
        return set(cartRef, cart);
      })
      .then(() => {
        updateCartButton(item.id);
        showPopup("Item added to cart successfully!");
      })
      .catch((error) => {
        console.error("Error updating cart:", error);
        showPopup("Failed to add item to cart. Please try again.");
      });
  } else {
    console.log("User is not signed in. Redirecting...");
    window.location.href = "../html/signup-signin.html";
  }
}

// Function to update the "Add to Cart" button text
function updateCartButton(productId) {
  const productCard = document.querySelector(
    `.product-card[data-id="${productId}"]`
  );
  if (productCard) {
    const addButton = productCard.querySelector("button");
    if (addButton) {
      addButton.textContent = "Visit Cart";
      addButton.onclick = () =>
        (window.location.href = "../html/cartPage.html");
    }
  }
}

// Function to show popup messages
function showPopup(message) {
  const popupContainer = document.getElementById("popupContainer");
  const popupMessage = popupContainer?.querySelector(".popup-message");

  if (!popupContainer || !popupMessage) return;

  popupMessage.textContent = message;
  popupMessage.style.backgroundColor = "green";
  popupMessage.style.color = "white";

  popupContainer.classList.add("show");

  setTimeout(() => {
    popupContainer.classList.remove("show");
  }, 1500);
}

// Function to update the cart count
function updateCartCount() {
  const user = auth.currentUser;
  if (user) {
    const cartRef = ref(database, `cart/${user.uid}/${gender}`);
    get(cartRef)
      .then((snapshot) => {
        const cart = snapshot.exists() ? snapshot.val() : [];
        const totalProducts = cart.length;
        const cartCountElement = document.getElementById("cartCount");
        if (cartCountElement) {
          cartCountElement.textContent = totalProducts;
        }
      })
      .catch((error) => {
        console.error("Error fetching cart count:", error);
      });
  }
}

// Load content on page load
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("gender").innerText = capitalizeFirstLetter(gender);
  if (productType) {
    document.getElementById("productType").innerText =
      localStorage.getItem("productType");
    document.getElementById(
      "searchBar"
    ).placeholder = `Search for ${localStorage.getItem("productType")} ...`;
  }
  loadProducts();
  updateCartCount();
});

function capitalizeFirstLetter(string) {
  if (string.length === 0) return string; // Handle empty strings
  return string.charAt(0).toUpperCase() + string.slice(1);
}

// Wait for the authentication state to be confirmed
onAuthStateChanged(auth, async (user) => {
  if (user) {
    // User is signed in, set userId
    userId = user.uid;
    await updateCartCountInHeader(); // Update the cart count once the user is authenticated
  } else {
    // No user is signed in
    console.log("No user is signed in.");
  }
});

// Fetch cart items from Firebase
async function fetchCartItems() {
  try {
    console.log(userId);
    const cartRef = ref(database, `cart/${userId}/${gender}`);
    const snapshot = await get(cartRef);
    if (snapshot.exists()) {
      return snapshot.val(); // The cart data will be in a nested structure
    }
    return {}; // Return empty if no cart data is found
  } catch (error) {
    console.error("Error fetching cart items from Firebase:", error);
    return {};
  }
}

// Function to update the cart count (counting all items in the cart)
async function updateCartCountInHeader() {
  // Get the cart items data
  const cartItems = await fetchCartItems();

  let totalItems = cartItems.length; // Initialize total item counter

  console.log(cartItems);

  // Update the cart count on the page
  const cartCountElement = document.getElementById("cartCount");
  if (cartCountElement) {
    cartCountElement.textContent = totalItems;
  }

  // Save cart count explicitly to localStorage (if needed)
  localStorage.setItem("cartCount", totalItems);
}

document.addEventListener("DOMContentLoaded", () => {
  // Select all the category links by class name
  const categoryLinks = document.querySelectorAll(".category-link");

  // Use forEach to loop through the NodeList of links
  categoryLinks.forEach((link) => {
    // Attach an event listener for each link
    link.addEventListener("click", (e) => {
      // Prevent the default behavior of the link
      e.preventDefault();

      // Get the target URL from the data attribute (data-target)
      const targetCategory = link.getAttribute("data-target");
      localStorage.setItem("gender", targetCategory);
      // Redirect to the target URL
      window.location.href = "/pages/html/categories.html";
    });
  });
});
