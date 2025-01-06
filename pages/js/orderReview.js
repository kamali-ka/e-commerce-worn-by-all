import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import {
  getDatabase,
  ref,
  get,
  set,
  remove,
  push,
} from "https://www.gstatic.com/firebasejs/11.0.2/firebase-database.js";
import {
  getAuth,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";

// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyAnKtlrGE7lMKtHhjQyzfElqCkI2bupWzs",
  authDomain: "wornbyall-926f5.firebaseapp.com",
  projectId: "wornbyall-926f5",
  storageBucket: "wornbyall-926f5.appspot.com",
  messagingSenderId: "770771226995",
  appId: "1:770771226995:web:15636d6b9e17d27611b506",
  measurementId: "G-B6PER21YN1",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const auth = getAuth(app);

async function getToken() {
  const response = await fetch(
    `https://www.universal-tutorial.com/api/getaccesstoken`,
    {
      method: "GET",
      headers: {
        "api-token":
          "5G63Z8Pifh6ZHt4N2togj-GElSMBCwt9hK4pIMIM1j3y0HsbZTpD_V-89QK1uxEStNQ",
        Accept: "application/json",
        "user-email": "utchikanna3108@gmail.com",
      },
    }
  );
  return response.json();
}
async function getData(endpoint) {
  const authToken = await getToken();
  const response = await fetch(
    `https://www.universal-tutorial.com/api/${endpoint}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${authToken.auth_token}`,
        Accept: "application/json",
      },
    }
  );
  return await response.json();
}

