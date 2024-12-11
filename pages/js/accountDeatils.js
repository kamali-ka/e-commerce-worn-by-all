document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById('accountForm');
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const phoneInput = document.getElementById('phone');
    const dressSizeInput = document.getElementById('dress-size');
    const profileImageInput = document.getElementById('profile-upload'); // File input for profile image
    const profileImage = document.getElementById('profile-image'); // Profile image display
    const saveButton = document.querySelector('.save-button');

    const nameError = document.getElementById('nameError');
    const emailError = document.getElementById('emailError');
    const phoneError = document.getElementById('phoneError');
    const removeProfileButton = document.getElementById('remove-profile'); // Get the remove button
    const defaultProfileImage = "/assets/images/default.png"; // Default profile image path

    const popupMessage = document.getElementById('popupMessage'); // Popup message container

    // Load saved profile information on page load
    const username = localStorage.getItem("username");
    const email = localStorage.getItem("email");
    const phone = localStorage.getItem("phone");
    const dressSize = localStorage.getItem("dress-size");
    const savedImage = localStorage.getItem("profileImage"); // Load saved image

    document.getElementById("profile-username").textContent = username || "Not provided";
    document.getElementById("profile-email").textContent = email || "Not provided";
    document.getElementById("profile-phone").textContent = phone || "Not provided";
    document.getElementById("profile-dress-size").textContent = dressSize || "Not provided";
    if (savedImage) {
        profileImage.src = savedImage; // Display saved image
    }

    // Validate form inputs
    function validateForm() {
        let isValid = true;

        // Validate Name (2 to 30 characters)
        if (nameInput.value.length < 2 || nameInput.value.length > 30) {
            nameError.textContent = 'Name must be between 2 and 30 characters.';
            isValid = false;
        } else {
            nameError.textContent = '';
        }

        // Validate Email (Valid email format)
        const emailPattern = /^[^@]+@[^@]+\.[a-zA-Z]{2,}$/;
        if (!emailPattern.test(emailInput.value)) {
            emailError.textContent = 'Please enter a valid email address.';
            isValid = false;
        } else {
            emailError.textContent = '';
        }

        // Validate Phone (10 digits only)
        const phonePattern = /^\d{10}$/;
        if (!phonePattern.test(phoneInput.value)) {
            phoneError.textContent = 'Phone number must be 10 digits.';
            isValid = false;
        } else {
            phoneError.textContent = '';
        }

        // Enable or disable the save button based on validation
        saveButton.disabled = !isValid;
    }

    // Attach event listeners for real-time validation
    nameInput.addEventListener('input', validateForm);
    emailInput.addEventListener('input', validateForm);
    phoneInput.addEventListener('input', validateForm);

    // Handle profile image upload and preview
    profileImageInput.addEventListener('change', function (event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                profileImage.src = e.target.result; // Update image preview
            };
            reader.readAsDataURL(file); // Convert file to Data URL
        } else {
            showPopup('Failed to load the image.', 'error'); // Show error message
        }
    });

    // Prevent form submission if there are errors
    form.addEventListener('submit', function (event) {
        validateForm();
        if (saveButton.disabled) {
            event.preventDefault(); // Prevent form submission if invalid
        } else {
            // Save form data to localStorage after successful submission
            localStorage.setItem("username", nameInput.value);
            localStorage.setItem("email", emailInput.value);
            localStorage.setItem("phone", phoneInput.value);
            localStorage.setItem("dress-size", dressSizeInput.value);

            // Save profile image to localStorage
            const profileImageData = profileImage.src;
            localStorage.setItem("profileImage", profileImageData);

            // Update profile display with new data
            document.getElementById("profile-username").textContent = nameInput.value;
            document.getElementById("profile-email").textContent = emailInput.value;
            document.getElementById("profile-phone").textContent = phoneInput.value;
            document.getElementById("profile-dress-size").textContent = dressSizeInput.value;

            showPopup('Profile details saved successfully!', 'success'); // Show success message
        }
    });

    // Restrict phone input to numbers only
    phoneInput.addEventListener('input', function () {
        phoneInput.value = phoneInput.value.replace(/\D/g, ''); // Allow only digits
    });

    // Function to show a popup message
    function showPopup(message, type) {
        popupMessage.textContent = message; // Set message text
        popupMessage.className = `popup-message ${type}`; // Add type class (success/error)
        popupMessage.classList.add('show'); // Show popup
        setTimeout(() => {
            popupMessage.classList.remove('show'); // Hide popup after 3 seconds
        }, 3000);
    }

    // Remove Profile Picture
    removeProfileButton.addEventListener('click', function () {
        profileImage.src = defaultProfileImage; // Reset profile picture to default
        localStorage.removeItem("profileImage"); // Remove saved image from localStorage
        showPopup('Profile picture removed successfully.', 'success'); // Show success message
    });
});
