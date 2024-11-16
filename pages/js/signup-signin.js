// Toggle between Sign Up and Login Forms
function toggleForms() {
  const signupForm = document.getElementById("signup-form");
  const loginForm = document.getElementById("login-form");

  signupForm.style.display = signupForm.style.display === "none" ? "block" : "none";
  loginForm.style.display = loginForm.style.display === "none" ? "block" : "none";

  clearErrorMessages(); // Clear errors when switching forms
}

// Clear all error messages
function clearErrorMessages() {
  document.getElementById("username-error").innerText = "";
  document.getElementById("email-error").innerText = "";
  document.getElementById("password-error").innerText = "";
  document.getElementById("confirm-password-error").innerText = "";
  document.getElementById("login-general-error").innerText = "";
}

// Validate username
function validateUsername(username) {
  const errorElement = document.getElementById("username-error");
  username = username.trim(); // Remove extra spaces

  if (username === "") {
    errorElement.innerText = "Please enter a username.";
    return false;
  }
  if (username.length < 4) {
    errorElement.innerText = "Username must be more than 3 characters.";
    return false;
  }
  const validUsernameRegex = /^[A-Za-z]+$/;
  if (!validUsernameRegex.test(username)) {
    errorElement.innerText = "Username must contain only letters (no special characters or numbers).";
    return false;
  }
  errorElement.innerText = "";
  return true;
}

// Validate email format
function validateEmail(email) {
  const errorElement = document.getElementById("email-error");
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  if (!emailRegex.test(email)) {
    errorElement.innerText = "Invalid email address.";
    return false;
  }
  errorElement.innerText = "";
  return true;
}

// Validate password
function validatePassword(password) {
  const errorElement = document.getElementById("password-error");
  if (/\s/.test(password)) {
    errorElement.innerText = "Password cannot contain spaces.";
    return false;
  }
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
  if (!passwordRegex.test(password)) {
    errorElement.innerText = "Password must be at least 8 characters long, with at least 1 uppercase, 1 lowercase, 1 number, and 1 special character.";
    return false;
  }
  errorElement.innerText = "";
  return true;
}

// Validate confirm password
function validateConfirmPassword(password, confirmPassword) {
  const errorElement = document.getElementById("confirm-password-error");
  if (password !== confirmPassword) {
    errorElement.innerText = "Passwords do not match.";
    return false;
  }
  errorElement.innerText = "";
  return true;
}

// Handle Sign Up
function signUp() {
  clearErrorMessages();

  const username = document.getElementById("signup-username").value.trim();
  const email = document.getElementById("signup-email").value;
  const password = document.getElementById("signup-password").value;
  const confirmPassword = document.getElementById("signup-confirm-password").value;

  let isValid = true;

  if (!username || !email || !password || !confirmPassword) {
    if (!username) document.getElementById("username-error").innerText = "Username is required.";
    if (!email) document.getElementById("email-error").innerText = "Email is required.";
    if (!password) document.getElementById("password-error").innerText = "Password is required.";
    if (!confirmPassword) document.getElementById("confirm-password-error").innerText = "Please confirm your password.";
    isValid = false;
  }

  const isUsernameValid = validateUsername(username);
  const isEmailValid = validateEmail(email);
  const isPasswordValid = validatePassword(password);
  const isConfirmPasswordValid = validateConfirmPassword(password, confirmPassword);

  if (isUsernameValid && isEmailValid && isPasswordValid && isConfirmPasswordValid && isValid) {
    showModal("You have successfully signed up! Welcome!");
  }
}

// Handle Login
function login() {
  clearErrorMessages();

  const email = document.getElementById("login-email").value;
  const password = document.getElementById("login-password").value;

  const validEmail = "user@example.com"; // Demo valid credentials
  const validPassword = "Password123!";

  if (!validateEmail(email) || email !== validEmail || password !== validPassword) {
    document.getElementById("login-general-error").innerText = "Invalid email or password.";
    document.getElementById("login-general-error").style.display = "block";
    return;
  }

  if (email === validEmail && password === validPassword) {
    showModal("Logged in successfully! Redirecting to your dashboard...");
  }
}

// Show success modal
function showModal(message) {
  document.getElementById("modal-message").innerText = message;
  document.getElementById("success-modal").style.display = "flex";
}

// Close success modal
function closeModal() {
  document.getElementById("success-modal").style.display = "none";
  redirectToPage();
}

// Redirect to index page
function redirectToPage() {
  window.location.href = "/index.html"; // Adjust path as needed
}

// Toggle password visibility
function togglePasswordVisibility(passwordFieldId, eyeIconId) {
  const passwordField = document.getElementById(passwordFieldId);
  const eyeIcon = document.getElementById(eyeIconId);

  if (passwordField.type === "password") {
    passwordField.type = "text";
    eyeIcon.innerHTML = '<i class="fa fa-eye"></i>';
  } else {
    passwordField.type = "password";
    eyeIcon.innerHTML = '<i class="fa fa-eye-slash"></i>';
  }
}

// Real-time validation for Sign Up form fields
document.getElementById("signup-username").addEventListener("blur", function () {
  const username = this.value;
  console.log(username);
  validateUsername(username); // Call validation function on input
});

document.getElementById("signup-email").addEventListener("blur", function () {
  const email = this.value;
  validateEmail(email); // Call validation function on input
});

document.getElementById("signup-password").addEventListener("blur", function () {
  const password = this.value;
  validatePassword(password); // Call validation function on input
});

document.getElementById("signup-confirm-password").addEventListener("blur", function () {
  const password = document.getElementById("signup-password").value;
  const confirmPassword = this.value;
  validateConfirmPassword(password, confirmPassword); // Call validation function on input
});
