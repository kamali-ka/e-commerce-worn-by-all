// Toggle between Sign Up and Login Forms
function toggleForms() {
    const signupForm = document.getElementById("signup-form");
    const loginForm = document.getElementById("login-form");

    signupForm.style.display = signupForm.style.display === "none" ? "block" : "none";
    loginForm.style.display = loginForm.style.display === "none" ? "block" : "none";
}

// Clear all error messages
function clearErrorMessages() {
    document.getElementById("username-error").innerText = "";
    document.getElementById("email-error").innerText = "";
    document.getElementById("password-error").innerText = "";
    document.getElementById("confirm-password-error").innerText = "";
}

// Validate username
function validateUsername(username) {
    const usernameRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*])/;
    if (!usernameRegex.test(username)) {
        document.getElementById("username-error").innerText = "Username must contain a number or special character.";
        return false;
    }
    return true;
}

// Validate email format
function validateEmail(email) {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
        document.getElementById("email-error").innerText = "Invalid email address.";
        return false;
    }
    return true;
}

// Validate password
function validatePassword(password) {
    if (password.length < 8) {
        document.getElementById("password-error").innerText = "Password must be at least 8 characters long.";
        return false;
    }
    return true;
}

// Validate confirm password
function validateConfirmPassword(password, confirmPassword) {
    if (password !== confirmPassword) {
        document.getElementById("confirm-password-error").innerText = "Passwords do not match.";
        return false;
    }
    return true;
}

// Show success modal
function showModal(message) {
    document.getElementById("modal-message").innerText = message;
    document.getElementById("success-modal").style.display = "block"; // Show success modal
}

// Close success modal and redirect to the address page
function closeModalAndRedirect() {
    document.getElementById("success-modal").style.display = "none"; // Close the modal
    redirectToPage(); // Redirect to the address page
}

// Redirect to another page after successful login or signup
function redirectToPage() {
    window.location.href = "/pages/html/address-page.html"; // Adjust the URL as needed
}

// Handle Sign Up
function signUp() {
    clearErrorMessages();

    const username = document.getElementById("signup-username").value;
    const email = document.getElementById("signup-email").value;
    const password = document.getElementById("signup-password").value;
    const confirmPassword = document.getElementById("signup-confirm-password").value;

    const isUsernameValid = validateUsername(username);
    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);
    const isConfirmPasswordValid = validateConfirmPassword(password, confirmPassword);

    if (isUsernameValid && isEmailValid && isPasswordValid && isConfirmPasswordValid) {
        // Simulate a successful signup (you can integrate with backend here)
        showModal("You have successfully signed up! Welcome!");
    }
}

// Handle Login
function login() {
    const email = document.getElementById("login-email").value;
    const password = document.getElementById("login-password").value;

    if (email && password) {
        // Simulate a successful login (you can integrate with backend here)
        showModal("Logged in successfully! Redirecting to your dashboard...");
    } else {
        alert("Please fill in both fields.");
    }
}
