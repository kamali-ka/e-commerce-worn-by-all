document.addEventListener('DOMContentLoaded', () => {
    const cardRadio = document.getElementById('card');
    const paypalRadio = document.getElementById('paypal');
    const codRadio = document.getElementById('cod');
    const cardDetails = document.querySelector('.card-details');
    const paymentForm = document.getElementById('payment-form');
  
    // Toggle card details visibility based on selected payment method
    const toggleCardDetails = () => {
      if (cardRadio.checked) {
        cardDetails.classList.remove('hidden');
      } else {
        cardDetails.classList.add('hidden');
      }
    };
  
    // Add event listeners to payment options
    cardRadio.addEventListener('change', toggleCardDetails);
    paypalRadio.addEventListener('change', toggleCardDetails);
    codRadio.addEventListener('change', toggleCardDetails);
  
    // Form submission handling
    paymentForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const selectedPayment = document.querySelector('input[name="payment"]:checked').value;
      alert(`Payment method selected: ${selectedPayment}`);
    });
  });
  