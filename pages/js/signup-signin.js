function toggleForms() {
  document.getElementById("signup-form").style.display =
      document.getElementById("signup-form").style.display === "none" ? "block" : "none";
  document.getElementById("login-form").style.display =
      document.getElementById("login-form").style.display === "none" ? "block" : "none";
}

function signUp() {
  const username = document.getElementById("signup-username").value;
  const email = document.getElementById("signup-email").value;
  const password = document.getElementById("signup-password").value;
  const confirmPassword = document.getElementById("signup-confirm-password").value;

  // Clear previous error messages
  document.getElementById("username-error").innerText = "";
  document.getElementById("email-error").innerText = "";
  document.getElementById("password-error").innerText = "";
  document.getElementById("confirm-password-error").innerText = "";
  document.getElementById("signup-success").innerText = "";

  // Username validation
  if (!/^[a-zA-Z0-9]+$/.test(username)) {
      document.getElementById("username-error").innerText = "Username contains invalid characters.";
      return;
  }

  // Email validation
  if (!email) {
      document.getElementById("email-error").innerText = "Email is required";
      return;
  }
  if (!/^\S+@\S+\.\S+$/.test(email)) {
      document.getElementById("email-error").innerText = "Invalid email format";
      return;
  }
  if (email.length > 50) {
      document.getElementById("email-error").innerText = "Email exceeds max length";
      return;
  }
  if (localStorage.getItem("email") === email) {
      document.getElementById("email-error").innerText = "Email already exists";
      return;
  }

  // Password validation
  if (!password) {
      document.getElementById("password-error").innerText = "Enter a password to proceed.";
      return;
  }
  if (password.length < 8) {
      document.getElementById("password-error").innerText = "Password must be at least 8 characters";
      return;
  }
  if (password.length > 30) {
      document.getElementById("password-error").innerText = "Limit password to a maximum of 30 characters.";
      return;
  }
  if (!/[A-Z]/.test(password)) {
      document.getElementById("password-error").innerText = "Password must include an uppercase letter";
      return;
  }
  if (!/[a-z]/.test(password)) {
      document.getElementById("password-error").innerText = "Password must include a lowercase letter";
      return;
  }
  if (!/[0-9]/.test(password)) {
      document.getElementById("password-error").innerText = "Password must include a number";
      return;
  }
  if (!/[!@#\$%\^&\*]/.test(password)) {
      document.getElementById("password-error").innerText = "Password must include a special character";
      return;
  }
  if (/password/i.test(password)) {
      document.getElementById("password-error").innerText = "Avoid common words like 'password' for security.";
      return;
  }
  if (/\s/.test(password)) {
      document.getElementById("password-error").innerText = "Do not include spaces in the password.";
      return;
  }

  // Confirm password validation
  if (password !== confirmPassword) {
      document.getElementById("confirm-password-error").innerText = "Passwords do not match";
      return;
  }

  // If all validations pass, save to local storage
  localStorage.setItem("username", username);
  localStorage.setItem("email", email);
  localStorage.setItem("password", password);
  document.getElementById("signup-success").innerText = "Sign up successful!";
  setTimeout(() => toggleForms(), 1000); // Switch to login form
}

function login() {
const username = document.getElementById("login-username").value;
const password = document.getElementById("login-password").value;

const storedUsername = localStorage.getItem("username");
const storedPassword = localStorage.getItem("password");

if (username === storedUsername && password === storedPassword) {
document.getElementById("login-message").innerText = "Login successful!";
setTimeout(() => {
  window.location.href = "address-page.html"; // Replace with your payment page URL
}, 1000); // Wait 1 second before redirecting
} else {
document.getElementById("login-message").innerText = "Incorrect username or password.";
}
}

