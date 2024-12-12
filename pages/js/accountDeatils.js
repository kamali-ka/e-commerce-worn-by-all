document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("accountForm");
    const nameInput = document.getElementById("name");
    const emailInput = document.getElementById("email");
    const phoneInput = document.getElementById("phone");
    const profilePlaceholder = document.getElementById("profile-placeholder");
    const popupMessage = document.getElementById("popupMessage");

    const currentUserEmail = localStorage.getItem("currentEmail");

    function getUserKey(field) {
        return `${field}_${currentUserEmail}`;
    }

    function loadProfileData() {
        if (currentUserEmail) {
            emailInput.value = currentUserEmail;
            const userName = localStorage.getItem(getUserKey("name")) || "";
            const phone = localStorage.getItem(getUserKey("phone")) || "";

            nameInput.value = userName;
            phoneInput.value = phone;

            profilePlaceholder.textContent = userName
                ? userName.charAt(0).toUpperCase()
                : "A";

            document.getElementById("profile-username").textContent =
                userName || "Not provided";
            document.getElementById("profile-email").textContent =
                currentUserEmail || "Not provided";
            document.getElementById("profile-phone").textContent =
                phone || "Not provided";
        }
    }

    form.addEventListener("submit", function (event) {
        event.preventDefault();

        const userName = nameInput.value;
        const email = emailInput.value;
        const phone = phoneInput.value;

        localStorage.setItem("currentEmail", email);
        localStorage.setItem(getUserKey("name"), userName);
        localStorage.setItem(getUserKey("phone"), phone);

        profilePlaceholder.textContent = userName
            ? userName.charAt(0).toUpperCase()
            : "A";

        document.getElementById("profile-username").textContent = userName;
        document.getElementById("profile-email").textContent = email;
        document.getElementById("profile-phone").textContent = phone;

        showPopup("Profile details saved successfully!", "success");
    });

    function showPopup(message, type) {
        popupMessage.textContent = message;
        popupMessage.className = `popup-message ${type}`;
        popupMessage.classList.add("show");
        setTimeout(() => {
            popupMessage.classList.remove("show");
        }, 3000);
    }

    loadProfileData();
});