document.addEventListener("DOMContentLoaded", async function () {
  const nextBtn = document.getElementById("next-btn");
  const nextBtnPayment = document.getElementById("next-btn-payment");
  const confirmOrderBtn = document.getElementById("confirm-order-btn");
  const upiRadio = document.getElementById("upi");
  const upiDetails = document.getElementById("upi-details");
  const cardRadio = document.getElementById("card");
  const cardDetails = document.getElementById("card-details");
  const codRadio = document.getElementById("cod");
  const closePopupBtn = document.getElementById("close-popup-btn");
  const orderConfirmationPopup = document.getElementById(
    "order-confirmation-popup"
  );
  const cardExpiryField = document.getElementById("card-expiry");

  const countryList = await getData("countries");
  console.log(countryList);

  // Expiry date auto-slash logic
  if (cardExpiryField) {
    cardExpiryField.addEventListener("input", function (e) {
      const value = this.value.replace(/\D/g, ""); // Remove non-digits
      if (value.length >= 2) {
        this.value = value.slice(0, 2) + "/" + value.slice(2, 4);
      } else {
        this.value = value;
      }
    });
  }

  // Fetch user details from localStorage
  const userName = localStorage.getItem("username") || "";
  const userPhone = localStorage.getItem("phone") || "";
  const userAddress = localStorage.getItem("address") || ""; // Assuming 'address' is stored in localStorage
  console.log("Retrieved address:", userAddress); // Check address value
  console.log("Retrieved name:", userName); // Check name value

  // Set these values to the address fields in the checkout page
  const fullNameField = document.getElementById("full-name");
  const phoneField = document.getElementById("phone");
  const addressField = document.getElementById("address-line-1");

  // Pre-fill fields with existing data from localStorage
  if (fullNameField) fullNameField.value = userName;
  if (phoneField) phoneField.value = userPhone;
  if (addressField) addressField.value = userAddress; // Address field

  // Start checkout process from the first step
  nextStep(1); // Start with step 1 (Address)

  // Toggle payment details based on radio selection
  const paymentRadios = [upiRadio, cardRadio, codRadio];
  paymentRadios.forEach((radio) => {
    if (radio) {
      radio.addEventListener("change", function () {
        togglePaymentDetails(radio.id);
      });
    }
  });

  // Address "Next" button
  if (nextBtn) {
    nextBtn.addEventListener("click", function () {
      if (validateAddress()) {
        nextStep(2); // Go to the payment step
      }
    });
  }

  // Payment "Next" button
  if (nextBtnPayment) {
    nextBtnPayment.addEventListener("click", function () {
      if (validatePayment()) {
        nextStep(3); // Go to the review step
      }
    });
  }

  // Confirm order button
  if (confirmOrderBtn) {
    confirmOrderBtn.addEventListener("click", function () {
      confirmOrder(); // Confirm the order and finish checkout
    });
  }

  // Close popup button
  if (closePopupBtn) {
    closePopupBtn.addEventListener("click", function () {
      orderConfirmationPopup.style.display = "none";
      window.location.href = "../html/orderPlaced.html"; // Redirect to the order placed page
    });
  }

  function nextStep(step) {
    // Hide all steps
    document.querySelectorAll(".step-content > div").forEach((stepDiv) => {
      stepDiv.classList.remove("active");
    });

    // Show the selected step
    if (step === 1) {
      document.querySelector(".address-step")?.classList.add("active");
      document.getElementById("step-1")?.classList.add("active");
    } else if (step === 2) {
      document.querySelector(".payment-step")?.classList.add("active");
      document.getElementById("step-1")?.classList.add("completed");
      document.getElementById("step-2")?.classList.add("active");
    } else if (step === 3) {
      document.querySelector(".review-step")?.classList.add("active");
      document.getElementById("step-2")?.classList.add("completed");
      document.getElementById("step-3")?.classList.add("active");

      // Update review details
      updateReviewDetails();
    }

    // Update progress bar
    updateProgress(step);
  }

  function updateProgress(stepNumber) {
    document.querySelectorAll(".progress-step").forEach((step, index) => {
      step.classList.toggle("completed", index + 1 < stepNumber);
      step.classList.toggle("in-progress", index + 1 === stepNumber);
    });
  }

  function validateAddress() {
    let isValid = true;

    const validateField = (fieldId, errorId, message) => {
      const field = document.getElementById(fieldId);
      const errorElement = document.getElementById(errorId);
      const isFieldValid = field?.value.trim();
      if (errorElement) {
        errorElement.innerText = isFieldValid ? "" : message;
        errorElement.style.color = isFieldValid ? "" : "red"; // Show error in red
      }
      return !!isFieldValid;
    };

    isValid =
      isValid &&
      validateField("full-name", "name-error", "Full Name is required.");
    isValid =
      isValid &&
      validateField(
        "address-line-1",
        "address1-error",
        "Address Line 1 is required."
      );
    isValid =
      isValid && validateField("city", "city-error", "City is required.");
    isValid =
      isValid && validateField("state", "state-error", "State is required.");
    isValid =
      isValid &&
      validateField(
        "postal-code",
        "postal-error",
        "Enter a valid 6-digit postal code."
      ) &&
      /^[0-9]{6}$/.test(document.getElementById("postal-code")?.value);
    isValid =
      isValid &&
      validateField("country", "country-error", "Country is required.");

    return isValid;
  }

  function validatePayment() {
    const paymentMethod = document.querySelector(
      'input[name="payment_method"]:checked'
    );

    if (!paymentMethod) {
      displayErrorMessage(
        "payment-method-error",
        "Please select a payment method."
      );
      return false;
    }
    clearErrorMessage("payment-method-error"); // Clear any previous error message

    // Validate UPI
    if (paymentMethod.value === "upi") {
      const upiId = document.getElementById("upi-id")?.value;
      if (!upiId || !/^[\w.-]+@[\w.-]+$/.test(upiId)) {
        displayErrorMessage("upi-id-error", "Please enter a valid UPI ID.");
        return false;
      }
      clearErrorMessage("upi-id-error");
    }

    // Validate Card
    if (paymentMethod.value === "card") {
      const cardNumberField = document.getElementById("card-number");
      const cardExpiryField = document.getElementById("card-expiry");
      const cardCvvField = document.getElementById("card-cvv");

      const cardNumber = cardNumberField.value;
      if (!cardNumber || cardNumber.length !== 16) {
        displayErrorMessage(
          "card-number-error",
          "Please enter a valid 16-digit card number."
        );
        return false;
      }
      clearErrorMessage("card-number-error");

      // Validate Expiry Date (MM/YY)
      const cardExpiry = cardExpiryField?.value.trim();
      if (!cardExpiry || !/^(0[1-9]|1[0-2])\/?([0-9]{2})$/.test(cardExpiry)) {
        displayErrorMessage(
          "card-expiry-error",
          "Please enter a valid expiration date (MM/YY)."
        );
        return false;
      }
      clearErrorMessage("card-expiry-error");

      // Validate CVV (3 digits)
      const cardCvv = cardCvvField?.value.trim();
      if (!cardCvv || !/^\d{3}$/.test(cardCvv)) {
        displayErrorMessage(
          "card-cvv-error",
          "Please enter a valid 3-digit CVV."
        );
        return false;
      }
      clearErrorMessage("card-cvv-error");
    }
    return true;
  }

  function displayErrorMessage(errorId, message) {
    const errorElement = document.getElementById(errorId);
    if (errorElement) {
      errorElement.innerText = message;
      errorElement.style.color = "red"; // Display the error message in red
    }
  }

  function clearErrorMessage(errorId) {
    const errorElement = document.getElementById(errorId);
    if (errorElement) {
      errorElement.innerText = ""; // Clear any previous error message
    }
  }

  function confirmOrder() {
    // Show the pop-up
    if (orderConfirmationPopup) {
      orderConfirmationPopup.style.display = "flex";
    }

    // Get the current order ID from localStorage or initialize it to 1
    let orderId = localStorage.getItem("orderId");
    let productId = localStorage.getItem("orderedProductsId");
    
    if (!orderId) {
      orderId = 1;
    } else {
      orderId = parseInt(orderId) + 1; // Increment the order ID
    }

    // Store the new order ID back into localStorage for future use (optional)
    localStorage.setItem("orderId", orderId);

    // Get the user ID (assuming you are using Firebase Authentication)
    const userId = auth.currentUser ? auth.currentUser.uid : null;
    if (!userId) {
      console.error("User not authenticated.");
      return; // Prevent further execution if no user is logged in
    }

    // Prepare the order details
    const orderDetails = {
      orderId: `ORD-${orderId}`, // Use the incremented order ID
      productId,
      date: new Date().toLocaleDateString(),
      name: document.getElementById("full-name").value,
      address: document.getElementById("address-line-1").value,
      payment:
        document.querySelector('input[name="payment_method"]:checked')?.value ||
        "COD",
      status: "Pending", // Add order status (e.g., 'Pending')
    };

    // Save the order to Firebase in the path orders/userId
    const ordersRef = ref(database, `orders/${userId}`);

    // You can use push to generate a unique key for each order
    const newOrderRef = push(ordersRef);

    // Set the order details in Firebase
    set(newOrderRef, orderDetails)
      .then(() => {
        console.log("Order saved successfully in Firebase.");
        if (localStorage.getItem("isFromCartPage") === "true")
          emptyCartInFirebase(userId);

        // Redirect to the order history page
        window.location.href = "../html/orderHistory.html";
      })
      .catch((error) => {
        console.error("Error saving order to Firebase:", error);
      });
  }

  // Empty the cart in Firebase
  async function emptyCartInFirebase(userId) {
    try {
      const cartRef = ref(database, `cart/${userId}`);
      await set(cartRef, {}); // Set the cart to an empty object to clear it
    } catch (error) {
      console.error("Error emptying the cart in Firebase:", error);
    }
  }

  function clearCartAfterOrder() {
    localStorage.removeItem("cart"); // Clear the cart from localStorage
    console.log("Cart cleared successfully.");
  }

  function togglePaymentDetails(selectedOption) {
    upiDetails.style.display = "none";
    cardDetails.style.display = "none";

    if (selectedOption === "upi" && upiDetails) {
      upiDetails.style.display = "block";
    } else if (selectedOption === "card" && cardDetails) {
      cardDetails.style.display = "block";
    }
  }

  function updateReviewDetails() {
    const reviewAddress = document.getElementById("review-address");
    const reviewPayment = document.getElementById("review-payment");

    if (reviewAddress) {
      reviewAddress.innerText = [
        document.getElementById("full-name")?.value,
        document.getElementById("address-line-1")?.value,
        document.getElementById("city")?.value,
        document.getElementById("state")?.value,
        document.getElementById("postal-code")?.value,
        document.getElementById("country")?.value,
      ]
        .filter(Boolean)
        .join(", ");
    }

    if (reviewPayment) {
      const selectedPayment = document.querySelector(
        'input[name="payment_method"]:checked'
      );
      reviewPayment.innerText =
        selectedPayment?.nextSibling?.textContent?.trim() ||
        selectedPayment?.value ||
        "No payment method selected.";
    }
  }
});

