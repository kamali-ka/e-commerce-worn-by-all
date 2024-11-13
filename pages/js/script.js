// Selecting form fields and error message elements
const signupForm = document.getElementById('signupForm');
const usernameInput = document.getElementById('username');
const usernameError = document.getElementById('username-error');
const passwordInput = document.getElementById('password');
const confirmPasswordInput = document.getElementById('confirm-password');
const passwordError = document.getElementById('password-error');

// Validation function for spaces in the username
function validateUsername() {
    const username = usernameInput.value;
    if (/\s/.test(username.trim()) && /\s/.test(username.slice(1, -1))) {
        usernameError.textContent = 'Username should not have spaces between characters';
        return false;
    } else {
        usernameError.textContent = '';
        return true;
    }
}

// Validation function for matching passwords
function validatePasswords() {
    if (passwordInput.value !== confirmPasswordInput.value) {
        passwordError.textContent = 'Passwords do not match';
        return false;
    } else {
        passwordError.textContent = '';
        return true;
    }
}
// Select profile icon, popup, and close button elements
const profileIcon = document.getElementById('profile-icon');
const popup = document.getElementById('popup');
const closeBtn = document.getElementById('close-btn');

// Show popup when profile icon is clicked
profileIcon.addEventListener('click', () => {
    popup.style.display = 'flex'; // Show popup
});

// Hide popup when close button is clicked
closeBtn.addEventListener('click', () => {
    popup.style.display = 'none'; // Hide popup
});

// Hide popup when clicking outside of popup content
window.addEventListener('click', (event) => {
    if (event.target === popup) {
        popup.style.display = 'none';
    }
});


// Event listener for form submission
signupForm.addEventListener('submit', function(event) {
    event.preventDefault();
    
    const isUsernameValid = validateUsername();
    const arePasswordsValid = validatePasswords();

    if (isUsernameValid && arePasswordsValid) {
        alert('Sign Up Successful!');
        signupForm.reset(); // Clear form after submission
    }
});

// Event listeners for real-time validation
usernameInput.addEventListener('input', validateUsername);
confirmPasswordInput.addEventListener('input', validatePasswords);
