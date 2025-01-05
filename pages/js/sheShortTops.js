import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";
import { getDatabase, ref, get } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-database.js";

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


// Loader functions
function showLoader() {
  document.getElementById("loader").style.display = "flex";
}

function hideLoader() {
  document.getElementById("loader").style.display = "none";
}

// Function to load Chudithars from JSON file
async function loadShortTops() {
    try {
      showLoader();
       const dbRef = ref(database, "she-page"); // Reference to your data in Firebase
          const snapshot = await get(dbRef);
      
          if (!snapshot.exists()) {
            throw new Error("No products found in the database.");
          }
      
          const products = snapshot.val(); // Get the products array

      const productGrid = document.getElementById("productGrid");
      if (!productGrid) {
        console.error("Product grid element not found!");
        return;
      }
      productGrid.innerHTML = ""; // Clear existing products
  
      // Filter and display Short Tops
      const shortTopProducts = products.filter(
        (product) => product.type=== "Short tops"
      );
  
      if (shortTopProducts.length === 0) {
        productGrid.textContent = "No Short Tops found!";
        return;
      }
  
      shortTopProducts.forEach((product) => {
        const productCard = document.createElement("div");
        productCard.classList.add("product-card");
        productCard.setAttribute("data-type", product.type);
  
        // Create a link for the product card
        const productLink = document.createElement("a");
        productLink.href = `../html/productDetails.html?id=${product.id}`;
        productLink.style.textDecoration = "none"; // Remove the default link underline
  
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
  
        // Check if the product is already in the cart
        const cart = JSON.parse(localStorage.getItem("cart")) || [];
        const existingItem = cart.find((item) => item.name === product.name);
  
        if (existingItem) {
          addButton.textContent = "Visit Cart"; // Change to 'Visit Cart' if the item is in the cart
          addButton.onclick = () => navigateToCart(); // Navigate to the cart
        } else {
          addButton.textContent = "Add to Cart";
          addButton.onclick = () => addToCart(product); // Add to cart
        }
  
        // Append product details to the link
        productLink.appendChild(productImage);
        productLink.appendChild(productName);
        productLink.appendChild(productPrice);
  
        // Append the link and add button to the product card
        productCard.appendChild(productLink);
        productCard.appendChild(addButton);
  
        productGrid.appendChild(productCard);
      });
    } catch (error) {
      console.error("Error loading Short Tops:", error.message);
    }finally{
      hideLoader();
    }
  }
  // Load page content on DOMContentLoaded
document.addEventListener("DOMContentLoaded", () => {
  loadShortTops();
  updateCartCount();

  const popupContainer = document.getElementById("popupContainer");
  if (popupContainer) {
    popupContainer.classList.remove("show");
  }
});
  // Load Short Tops on page load
  document.addEventListener("DOMContentLoaded", () => {
    loadShortTops();
    updateCartCount();
    const popupContainer = document.getElementById("popupContainer");
    popupContainer.classList.remove("show"); // Ensure the popup is hidden on page load
  });
  // Navigate to the cart page
function searchProducts() {
  const searchBarValue = document.getElementById("searchBar").value.toLowerCase();
  const products = document.querySelectorAll(".product-card");
  products.forEach((product) => {
    const productName = product.querySelector("h2").textContent.toLowerCase();
    product.style.display = productName.includes(searchBarValue) ? "block" : "none";
  });
}


// Add event listener to the search bar to trigger search when typing
document.getElementById("searchBar").addEventListener("input", searchProducts);

