// Select color functionality
const colors = document.querySelectorAll('.color');
colors.forEach(color => {
    color.addEventListener('click', () => {
        colors.forEach(c => c.classList.remove('selected'));
        color.classList.add('selected');
    });
});

// Add to cart functionality
const addToCartButton = document.getElementById('addToCartButton');
const cartMessage = document.getElementById('cartMessage');

addToCartButton.addEventListener('click', () => {
    const selectedColor = document.querySelector('.color.selected')?.dataset.color;
    const selectedSize = document.getElementById('sizeSelect').value;

    if (!selectedColor) {
        cartMessage.textContent = "Please select a color.";
        cartMessage.style.color = "red";
        return;
    }

    cartMessage.textContent = `Added to cart: ${selectedSize} ${selectedColor} shirt.`;
    cartMessage.style.color = "#28a745";
});
