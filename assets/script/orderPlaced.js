document.getElementById('confirm').addEventListener('click', () => {
    let button = document.getElementById('confirm');
    
    // Start the animation
    button.classList.add('animate');
    
    // Wait for 10 seconds (to complete the animation)
    setTimeout(() => {
        // After animation is complete, redirect to the next page
        window.location.href = '/index.html';
    }, 10000);
});
