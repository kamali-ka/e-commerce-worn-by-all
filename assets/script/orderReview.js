import { initializeApp } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-app.js";
import {
  getDatabase,
  ref,
  get,
  set,
  remove,
  push,
} from "https://www.gstatic.com/firebasejs/11.2.0/firebase-database.js";
import {
  getAuth,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/11.2.0/firebase-auth.js";
// import {} from "../script/signup-signin.js";

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

// async function getToken() {
//   const response = await fetch(
//     `https://www.universal-tutorial.com/api/getaccesstoken`,
//     {
//       method: "GET",
//       headers: {
//         "api-token":
//           "oL2g_Vm0tMkL2eQM511fegF89xIemo9O7EYIg-5R5mnTIjokg7OPS9StJOk6wf67wVc",
//         Accept: "application/json",
//         "user-email": "kamalika.azhakar2328@gmail.com",
//       },
//     }
//   );
//   return response.json();
// }
// async function getData(endpoint) {
//   const authToken = await getToken();
//   const response = await fetch(
//     `https://www.universal-tutorial.com/api/${endpoint}`,
//     {
//       method: "GET",
//       headers: {
//         Authorization: `Bearer ${authToken.auth_token}`,
//         Accept: "application/json",
//       },
//     }
//   );
//   return await response.json();
// }

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

  // const countryList = await getData("countries");
  // console.log(countryList);

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
      window.location.href = "../../pages/html/orderPlaced.html";
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
  
    const validateField = (fieldId, errorId, message, pattern = null) => {
      const field = document.getElementById(fieldId);
      const errorElement = document.getElementById(errorId);
      const fieldValue = field?.value.trim();
  
      let isFieldValid = fieldValue !== "";
  
      if (pattern) {
        isFieldValid = pattern.test(fieldValue);
      }
  
      if (errorElement) {
        if (isFieldValid) {
          errorElement.innerText = "";
          errorElement.style.display = "none";
        } else {
          errorElement.innerText = message;
          errorElement.style.color = "red";
          errorElement.style.fontWeight = "bold";
          errorElement.style.display = "block"; // Ensure the error message is visible
        }
      }
  
      return isFieldValid;
    };
  
    // Full name should contain at least 3 letters
    isValid &= validateField(
      "full-name",
      "full-name-error",
      "Full name should contain at least 3 letters.",
      /^[A-Za-z ]{3,50}$/
    );
    isValid &= validateField("address-line-1", "address1-error", "Address Line 1 is required.");
    isValid &= validateField("country", "country-error", "Please select a country.");
    isValid &= validateField("state", "state-error", "Please select a state.");
    isValid &= validateField("city", "city-error", "Please select a city.");
    isValid &= validateField(
      "postal-code",
      "postal-error",
      "Enter a valid 6-digit postal code.",
      /^(?!(\d)\1{5}$)[0-9]{6}$/ // This regex prevents all repeated digits like '111111', '222222', etc.
    );
    
    // Validate postal code to ensure it's a valid 6-digit number and not '000000'
    const postalCodeField = document.getElementById("postal-code");
    const postalCodeError = document.getElementById("postal-error");
    const postalCodeValue = postalCodeField?.value.trim();
  
  let postalCodeValid = /^[0-9]{6}$/.test(postalCodeValue); // Ensure it's a 6-digit number
  /*     if (postalCodeValid && postalCodeValue === "000000") {
      postalCodeValid = false; // Invalid postal code if it's '000000'
    } */
  
    if (postalCodeError) {
      if (postalCodeValid) {
        postalCodeError.innerText = "";
        postalCodeError.style.display = "none";
      } else {
        postalCodeError.innerText = "Enter a valid 6-digit postal code.";
        postalCodeError.style.color = "red";
        postalCodeError.style.fontWeight = "bold";
        postalCodeError.style.display = "block";
      }
    }
  
    // Update isValid status for postal code
    isValid &= postalCodeValid;
  
    return !!isValid;
  }
  
  // Attach event listener to the "Next" button
  document.getElementById("next-btn").addEventListener("click", function () {
    if (validateAddress()) {
      // Proceed to the next step, e.g., showing the payment step
      document.querySelector(".address-step").classList.remove("active");
      document.querySelector(".payment-step").classList.add("active");
    }
  });
  
  
  function displayErrorMessage(errorId, message) {
    const errorElement = document.getElementById(errorId);
    if (errorElement) {
      errorElement.innerText = message;
      errorElement.style.color = "red"; // Set error message color to red
      errorElement.style.fontWeight = "bold";
      errorElement.style.display = "block"; // Ensure the error message is visible
    }
  }
  
  function clearErrorMessage(errorId) {
    const errorElement = document.getElementById(errorId);
    if (errorElement) {
      errorElement.innerText = ""; // Clear the error message
      errorElement.style.display = "none"; // Hide the error message
    }
  }
  
  function validateCardNumber(cardNumber) {
    // Remove non-digit characters
    cardNumber = cardNumber.replace(/\D/g, '');
    
    // Check if the card number contains exactly 16 digits
    if (cardNumber.length !== 16) {
      return false; // Invalid length
    }
    
    // Check if the card number contains only digits
    if (!/^\d{16}$/.test(cardNumber)) {
      return false; // Invalid characters (only digits allowed)
    }
  
    // Check if all digits are the same (e.g., 1111111111111111)
    if (/^(\d)\1+$/.test(cardNumber)) {
      return false; // Invalid if all digits are the same
    }
  
    return true; // Valid card number
  }
  
  function validateExpiryDate(expiryDate) {
    // Ensure the format is MM/YY
    if (!/^([1-9]|1[0-2])\/([0-9]{2})$/.test(expiryDate)) {
      return false;
    }
  
    const [month, year] = expiryDate.split('/').map(num => parseInt(num, 10));
    const currentYear = new Date().getFullYear() % 100; // Get the last two digits of the current year
    const currentMonth = new Date().getMonth() + 1; // Get the current month (1-12)
  
    // Check if the expiry year is greater than the current year or if it's the same year but the month is in the future
    if (year < currentYear || (year === currentYear && month < currentMonth)) {
      return false; // Expiry date is in the past
    }
  
    return true; // Valid expiry date
  }
  
  function validatePayment() {
    const paymentMethod = document.querySelector('input[name="payment_method"]:checked');
  
    if (!paymentMethod) {
      displayErrorMessage("payment-method", "Please select a payment method.");
      return false;
    }
    clearErrorMessage("payment-method");
  
    // Validate UPI
    if (paymentMethod.value === "upi") {
      const upiId = document.getElementById("upi-id");
      if (!upiId.value || !/^[\w.-]+@[\w.-]+$/.test(upiId.value)) {
        displayErrorMessage("upi-id", "Please enter a valid UPI ID.");
        return false;
      }
      clearErrorMessage("upi-id");
    }
  
    // Validate Card
    if (paymentMethod.value === "card") {
      const cardNumberField = document.getElementById("card-number");
      const cardExpiryField = document.getElementById("card-expiry");
      const cardCvvField = document.getElementById("card-cvv");
  
      if (!cardNumberField.value || cardNumberField.value.length !== 16 || !validateCardNumber(cardNumberField.value)) {
        displayErrorMessage("card-number", "Please enter a valid 16-digit card number.");
        return false;
      }
      clearErrorMessage("card-number");
  
      if (!cardExpiryField.value.trim() || !validateExpiryDate(cardExpiryField.value.trim())) {
        displayErrorMessage("card-expiry", "Please enter a valid expiration date (MM/YY) and ensure it's not expired.");
        return false;
      }
      clearErrorMessage("card-expiry");
  
      if (!cardCvvField.value.trim() || !/^\d{3}$/.test(cardCvvField.value.trim())) {
        displayErrorMessage("card-cvv", "Please enter a valid 3-digit CVV.");
        return false;
      }
      clearErrorMessage("card-cvv");
    }
  
    return true; // Everything is valid
  }
  
  
  // Format Expiry Date (MM/YY) automatically
  function formatExpiry(input) {
    let value = input.value.replace(/\D/g, ""); // Remove non-numeric characters
  
    if (value.length > 2) {
      let month = parseInt(value.substring(0, 2), 10);
      let year = value.substring(2, 4);
  
      if (month > 12) {
        input.value = "12" + (year ? "/" + year : "");
      } else if (month < 1) {
        input.value = "01" + (year ? "/" + year : "");
      } else {
        input.value = value.substring(0, 2) + (year ? "/" + year : "");
      }
    } else {
      input.value = value;
    }
  
    // Auto-add "/" after month input
    if (value.length >= 2 && !input.value.includes("/")) {
      input.value = value.substring(0, 2) + "/" + value.substring(2);
    }
  }
  
  document.getElementById("card-expiry").addEventListener("input", function () {
    formatExpiry(this);
  });
    

  function displayErrorMessage(fieldId, message) {
    let field = document.getElementById(fieldId);
    let errorElement = document.getElementById(`${fieldId}-error-msg`);
  
    if (!errorElement) {
      errorElement = document.createElement("div");
      errorElement.id = `${fieldId}-error-msg`;
      errorElement.style.color = "red";
      errorElement.style.fontSize = "14px";
      errorElement.style.marginTop = "5px";
      field.parentNode.appendChild(errorElement);
    }
  
    errorElement.textContent = message;
  }
  
  function clearErrorMessage(fieldId) {
    let errorElement = document.getElementById(`${fieldId}-error-msg`);
    if (errorElement) {
      errorElement.remove();
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
    let totalBillPrice = localStorage.getItem("orderedTotalPrice");
    console.log(totalBillPrice);
    
    
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
      window.location.href='../../pages/html/signup-signin.html'
      
      return; // Prevent further execution if no user is logged in
    }

    // Prepare the order details
    const orderDetails = {
      orderId: `ORD-${orderId}`, // Use the incremented order ID
      productId,
      price:totalBillPrice, 
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
        window.location.href = "../../pages/html/orderPlaced.html";
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

  document.addEventListener("DOMContentLoaded", () => {
    const totalPrice = localStorage.getItem("orderedTotalPrice");
    if (totalPrice) {
      document.getElementById("orderTotalPrice").textContent = `₹${parseFloat(totalPrice).toFixed(2)}`;
    }
  });
  

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

// // Fetch country, state, and city data dynamically
// async function loadCountryStateCity() {
//   try {
//     // Load countries
//     const countries = await getData("countries");
//     const countrySelect = document.getElementById("country");
//     countries.forEach((country) => {
//       const option = document.createElement("option");
//       option.value = country.country_name;
//       option.textContent = country.country_name;
//       countrySelect.appendChild(option);
//     });

//     // Load states based on selected country
//     countrySelect.addEventListener("change", async function () {
//       const selectedCountry = this.value;
//       const states = await getData(`states/${selectedCountry}`);
//       const stateSelect = document.getElementById("state");
//       stateSelect.innerHTML = '<option value="">Select State</option>'; // Clear previous options
//       states.forEach((state) => {
//         const option = document.createElement("option");
//         option.value = state.state_name;
//         option.textContent = state.state_name;
//         stateSelect.appendChild(option);
//       });

//       // Clear cities dropdown when country or state changes
//       document.getElementById("city").innerHTML =
//         '<option value="">Select City</option>';
//     });

//     // Load cities based on selected state
//     const stateSelect = document.getElementById("state");
//     stateSelect.addEventListener("change", async function () {
//       const selectedState = this.value;
//       const cities = await getData(`cities/${selectedState}`);
//       const citySelect = document.getElementById("city");
//       citySelect.innerHTML = '<option value="">Select City</option>'; // Clear previous options
//       cities.forEach((city) => {
//         const option = document.createElement("option");
//         option.value = city.city_name;
//         option.textContent = city.city_name;
//         citySelect.appendChild(option);
//       });
//     });
//   } catch (error) {
//     console.error("Error loading country, state, or city data:", error);
//   }
// }

// // Initialize dynamic data loading
// loadCountryStateCity();

console.log(localStorage.getItem('cartCount'))

console.log(localStorage.getItem('orderedTotalPrice'))

console.log(localStorage.getItem("orderedProductsId"))