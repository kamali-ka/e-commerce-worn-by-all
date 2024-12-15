import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import {
  getAuth,
  signOut,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";

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

// Wait for DOM to load
document.addEventListener("DOMContentLoaded", function () {
  const overlay = document.getElementById("modal-overlay");

  // Helper Function: Show Modal
  function showModal(message, redirect = null) {
    const modal = document.getElementById("popup-modal");
    const modalMessage = document.getElementById("popup-message");
    const okButton = document.getElementById("popup-ok-button");

    if (!modal || !overlay) {
      console.error("Modal elements not found in the DOM.");
      return;
    }

    modalMessage.textContent = message;
    modal.style.display = "block";
    overlay.style.display = "block";

    okButton.onclick = function () {
      modal.style.display = "none";
      overlay.style.display = "none";
      if (redirect) {
        window.location.href = redirect;
      }
    };
  }

  // Hide Modal on Overlay Click
  if (overlay) {
    overlay.onclick = function () {
      const modal = document.getElementById("popup-modal");
      if (modal) {
        modal.style.display = "none";
        overlay.style.display = "none";
      }
    };
  }

  // Password Visibility Toggle
  window.togglePasswordVisibility = function (inputId, eyeId) {
    const passwordField = document.getElementById(inputId);
    const eyeIcon = document.getElementById(eyeId);

    if (passwordField && eyeIcon) {
      if (passwordField.type === "password") {
        passwordField.type = "text";
        eyeIcon.innerHTML = "<i class='fa fa-eye'></i>";
      } else {
        passwordField.type = "password";
        eyeIcon.innerHTML = "<i class='fa fa-eye-slash'></i>";
      }
    } else {
      console.error("Password field or eye icon not found.");
    }
  };

  // Form Toggle Between Sign-Up and Login
  window.toggleForms = function () {
    const signupForm = document.getElementById("signup-form");
    const loginForm = document.getElementById("login-form");

    if (signupForm && loginForm) {
      if (signupForm.style.display === "none") {
        signupForm.style.display = "block";
        loginForm.style.display = "none";
      } else {
        signupForm.style.display = "none";
        loginForm.style.display = "block";
      }
    } else {
      console.error("Sign-up or Login form not found.");
    }
  };

  // Handle Sign-Up
  window.handleSignup = async function () {
    try {
      const username = document.getElementById("signup-username").value.trim();
      const email = document.getElementById("signup-email").value.trim();
      const password = document.getElementById("signup-password").value;
      const confirmPassword = document.getElementById(
        "signup-confirm-password"
      ).value;

      // Basic Validation
      if (!username) {
        document.getElementById("username-error").textContent =
          "Username is required.";
        return;
      } else {
        document.getElementById("username-error").textContent = "";
      }

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        document.getElementById("email-error").textContent =
          "Invalid email format.";
        return;
      } else {
        document.getElementById("email-error").textContent = "";
      }

      if (password.length < 6) {
        document.getElementById("password-error").textContent =
          "Password must be at least 6 characters.";
        return;
      } else {
        document.getElementById("password-error").textContent = "";
      }

      if (password !== confirmPassword) {
        document.getElementById("confirm-password-error").textContent =
          "Passwords do not match.";
        return;
      } else {
        document.getElementById("confirm-password-error").textContent = "";
      }

      // Create User
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      localStorage.setItem("username", username);
      localStorage.setItem("email", email);
      showModal(
        "Sign-up successful! Redirecting to account details page...",
        "../html/accountDetails.html"
      );
    } catch (error) {
      console.error("Sign-up error:", error.message);
      showModal(`Error during sign-up: ${error.message}`);
    }
  };

  // Handle Login
  window.handleLogin = async function () {
    try {
      const email = document.getElementById("login-email").value.trim();
      const password = document.getElementById("login-password").value;

      // Basic Validation
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        document.getElementById("login-email-error").textContent =
          "Invalid email format.";
        return;
      } else {
        document.getElementById("login-email-error").textContent = "";
      }

      if (!password) {
        document.getElementById("login-general-error").textContent =
          "Password is required.";
        return;
      } else {
        document.getElementById("login-general-error").textContent = "";
      }

      // Sign In User
      await signInWithEmailAndPassword(auth, email, password);
      localStorage.setItem("email", email);

      // Fetch or set username
      let userName = localStorage.getItem("username");
      if (!userName) {
        userName = email.split("@")[0]; // Default to email prefix if username not set
        localStorage.setItem("username", userName);
      }

      // Redirect to account details page after successful login
      showModal(
        "Login successful! Redirecting to account details page...",
        "../html/accountDetails.html"
      );
    } catch (error) {
      console.error("Login error:", error.message);
      showModal("Invalid email or password.");
    }
  };

  // Handle Logout
  const logoutButton = document.getElementById("logoutButton");
  if (logoutButton) {
    logoutButton.addEventListener("click", function () {
      signOut(auth)
        .then(() => {
          // Clear localStorage and logout user
          localStorage.clear();
          showModal(
            "Logged out successfully! Redirecting to login page...",
            "../../index.html"
          );
        })
        .catch((error) => {
          console.error("Logout error:", error.message);
        });
    });
  } else {
    console.warn("Logout button not found.");
  }

  // Check Auth State
  onAuthStateChanged(auth, (user) => {
    if (user) {
      console.log("User is signed in:", user);
      // Fetch user details and update the UI accordingly
      const username =
        localStorage.getItem("username") || user.email.split("@")[0];
      const email = user.email;
      const phone = localStorage.getItem("phone");
      window.location.href = "../../index.html";
      // Assuming you have elements with the following ids in your account details page:
      document.getElementById("profile-username").textContent = username;
      document.getElementById("profile-email").textContent = email;
      document.getElementById("profile-phone").textContent =
        phone || "Not provided";
    } else {
      console.log("No user is signed in.");
    }
  });
});
