function toggleForms() {
  const signupForm = document.getElementById("signup-form");
  const loginForm = document.getElementById("login-form");

  signupForm.style.display = signupForm.style.display === "none" ? "block" : "none";
  loginForm.style.display = loginForm.style.display === "none" ? "block" : "none";
}

function clearErrorMessages() {
  document.getElementById("username-error").innerText = "";
  document.getElementById("email-error").innerText = "";
  document.getElementById("password-error").innerText = "";
  document.getElementById("confirm-password-error").innerText = "";
  document.getElementById("signup-success").innerText = "";
}

function validateEmail(email) {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
        document.getElementById("email-error").innerText = "Please enter a valid email.";
        return false;
    }
    return true;
}

function validatePassword(password) {
    if (password.length < 6) {
        document.getElementById("password-error").innerText = "Password must be at least 6 characters long.";
        return false;
    }
    return true;
}

function signUp() {
  const username = document.getElementById("signup-username").value;
  const email = document.getElementById("signup-email").value;
  const password = document.getElementById("signup-password").value;
  const confirmPassword = document.getElementById("signup-confirm-password").value;

  clearErrorMessages();

  let isValid = true;

  if (!username) {
      document.getElementById("username-error").innerText = "Username is required.";
      isValid = false;
  }

  if (!email) {
      document.getElementById("email-error").innerText = "Email is required.";
      isValid = false;
  } else if (!validateEmail(email)) {
      isValid = false;
  }

  if (!password) {
      document.getElementById("password-error").innerText = "Password is required.";
      isValid = false;
  } else if (!validatePassword(password)) {
      isValid = false;
  }

  if (password !== confirmPassword) {
      document.getElementById("confirm-password-error").innerText = "Passwords do not match.";
      isValid = false;
  }

  if (!isValid) return;

  const users = JSON.parse(localStorage.getItem('users')) || [];
  // Check for existing username or email
  if (users.some(u => u.username === username)) {
    document.getElementById("username-error").innerText = "Username already exists.";
    return;
  }

  if (users.some(u => u.email === email)) {
    document.getElementById("email-error").innerText = "Email already exists.";
    return;
  }

  users.push({ username, email, password }); // In production, hash the password
  localStorage.setItem('users', JSON.stringify(users));

  document.getElementById("signup-success").innerText = "Sign up successful!";

  setTimeout(() => {
      toggleForms();
      clearFormFields("signup-form");
  }, 1500);
}

function login() {
  const username = document.getElementById("login-username").value;
  const password = document.getElementById("login-password").value;

  const users = JSON.parse(localStorage.getItem('users')) || [];
  const user = users.find(u => u.username === username && u.password === password);

  if (!username || !password) {
      document.getElementById("login-message").innerText = "Please enter both username and password.";
      return;
  }

  if (user) {
      document.getElementById("login-message").innerText = "Login successful!";
      setTimeout(() => {
          window.location.href = "address-page.html"; // Replace with your actual page URL
      }, 1500);
  } else {
      document.getElementById("login-message").innerText = "Incorrect username or password.";
  }
}

function clearFormFields(formId) {
  const form = document.getElementById(formId);
  const inputs = form.querySelectorAll("input[type='text'], input[type='password']");
  inputs.forEach(input => input.value = "");
}
