// Sign-Up Form Validation
function validateSignUp(event) {
    event.preventDefault(); // Prevent form submission
  
    const fullName = document.getElementById('fullname').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password').value;
  
    if (!fullName) {
      alert("Please enter your full name.");
      return;
    }
  
    if (!validateEmail(email)) {
      alert("Please enter a valid email.");
      return;
    }
  
    if (password.length < 6) {
      alert("Password must be at least 6 characters long.");
      return;
    }
  
    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }
  
    alert("Sign-Up Successful!");
    // Proceed with form submission or further logic here
  }
  
  // Login Form Validation
  function validateLogin(event) {
    event.preventDefault(); // Prevent form submission
  
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
  
    if (!validateEmail(email)) {
      alert("Please enter a valid email.");
      return;
    }
  
    if (password.length < 6) {
      alert("Incorrect password length.");
      return;
    }
  
    alert("Login Successful!");
    // Proceed with login logic here
  }
  
  // Email Validation Function
  function validateEmail(email) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  }
  