const BASE_URL = "https://buynest-backend-p1s9.onrender.com";

// =====================================================
// GET LOGGED-IN DELIVERY PERSON
// =====================================================

const DELIVERY_PERSON_ID =
    localStorage.getItem("deliveryPersonId");

const DELIVERY_PERSON_NAME =
    localStorage.getItem("deliveryPersonName");


// =====================================================
// PAGE LOAD
// =====================================================

document.addEventListener("DOMContentLoaded", function () {

    console.log(
        "Logged-in Delivery Person ID:",
        DELIVERY_PERSON_ID
    );

    console.log(
        "Logged-in Delivery Person Name:",
        DELIVERY_PERSON_NAME
    );


    // If nobody is logged in
    if (!DELIVERY_PERSON_ID) {

        alert("Please login first");

        window.location.href =
            "delivery-login.html";

        return;
    }


    // Show logged-in person's name
    const profile =
        document.querySelector(".profile");

    if (profile && DELIVERY_PERSON_NAME) {

        profile.innerHTML =
            `🚚 ${DELIVERY_PERSON_NAME}`;
    }


    // Load orders
    loadAssignedOrders();

});


// =====================================================
// LOAD ASSIGNED ORDERS
// =====================================================

function loadAssignedOrders() {

    console.log(
        "Loading orders for Delivery Person ID:",
        DELIVERY_PERSON_ID
    );


    fetch(
        `${BASE_URL}/deliveryperson/${DELIVERY_PERSON_ID}/orders`
    )

    .then(response => {

        console.log(
            "Orders Response Status:",
            response.status
        );


        if (!response.ok) {

            throw new Error(
                "HTTP Error: " + response.status
            );
        }


        return response.json();

    })

    .then(orders => {

        console.log(
            "Orders for logged-in delivery person:",
            orders
        );


        displayStatistics(orders);

        displayOrders(orders);

    })

    .catch(error => {

        console.error(
            "Error loading orders:",
            error
        );


        const container =
            document.querySelector(
                ".orders-container"
            );


        if (container) {

            container.innerHTML = `
                <p style="
                    text-align:center;
                    padding:20px;
                ">
                    Unable to load orders.
                </p>
            `;
        }

    });

}


// =====================================================
// STATISTICS
// =====================================================

function displayStatistics(orders) {

    let assigned = 0;

    let outForDelivery = 0;

    let delivered = 0;


    orders.forEach(order => {

        const status =
            (order.status || "")
                .toUpperCase();


        // Active assigned orders
        if (
            status === "PLACED" ||
            status === "ASSIGNED" ||
            status === "PICKED_UP"
        ) {

            assigned++;
        }


        // Out for delivery
        if (
            status === "OUT_FOR_DELIVERY"
        ) {

            outForDelivery++;
        }


        // Delivered
        if (
            status === "DELIVERED"
        ) {

            delivered++;
        }

    });


    const statCards =
        document.querySelectorAll(
            ".stat-card h2"
        );


    if (statCards.length >= 3) {

        statCards[0].textContent =
            assigned;

        statCards[1].textContent =
            outForDelivery;

        statCards[2].textContent =
            delivered;
    }

}


// =====================================================
// DISPLAY ORDERS
// =====================================================

function displayOrders(orders) {

    const container =
        document.querySelector(
            ".orders-container"
        );


    if (!container) {
        return;
    }


    container.innerHTML = "";


    // No orders
    if (
        !orders ||
        orders.length === 0
    ) {

        container.innerHTML = `
            <p style="
                text-align:center;
                padding:20px;
            ">
                No orders assigned.
            </p>
        `;

        return;
    }


    // Create order cards
    orders.forEach(order => {


        // Customer name
        const customer =
            order.user
                ? order.user.name
                : "Unknown";


        // Customer phone
        const phone =
            order.user
                ? order.user.phone
                : "N/A";


        // Amount
        const amount =
            order.totalAmount || 0;


        // Status
        const status =
            order.status || "PLACED";


        // Create card
        const card =
            document.createElement("div");


        card.className =
            "order-card";


        card.innerHTML = `

            <div class="order-header">

                <h3>
                    Order #${order.id}
                </h3>

                <span class="status ${getStatusClass(status)}">
                    ${formatStatus(status)}
                </span>

            </div>


            <div class="order-details">

                <p>
                    <strong>Customer:</strong>
                    ${customer}
                </p>

                <p>
                    <strong>Phone:</strong>
                    ${phone}
                </p>

                <p>
                    <strong>Amount:</strong>
                    ₹${amount}
                </p>

            </div>


            <div class="actions">

                ${getButtons(order)}

            </div>

        `;


        container.appendChild(card);

    });

}


