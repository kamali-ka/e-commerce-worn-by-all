import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";

// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyAnKtlrGE7lMKtHhjQyzfElqCkI2bupWzs",
  authDomain: "wornbyall-926f5.firebaseapp.com",
  projectId: "wornbyall-926f5",
  storageBucket: "wornbyall-926f5.appspot.com",
  messagingSenderId: "770771226995",
  appId: "1:770771226995:web:15636d6b9e17d27611b506",
  measurementId: "G-B6PER21YN1"
};

// Initialize Firebase App
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

document.addEventListener("DOMContentLoaded", function () {
  const overlay = document.getElementById("modal-overlay");

  // Modal function with redirection
  function showModal(message, redirect = null) {
    const modal = document.getElementById("popup-modal");
    const modalMessage = document.getElementById("popup-message");
    const okButton = document.getElementById("popup-ok-button");

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

  // Hide modal when overlay is clicked
  overlay.onclick = function () {
    const modal = document.getElementById("popup-modal");
    modal.style.display = "none";
    overlay.style.display = "none";
  };

  // Password visibility toggle
  window.togglePasswordVisibility = function (inputId, eyeId) {
    const passwordField = document.getElementById(inputId);
    const eyeIcon = document.getElementById(eyeId);

    if (passwordField.type === "password") {
      passwordField.type = "text";
      eyeIcon.innerHTML = "<i class='fa fa-eye'></i>";
    } else {
      passwordField.type = "password";
      eyeIcon.innerHTML = "<i class='fa fa-eye-slash'></i>";
    }
  };

  // Toggle between Sign-Up and Login forms
  window.toggleForms = function () {
    const signupForm = document.getElementById("signup-form");
    const loginForm = document.getElementById("login-form");

    if (signupForm.style.display === "none") {
      signupForm.style.display = "block";
      loginForm.style.display = "none";
    } else {
      signupForm.style.display = "none";
      loginForm.style.display = "block";
    }
  };

  // Handle Sign-Up
  window.handleSignup = async function () {
    // Clear error messages
    document.getElementById("username-error").textContent = "";
    document.getElementById("email-error").textContent = "";
    document.getElementById("password-error").textContent = "";
    document.getElementById("confirm-password-error").textContent = "";

    // Get values
    const username = document.getElementById("signup-username").value.trim();
    const email = document.getElementById("signup-email").value.trim();
    const password = document.getElementById("signup-password").value;
    const confirmPassword = document.getElementById("signup-confirm-password").value;

    // Validation
    let isValid = true;

    if (username === "") {
      document.getElementById("username-error").textContent = "Username is required.";
      isValid = false;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      document.getElementById("email-error").textContent = "Invalid email format.";
      isValid = false;
    }

    if (password.length < 6) {
      document.getElementById("password-error").textContent = "Password must be at least 6 characters.";
      isValid = false;
    }

    if (password !== confirmPassword) {
      document.getElementById("confirm-password-error").textContent = "Passwords do not match.";
      isValid = false;
    }

    if (isValid) {
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        showModal("Sign-up successful! Redirecting to home page...", "../../index.html");
      } catch (error) {
        console.error("Error during sign-up:", error);
        showModal(`Error during sign-up: ${error.message}`);
      }
    }
  };

  // Handle Login
  window.handleLogin = async function () {
    // Clear error messages
    document.getElementById("login-email-error").textContent = "";
    document.getElementById("login-general-error").textContent = "";

    // Get values
    const email = document.getElementById("login-email").value.trim();
    const password = document.getElementById("login-password").value;

    // Validation
    let isValid = true;

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      document.getElementById("login-email-error").textContent = "Invalid email format.";
      isValid = false;
    }

    if (password === "") {
      document.getElementById("login-general-error").textContent = "Password is required.";
      isValid = false;
    }

    if (isValid) {
      try {
        await signInWithEmailAndPassword(auth, email, password);
        showModal("Login successful! Redirecting to home page...", "/index.html");
      } catch (error) {
        console.error("Error during login:", error);
        showModal("Invalid email or password.");
      }
    }
  };

  // Check Auth State
  onAuthStateChanged(auth, (user) => {
    if (user) {
      console.log("User is signed in:", user);
    } else {
      console.log("No user is signed in.");
    }
  });
});
