$(document).ready(function() {
    // Check if the order has already been placed
    if (localStorage.getItem('orderPlaced') === 'true') {
        // If order is placed, hide the button and redirect to the index page
        $('.order').hide();  // Hide the "Complete Order" button
        window.location.href = "/index.html"; // Redirect to index page
    }

    // Order button click event
    $('.order').click(function(e) {
        let button = $(this);

        if (!button.hasClass('animate')) {
            button.addClass('animate');
            setTimeout(() => {
                // Mark the order as placed in localStorage
                localStorage.setItem('orderPlaced', 'true');

                // After 10 seconds, hide the button and redirect to index page
                button.removeClass('animate');
                window.location.href = "/index.html"; // Redirect to index page
            }, 10000);  // Delay of 10 seconds before redirection
        }
    });
});
