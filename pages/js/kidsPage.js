// Filtering based on search input
document.getElementById('searchInput').addEventListener('input', function() {
    const query = this.value.toLowerCase();
    const items = document.querySelectorAll('.item');

    items.forEach(item => {
        const itemName = item.querySelector('p').textContent.toLowerCase();
        item.style.display = itemName.includes(query) ? 'block' : 'none';
    });
});

// Filtering based on dropdown selection
document.getElementById('categorySelect').addEventListener('change', function() {
    const category = this.value;
    const items = document.querySelectorAll('.item');

    items.forEach(item => {
        const itemCategory = item.getAttribute('data-category');
        item.style.display = (category === 'all' || itemCategory === category) ? 'block' : 'none';
    });
});
