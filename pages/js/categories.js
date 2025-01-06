import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import {
  getDatabase,
  ref,
  get,
  set,
  remove,
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
const db = getDatabase(app);
let gender = localStorage.getItem("gender");

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("pageTitle").innerText =
    capitalizeFirstLetter(gender);
  const menRef = ref(db, `categories/${gender}`);
  const container = document.getElementById("categories-container");

  if (!container) {
    console.error("Container element not found.");
    return;
  }

  // Fetch the data for "men"
  get(menRef)
    .then((snapshot) => {
      if (snapshot.exists()) {
        const menData = snapshot.val();
        console.log(menData); // Display the fetched data in the console

        // Loop through the fetched data and create HTML for each item
        menData.forEach((item) => {
          // Create a new div element for each category card
          const categoryCard = document.createElement("div");
          categoryCard.classList.add("category-card");

          // Create the inner HTML structure for the category card
          categoryCard.innerHTML = `
          <img src="${item.img}" alt="${item.alt}">
          <h2>${item.heading}</h2>
          <p>${item.description}</p>
          <button>Shop Now</button>
        `;

          // Append the new card to the container
          container.appendChild(categoryCard);
          categoryCard.querySelector("button").addEventListener("click", () => {
            localStorage.setItem("productType", item.heading);
            window.location.href = "/pages/html/products.html";
          });
        });
      } else {
        console.log("No data available for men.");
      }
    })
    .catch((error) => {
      console.error("Error fetching data: ", error);
    });
});

function capitalizeFirstLetter(string) {
  if (string.length === 0) return string; // Handle empty strings
  return string.charAt(0).toUpperCase() + string.slice(1);
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
