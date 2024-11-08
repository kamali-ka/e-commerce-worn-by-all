 // JavaScript to redirect on hover
 const headingLink = document.getElementById('hover-heading');
        
 headingLink.addEventListener('mouseenter', function() {
     // Triggering the animation on hover
     headingLink.classList.add('hovered');

     // Redirect to the next page after a short delay (to allow animation to run)
     setTimeout(function() {
         window.location.href = 'nextpage.html'; // Replace with the actual next page URL
     }, 500); // 500ms delay for the animation to be visible
 });

 headingLink.addEventListener('mouseleave', function() {
     // Remove the animation when the hover ends
     headingLink.classList.remove('hovered');
 });