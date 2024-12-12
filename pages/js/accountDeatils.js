import {
  getAuth,
  signOut,
} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";

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
const auth = getAuth(app); // Initialize Firebase Auth

document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("accountForm");
  const nameInput = document.getElementById("name");
  const emailInput = document.getElementById("email");
  const phoneInput = document.getElementById("phone");
  const profilePlaceholder = document.getElementById("profile-placeholder");
  const popupMessage = document.getElementById("popupMessage");
  const logoutButton = document.getElementById("logoutButton");

  const currentUserEmail = localStorage.getItem("email");
  const currentUserName = localStorage.getItem("username");

  // Redirect to login page if no user is logged in
  if (!currentUserEmail) {
    window.location.href = "../html/signup-signin.html";
    return; // Prevent further execution if redirected
  }

  // Display user data
  function loadProfileData() {
    emailInput.value = currentUserEmail;

    const userName = currentUserName || "";
    const phone = localStorage.getItem(getUserKey("phone")) || "";

    nameInput.value = userName;
    phoneInput.value = phone;

    profilePlaceholder.textContent = userName
      ? userName.charAt(0).toUpperCase()
      : "A";

    document.getElementById("profile-username").textContent =
      userName || "Not provided";
    document.getElementById("profile-email").textContent =
      currentUserEmail || "Not provided";
    document.getElementById("profile-phone").textContent =
      phone || "Not provided";
  }

  function getUserKey(field) {
    return `${field}_${currentUserEmail}`;
  }

  // Form submit event to save the user's data
  form.addEventListener("submit", function (event) {
    event.preventDefault();

    const userName = nameInput.value.trim();
    const email = emailInput.value.trim();
    const phone = phoneInput.value.trim();

    // Save profile data to localStorage
    localStorage.setItem("username", userName);
    localStorage.setItem(getUserKey("phone"), phone);

    // Update UI
    profilePlaceholder.textContent = userName
      ? userName.charAt(0).toUpperCase()
      : "A";

    document.getElementById("profile-username").textContent =
      userName || "Not provided";
    document.getElementById("profile-email").textContent =
      email || "Not provided";
    document.getElementById("profile-phone").textContent =
      phone || "Not provided";

    // Show confirmation popup
    showPopup("Profile details saved successfully!", "success");
  });

  // Logout button event
  logoutButton.addEventListener("click", function () {
    // Clear user-specific data from localStorage
    localStorage.removeItem("email");
    localStorage.removeItem("username");
    localStorage.removeItem(getUserKey("name"));
    localStorage.removeItem(getUserKey("phone"));

    // Firebase logout
    const auth = getAuth(); // Ensure auth is properly initialized
    signOut(auth)
      .then(() => {
        // Redirect to login page after sign-out
        window.location.href = "../html/signup-signin.html";
      })
      .catch((error) => {
        console.error("Error during logout:", error);
      });
  });

  function showPopup(message, type) {
    popupMessage.textContent = message;
    popupMessage.className = `popup-message ${type}`;
    popupMessage.classList.add("show");

    setTimeout(() => {
      popupMessage.classList.remove("show");
    }, 3000);
  }

  // Load profile data on page load
  loadProfileData();
});
// Handle Logout with Confirmation
const logoutButton = document.getElementById("logout-button");
if (logoutButton) {
  logoutButton.addEventListener("click", function () {
    // Show confirmation dialog
    const userConfirmed = window.confirm("Do you want to log out?");

    if (userConfirmed) {
      // Proceed with logout if user confirms
      signOut(auth)
        .then(() => {
          // Clear localStorage and logout user
          localStorage.clear();

          // Show a success message using your modal
          showModal(
            "Successfully logged out! Redirecting to login page...",
            "../../pages/html/signup-signin.html"
          );
        })
        .catch((error) => {
          console.error("Logout error:", error.message);
        });
    } else {
      // Do nothing if user cancels the logout
      console.log("Logout cancelled.");
    }
  });
} else {
  console.warn("Logout button not found.");
}
