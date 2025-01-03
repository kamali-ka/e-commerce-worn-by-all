document.addEventListener('DOMContentLoaded', function () {
    const nextBtn = document.getElementById('next-btn');
    const nextBtnPayment = document.getElementById('next-btn-payment');
    const confirmOrderBtn = document.getElementById('confirm-order-btn');
    const upiRadio = document.getElementById('upi');
    const upiDetails = document.getElementById('upi-details');
    const cardRadio = document.getElementById('card');
    const cardDetails = document.getElementById('card-details');
    const codRadio = document.getElementById('cod');
    const closePopupBtn = document.getElementById('close-popup-btn');
    const orderConfirmationPopup = document.getElementById('order-confirmation-popup');

    // Fetch user details from localStorage
    const userName = localStorage.getItem('username') || '';
    const userPhone = localStorage.getItem('phone') || '';
    const userAddress = localStorage.getItem('address') || ''; // Assuming 'address' is stored in localStorage
   /*  console.log('Retrieved address:', userAddress); // Check address value
    console.log('Retrieved name:', userName); // Check name value */


    // Set these values to the address fields in the checkout page
    const fullNameField = document.getElementById('full-name');
    const phoneField = document.getElementById('phone');
    const addressField = document.getElementById('address-line-1');

    // Pre-fill fields with existing data from localStorage
    if (fullNameField) fullNameField.value = userName;
    if (phoneField) phoneField.value = userPhone;
    if (addressField) addressField.value = userAddress;  // Address field

    // Start checkout process from the first step
    nextStep(1); // Start with step 1 (Address)

    // Toggle payment details based on radio selection
    const paymentRadios = [upiRadio, cardRadio, codRadio];
    paymentRadios.forEach((radio) => {
        if (radio) {
            radio.addEventListener('change', function () {
                togglePaymentDetails(radio.id);
            });
        }
    });

    // Address "Next" button
    if (nextBtn) {
        nextBtn.addEventListener('click', function () {
            if (validateAddress()) {
                nextStep(2); // Go to the payment step
            }
        });
    }

    // Payment "Next" button
    if (nextBtnPayment) {
        nextBtnPayment.addEventListener('click', function () {
            if (validatePayment()) {
                nextStep(3); // Go to the review step
            }
        });
    }

    // Confirm order button
    if (confirmOrderBtn) {
        confirmOrderBtn.addEventListener('click', function () {
            confirmOrder(); // Confirm the order and finish checkout
        });
    }

    // Close popup button
    if (closePopupBtn) {
        closePopupBtn.addEventListener('click', function () {
            orderConfirmationPopup.style.display = 'none';
            window.location.href = '../html/orderPlaced.html'; // Redirect to the order placed page
        });
    }

    function nextStep(step) {
        // Hide all steps
        document.querySelectorAll('.step-content > div').forEach(stepDiv => {
            stepDiv.classList.remove('active');
        });

        // Show the selected step
        if (step === 1) {
            document.querySelector('.address-step')?.classList.add('active');
            document.getElementById('step-1')?.classList.add('active');
        } else if (step === 2) {
            document.querySelector('.payment-step')?.classList.add('active');
            document.getElementById('step-1')?.classList.add('completed');
            document.getElementById('step-2')?.classList.add('active');
        } else if (step === 3) {
            document.querySelector('.review-step')?.classList.add('active');
            document.getElementById('step-2')?.classList.add('completed');
            document.getElementById('step-3')?.classList.add('active');

            // Update review details
            updateReviewDetails();
        }

        // Update progress bar
        updateProgress(step);
    }

    function updateProgress(stepNumber) {
        document.querySelectorAll('.progress-step').forEach((step, index) => {
            step.classList.toggle('completed', index + 1 < stepNumber);
            step.classList.toggle('in-progress', index + 1 === stepNumber);
        });
    }

    function validateAddress() {
        let isValid = true;

        const validateField = (fieldId, errorId, message) => {
            const field = document.getElementById(fieldId);
            const errorElement = document.getElementById(errorId);
            const isFieldValid = field?.value.trim();
            if (errorElement) {
                errorElement.innerText = isFieldValid ? '' : message;
            }
            return !!isFieldValid;
        };

        isValid = isValid && validateField('full-name', 'name-error', 'Full Name is required.');
        isValid = isValid && validateField('address-line-1', 'address1-error', 'Address Line 1 is required.');
        isValid = isValid && validateField('city', 'city-error', 'City is required.');
        isValid = isValid && validateField('state', 'state-error', 'State is required.');
        isValid = isValid && validateField('postal-code', 'postal-error', 'Enter a valid 6-digit postal code.') &&
            /^[0-9]{6}$/.test(document.getElementById('postal-code')?.value);
        isValid = isValid && validateField('country', 'country-error', 'Country is required.');

        return isValid;
    }

    function validatePayment() {
        const paymentMethod = document.querySelector('input[name="payment_method"]:checked');
        if (!paymentMethod) {
            alert('Please select a payment method.');
            return false;
        }

        if (paymentMethod.value === 'upi' && !document.getElementById('upi-id')?.value) {
            alert('Please enter your UPI ID.');
            return false;
        }

        return true;
    }

    function confirmOrder() {
        // Show the pop-up
        if (orderConfirmationPopup) {
            orderConfirmationPopup.style.display = 'flex';
        }
    
        // Get the current order ID from localStorage or initialize it to 1
        let orderId = localStorage.getItem('orderId');
        if (!orderId) {
            orderId = 1;
        } else {
            orderId = parseInt(orderId) + 1; // Increment the order ID
        }
    
        // Store the new order ID back into localStorage
        localStorage.setItem('orderId', orderId);
    
        const orderDetails = {
            orderId: `ORD-${orderId}`,  // Use the incremented order ID
            date: new Date().toLocaleDateString(),
            name: document.getElementById('full-name').value,
            address: document.getElementById('address-line-1').value,
            payment: document.querySelector('input[name="payment_method"]:checked')?.value || 'COD'
        };
    
        // Store the order details in localStorage
        let orders = JSON.parse(localStorage.getItem('orders')) || [];
        orders.push(orderDetails);
        localStorage.setItem('orders', JSON.stringify(orders));
        if(localStorage.getItem("isFromCartPage")=="true") clearCartAfterOrder()
        // Redirect to the order history page
        window.location.href = '../html/orderHistory.html';
    }
    
    function clearCartAfterOrder() {
        localStorage.removeItem('cart'); // Clear the cart from localStorage
        console.log('Cart cleared successfully.');
    }

    function togglePaymentDetails(selectedOption) {
        upiDetails.style.display = 'none';
        cardDetails.style.display = 'none';

        if (selectedOption === 'upi' && upiDetails) {
            upiDetails.style.display = 'block';
        } else if (selectedOption === 'card' && cardDetails) {
            cardDetails.style.display = 'block';
        }
    }

    function updateReviewDetails() {
        const reviewAddress = document.getElementById('review-address');
        const reviewPayment = document.getElementById('review-payment');

        if (reviewAddress) {
            reviewAddress.innerText = [
                document.getElementById('full-name')?.value,
                document.getElementById('address-line-1')?.value,
                document.getElementById('city')?.value,
                document.getElementById('state')?.value,
                document.getElementById('postal-code')?.value,
                document.getElementById('country')?.value
            ].filter(Boolean).join(', ');
        }

        if (reviewPayment) {
            const selectedPayment = document.querySelector('input[name="payment_method"]:checked');
            reviewPayment.innerText = selectedPayment?.nextSibling?.textContent?.trim() || selectedPayment?.value || 'No payment method selected.';
        }
    }
});
