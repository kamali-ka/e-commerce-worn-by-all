import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";
import {
  getDatabase,
  ref,
  get,set,
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
const auth = getAuth(app);
const database = getDatabase(app); // Initialize Realtime Database
let gender = localStorage.getItem("gender");
let userId = null;

// Function to show the loader (spinner)
function showLoader() {
  document.getElementById("loader").style.display = "block";
}

// Function to hide the loader (spinner)
function hideLoader() {
  document.getElementById("loader").style.display = "none";
}

document.addEventListener("DOMContentLoaded", () => {
  showLoader();
  // Fetch data from Firebase Realtime Database
  const hePageRef = ref(database, "he-page");
  const shePageRef = ref(database, "she-page");
  const kidsPageRef = ref(database, "kids-page");
  const unisexPageRef = ref(database, "unisex-page");

  // Fetch data for all pages
  Promise.all([
    get(hePageRef),
    get(shePageRef),
    get(kidsPageRef),
    get(unisexPageRef),
  ])
    .then(([snapshotHe, snapshotShe, snapshotKids, snapshotUnisex]) => {
      hideLoader();
      if (
        !snapshotHe.exists() ||
        !snapshotShe.exists() ||
        !snapshotKids.exists() ||
        !snapshotUnisex.exists()
      ) {
        throw new Error("One or more database snapshots are empty.");
      }

      // Ensure the data is an array (fallback to empty array if not)
      const productsHe = Array.isArray(snapshotHe.val())
        ? snapshotHe.val()
        : [];
      const productsShe = Array.isArray(snapshotShe.val())
        ? snapshotShe.val()
        : [];
      const productsKids = Array.isArray(snapshotKids.val())
        ? snapshotKids.val()
        : [];
      const productsUnisex = Array.isArray(snapshotUnisex.val())
        ? snapshotUnisex.val()
        : [];

      // Combine all products into one array
      const allProducts = [
        ...productsHe,
        ...productsShe,
        ...productsKids,
        ...productsUnisex,
      ];

      localStorage.setItem("allProducts", JSON.stringify(allProducts));
      const selectedProductId = getQueryParam("id");

      if (!selectedProductId) {
        displayErrorMessage(
          "Product details not found. Please go back to the product list."
        );
        return;
      }

      // Find the product from the combined array of all products
      const product = allProducts.find((item) => item.id === selectedProductId);

      if (!product) {
        displayErrorMessage(
          "Product details not found. Please go back to the product list."
        );
        return;
      }

      // Display the product details
      displayProductDetails(product);
    })
    .catch((error) => {
      hideLoader();

      console.error("Error fetching product data:", error);
      displayErrorMessage(
        `Failed to load product details. Error: ${error.message}`
      );
    });

  function displayErrorMessage(message) {
    document.getElementById("product-details").innerHTML = `<p>${message}</p>`;
  }

  // Function to get query parameter (product ID)
  function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
  }

  // Function to display product details
  function displayProductDetails(product) {
    // Set product details in the HTML
    document.getElementById("productImage").src =
      product.image || "placeholder.jpg";
    document.getElementById("productName").textContent =
      product.name || "Unnamed Product";
    document.getElementById("productPrice").textContent = product.price
      ? `₹${product.price}`
      : "Price not available";
    displayRating(product.rating || 0); // Display rating stars
    document.getElementById("productDescription").textContent =
      product.description || "No description available.";

    // Display stock status
    displayStockStatus(product.stock);

    // Display size options
    displayProductSizes(product.sizes); // Call the function to display sizes

    // Disable "Buy Now" button initially
    const buyNowButton = document.getElementById("buyNowButton");
    if (buyNowButton) {
      buyNowButton.disabled = true; // Disable "Buy Now" button
    }

    // Check if the product is already in the cart
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    const productInCart = cart.find((item) => item.id === product.id);

    const addToCartButton = document.getElementById("addToCartButton");

    if (productInCart) {
      addToCartButton.textContent = "Visit Cart";
      addToCartButton.onclick = () => {
        window.location.href = "../html/cartPage.html"; // Redirect to cart page
      };
    } else {
      addToCartButton.addEventListener("click", () =>
        addToCart(product, addToCartButton)
      );
    }

    if (buyNowButton) {
      buyNowButton.addEventListener("click", () => showBuyNowPopup());
    }
  }

  // Function to handle size selection
  function selectSize(button, size) {
    // Remove the 'selected' class from all size buttons
    const allSizeButtons = document.querySelectorAll(".size-options button");
    allSizeButtons.forEach((btn) => btn.classList.remove("selected"));

    // Add the 'selected' class to the clicked size button
    button.classList.add("selected");

    // Store the selected size in localStorage
    localStorage.setItem("selectedSize", size);

    // Optionally enable the Buy Now button when size is selected
    const buyNowButton = document.getElementById("buyNowButton");
    buyNowButton.disabled = false; // Enable "Buy Now" button when size is selected

    // Optionally enable the Add to Cart button when size is selected
    const addToCartButton = document.getElementById("addToCartButton");
    addToCartButton.disabled = !size; // Disable Add to Cart if no size is selected
  }

  // Function to display stock status
  function displayStockStatus(stock) {
    const stockStatusElement = document.getElementById("stockStatus");
    if (stockStatusElement) {
      stockStatusElement.textContent = `Stock Available: ${stock} items`;

      // Check stock quantity
      if (stock < 10) {
        stockStatusElement.style.color = "red"; // Change color to red if stock is less than 10
      } else {
        stockStatusElement.style.color = "green"; // Set to green if stock is sufficient
      }
    }
  }

  // Function to display size options
  function displayProductSizes(sizes) {
    const sizeOptionsContainer = document.getElementById("sizeOptions");
    sizeOptionsContainer.innerHTML = ""; // Clear any existing options

    sizes.forEach((size) => {
      const sizeButton = document.createElement("button");
      sizeButton.textContent = size;
      sizeButton.onclick = () => selectSize(sizeButton, size);
      sizeOptionsContainer.appendChild(sizeButton);
    });
  }

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

  // Function to display the star rating
  function displayRating(rating) {
    const starContainer = document.getElementById("productRatings");
    const totalStars = 5;

    const fullStars = Math.floor(rating); // Full stars
    const halfStars = rating % 1 !== 0 ? 1 : 0; // Half stars
    const emptyStars = totalStars - fullStars - halfStars; // Empty stars

    let starsHtml = "";

    // Add full stars
    for (let i = 0; i < fullStars; i++) {
      starsHtml += '<i class="fa-solid fa-star"></i>';
    }

    // Add half star
    if (halfStars) {
      starsHtml += '<i class="fa-solid fa-star-half-alt"></i>';
    }

    // Add empty stars
    for (let i = 0; i < emptyStars; i++) {
      starsHtml += '<i class="fa-regular fa-star"></i>';
    }

    starContainer.innerHTML = starsHtml;
  }

  // Initialize cart count on page load
  updateCartCount();
});

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
      const cartData = snapshot.val();
      return cartData || {};  // Return the cart data or an empty object
    }
    return {};  // Return empty object if no cart data is found
  } catch (error) {
    console.error("Error fetching cart items from Firebase:", error);
    return {};
  }
}

async function updateCartCountInHeader() {
  const cartItems = await fetchCartItems();
  let totalItems = Object.keys(cartItems).length;  // Count the keys directly

  // Update the cart count in the DOM
  const cartCountElement = document.getElementById("cartCount");
  if (cartCountElement) {
    cartCountElement.textContent = totalItems;
  }

  // Save cart count to localStorage
  localStorage.setItem("cartCount", totalItems);
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