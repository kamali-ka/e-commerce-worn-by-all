function navigateToCart() {
    window.location.href = "../html/cartPage.html";
  }
  // Update cart count
  function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
  
    const cartCountElement = document.getElementById("cartCount");
    if (cartCountElement) {
      cartCountElement.textContent = totalItems;
    }
  
    // Save cart count to localStorage
    localStorage.setItem("cartCount", totalItems);
  }
  // Toggle sidebar visibility
  document.getElementById("toggleSidebar").addEventListener("click", () => {
    const sidebar = document.getElementById("sidebar");
    sidebar.classList.toggle("visible"); // Toggle 'visible' class to show/hide sidebar
  });