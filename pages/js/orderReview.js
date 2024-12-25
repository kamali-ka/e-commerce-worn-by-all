document.addEventListener('DOMContentLoaded', function () {
    const nextBtn = document.getElementById('next-btn');
    const nextBtnPayment = document.getElementById('next-btn-payment');
    const confirmOrderBtn = document.getElementById('confirm-order-btn');
    const upiRadio = document.getElementById('upi');
    const upiDetails = document.getElementById('upi-details');
    const cardRadio = document.getElementById('card');
    const cardDetails = document.getElementById('card-details');
    const codRadio = document.getElementById('cod');

    // Start checkout process from the first step
    nextStep(1); // Start with step 1 (Address)

    // Toggle UPI details based on radio selection
    if (upiRadio) {
        upiRadio.addEventListener('change', function () {
            togglePaymentDetails('upi');
        });
    }

    // Toggle Card details based on radio selection
    if (cardRadio) {
        cardRadio.addEventListener('change', function () {
            togglePaymentDetails('card');
        });
    }

    // Toggle COD details based on radio selection
    if (codRadio) {
        codRadio.addEventListener('change', function () {
            togglePaymentDetails('cod');
        });
    }

    // Attach event listener for the Address "Next" button
    if (nextBtn) {
        nextBtn.addEventListener('click', function () {
            if (validateAddress()) {
                nextStep(2); // Go to the payment step
            }
        });
    }

    // Attach event listener for the Payment "Next" button
    if (nextBtnPayment) {
        nextBtnPayment.addEventListener('click', function () {
            if (validatePayment()) {
                nextStep(3); // Go to the review step
            }
        });
    }

    // Attach event listener for confirming the order
    if (confirmOrderBtn) {
        confirmOrderBtn.addEventListener('click', function () {
            confirmOrder(); // Confirm the order and finish checkout
        });
    }

    // Function to move to the next step
    // Function to move to the next step
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

        // Update review details for address
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
            if (selectedPayment) {
                // Update payment method in the review step
                reviewPayment.innerText = selectedPayment.nextSibling?.textContent?.trim() || selectedPayment.value;
            } else {
                reviewPayment.innerText = 'No payment method selected.';
            }
        }
    }

    // Update progress bar
    updateProgress(step);
}


    // Update progress bar and step styles
    function updateProgress(stepNumber) {
        document.querySelectorAll('.progress-step').forEach((step, index) => {
            step.classList.toggle('completed', index + 1 < stepNumber);
            step.classList.toggle('in-progress', index + 1 === stepNumber);
        });
    }

    // Validate address form
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

    // Validate payment form fields
    function validatePayment() {
        let isValid = true;

        const paymentMethod = document.querySelector('input[name="payment_method"]:checked');
        if (!paymentMethod) {
            alert('Please select a payment method.');
            return false;
        }

        if (paymentMethod.value === 'upi' && !document.getElementById('upi-id').value) {
            alert('Please enter your UPI ID.');
            return false;
        }

        return isValid;
    }

    // Confirm the order
    function confirmOrder() {
        alert('Order confirmed! Thank you for your purchase.');
        // Optionally, reset the form or redirect to a confirmation page
    }

    // Function to toggle payment details based on the selected option
    function togglePaymentDetails(selectedOption) {
        // Hide all payment detail sections
        upiDetails.style.display = 'none';
        cardDetails.style.display = 'none';

        // Show the selected option details
        if (selectedOption === 'upi') {
            upiDetails.style.display = upiDetails.style.display === 'block' ? 'none' : 'block';
        } else if (selectedOption === 'card') {
            cardDetails.style.display = cardDetails.style.display === 'block' ? 'none' : 'block';
        }
    }
});
