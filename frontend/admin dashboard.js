// ===============================
// ADMIN DASHBOARD
// ===============================

const BASE_URL = "https://buynest-backend-p1s9.onrender.com";


// ===============================
// LOAD DASHBOARD
// ===============================

document.addEventListener("DOMContentLoaded", function () {

    loadTotalUsers();
    loadTotalProducts();
    loadTotalOrders();
    loadTotalDeliveries();
    loadRecentOrders();

});


// ===============================
// TOTAL USERS
// ===============================

function loadTotalUsers() {

    fetch(`${BASE_URL}/admin/totalUsers`)
        .then(response => response.json())
        .then(data => {

            document.querySelector(".stats .stat-card:nth-child(1) h2")
                .textContent = data;

        })
        .catch(error => {
            console.error("Error loading users:", error);
        });
}


// ===============================
// TOTAL PRODUCTS
// ===============================

function loadTotalProducts() {

    fetch(`${BASE_URL}/admin/totalProducts`)
        .then(response => response.json())
        .then(data => {

            document.querySelector(".stats .stat-card:nth-child(2) h2")
                .textContent = data;

        })
        .catch(error => {
            console.error("Error loading products:", error);
        });
}


// ===============================
// TOTAL ORDERS
// ===============================

function loadTotalOrders() {

    fetch(`${BASE_URL}/admin/totalOrders`)
        .then(response => response.json())
        .then(data => {

            document.querySelector(".stats .stat-card:nth-child(3) h2")
                .textContent = data;

        })
        .catch(error => {
            console.error("Error loading orders:", error);
        });
}


// ===============================
// TOTAL DELIVERIES
// ===============================

function loadTotalDeliveries() {

    fetch(`${BASE_URL}/admin/totalDeliveries`)
        .then(response => response.json())
        .then(data => {

            document.querySelector(".stats .stat-card:nth-child(4) h2")
                .textContent = data;

        })
        .catch(error => {
            console.error("Error loading deliveries:", error);
        });
}


// ===============================
// RECENT ORDERS
// ===============================

function loadRecentOrders() {

    fetch(`${BASE_URL}/admin/recentOrders`)
        .then(response => response.json())
        .then(orders => {

            const tbody =
                document.querySelector("table tbody");

            tbody.innerHTML = "";

            orders.forEach(order => {

                const row =
                    document.createElement("tr");

                row.innerHTML = `
                    <td>#${order.id}</td>

                    <td>
                        ${order.user
                            ? order.user.name
                            : "Unknown"}
                    </td>

                    <td>
                        ₹${order.totalAmount}
                    </td>

                    <td>
                        <span class="status ${getStatusClass(order.status)}">
                            ${order.status}
                        </span>
                    </td>

                    <td>
                        Not Assigned
                    </td>
                `;

                tbody.appendChild(row);

            });

        })
        .catch(error => {
            console.error(
                "Error loading recent orders:",
                error
            );
        });
}


// ===============================
// ORDER STATUS CLASS
// ===============================

function getStatusClass(status) {

    if (!status) {
        return "";
    }

    status =
        status.toLowerCase();

    if (status === "delivered") {
        return "delivered";
    }

    if (
        status === "out for delivery" ||
        status === "shipped"
    ) {
        return "delivery";
    }

    return "confirmed";
}