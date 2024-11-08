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
  
  function validateUsername(username) {
    // Check if the username contains spaces
    if (/\s/.test(username)) {
      document.getElementById("username-error").innerText = "Username should not contain spaces.";
      return false;
    }
  
    // Check for at least one lowercase letter
    if (!/[a-z]/.test(username)) {
      document.getElementById("username-error").innerText = "Username must include at least one lowercase letter.";
      return false;
    }
  
    // Check for at least one uppercase letter
    if (!/[A-Z]/.test(username)) {
      document.getElementById("username-error").innerText = "Username must include at least one uppercase letter.";
      return false;
    }
  
    // Check for at least one number
    if (!/[0-9]/.test(username)) {
      document.getElementById("username-error").innerText = "Username must include at least one number.";
      return false;
    }
  
    // Check for at least one special character
    if (!/[!@#\$%\^&\*\(\)_\+\=\[\]\{\};:'"<>?,.\/]/.test(username)) {
      document.getElementById("username-error").innerText = "Username must include at least one special character.";
      return false;
    }
  
    // Check that the username only contains valid characters (no spaces)
    if (!/^[a-zA-Z0-9!@#\$%\^&\*\(\)_\+\=\[\]\{\};:'"<>?,.\/]+$/.test(username)) {
      document.getElementById("username-error").innerText = "Username contains invalid characters.";
      return false;
    }
  
    return true;
  }
  
  function validateEmail(email) {
    if (!email) {
      document.getElementById("email-error").innerText = "Email is required.";
      return false;
    }
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      document.getElementById("email-error").innerText = "Invalid email format.";
      return false;
    }
    if (email.length > 50) {
      document.getElementById("email-error").innerText = "Email exceeds max length.";
      return false;
    }
    if (localStorage.getItem("email") === email) {
      document.getElementById("email-error").innerText = "Email already exists.";
      return false;
    }
    return true;
  }
  
  function validatePassword(password) {
    if (!password) {
      document.getElementById("password-error").innerText = "Password is required.";
      return false;
    }
    if (password.length < 8 || password.length > 30) {
      document.getElementById("password-error").innerText = "Password must be between 8 and 30 characters.";
      return false;
    }
    if (!/[A-Z]/.test(password)) {
      document.getElementById("password-error").innerText = "Password must include an uppercase letter.";
      return false;
    }
    if (!/[a-z]/.test(password)) {
      document.getElementById("password-error").innerText = "Password must include a lowercase letter.";
      return false;
    }
    if (!/[0-9]/.test(password)) {
      document.getElementById("password-error").innerText = "Password must include a number.";
      return false;
    }
    if (!/[!@#\$%\^&\*]/.test(password)) {
      document.getElementById("password-error").innerText = "Password must include a special character.";
      return false;
    }
    if (/password/i.test(password)) {
      document.getElementById("password-error").innerText = "Avoid common words like 'password' for security.";
      return false;
    }
    if (/\s/.test(password)) {
      document.getElementById("password-error").innerText = "Do not include spaces in the password.";
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
  
    // Validate Username
    if (!username) {
      document.getElementById("username-error").innerText = "Username is required.";
      isValid = false;
    } else if (!validateUsername(username)) {
      isValid = false;
    }
  
    // Validate Email
    if (!email) {
      document.getElementById("email-error").innerText = "Email is required.";
      isValid = false;
    } else if (!validateEmail(email)) {
      isValid = false;
    }
  
    // Validate Password
    if (!password) {
      document.getElementById("password-error").innerText = "Password is required.";
      isValid = false;
    } else if (!validatePassword(password)) {
      isValid = false;
    }
  
    // Confirm Password Validation
    if (!confirmPassword) {
      document.getElementById("confirm-password-error").innerText = "Please confirm your password.";
      isValid = false;
    } else if (password !== confirmPassword) {
      document.getElementById("confirm-password-error").innerText = "Passwords do not match.";
      isValid = false;
    }
  
    // If any validation failed, stop the process
    if (!isValid) return;
  
    // If all validations pass, save to local storage (NOTE: You should hash the password in a real app)
    localStorage.setItem("username", username);
    localStorage.setItem("email", email);
    localStorage.setItem("password", password); // In a production environment, hash the password
    document.getElementById("signup-success").innerText = "Sign up successful!";
  
    setTimeout(() => {
      toggleForms(); // Switch to login form
      clearFormFields("signup-form");
    }, 1500); // Wait for 1.5 seconds before switching to the login form
  }
  
  function login() {
    const username = document.getElementById("login-username").value;
    const password = document.getElementById("login-password").value;
  
    const storedUsername = localStorage.getItem("username");
    const storedPassword = localStorage.getItem("password");
  
    if (!username || !password) {
      document.getElementById("login-message").innerText = "Please enter both username and password.";
      return;
    }
  
    if (username === storedUsername && password === storedPassword) {
      document.getElementById("login-message").innerText = "Login successful!";
      setTimeout(() => {
        window.location.href = "address-page.html"; // Replace with your actual page URL
      }, 1500); // Wait 1.5 seconds before redirecting
    } else {
      document.getElementById("login-message").innerText = "Incorrect username or password.";
    }
  }
  
  function clearFormFields(formId) {
    const form = document.getElementById(formId);
    const inputs = form.querySelectorAll("input[type='text'], input[type='password']");
    inputs.forEach(input => input.value = "");
  }
  