
        const form = document.getElementById('accountForm');
        const nameInput = document.getElementById('name');
        const emailInput = document.getElementById('email');
        const phoneInput = document.getElementById('phone');
        const passwordInput = document.getElementById('password');
        const saveButton = document.querySelector('.save-button');

        const nameError = document.getElementById('nameError');
        const emailError = document.getElementById('emailError');
        const phoneError = document.getElementById('phoneError');
        const passwordError = document.getElementById('passwordError');

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

            // Validate Password (6 to 12 characters, including at least one special character)
            const passwordPattern = /^(?=.*[!@#$%^&*]).{6,12}$/;
            if (!passwordPattern.test(passwordInput.value)) {
                passwordError.textContent = 'Password must be 6-12 characters long and include at least one special character.';
                isValid = false;
            } else {
                passwordError.textContent = '';
            }

            // Enable or disable the save button based on validation
            saveButton.disabled = !isValid;
        }

        window.onload = function () {
            const username = localStorage.getItem("username");
            const email = localStorage.getItem("email");
          
            document.getElementById("profile-username").textContent = username || "Not provided";
            document.getElementById("profile-email").textContent = email || "Not provided";
          };
          

        // Attach event listeners for real-time validation
        nameInput.addEventListener('input', validateForm);
        emailInput.addEventListener('input', validateForm);
        phoneInput.addEventListener('input', validateForm);
        passwordInput.addEventListener('input', validateForm);

        // Prevent form submission if there are errors
        form.addEventListener('submit', function (event) {
            validateForm();
            if (saveButton.disabled) {
                event.preventDefault();
            } else {
                alert('Form submitted successfully!');
            }
        });

       // Restrict phone input to numbers only
        phoneInput.addEventListener('input', function () {
            phoneInput.value = phoneInput.value.replace(/\D/g, '');
        });
    