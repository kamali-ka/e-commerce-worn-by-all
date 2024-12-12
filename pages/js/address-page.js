function submitAddress() {
  const fullName = document.getElementById("full-name").value.trim();
  const addressLine1 = document.getElementById("address-line-1").value.trim();
  const city = document.getElementById("city").value.trim();
  const state = document.getElementById("state").value.trim();
  const postalCode = document.getElementById("postal-code").value.trim();
  const country = document.getElementById("country").value.trim();

  // Clear previous error messages
  document.getElementById("name-error").innerText = "";
  document.getElementById("address1-error").innerText = "";
  document.getElementById("city-error").innerText = "";
  document.getElementById("state-error").innerText = "";
  document.getElementById("postal-error").innerText = "";
  document.getElementById("country-error").innerText = "";
  document.getElementById("success-message").innerText = "";

  // Validate inputs
  let isValid = true;

  if (!fullName) {
    document.getElementById("name-error").innerText = "Full name is required.";
    isValid = false;
  }
  if (!addressLine1) {
    document.getElementById("address1-error").innerText =
      "Address Line 1 is required.";
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
    document.getElementById("postal-error").innerText =
      "Postal code is required.";
    isValid = false;
  } else if (!/^\d{5}$/.test(postalCode)) {
    document.getElementById("postal-error").innerText =
      "Enter a valid 5-digit postal code.";
    isValid = false;
  }
  if (!country) {
    document.getElementById("country-error").innerText = "Country is required.";
    isValid = false;
  }

  // Show success message if form is valid
  if (isValid) {
    document.getElementById("success-message").innerText =
      "Address saved successfully!";
    setTimeout(() => {
      window.location.href = "../html/payment.html"; // Redirect to the payment page
    }, 1000);
  }
}
