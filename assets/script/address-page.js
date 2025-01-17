function submitAddress() {
  // Get input values
  const fullName = document.getElementById("full-name").value.trim();
  const addressLine1 = document.getElementById("address-line-1").value.trim();
  const city = document.getElementById("city").value.trim();
  const state = document.getElementById("state").value.trim();
  const postalCode = document.getElementById("postal-code").value.trim();
  const country = document.getElementById("country").value.trim();

  // Clear previous error messages
  const errorFields = ["name-error", "address1-error", "city-error", "state-error", "postal-error", "country-error"];
  errorFields.forEach((id) => {
      const element = document.getElementById(id);
      if (element) {
          element.innerText = ""; // Clear the error message
      }
  });
  
  const successMessage = document.getElementById("success-message");
  if (successMessage) {
      successMessage.innerText = "";
  }

  // Validate inputs
  let isValid = true;
  if (!fullName) {
      document.getElementById("name-error").innerText = "Full name is required.";
      isValid = false;
  }
  if (!addressLine1) {
      document.getElementById("address1-error").innerText = "Address Line 1 is required.";
      isValid = false;
  }
  if (!city) {
      document.getElementById("city-error").innerText = "City is required.";
      isValid = false;
  }
  if (!state) {
      document.getElementById("state-error").innerText = "State is required.";
      isValid = false;
  }
  if (!postalCode) {
      document.getElementById("postal-error").innerText = "Postal code is required.";
      isValid = false;
  } else if (!/^\d{5}$/.test(postalCode)) {
      document.getElementById("postal-error").innerText = "Enter a valid 5-digit postal code.";
      isValid = false;
  }
  if (!country) {
      document.getElementById("country-error").innerText = "Country is required.";
      isValid = false;
  }

  // Show success message and redirect if form is valid
  if (isValid) {
      successMessage.innerText = "Address saved successfully!";
      successMessage.style.color = "#4caf50"; // Success green
      successMessage.style.marginTop = "10px";

      // Simulate a slight delay before redirection
      setTimeout(() => {
          window.location.href = "/pages/html/payment.html"; // Redirect to payment page
      }, 1500);
  }
}

function goBack() {
  window.history.back(); // Go back to the previous page
}