// =====================================================
// GET STATUS CSS CLASS
// =====================================================

function getStatusClass(status) {

    status =
        status.toUpperCase();


    if (
        status === "OUT_FOR_DELIVERY"
    ) {

        return "out";
    }


    if (
        status === "DELIVERED"
    ) {

        return "completed";
    }


    return "assigned";

}


// =====================================================
// FORMAT STATUS
// =====================================================

function formatStatus(status) {

    return status
        .replaceAll("_", " ")
        .toLowerCase()
        .replace(
            /\b\w/g,
            char => char.toUpperCase()
        );

}


// =====================================================
// GET BUTTONS
// =====================================================

function getButtons(order) {

    const status =
        (order.status || "PLACED")
            .toUpperCase();


    // PLACED / ASSIGNED
    if (
        status === "PLACED" ||
        status === "ASSIGNED"
    ) {

        return `

            <button
                class="pickup"
                onclick="markAsPickedUp(${order.id})">

                Mark as Picked Up

            </button>

        `;
    }


    // PICKED UP
    if (
        status === "PICKED_UP"
    ) {

        return `

            <button
                class="delivery"
                onclick="markOutForDelivery(${order.id})">

                Out for Delivery

            </button>

        `;
    }


    // OUT FOR DELIVERY
    if (
        status === "OUT_FOR_DELIVERY"
    ) {

        return `

            <button
                class="complete"
                onclick="markAsDelivered(${order.id})">

                Mark as Delivered

            </button>

        `;
    }


    // DELIVERED
    if (
        status === "DELIVERED"
    ) {

        return `

            <span>
                ✅ Delivered
            </span>

        `;
    }


    return "";

}


// =====================================================
// MARK AS PICKED UP
// =====================================================

function markAsPickedUp(orderId) {

    console.log(
        "Marking order as PICKED_UP:",
        orderId
    );


    fetch(
        `${BASE_URL}/deliveryperson/orders/${orderId}/picked-up`,
        {
            method: "PUT"
        }
    )

    .then(response => {

        if (!response.ok) {

            throw new Error(
                "Failed to update order"
            );
        }


        return response.json();

    })

    .then(data => {

        console.log(
            "Order picked up:",
            data
        );


        loadAssignedOrders();

    })

    .catch(error => {

        console.error(
            "Pickup Error:",
            error
        );


        alert(
            "Unable to mark order as picked up."
        );

    });

}


// =====================================================
// MARK AS OUT FOR DELIVERY
// =====================================================

function markOutForDelivery(orderId) {

    console.log(
        "Marking order as OUT_FOR_DELIVERY:",
        orderId
    );


    fetch(
        `${BASE_URL}/deliveryperson/orders/${orderId}/out-for-delivery`,
        {
            method: "PUT"
        }
    )

    .then(response => {

        if (!response.ok) {

            throw new Error(
                "Failed to update order"
            );
        }


        return response.json();

    })

    .then(data => {

        console.log(
            "Order out for delivery:",
            data
        );


        loadAssignedOrders();

    })

    .catch(error => {

        console.error(
            "Out for Delivery Error:",
            error
        );


        alert(
            "Unable to mark order as out for delivery."
        );

    });

}


// =====================================================
// MARK AS DELIVERED
// =====================================================

function markAsDelivered(orderId) {

    console.log(
        "Marking order as DELIVERED:",
        orderId
    );


    fetch(
        `${BASE_URL}/deliveryperson/orders/${orderId}/delivered`,
        {
            method: "PUT"
        }
    )

    .then(response => {

        if (!response.ok) {

            throw new Error(
                "Failed to update order"
            );
        }


        return response.json();

    })

    .then(data => {

        console.log(
            "Order delivered:",
            data
        );


        loadAssignedOrders();

    })

    .catch(error => {

        console.error(
            "Delivery Error:",
            error
        );


        alert(
            "Unable to mark order as delivered."
        );

    });

}


// =====================================================
// LOGOUT
// =====================================================

function logoutDeliveryPerson() {

    localStorage.removeItem(
        "deliveryPersonId"
    );

    localStorage.removeItem(
        "deliveryPersonName"
    );

    localStorage.removeItem(
        "deliveryPersonEmail"
    );


    window.location.href =
        "delivery-login.html";

}