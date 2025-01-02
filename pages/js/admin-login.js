// Dummy data for admin login (for demo purposes)
const adminCredentials = {
    username: "site_manager",
    password: "site_manager!@#"
};

// Handle form submission
document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent form from submitting

    // Get form values
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Check credentials (this is just a placeholder, ideally use backend authentication)
    if (username === adminCredentials.username && password === adminCredentials.password) {
        // Redirect to the admin dashboard on successful login
        window.location.href = "admin.html";  // Replace with actual dashboard page
    } else {
        // Show error message if login fails
        document.getElementById('error-message').innerText = "Invalid username or password.";
    }
});
