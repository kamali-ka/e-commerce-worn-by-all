import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import { getDatabase, ref, get, set, remove, push } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-database.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";

// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyAnKtlrGE7lMKtHhjQyzfElqCkI2bupWzs",
  authDomain: "wornbyall-926f5.firebaseapp.com",
  projectId: "wornbyall-926f5",
  storageBucket: "wornbyall-926f5.appspot.com",
  messagingSenderId: "770771226995",
  appId: "1:770771226995:web:15636d6b9e17d27611b506",
  measurementId: "G-B6PER21YN1",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const auth = getAuth(app);
let userId = null;  // Initially null

// Wait for the authentication state to be confirmed
onAuthStateChanged(auth, (user) => {
    if (user) {
        // User is signed in, set userId
        userId = user.uid;
        console.log("User ID:", userId);  // You can check the user ID here
        loadOrders();  // Call the loadOrders function once the user is authenticated
    } else {
        // No user is signed in
        console.log("No user is signed in.");
    }
});

let deletedOrder = null;
let deletedOrderId = null;
let undoTimeout = null;

function loadOrders() {
    const orderHistoryContainer = document.getElementById('order-history');
    console.log(userId);

    // Assuming `userId` is set correctly for the logged-in user
    const ordersRef = ref(database, `orders/${userId}`);

    get(ordersRef).then(snapshot => {
        const orders = snapshot.exists() ? snapshot.val() : {};  // Retrieve the orders object

        orderHistoryContainer.innerHTML = '';  // Clear existing content

        if (Object.keys(orders).length === 0) {
            orderHistoryContainer.innerHTML = '<p id="loading">No orders found.</p>';
            return;
        }

        // Iterate through orders for the given user
        Object.keys(orders).forEach(orderId => {
            const order = orders[orderId];  // Access order using its key

            const orderCard = document.createElement('div');
            orderCard.classList.add('order-card');

            orderCard.innerHTML = `
                <div>
                    <h3>Order ID: ${order.orderId}</h3>
                    
                    <p>Address: ${order.address}</p>
                    
                    <p>Status: ${order.status}</p>
                </div>
                 <a class="delete-btn" href='../html/orderDetail.html?id=${orderId}'>View Details</i></a>
            `;

            orderHistoryContainer.appendChild(orderCard);
        });
    }).catch(error => {
        console.error('Error fetching orders from Firebase:', error);
    });
}

// Function to delete order by orderId
function deleteOrder(orderId) {
    const ordersRef = ref(database, `orders/${userId}/${orderId}`);
    // Get the order before deletion
    get(ordersRef).then(snapshot => {
        if (snapshot.exists()) {
            deletedOrder = snapshot.val();
            deletedOrderId = orderId; // Store orderId to identify the order

            // Remove order from Firebase
            remove(ordersRef).then(() => {
                loadOrders();  // Refresh UI
                showUndoNotification();  // Show undo notification
            }).catch(error => {
                console.error('Error deleting order from Firebase:', error);
            });
        }
    });
}

// Show Undo Notification
function showUndoNotification() {
    const undoNotification = document.getElementById('undo-notification');
    undoNotification.style.display = 'flex';

    // Set timeout to clear the undo option after 5 seconds
    undoTimeout = setTimeout(() => {
        deletedOrder = null;
        deletedOrderId = null;
        undoNotification.style.display = 'none';
    }, 5000);
}

// Undo the delete action
function undoDelete() {
    if (deletedOrder && deletedOrderId) {
        const ordersRef = ref(database, `orders/${userId}`);
        
        // Add the deleted order back to Firebase using the original orderId
        const newOrderRef = ref(ordersRef, deletedOrderId);  // Use deletedOrderId as the key
        newOrderRef.set(deletedOrder).then(() => {
            loadOrders();  // Refresh UI
            clearTimeout(undoTimeout);  // Cancel timeout
            document.getElementById('undo-notification').style.display = 'none';
            deletedOrder = null;
            deletedOrderId = null;
        }).catch(error => {
            console.error('Error restoring order to Firebase:', error);
        });
    }
}

// Expose the deleteOrder function to the global window object
window.deleteOrder = deleteOrder;


document.getElementById("undoDelete").addEventListener("click",()=>{
    undoDelete()
})