// Add product to the cart
function addToCart(item) {
  const user = auth.currentUser;
  console.log("Checking user state in addToCart:", user);

  if (user) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    const existingItemIndex = cart.findIndex(
      (cartItem) => cartItem.id === item.id
    );

    if (existingItemIndex > -1) {
      cart[existingItemIndex].quantity += 1;
    } else {
      cart.push({ ...item, quantity: 1 });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartCount();
    showPopup("Item added to cart successfully!");
  } else {
    console.log("User is not signed in. Redirecting...");

    const currentURL = window.location.href;
    const itemToStore = JSON.stringify(item);

    // Store current URL and item to add after login
    localStorage.setItem("redirectAfterLogin", currentURL);
    localStorage.setItem("itemToAdd", itemToStore);

    if (!currentURL.includes("signup-signin.html")) {
      window.location.href = "../html/signup-signin.html";
    }
  }
}

async function handlePostLoginRedirect() {
  const redirectURL = localStorage.getItem("redirectAfterLogin");
  const itemToAdd = localStorage.getItem("itemToAdd");

  if (redirectURL && itemToAdd) {
    const parsedItem = JSON.parse(itemToAdd);
    
    // Add item to cart first
    addToCart(parsedItem);

    // Clear stored data
    localStorage.removeItem("redirectAfterLogin");
    localStorage.removeItem("itemToAdd");

    // Redirect to the previous page
    window.location.href = redirectURL || "../../index.html";  // Use stored URL, fallback to default
  }
}

// Listen for Authentication State Changes
onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log("User signed in:", user);
    // Add the item to cart and redirect immediately
    handlePostLoginRedirect();
  } else {
    console.log("No user signed in.");
  }
});

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
  }, 1500);
}

// Update cart count
// Function to update the cart count (counting unique products)
function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  
  // Get the number of unique products in the cart
  const totalProducts = cart.length;

  const cartCountElement = document.getElementById("cartCount");
  if (cartCountElement) {
    cartCountElement.textContent = totalProducts;
  }

  // Save cart count explicitly to localStorage (if needed)
  localStorage.setItem("cartCount", totalProducts);
}


// Function to get URL parameters
function getQueryParam(param) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}

// Load product details from URL parameter
function loadProductDetails() {
  const productId = getQueryParam("id");
  const productDetailsElement = document.getElementById("productDetails");
  if (!productDetailsElement) {
    document.getElementById("productDetails").textContent =
      "Element with ID 'productDetails' not found.";
    return;
  }
  if(!productId){
    productDetailsElement.textContent = "Product ID not found!";
   return;  
}

 
   fetch("/pages/js/public/she-page.json")
     .then((response) => response.json())
     .then((data) => {
       const product = data.find((p) => p.id === productId);
       if (product) {
         document.getElementById("productImage").src =
           product.image || "default-image.jpg";
         document.getElementById("productName").textContent =
           product.name || "Unnamed Product";
         document.getElementById("productPrice").textContent = `₹${
           product.price || "Price not available"
         }`;
         document.getElementById("productRatings").textContent = `Rating: ${
           product.rating || "N/A"
         }`;
         document.getElementById("productDescription").textContent =
           product.description || "No description available.";
 
         const addToCartButton = document.createElement("button");
         addToCartButton.textContent = "Add to Cart";
 
         onAuthStateChanged(auth, (user) => {
           if (user) {
             addToCartButton.onclick = () => addToCart(product);
           } else {
             addToCartButton.onclick = () =>
               (window.location.href = "../html/signup-signin.html");
           }
         });
 
         productDetailsElement.appendChild(addToCartButton);
       } else {
         productDetailsElement.textContent = "Product not found!";
       }
     })
     .catch((error) => {
       console.error("Error fetching product details:", error);
       productDetailsElement.textContent = "Failed to load product details.";
     });
 }
// Toggle sidebar visibility
document.getElementById("toggleSidebar").addEventListener("click", () => {
  const sidebar = document.getElementById("sidebar");
  sidebar.classList.toggle("visible"); // Toggle 'visible' class to show/hide sidebar
});
function navigateToCart() {
  window.location.href = "../html/cartPage.html";
}
const response = await fetch("/pages/js/public/she-page.json").then(res=>res.json('she-page')).then(data=>data);
console.log(response)