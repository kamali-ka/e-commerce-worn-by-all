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
  document.querySelectorAll(".error-message").forEach((element) => (element.innerText = ""));
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
function validateUsername(username) {
  const error = document.getElementById("username-error");
  if (!username.trim()) return (error.innerText = "Please enter a username.");
  if (username.length < 4) return (error.innerText = "Username must be at least 4 characters.");
  if (!/^[A-Za-z]+$/.test(username)) return (error.innerText = "Username must contain only letters.");
  error.innerText = "";
  return true;
}

function validateEmail(email) {
  const error = document.getElementById("email-error");
  if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email))
    return (error.innerText = "Invalid email address.");
  error.innerText = "";
  return true;
}

function validatePassword(password) {
  const error = document.getElementById("password-error");
  if (!password) return (error.innerText = "Please enter a password.");
  if (password.length < 8)
    return (error.innerText = "Password must be at least 8 characters long.");
  if (!/(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*])/.test(password))
    return (error.innerText = "Password must include uppercase, number, and special character.");
  error.innerText = "";
  return true;
}

function validateConfirmPassword(password, confirmPassword) {
  const error = document.getElementById("confirm-password-error");
  if (password !== confirmPassword) return (error.innerText = "Passwords do not match.");
  error.innerText = "";
  return true;
}

// Sign Up
function signUp() {
  clearErrorMessages();

  const username = document.getElementById("signup-username").value;
  const email = document.getElementById("signup-email").value;
  const password = document.getElementById("signup-password").value;
  const confirmPassword = document.getElementById("signup-confirm-password").value;

  if (
    validateUsername(username) &&
    validateEmail(email) &&
    validatePassword(password) &&
    validateConfirmPassword(password, confirmPassword)
  ) {
    localStorage.setItem("email", email);
    localStorage.setItem("password", password);
    showModal("Sign-up successful! Welcome!");
  }
}

// Login
function login() {
  clearErrorMessages();

  const email = document.getElementById("login-email").value.trim();
  const password = document.getElementById("login-password").value;
  const errorElement = document.getElementById("login-general-error");

  // Check if email or password fields are empty
  if (email === "" || password === "") {
    errorElement.innerText = "Invalid credentials. Please enter valid details.";
    errorElement.style.display = "block"; // Ensure the error message is visible
    return;
  }

  // Validate email format
  if (!validateEmail(email)) {
    errorElement.innerText = "Invalid email format.";
    errorElement.style.display = "block";
    return;
  }

  // Retrieve stored credentials
  const storedEmail = localStorage.getItem("email");
  const storedPassword = localStorage.getItem("password");

  // Check if email matches stored data
  if (email !== storedEmail || password !== storedPassword) {
    errorElement.innerText = "Invalid credentials. Please check your email or password.";
    errorElement.style.display = "block";
    return;
  }

  // Success case
  showModal("Welcome back ! Login successful!");
}



// Show modal
function showModal(message) {
  const modal = document.getElementById("success-modal");
  const modalMessage = document.getElementById("modal-message");

  modalMessage.innerText = message;
  modal.style.display = "flex";

  // Automatically redirect after 2 seconds
  setTimeout(() => {
    window.location.href = "/index.html";
  }, 2000);
}


// Close modal
function closeModal() {
  const modal = document.getElementById("success-modal");
  modal.style.display = "none";
}
