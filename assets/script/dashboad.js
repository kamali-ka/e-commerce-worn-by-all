document.addEventListener("DOMContentLoaded", () => {
    const savedDetails = document.getElementById("savedDetails");
    const editButton = document.getElementById("editButton");
    const accountForm = document.getElementById("accountForm");

    const nameInput = document.getElementById("name");
    const emailInput = document.getElementById("email");
    const phoneInput = document.getElementById("phone");
    const passwordInput = document.getElementById("password");

    const displayName = document.getElementById("displayName");
    const displayEmail = document.getElementById("displayEmail");
    const displayPhone = document.getElementById("displayPhone");
    const displayPassword = document.getElementById("displayPassword");

    // Load saved details from localStorage on page load
    displayName.textContent = localStorage.getItem("name") || "Not provided";
    displayEmail.textContent = localStorage.getItem("email") || "Not provided";
    displayPhone.textContent = localStorage.getItem("phone") || "Not provided";

    // Show the form when the "Edit" button is clicked
    editButton.addEventListener("click", () => {
        savedDetails.style.display = "none";
        accountForm.style.display = "block";

        // Populate form with current details
        nameInput.value = localStorage.getItem("name") || "";
        emailInput.value = localStorage.getItem("email") || "";
        phoneInput.value = localStorage.getItem("phone") || "";
    });

    // Handle form submission
    accountForm.addEventListener("submit", (event) => {
        event.preventDefault();

        // Save details to localStorage
        localStorage.setItem("name", nameInput.value);
        localStorage.setItem("email", emailInput.value);
        localStorage.setItem("phone", phoneInput.value);
        localStorage.setItem("password", passwordInput.value);

        // Update displayed details
        displayName.textContent = nameInput.value;
        displayEmail.textContent = emailInput.value;
        displayPhone.textContent = phoneInput.value;
        displayPassword.textContent = "********";

        // Switch back to saved details view
        accountForm.style.display = "none";
        savedDetails.style.display = "block";
    });
});