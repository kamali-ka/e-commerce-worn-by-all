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
    document.getElementById("login-general-error").innerText = "";
    document.getElementById("login-general-error").style.display = "none";
}

// Validate username
function validateUsername(username) {
    username = username.replace(/\s+/g, ""); // Remove all spaces

    const hasThreeLetters = (username.match(/[A-Za-z]/g) || []).length >= 3;
    const isOnlyNumbersOrSpecialChars = /^[0-9!@#$%^&*]+$/.test(username);

    if (username === "") {
        document.getElementById("username-error").innerText = "Username cannot be empty.";
        return false;
    }

    if (hasThreeLetters && !isOnlyNumbersOrSpecialChars) {
        return true;
    } else {
        document.getElementById("username-error").innerText = 
            "Username must contain at least 3 letters and cannot be only numbers or special characters.";
        return false;
    }
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
    const hasSpaces = /\s/.test(password);

    if (hasSpaces) {
        document.getElementById("password-error").innerText = "Password cannot contain spaces.";
        return false;
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
    if (!passwordRegex.test(password)) {
        document.getElementById("password-error").innerText = 
            "Password must be at least 8 characters long, with at least 1 uppercase, 1 lowercase, 1 number, and 1 special character.";
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
    document.getElementById("success-modal").style.display = "block";
}

// Close success modal and redirect to index page
function closeModal() {
    document.getElementById("success-modal").style.display = "none";
    redirectToPage();
}

// Redirect to index page after successful login or signup
function redirectToPage() {
    window.location.href = "/index.html"; // Adjust this path if needed
}

// Handle Sign Up with empty field checks
function signUp() {
    clearErrorMessages();

    const username = document.getElementById("signup-username").value.trim();
    const email = document.getElementById("signup-email").value;
    const password = document.getElementById("signup-password").value;
    const confirmPassword = document.getElementById("signup-confirm-password").value;

    if (!username || !email || !password || !confirmPassword) {
        if (!username) document.getElementById("username-error").innerText = "Username is required.";
        if (!email) document.getElementById("email-error").innerText = "Email is required.";
        if (!password) document.getElementById("password-error").innerText = "Password is required.";
        if (!confirmPassword) document.getElementById("confirm-password-error").innerText = "Please confirm your password.";
        return;
    }

    const isUsernameValid = validateUsername(username);
    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);
    const isConfirmPasswordValid = validateConfirmPassword(password, confirmPassword);

    if (isUsernameValid && isEmailValid && isPasswordValid && isConfirmPasswordValid) {
        showModal("You have successfully signed up! Welcome!");
    }
}

// Handle Login
function login() {
    clearErrorMessages();

    const email = document.getElementById("login-email").value;
    const password = document.getElementById("login-password").value;

    const validEmail = "user@example.com";
    const validPassword = "Password123!";

    if (email !== validEmail || password !== validPassword) {
        document.getElementById("login-general-error").innerText = "Invalid email or password.";
        document.getElementById("login-general-error").style.display = "block";
        return;
    }

    if (validateEmail(email) && password) {
        showModal("Logged in successfully! Redirecting to your dashboard...");
    }
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