// Fetch country, state, and city data dynamically
async function loadCountryStateCity() {
  try {
    // Load countries
    const countries = await getData("countries");
    const countrySelect = document.getElementById("country");
    countries.forEach((country) => {
      const option = document.createElement("option");
      option.value = country.country_name;
      option.textContent = country.country_name;
      countrySelect.appendChild(option);
    });

    // Load states based on selected country
    countrySelect.addEventListener("change", async function () {
      const selectedCountry = this.value;
      const states = await getData(`states/${selectedCountry}`);
      const stateSelect = document.getElementById("state");
      stateSelect.innerHTML = '<option value="">Select State</option>'; // Clear previous options
      states.forEach((state) => {
        const option = document.createElement("option");
        option.value = state.state_name;
        option.textContent = state.state_name;
        stateSelect.appendChild(option);
      });

      // Clear cities dropdown when country or state changes
      document.getElementById("city").innerHTML =
        '<option value="">Select City</option>';
    });

    // Load cities based on selected state
    const stateSelect = document.getElementById("state");
    stateSelect.addEventListener("change", async function () {
      const selectedState = this.value;
      const cities = await getData(`cities/${selectedState}`);
      const citySelect = document.getElementById("city");
      citySelect.innerHTML = '<option value="">Select City</option>'; // Clear previous options
      cities.forEach((city) => {
        const option = document.createElement("option");
        option.value = city.city_name;
        option.textContent = city.city_name;
        citySelect.appendChild(option);
      });
    });
  } catch (error) {
    console.error("Error loading country, state, or city data:", error);
  }
}

// Initialize dynamic data loading
loadCountryStateCity();
