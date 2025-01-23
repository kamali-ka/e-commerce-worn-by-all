// Select all payment method radio buttons
const paymentOptions = document.querySelectorAll(
  'input[name="payment_method"]'
);

// Add event listeners to toggle payment details
paymentOptions.forEach((option) => {
  option.addEventListener("change", function () {
    // Hide all payment details sections
    document.querySelectorAll(".payment-details").forEach((detail) => {
      detail.classList.add("hidden");
    });

    // Show the selected payment method's details (if applicable)
    const selectedDetails = document.getElementById(`${option.id}-details`);
    if (selectedDetails) {
      selectedDetails.classList.remove("hidden");
    }
  });
});
