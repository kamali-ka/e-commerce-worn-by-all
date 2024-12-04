// Toggle between Sign Up and Login forms
function toggleForms() {
  const signupForm = document.getElementById("signup-form");
  const loginForm = document.getElementById("login-form");

  if (signupForm && loginForm) {
    signupForm.style.display = signupForm.style.display === "none" ? "block" : "none";
    loginForm.style.display = loginForm.style.display === "none" ? "block" : "none";
  }

  clearErrorMessages();
}

// Clear all error messages
function clearErrorMessages() {
  document.querySelectorAll(".error-message").forEach((element) => {
    element.innerText = "";
    element.style.display = "none";
  });
}

// Toggle password visibility
function togglePasswordVisibility(inputId, eyeIconId) {
  const input = document.getElementById(inputId);
  const eyeIcon = document.getElementById(eyeIconId).querySelector("i");

  if (input.type === "password") {
    input.type = "text";
    eyeIcon.classList.replace("fa-eye-slash", "fa-eye");
  } else {
    input.type = "password";
    eyeIcon.classList.replace("fa-eye", "fa-eye-slash");
  }
}

// Validation functions
// Real-time validation for all inputs
function setupRealTimeValidation() {
  document.getElementById("signup-username").addEventListener("input", (event) => {
    validateUsername(event.target.value);
  });

  document.getElementById("signup-email").addEventListener("input", (event) => {
    validateEmail(event.target.value);
  });

  document.getElementById("signup-password").addEventListener("input", (event) => {
    validatePassword(event.target.value);
  });

  document.getElementById("signup-confirm-password").addEventListener("input", (event) => {
    const password = document.getElementById("signup-password").value;
    validateConfirmPassword(password, event.target.value);
  });

  document.getElementById("login-email").addEventListener("input", (event) => {
    validateEmail(event.target.value);
  });

  document.getElementById("login-password").addEventListener("input", (event) => {
    const error = document.getElementById("password-error");
    if (event.target.value.trim() !== "") {
      error.innerText = "";
      error.style.display = "none";
    }
  });
}

// Call this function once the DOM content is loaded
document.addEventListener("DOMContentLoaded", setupRealTimeValidation);

// Validation functions
function validateUsername(username) {
  const error = document.getElementById("username-error");
  if (!username.trim()) {
    error.innerText = "Please enter a username.";
    error.style.display = "block";
    return false;
  }
  if (username.length < 4) {
    error.innerText = "Username must be at least 4 characters.";
    error.style.display = "block";
    return false;
  }
  if (!/^[A-Za-z]+$/.test(username)) {
    error.innerText = "Username must contain only letters.";
    error.style.display = "block";
    return false;
  }
  error.innerText = "";
  error.style.display = "none";
  return true;
}

function validateEmail(email) {
  const error = document.getElementById("email-error");
  if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
    error.innerText = "Invalid email address.";
    error.style.display = "block";
    return false;
  }
  error.innerText = "";
  error.style.display = "none";
  return true;
}
function validatePassword(password) {
  const error = document.getElementById("password-error");
  if (!password) {
    error.innerText = "Please enter a password.";
    error.style.display = "block";
    return false;
  }
  if (password.length < 8) {
    error.innerText = "Password must be at least 8 characters long.";
    error.style.display = "block";
    return false;
  }
  if (password.length > 30) {
    error.innerText = "Password must not exceed 30 characters.";
    error.style.display = "block";
    return false;
  }
  if (!/(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*])/.test(password)) {
    error.innerText = "Password must include uppercase, number, and special character.";
    error.style.display = "block";
    return false;
  }
  error.innerText = "";
  error.style.display = "none";
  return true;
}

function validateConfirmPassword(password, confirmPassword) {
  const error = document.getElementById("confirm-password-error");
  if (password !== confirmPassword) {
    error.innerText = "Passwords do not match.";
    error.style.display = "block";
    return false;
  }
  error.innerText = "";
  error.style.display = "none";
  return true;
}
// Sign Up
function signUp() {
  clearErrorMessages();

  const username = document.getElementById("signup-username").value.trim();
  const email = document.getElementById("signup-email").value.trim();
  const password = document.getElementById("signup-password").value.trim();
  const confirmPassword = document.getElementById("signup-confirm-password").value.trim();

  // Validate all fields
  const isUsernameValid = validateUsername(username);
  const isEmailValid = validateEmail(email);
  const isPasswordValid = validatePassword(password);
  const isConfirmPasswordValid = validateConfirmPassword(password, confirmPassword);

  // Only proceed if all validations pass
  if (isUsernameValid && isEmailValid && isPasswordValid && isConfirmPasswordValid) {
    localStorage.setItem("email", email);
    localStorage.setItem("password", password);
    showModal("Sign-up successful! Welcome!");
  }
}

// Login
function login() {
  clearErrorMessages();

  const email = document.getElementById("login-email").value.trim();
  const password = document.getElementById("login-password").value.trim();
  const errorElement = document.getElementById("login-general-error");

  console.log("Entered Email:", email);
  console.log("Entered Password:", password);

  const storedEmail = localStorage.getItem("email");
  const storedPassword = localStorage.getItem("password");

  console.log("Stored Email:", storedEmail);
  console.log("Stored Password:", storedPassword);

  if (!validateEmail(email)) {
    errorElement.innerText = "Invalid credentials";
    errorElement.style.display = "block";
    return;
  }

  if (!password) {
    errorElement.innerText = "Please enter your password.";
    errorElement.style.display = "block";
    return;
  }

  if (email !== storedEmail || password !== storedPassword) {
    errorElement.innerText = "Invalid credentials. Please check your email or password.";
    errorElement.style.display = "block";
    return;
  }

  showModal("Welcome back! Login successful!");
}


// Show modal
function showModal(message) {
  const modal = document.getElementById("success-modal");
  const modalMessage = document.getElementById("modal-message");

  modalMessage.innerText = message;
  modal.style.display = "flex";

  setTimeout(() => {
    closeModal();
    window.location.href = "/index.html";
  }, 2000);
}

// Close modal
function closeModal() {
  const modal = document.getElementById("success-modal");
  modal.style.display = "none";
}
