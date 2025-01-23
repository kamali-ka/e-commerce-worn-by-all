import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import {
  getDatabase,
  ref,
  get,
} from "https://www.gstatic.com/firebasejs/11.0.2/firebase-database.js";
const orders = [];

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
const database = getDatabase(app); // Initialize Realtime Database

const orderPageRef = ref(database, "orders");
const totalPrice = document.getElementById("total-price");

// Fetch order data
get(orderPageRef)
  .then((snapshot) => {
    if (!snapshot.exists()) {
      throw new Error("No orders found in the database.");
    }

    // Ensure the data is an array (fallback to empty array if not)
    const orders = Object.values(snapshot.val());

    const selectedOrderId = getQueryParam("id");

    // if (!selectedOrderId) {
    //   displayErrorMessage(
    //     "Order details not found. Please go back to the orders list."
    //   );
    //   return;
    // }

    // Find the specific order by ID

    let foundOrder = null;

    // Iterate through all entries
    for (const group of orders) {
      if (group[selectedOrderId]) {
        foundOrder = group[selectedOrderId];
        break;
      }
    }

    // const order = orders[0][selectedOrderId];

    // if (!order) {
    //   displayErrorMessage(
    //     "Order details not found. Please go back to the orders list."
    //   );
    //   return;
    // }

    // Display the order details
    loadOrders(foundOrder);
  })
  .catch((error) => {
    console.error("Error fetching order data:", error);
  });

function getQueryParam(param) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}
document.addEventListener("DOMContentLoaded", () => {
  const continueShoppingButton = document.querySelector(".continue-shopping");

  if (continueShoppingButton) {
    continueShoppingButton.addEventListener("click", () => {
      // Redirect to the index page
      window.location.href = "/index.html"; // Update the path if necessary
    });
  }
});

// Function to load orders dynamically
function loadOrders(order) {
  console.log(order);

  const orderList = document.getElementById("order-list");
  orderList.innerHTML = ""; // Clear previous content

  let totalItems = 0;

  const productIds = order.productId.split(","); // Handle multiple product IDs
  totalItems = productIds.length;

  const orderItem = document.createElement("div");
  orderItem.classList.add("order-item");
  orderItem.dataset.id = order.orderId;

  const imageContainer = document.createElement("div");
  imageContainer.classList.add("image-container");

  // Fetch all products from local storage
  const allProducts = JSON.parse(localStorage.getItem("allProducts")) || [];

  // Loop through each product ID in the order
  for (const id of productIds) {
    // Find the product in allProducts
    const product = allProducts.find((prod) => prod.id === id);

    if (product) {
      // Create image element for each product
      const imageWrapper = document.createElement("div");
      imageWrapper.classList.add("product-image-wrapper");
      const imgElement = document.createElement("img");
      const deet = document.getElementById("userdetails");
      imgElement.src = product.image; // Assuming imageUrl is part of product data
      imgElement.alt = `Product ${id}`;
      imgElement.classList.add("product-image");

      // Add click event to redirect to product details page with product id
      imgElement.addEventListener("click", () => {
        window.location.href = `/pages/html/productDetails.html?id=${id}`;
      });

      imageWrapper.appendChild(imgElement);
      imageContainer.appendChild(imageWrapper);
    } else {
      console.warn(`Product with ID ${id} not found in local storage.`);
    }
  }

  totalPrice.innerHTML = `<p>Order Total:${order.price}</p>`;

  // Add order details
  orderItem.innerHTML += `
    <div class="item-info">
      <h5><strong>Name:</strong>${order.name}</h5>
      <p>Quantity: ${totalItems}</p>
    </div>
  `;

  // Append the image container and order details to the order item
  orderItem.prepend(imageContainer);
  orderList.appendChild(orderItem);

  // Update total items
  document.getElementById("total-items").textContent = totalItems;
}
