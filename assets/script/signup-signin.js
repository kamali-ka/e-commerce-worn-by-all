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

  // Helper: Validate Email with Rules
  function validateEmail(email) {
    // General Email Regex
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
  
    // Special Character Regex
    const specialCharRegex = /[!#$%&'*+/=?^_`{|}~.-]/g;
    const specialCharCount = (email.match(specialCharRegex) || []).length;
  
    // Split email into local part and domain part
    const [localPart, domain] = email.split("@");
  
    // Local part RFC compliance check
    const localPartRegex = /^(?!\.)[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*(?<!\.)$/;
  
    // Validate the domain part format
    const domainRegex = /^[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
  
    // Validate conditions
    return (
      emailRegex.test(email) &&
      specialCharCount <= 2 &&
      localPartRegex.test(localPart) &&
      domainRegex.test(domain)
    );
  }
  
  // Integration into Sign-Up and Login
  window.handleSignup = async function () {
    try {
      const email = document.getElementById("signup-email").value.trim();
  
      // Validate Email
      if (!validateEmail(email)) {
        document.getElementById("email-error").textContent =
          "Invalid email format. Ensure it meets the required standards.";
        return;
      } else {
        document.getElementById("email-error").textContent = "";
      }
  
      // Proceed with existing sign-up logic...
      const password = document.getElementById("signup-password").value;
      // Other validations and user creation flow...
    } catch (error) {
      console.error("Sign-up error:", error.message);
    }
  };
  
  window.handleLogin = async function () {
    try {
      const email = document.getElementById("login-email").value.trim();
  
      // Validate Email
      if (!validateEmail(email)) {
        document.getElementById("login-email-error").textContent =
          "Invalid email format.";
        return;
      } else {
        document.getElementById("login-email-error").textContent = "";
      }
  
      // Proceed with existing login logic...
      const password = document.getElementById("login-password").value;
      // Other validations and login flow...
    } catch (error) {
      console.error("Login error:", error.message);
    }
  };
  

  // Handle Sign-Up
  // Handle Sign-Up
window.handleSignup = async function () {
  try {
    const username = document.getElementById("signup-username").value.trim();
    const email = document.getElementById("signup-email").value.trim();
    const password = document.getElementById("signup-password").value;
    const confirmPassword = document.getElementById(
      "signup-confirm-password"
    ).value;

    // Validate Username
    const usernameRegex = /^(?=.*[a-zA-Z])[a-zA-Z0-9@.\-_']+$/;
    if (!username) {
      document.getElementById("username-error").textContent =
        "Username is required.";
      return;
    } else if (!usernameRegex.test(username)) {
      document.getElementById("username-error").textContent =
        "Username must contain at least one letter and can include letters, numbers, and @, ., -, _, or ' characters.";
      return;
    } else {
      document.getElementById("username-error").textContent = "";
    }

    // Validate Email
    const emailRegex =
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    const specialCharRegex = /[!#$%&'*+/=?^_`{|}~.-]/g;
    const specialCharCount = (email.match(specialCharRegex) || []).length;
    if (!emailRegex.test(email) || specialCharCount > 2) {
      document.getElementById("email-error").textContent =
        "Invalid email format or too many special characters.";
      return;
    } else {
      document.getElementById("email-error").textContent = "";
    }

    // Validate Password
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
    if (!passwordRegex.test(password)) {
      document.getElementById("password-error").textContent =
        "Password must be at least 6 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character.";
      return;
    }

    const onlyLettersRegex = /^[a-zA-Z]+$/;
    const onlyNumbersRegex = /^\d+$/;
    const onlySpecialCharsRegex = /^[!@#$%^&*(),.?":{}|<>]+$/;

    if (
      onlyLettersRegex.test(password) ||
      onlyNumbersRegex.test(password) ||
      onlySpecialCharsRegex.test(password)
    ) {
      document.getElementById("password-error").textContent =
        "Password cannot consist of only letters, only numbers, or only special characters.";
      return;
    } else {
      document.getElementById("password-error").textContent = "";
    }

    // Confirm Password Match
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
     null
    
    );
    window.location.href='../../index.html';
    
  
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

      // Validate Email
      if (!validateEmail(email)) {
        document.getElementById("login-email-error").textContent =
          "Invalid email format.";
        return;
      } else {
        document.getElementById("login-email-error").textContent = "";
      }

      // Validate Password
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

      // Redirect to account details page
      // showModal(
      //   "Login successful! Redirecting to account details page...",
      //   "../../index.html"
      // );
      window.location.href='../../index.html';
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
// After successful sign-up or sign-in
function onAuthenticationSuccess() {
  // Retrieve the stored URL
  const redirectUrl = localStorage.getItem('redirectAfterLogin');
  if (redirectUrl) {
    // Clear the stored URL
    localStorage.removeItem('redirectAfterLogin');
    // Redirect to the original page
    window.location.href = redirectUrl;
  } else {
    // Fallback: Redirect to a default page
    window.location.href = 'default_page.html';
  }
}

  // Check Auth State
  onAuthStateChanged(auth, (user) => {
    if (user) {
      const username =
        localStorage.getItem("username") || user.email.split("@")[0];
      const email = user.email;
      const phone = localStorage.getItem("phone");
      window.location.href = localStorage.getItem("redirectAfterLogin");

      document.getElementById("profile-username").textContent = username;
      document.getElementById("profile-email").textContent = email;
      document.getElementById("profile-phone").textContent =
        phone || "Not provided";
    } else {
      console.log("No user is signed in.");
    }
  });
});