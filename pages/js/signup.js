// Function to validate the Sign-Up form
function validateSignUp(event) {
    event.preventDefault(); // Prevent form submission
  
    const fullName = document.getElementById('fullname').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password').value;
  
    // Check if full name is provided
    if (!fullName) {
      alert("Please enter your full name.");
      return;
    }
  
    // Validate email format
    if (!validateEmail(email)) {
      alert("Please enter a valid email address.");
      return;
    }
  
    // Check password length
    if (password.length < 6) {
      alert("Password must be at least 6 characters long.");
      return;
    }
  
    // Check if passwords match
    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }
  
    alert("Sign-Up Successful!");
    // Add further actions like form submission or redirect
  }
  
  // Email validation function using regex
  function validateEmail(email) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  }
  