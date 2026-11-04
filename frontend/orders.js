// =====================================================
// BASE URL
// =====================================================

const BASE_URL = "https://buynest-backend-p1s9.onrender.com";


// =====================================================
// PAGE LOAD
// =====================================================

document.addEventListener("DOMContentLoaded", function () {

    loadOrders();

});


// =====================================================
// LOAD CUSTOMER ORDERS
// =====================================================

async function loadOrders() {

    const loading = document.getElementById("loading");
    const ordersContainer = document.getElementById("ordersContainer");
    const errorMessage = document.getElementById("errorMessage");

    loading.style.display = "block";
    ordersContainer.innerHTML = "";
    errorMessage.style.display = "none";

    try {

        // Get logged-in customer ID
        const userId = localStorage.getItem("userId");

        // Check login
        if (!userId || localStorage.getItem("loggedIn") !== "true") {

            loading.style.display = "none";

            errorMessage.style.display = "block";
            errorMessage.innerHTML = `
                <p>Please log in to view your orders.</p>
                <button onclick="window.location.href='customer-login.html'">
                    Login
                </button>
            `;

            return;
        }

        // Fetch orders for this customer
        const response = await fetch(
            `${BASE_URL}/getorders/user/${encodeURIComponent(userId)}`
        );

        if (!response.ok) {
            throw new Error(`Failed to load orders. HTTP ${response.status}`);
        }

        const result = await response.json();

        // ResponseStructure contains the orders in data
        const orders = Array.isArray(result)
            ? result
            : result.data;

        if (!Array.isArray(orders)) {
            throw new Error("Unexpected orders response from server.");
        }

        loading.style.display = "none";

        // No orders
        if (orders.length === 0) {

            ordersContainer.innerHTML = `
                <div class="no-orders">
                    <h2>No orders yet 🛍️</h2>
                    <p>You haven't placed any orders yet.</p>
                    <button onclick="window.location.href='products.html'">
                        Start Shopping
                    </button>
                </div>
            `;

            return;
        }

        // Display customer orders
        displayOrders(orders);

    } catch (error) {

        console.error("Error loading customer orders:", error);

        loading.style.display = "none";
        errorMessage.style.display = "block";

        errorMessage.innerHTML = `
            <p>Unable to load your orders.</p>
            <p>${escapeHTML(error.message)}</p>
            <button onclick="loadOrders()">Try Again</button>
        `;
    }
}


// =====================================================
// DISPLAY CUSTOMER ORDERS
// =====================================================

function displayOrders(orders) {

    const ordersContainer =
        document.getElementById("ordersContainer");

    ordersContainer.innerHTML = "";

    orders.forEach(function (order) {

        const orderCard = document.createElement("div");
        orderCard.className = "order-card";

        const orderId = order.id;
        const status = order.status || "PLACED";
        const totalAmount = Number(order.totalAmount || 0);

        orderCard.innerHTML = `
            <div class="order-card-header">
                <h3>Order #${escapeHTML(orderId)}</h3>
                <span class="order-status">
                    ${escapeHTML(status)}
                </span>
            </div>

            <div class="order-card-body">
                <p>
                    <strong>Total Amount:</strong>
                    ₹${totalAmount.toLocaleString("en-IN")}
                </p>

                <p>
                    <strong>Order Status:</strong>
                    ${escapeHTML(status)}
                </p>
            </div>

            <div class="order-card-footer">
                <button class="view-order-btn">
                    View Details
                </button>
            </div>
        `;

        orderCard
            .querySelector(".view-order-btn")
            .addEventListener("click", function () {

                window.location.href =
                    `order_details.html?id=${encodeURIComponent(orderId)}`;

            });

        ordersContainer.appendChild(orderCard);

    });
}


// =====================================================
// ESCAPE HTML
// =====================================================

function escapeHTML(value) {

    return String(value ?? "").replace(/[&<>"']/g, function (character) {

        const entities = {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;"
        };

        return entities[character];

    });
}