let deletedOrder = null;
let deletedOrderIndex = null;
let undoTimeout = null;

document.addEventListener('DOMContentLoaded', loadOrders);

function loadOrders() {
    const orderHistoryContainer = document.getElementById('order-history');
    const orders = JSON.parse(localStorage.getItem('orders')) || [];

    orderHistoryContainer.innerHTML = '';  // Clear existing content

    if (orders.length === 0) {
        orderHistoryContainer.innerHTML = '<p id="loading">No orders found.</p>';
        return;
    }

    orders.forEach((order, index) => {
        const orderCard = document.createElement('div');
        orderCard.classList.add('order-card');

        orderCard.innerHTML = `
            <div>
                <h3>Order ID: ${order.orderId}</h3>
                <p>Name: ${order.name}</p>
                <p>Address: ${order.address}</p>
                <p>Payment: ${order.payment}</p>
                <p class="total">Date: ${order.date}</p>
            </div>
            <button class="delete-btn" onclick="deleteOrder(${index})">Delete</button>
        `;

        orderHistoryContainer.appendChild(orderCard);
    });
}

// Function to delete order by index
function deleteOrder(index) {
    let orders = JSON.parse(localStorage.getItem('orders')) || [];

    // Store deleted order temporarily
    deletedOrder = orders[index];
    deletedOrderIndex = index;
    orders.splice(index, 1);  // Remove order from array
    localStorage.setItem('orders', JSON.stringify(orders));  // Update localStorage
    loadOrders();  // Refresh UI

    // Show Undo notification
    showUndoNotification();
}

// Show Undo Notification
function showUndoNotification() {
    const undoNotification = document.getElementById('undo-notification');
    undoNotification.style.display = 'flex';

    // Set timeout to clear the undo option after 5 seconds
    undoTimeout = setTimeout(() => {
        deletedOrder = null;
        deletedOrderIndex = null;
        undoNotification.style.display = 'none';
    }, 5000);
}

// Undo the delete action
function undoDelete() {
    let orders = JSON.parse(localStorage.getItem('orders')) || [];

    if (deletedOrder) {
        orders.splice(deletedOrderIndex, 0, deletedOrder);  // Reinsert at the original position
        localStorage.setItem('orders', JSON.stringify(orders));  // Update localStorage
        loadOrders();  // Refresh UI
        clearTimeout(undoTimeout);  // Cancel timeout
        document.getElementById('undo-notification').style.display = 'none';
        deletedOrder = null;
        deletedOrderIndex = null;
    }
}
